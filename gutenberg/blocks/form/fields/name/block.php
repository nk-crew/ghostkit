<?php
/**
 * Form Field Name block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Form_Field_Name_Block
 */
class GhostKit_Form_Field_Name_Block {
	/**
	 * GhostKit_Form_Field_Name_Block constructor.
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
							'default' => esc_html__( 'Name', 'ghostkit' ),
						),
						'nameFields' => array(
							'type'    => 'string',
							'default' => 'first',
						),

						'descriptionLast' => array(
							'type' => 'string',
						),
						'placeholderLast' => array(
							'type' => 'string',
						),
						'defaultLast' => array(
							'type' => 'string',
						),

						'descriptionMiddle' => array(
							'type' => 'string',
						),
						'placeholderMiddle' => array(
							'type' => 'string',
						),
						'defaultMiddle' => array(
							'type' => 'string',
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
				'slug'              => '',
				'nameFields'        => 'first',
				'description'       => '',
				'descriptionLast'   => '',
				'placeholderLast'   => '',
				'defaultLast'       => '',
				'descriptionMiddle' => '',
				'placeholderMiddle' => '',
				'defaultMiddle'     => '',
				'hideDescription'   => false,
			),
			$attributes
		);

		ob_start();

		$class = 'ghostkit-form-field ghostkit-form-field-name';

		if ( 'first-middle-last' === $attributes['nameFields'] || 'first-last' === $attributes['nameFields'] ) {
			$class .= ' ghostkit-form-field-name-with-last';
		}
		if ( 'first-middle-last' === $attributes['nameFields'] ) {
			$class .= ' ghostkit-form-field-name-with-middle';
		}

		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		$last_attributes = array(
			'slug'            => $attributes['slug'],
			'slug_sub'        => 'last',
			'description'     => $attributes['descriptionLast'],
			'placeholder'     => $attributes['placeholderLast'],
			'default'         => $attributes['defaultLast'],
			'hideDescription' => $attributes['hideDescription'],
		);

		$middle_attributes = array(
			'slug'            => $attributes['slug'],
			'slug_sub'        => 'middle',
			'description'     => $attributes['descriptionMiddle'],
			'placeholder'     => $attributes['placeholderMiddle'],
			'default'         => $attributes['defaultMiddle'],
			'hideDescription' => $attributes['hideDescription'],
		);

		?>

		<div class="<?php echo esc_attr( $class ); ?>">
			<?php GhostKit_Form_Field_Label::get( $attributes ); ?>

			<?php if ( 'first-last' === $attributes['nameFields'] || 'first-middle-last' === $attributes['nameFields'] ) : ?>
				<div class="ghostkit-form-field-row">
					<div class="ghostkit-form-field-name-first">
			<?php endif; ?>

				<input type="text" <?php GhostKit_Form_Field_Attributes::get( $attributes ); ?> />

				<?php GhostKit_Form_Field_Description::get( $attributes ); ?>

			<?php if ( 'first-middle-last' === $attributes['nameFields'] ) : ?>
					</div>
					<div class="ghostkit-form-field-name-middle">
						<input type="text" <?php GhostKit_Form_Field_Attributes::get( $middle_attributes ); ?> />

						<?php GhostKit_Form_Field_Description::get( $middle_attributes ); ?>
			<?php endif; ?>

			<?php if ( 'first-last' === $attributes['nameFields'] || 'first-middle-last' === $attributes['nameFields'] ) : ?>
					</div>
					<div class="ghostkit-form-field-name-last">
						<input type="text" <?php GhostKit_Form_Field_Attributes::get( $last_attributes ); ?> />

						<?php GhostKit_Form_Field_Description::get( $last_attributes ); ?>
					</div>
				</div>
			<?php endif; ?>
		</div>

		<?php

		return ob_get_clean();
	}
}
new GhostKit_Form_Field_Name_Block();
