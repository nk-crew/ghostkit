<?php
/**
 * Form field description.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Form_Field_Description
 */
class GhostKit_Form_Field_Description {
	/**
	 * Prepare description for field.
	 *
	 * @param array $attributes block attributes.
	 */
	public static function get( $attributes ) {
		$attributes = array_merge(
			array(
				'description'     => '',
				'hideDescription' => false,
			),
			$attributes
		);

		$description      = $attributes['description'];
		$hide_description = $attributes['hideDescription'];
		$class            = 'ghostkit-form-field-description';

		if ( $hide_description ) {
			$class .= ' ghostkit-form-field-description-hidden';
		}

		if ( $description ) {
			?>
			<small class="<?php echo esc_attr( $class ); ?>">
				<?php echo wp_kses_post( $description ); ?>
			</small>
			<input type="hidden" name="<?php echo esc_attr( $attributes['slug'] ); ?>[description]" value="<?php echo esc_attr( $description ); ?>" />
			<?php
		}
	}
}
new GhostKit_Form_Field_Description();
