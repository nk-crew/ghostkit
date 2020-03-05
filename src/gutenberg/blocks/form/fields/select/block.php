<?php
/**
 * Form Field Select block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Form_Field_Select_Block
 */
class GhostKit_Form_Field_Select_Block {
    /**
     * GhostKit_Form_Field_Select_Block constructor.
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
            'ghostkit/form-field-select',
            array(
                'parent'          => array( 'ghostkit/form' ),
                'render_callback' => array( $this, 'block_render' ),
                'attributes'      => GhostKit_Form_Field_Attributes::get_block_attributes(
                    array(
                        'label' => array(
                            'default' => esc_html__( 'Select', '@@text_domain' ),
                        ),
                        'options' => array(
                            'type'  => 'array',
                            'items' => array(
                                'type' => 'object',
                            ),
                        ),
                        'multiple' => array(
                            'type' => 'boolean',
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
                'options' => array(),
            ),
            $attributes
        );

        ob_start();

        $class = 'ghostkit-form-field ghostkit-form-field-select';

        if ( isset( $attributes['className'] ) ) {
            $class .= ' ' . $attributes['className'];
        }

        if ( ! is_array( $attributes['options'] ) ) {
            $attributes['options'] = array();
        }

        ?>

        <div class="<?php echo esc_attr( $class ); ?>">
            <?php GhostKit_Form_Field_Label::get( $attributes ); ?>

            <select <?php GhostKit_Form_Field_Attributes::get( $attributes ); ?>>
                <?php foreach ( $attributes['options'] as $option ) : ?>
                    <option <?php selected( $option['selected'] ); ?> value="<?php echo esc_attr( $option['value'] ); ?>">
                        <?php echo esc_html( $option['label'] ); ?>
                    </option>
                <?php endforeach; ?>
            </select>

            <?php GhostKit_Form_Field_Description::get( $attributes ); ?>
        </div>

        <?php

        return ob_get_clean();
    }
}
new GhostKit_Form_Field_Select_Block();
