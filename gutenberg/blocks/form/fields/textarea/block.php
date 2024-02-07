<?php
/**
 * Form Field Textarea block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Form_Field_Textarea_Block
 */
class GhostKit_Form_Field_Textarea_Block {
	/**
	 * GhostKit_Form_Field_Textarea_Block constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Init.
	 */
	public function init() {
		register_block_type_from_metadata(
			dirname( __FILE__ ),
			array(
				'render_callback' => array( $this, 'block_render' ),
				'attributes'      => GhostKit_Form_Field_Attributes::get_block_attributes(
					array(
						'label' => array(
							'default' => esc_html__( 'Textarea', 'ghostkit' ),
						),
					)
				),
			)
		);
	}

	/**
	 * Register gutenberg block output
	 *
	 * @param array $attributes - block attributes.
	 *
	 * @return string
	 */
	public function block_render( $attributes ) {
		ob_start();

		$class = 'ghostkit-form-field ghostkit-form-field-textarea';

		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		$attrs_without_default = $attributes;
		unset( $attrs_without_default['default'] );

		$default = isset( $attributes['default'] ) ? $attributes['default'] : '';

		?>

		<div class="<?php echo esc_attr( $class ); ?>">
			<?php GhostKit_Form_Field_Label::get( $attributes ); ?>

			<textarea <?php GhostKit_Form_Field_Attributes::get( $attributes ); ?>><?php echo esc_html( $default ); ?></textarea>

			<?php GhostKit_Form_Field_Description::get( $attributes ); ?>
		</div>

		<?php

		return ob_get_clean();
	}
}
new GhostKit_Form_Field_Textarea_Block();
