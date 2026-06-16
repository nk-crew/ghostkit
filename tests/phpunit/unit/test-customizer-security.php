<?php
/**
 * Tests for GhostKit Customizer security.
 *
 * @package ghostkit
 */

/**
 * Customizer security test case.
 */
class GhostKitCustomizerSecurityTest extends WP_UnitTestCase {
	/**
	 * Customizer plugin instance.
	 *
	 * @var GhostKit_Customizer_Plugin
	 */
	private $customizer;

	/**
	 * Set up test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->customizer = new GhostKit_Customizer_Plugin();

		update_option(
			'ghostkit_customizer_fields',
			array(
				array(
					'id'   => 'blogname',
					'type' => 'option',
				),
				array(
					'id'   => 'header_textcolor',
					'type' => 'theme_mod',
				),
			)
		);
	}

	/**
	 * Malicious customizer payloads should be stripped.
	 */
	public function test_filter_valid_custom_options_blocks_malicious_payload() {
		$malicious = array(
			array(
				'type'  => 'option',
				'id'    => 'ghostkit_custom_code',
				'value' => array(
					'ghostkit_custom_js_head' => "alert('xss')",
				),
			),
		);

		$result = $this->customizer->filter_valid_custom_options( $malicious );

		$this->assertSame( array(), $result );
	}

	/**
	 * Only allowlisted customizer fields should be accepted.
	 */
	public function test_filter_valid_custom_options_allows_allowlisted_field() {
		$valid = array(
			array(
				'type'  => 'option',
				'id'    => 'blogname',
				'value' => 'My Site',
			),
		);

		$result = $this->customizer->filter_valid_custom_options( $valid );

		$this->assertCount( 1, $result );
		$this->assertSame( 'blogname', $result[0]['id'] );
		$this->assertSame( 'My Site', $result[0]['value'] );
	}

	/**
	 * Non-scalar values should be rejected.
	 */
	public function test_filter_valid_custom_options_rejects_non_scalar_values() {
		$invalid = array(
			array(
				'type'  => 'option',
				'id'    => 'blogname',
				'value' => array( 'nested' => 'value' ),
			),
		);

		$result = $this->customizer->filter_valid_custom_options( $invalid );

		$this->assertSame( array(), $result );
	}

	/**
	 * Sanitize callback should remove blocked options from stored meta.
	 */
	public function test_sanitize_customizer_options_strips_malicious_payload() {
		$payload = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'option',
						'id'    => 'ghostkit_custom_code',
						'value' => array(
							'ghostkit_custom_js_head' => "alert('xss')",
						),
					),
				)
			)
		);

		$result = $this->customizer->sanitize_customizer_options( $payload );

		$this->assertSame( '', $result );
	}

	/**
	 * Sanitize callback should keep valid allowlisted options.
	 */
	public function test_sanitize_customizer_options_keeps_valid_payload() {
		$payload = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'theme_mod',
						'id'    => 'header_textcolor',
						'value' => '#ffffff',
					),
				)
			)
		);

		$result = $this->customizer->sanitize_customizer_options( $payload );

		$this->assertNotSame( '', $result );

		$decoded = json_decode( rawurldecode( $result ), true );

		$this->assertCount( 1, $decoded );
		$this->assertSame( 'header_textcolor', $decoded[0]['id'] );
		$this->assertSame( '#ffffff', $decoded[0]['value'] );
	}
}
