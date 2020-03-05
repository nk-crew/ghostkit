<?php
/**
 * Form Field Text block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Form_Field_Text_Block
 */
class GhostKit_Form_Field_Text_Block {
    /**
     * GhostKit_Form_Field_Text_Block constructor.
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
            'ghostkit/form-field-text',
            array(
                'parent'          => array( 'ghostkit/form' ),
                'render_callback' => array( $this, 'block_render' ),
                'attributes'      => GhostKit_Form_Field_Attributes::get_block_attributes(
                    array(
                        'label' => array(
                            'default' => esc_html__( 'Text', '@@text_domain' ),
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

        $class = 'ghostkit-form-field ghostkit-form-field-text';

        if ( isset( $attributes['className'] ) ) {
            $class .= ' ' . $attributes['className'];
        }

        ?>

        <div class="<?php echo esc_attr( $class ); ?>">
            <?php GhostKit_Form_Field_Label::get( $attributes ); ?>

            <input type="text" <?php GhostKit_Form_Field_Attributes::get( $attributes ); ?> />

            <?php GhostKit_Form_Field_Description::get( $attributes ); ?>
        </div>

        <?php

        return ob_get_clean();
    }
}
new GhostKit_Form_Field_Text_Block();
