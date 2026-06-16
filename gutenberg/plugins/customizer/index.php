<?php
/**
 * Customizer plugin.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Customizer_Plugin
 */
class GhostKit_Customizer_Plugin {
	/**
	 * Custom options.
	 *
	 * @var array
	 */
	public $custom_options = array();

	/**
	 * GhostKit_Customizer_Plugin constructor.
	 */
	public function __construct() {
		add_action( 'template_redirect', array( $this, 'maybe_find_options' ) );
		add_action( 'init', array( $this, 'register_meta' ) );

		add_action(
			'wp_loaded',
			function () {
				$allow_customizer = 'false';

				// Don't parse customizer controls if a block theme is activated and no plugins use the customizer.
				if ( ( function_exists( 'wp_is_block_theme' ) && ! wp_is_block_theme() ) || has_action( 'customize_register' ) ) {
					add_action( 'customize_register', array( $this, 'parse_customizer_controls' ), 99999 );
					$allow_customizer = 'true';
				}

				// Disable customizer settings from GhostKit.
				wp_add_inline_script( 'ghostkit-helper', 'if (ghostkitVariables) { ghostkitVariables.allowPluginCustomizer = ' . $allow_customizer . '; }', 'before' );
			},
			9
		);
	}

	/**
	 * Try to find meta data to replace options.
	 */
	public function maybe_find_options() {
		$raw_options          = json_decode( urldecode( get_post_meta( get_queried_object_id(), 'ghostkit_customizer_options', true ) ), true );
		$this->custom_options = $this->filter_valid_custom_options( $raw_options );

		if ( $this->custom_options && ! empty( $this->custom_options ) ) {
			foreach ( $this->custom_options as $opt ) {
				add_filter( ( isset( $opt['type'] ) ? $opt['type'] : 'theme_mod' ) . '_' . $opt['id'], array( $this, 'replace_option' ) );
			}
		}
	}

	/**
	 * Replace option value.
	 *
	 * @param mixed $val - current option value.
	 *
	 * @return mixed
	 */
	public function replace_option( $val ) {
		if ( $this->custom_options && ! empty( $this->custom_options ) ) {
			$this_id = current_filter();

			foreach ( $this->custom_options as $opt ) {
				$id = ( isset( $opt['type'] ) ? $opt['type'] : 'theme_mod' ) . '_' . $opt['id'];
				if ( $id === $this_id ) {
					$val = $opt['value'];
				}
			}
		}
		return $val;
	}

	/**
	 * Check if current user can edit customizer options meta.
	 *
	 * @param bool   $allowed   Whether the user can add the meta field.
	 * @param string $meta_key  The meta key.
	 * @param int    $object_id Object ID.
	 * @param int    $user_id   User ID.
	 * @param string $cap       Capability name.
	 * @param array  $caps      User capabilities.
	 *
	 * @return bool
	 */
	public function can_edit_customizer_options_permission( $allowed, $meta_key, $object_id, $user_id, $cap, $caps ) {
		if ( $this->can_edit_customizer_options_simple() ) {
			return true;
		}

		$current_value = get_post_meta( $object_id, $meta_key, true );
		$new_value     = $this->get_meta_value_from_rest_request( $meta_key );

		if ( null === $new_value ) {
			return false;
		}

		if ( $current_value === $new_value ) {
			return true;
		}

		return false;
	}

	/**
	 * Simple capability check for customizer options.
	 *
	 * @return bool
	 */
	public function can_edit_customizer_options_simple() {
		return current_user_can( 'edit_theme_options' );
	}

	/**
	 * Helper method to extract meta value from current REST API request.
	 *
	 * @param string $meta_key The meta key to look for.
	 * @return string|null The new meta value from request, or null if not found.
	 */
	private function get_meta_value_from_rest_request( $meta_key ) {
		if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) {
			return null;
		}

		global $wp;
		if ( ! isset( $wp->query_vars['rest_route'] ) ) {
			return null;
		}

		$request_body = json_decode( file_get_contents( 'php://input' ), true );

		if ( ! $request_body || ! isset( $request_body['meta'][ $meta_key ] ) ) {
			return null;
		}

