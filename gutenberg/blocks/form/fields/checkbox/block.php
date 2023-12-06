<?php
/**
 * Form Field Checkbox block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Form_Field_Checkbox_Block
 */
class GhostKit_Form_Field_Checkbox_Block {
	/**
	 * GhostKit_Form_Field_Checkbox_Block constructor.
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
							'default' => esc_html__( 'Checkbox', 'ghostkit' ),
						),
						'options' => array(
							'type'  => 'array',
							'items' => array(
								'type' => 'object',
							),
						),
						'inline' => array(
							'type'  => 'boolean',
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
		$attributes = array_merge(
			array(
				'slug'    => '',
				'options' => array(),
				'inline'  => false,
			),
			$attributes
		);

		ob_start();

		$class = 'ghostkit-form-field ghostkit-form-field-checkbox';

		if ( $attributes['inline'] ) {
			$class .= ' ghostkit-form-field-checkbox-inline';
		}

		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		?>

		<div class="<?php echo esc_attr( $class ); ?>">
			<?php GhostKit_Form_Field_Label::get( $attributes ); ?>

			<div class="ghostkit-form-field-checkbox-items">
				<?php
				foreach ( $attributes['options'] as $k => $option ) :
					$item_id    = $attributes['slug'] . '-item-' . $k;
					$item_attrs = array_merge(
						$attributes,
						array(
							'id'           => $item_id,
							'fieldIsArray' => true,
						)
					);
					?>
					<label class="ghostkit-form-field-checkbox-item" for="<?php echo esc_attr( $item_id ); ?>">
						<input type="checkbox" <?php checked( $option['selected'] ); ?> value="<?php echo esc_attr( $option['value'] ); ?>" <?php GhostKit_Form_Field_Attributes::get( $item_attrs ); ?> />
						<?php echo esc_html( $option['label'] ); ?>
					</label>
				<?php endforeach; ?>
			</div>

			<?php GhostKit_Form_Field_Description::get( $attributes ); ?>
		</div>

		<?php

		return ob_get_clean();
	}
}
new GhostKit_Form_Field_Checkbox_Block();
