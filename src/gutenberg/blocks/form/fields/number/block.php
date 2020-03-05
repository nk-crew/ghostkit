<?php
/**
 * Form Field Number block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Form_Field_Number_Block
 */
class GhostKit_Form_Field_Number_Block {
    /**
     * GhostKit_Form_Field_Number_Block constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'init' ) );
    }

    /**
     * Init.
     */
    public function init() {
        if ( ! function_exists( 'register_block_type' ) ) {
            return;
        }

        register_block_type(
            'ghostkit/form-field-number',
            array(
                'parent'          => array( 'ghostkit/form' ),
                'render_callback' => array( $this, 'block_render' ),
                'attributes'      => GhostKit_Form_Field_Attributes::get_block_attributes(
                    array(
                        'label' => array(
                            'default' => esc_html__( 'Number', '@@text_domain' ),
                        ),
                        'min' => array(
                            'type' => 'string',
                        ),
                        'max' => array(
                            'type' => 'string',
                        ),
                        'step' => array(
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
        ob_start();

        $class = 'ghostkit-form-field ghostkit-form-field-number';

        if ( isset( $attributes['className'] ) ) {
            $class .= ' ' . $attributes['className'];
        }

        ?>

        <div class="<?php echo esc_attr( $class ); ?>">
            <?php GhostKit_Form_Field_Label::get( $attributes ); ?>

            <input type="number" <?php GhostKit_Form_Field_Attributes::get( $attributes ); ?> />

            <?php GhostKit_Form_Field_Description::get( $attributes ); ?>
        </div>

        <?php

        return ob_get_clean();
    }
}
new GhostKit_Form_Field_Number_Block();