		return $request_body['meta'][ $meta_key ];
	}

	/**
	 * Sanitize customizer options meta.
	 *
	 * @param string $meta_value Meta value.
	 * @return string
	 */
	public function sanitize_customizer_options( $meta_value ) {
		if ( empty( $meta_value ) ) {
			return '';
		}

		if ( ! is_string( $meta_value ) ) {
			return '';
		}

		$options   = json_decode( urldecode( $meta_value ), true );
		$sanitized = $this->filter_valid_custom_options( $options );

		if ( empty( $sanitized ) ) {
			return '';
		}

		return rawurlencode( wp_json_encode( $sanitized ) );
	}

	/**
	 * Filter customizer options to only allowed entries.
	 *
	 * @param mixed $options Decoded customizer options.
	 * @return array
	 */
	public function filter_valid_custom_options( $options ) {
		if ( ! is_array( $options ) ) {
			return array();
		}

		$allowed_fields = $this->get_allowed_customizer_fields();
		$sanitized      = array();

		foreach ( $options as $opt ) {
			if ( ! is_array( $opt ) || empty( $opt['id'] ) ) {
				continue;
			}

			$type = isset( $opt['type'] ) ? $opt['type'] : 'theme_mod';

			if ( ! in_array( $type, array( 'theme_mod', 'option' ), true ) ) {
				continue;
			}

			if ( $this->is_blocked_customizer_option( $type, $opt['id'] ) ) {
				continue;
			}

			$field_key = $type . ':' . $opt['id'];
			if ( ! isset( $allowed_fields[ $field_key ] ) ) {
				continue;
			}

			if ( ! isset( $opt['value'] ) || ! is_scalar( $opt['value'] ) ) {
				continue;
			}

			$sanitized[] = array(
				'id'    => $opt['id'],
				'type'  => $type,
				'value' => $opt['value'],
			);
		}

		return $sanitized;
	}

	/**
	 * Get allowed customizer fields from stored settings.
	 *
	 * @return array
	 */
	private function get_allowed_customizer_fields() {
		$fields  = get_option( 'ghostkit_customizer_fields', array() );
		$allowed = array();

		if ( ! is_array( $fields ) ) {
			return $allowed;
		}

		foreach ( $fields as $field ) {
			if ( empty( $field['id'] ) || empty( $field['type'] ) ) {
				continue;
			}

			if ( ! in_array( $field['type'], array( 'theme_mod', 'option' ), true ) ) {
				continue;
			}

			if ( $this->is_blocked_customizer_option( $field['type'], $field['id'] ) ) {
				continue;
			}

			$allowed[ $field['type'] . ':' . $field['id'] ] = true;
		}

		return $allowed;
	}

	/**
	 * Check if customizer option should be blocked from overrides.
	 *
	 * @param string $type Option type.
	 * @param string $id   Option ID.
	 * @return bool
	 */
	private function is_blocked_customizer_option( $type, $id ) {
		if ( 'option' === $type && 0 === strpos( $id, 'ghostkit_' ) ) {
			return true;
		}

		$blocked_ids = array( 'active_theme' );
		if ( in_array( $id, $blocked_ids, true ) ) {
			return true;
		}

		if ( 'option' === $type ) {
			if ( preg_match( '/^widget_/', $id ) ) {
				return true;
			}
			if ( preg_match( '/^sidebars_widgets\[/', $id ) ) {
				return true;
			}
			if ( preg_match( '/^nav_menus_/', $id ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Register meta.
	 */
	public function register_meta() {
		register_meta(
			'post',
			'ghostkit_customizer_options',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'auth_callback'     => array( $this, 'can_edit_customizer_options_permission' ),
				'sanitize_callback' => array( $this, 'sanitize_customizer_options' ),
			)
		);
	}

	/**
	 * Prepare customizer data and save it to the options for further use.
	 *
	 * @param {object} $wp_customize - customizer data.
	 */
	public function parse_customizer_controls( $wp_customize ) {
		$settings = array();
		foreach ( $wp_customize->settings() as $setting ) {
			if ( isset( $setting->type ) && ( 'theme_mod' === $setting->type || 'option' === $setting->type ) ) {
				$control = $wp_customize->get_control( $setting->id );

				// get section and panel.
				$section = false;
				$panel   = false;

				if ( isset( $control->section ) ) {
					$section_object = $wp_customize->get_section( $control->section );
					if ( $section_object ) {
						$section = array(
							'id'          => isset( $section_object->id ) ? $section_object->id : false,
							'title'       => isset( $section_object->title ) ? $section_object->title : false,
							'description' => isset( $section_object->description ) ? $section_object->description : false,
						);
						if ( isset( $section_object->panel ) ) {
							$panel_object = $wp_customize->get_panel( $section_object->panel );
							if ( $panel_object ) {
								$panel = array(
									'id'          => isset( $panel_object->id ) ? $panel_object->id : false,
									'title'       => isset( $panel_object->title ) ? $panel_object->title : false,
									'description' => isset( $panel_object->description ) ? $panel_object->description : false,
								);
							}
						}
					}
				}

				// get control data.
				$settings[] = array(
					'id'           => $setting->id,
					'type'         => $setting->type,
					'default'      => $setting->default,
					'section'      => $section,
					'panel'        => $panel,
					'label'        => isset( $control->label ) ? $control->label : false,
					'description'  => isset( $control->description ) ? $control->description : false,
					'choices'      => isset( $control->choices ) ? $control->choices : false,
					'control_type' => isset( $control->type ) ? $control->type : false,
				);
			}
		}

		update_option( 'ghostkit_customizer_fields', $settings );
	}
}
new GhostKit_Customizer_Plugin();
