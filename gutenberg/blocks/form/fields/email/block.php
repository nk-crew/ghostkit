<?php
/**
 * Form Field Email block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Form_Field_Email_Block
 */
class GhostKit_Form_Field_Email_Block {
	/**
	 * GhostKit_Form_Field_Email_Block constructor.
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
							'default' => esc_html__( 'Email', 'ghostkit' ),
						),
						'emailConfirmation' => array(
							'type' => 'boolean',
						),
						'descriptionConfirmation' => array(
							'type' => 'string',
						),
						'placeholderConfirmation' => array(
							'type' => 'string',
						),
						'defaultConfirmation' => array(
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
				'slug'                    => '',
				'description'             => '',
				'descriptionConfirmation' => '',
				'placeholderConfirmation' => '',
				'defaultConfirmation'     => '',
				'emailConfirmation'       => false,
				'hideDescription'         => false,
			),
			$attributes
		);

		ob_start();

		$class = 'ghostkit-form-field ghostkit-form-field-email';

		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		$confirmation_attributes = array(
			'slug'            => $attributes['slug'],
			'slug_sub'        => 'validation',
			'description'     => $attributes['descriptionConfirmation'],
			'placeholder'     => $attributes['placeholderConfirmation'],
			'default'         => $attributes['defaultConfirmation'],
			'hideDescription' => $attributes['hideDescription'],
		);

		?>

		<div class="<?php echo esc_attr( $class ); ?>">
			<?php GhostKit_Form_Field_Label::get( $attributes ); ?>

			<?php if ( $attributes['emailConfirmation'] ) : ?>
				<div class="ghostkit-form-field-row">
					<div class="ghostkit-form-field-email-primary">
			<?php endif; ?>

				<input type="email" <?php GhostKit_Form_Field_Attributes::get( $attributes ); ?> />

				<?php GhostKit_Form_Field_Description::get( $attributes ); ?>

			<?php if ( $attributes['emailConfirmation'] ) : ?>
					</div>
					<div class="ghostkit-form-field-email-confirm">
						<input type="email" <?php GhostKit_Form_Field_Attributes::get( $confirmation_attributes ); ?> data-confirm-email="[name='<?php echo esc_attr( $attributes['slug'] ); ?>[value]']" />

						<?php GhostKit_Form_Field_Description::get( $confirmation_attributes ); ?>
					</div>
				</div>
			<?php endif; ?>
		</div>

		<?php

		return ob_get_clean();
	}
}
new GhostKit_Form_Field_Email_Block();
