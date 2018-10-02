<?php
/**
 * Widget for reusable blocks
 *
 * @package @@plugin_name
 */

/**
 * Ghostkit_Reusable_Widget
 */
class Ghostkit_Reusable_Widget extends WP_Widget {
    /**
     * Sets up the widgets name etc
     */
    public function __construct() {
        parent::__construct(
            'ghostkit_reusable_widget',
            esc_html__( 'Reusable Block', '@@text_domain' ),
            array(
                'classname' => 'ghostkit-reusable-widget',
                'description' => esc_html__( 'Display Gutenberg Reusable Blocks.', '@@text_domain' ),
            )
        );
    }

    /**
     * Outputs the content of the widget
     *
     * @param array $args args.
     * @param array $instance instance.
     */
    public function widget( $args, $instance ) {
        $title = ! empty( $instance['title'] ) ? apply_filters( 'widget_title', $instance['title'] ) : '';
        $block = isset( $instance['block'] ) && ! empty( $instance['block'] ) ? $instance['block'] : '';
        $post = $block ? get_post( $block ) : false;

        if ( $block && $post->post_content ) {
            // phpcs:disable
            echo $args['before_widget'];

            if ( ! empty( $title ) ) {
                echo $args[ 'before_title' ] . $title . $args[ 'after_title' ];
            }

            echo apply_filters( 'the_content', $post->post_content );

            echo $args['after_widget'];
            // phpcs:enable
        }
    }
    /**
     * Outputs the options form on admin
     *
     * @param array $instance The widget options.
     */
    public function form( $instance ) {
        $title = ! empty( $instance['title'] ) ? $instance['title'] : '';
        $selected_block = ! empty( $instance['block'] ) ? $instance['block'] : '';
        $blocks = get_posts( array(
            'post_type' => 'wp_block',
        ) );
        ?>

        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title:', '@@text_domain' ); ?></label>
            <input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
        </p>

        <?php
        if ( ! empty( $blocks ) ) {
            ?>
            <p>
                <label for="<?php echo esc_attr( $this->get_field_id( 'block' ) ); ?>"><?php echo esc_attr__( 'Select Block:', '@@text_domain' ); ?></label>
                <select class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'block' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'block' ) ); ?>">
                    <option value="" disabled <?php selected( ! $selected_block ); ?>><?php echo esc_html__( '--- Select block ---', '@@text_domain' ); ?></option>
                    <?php
                    foreach ( $blocks as $block ) {
                        ?>
                        <option value="<?php echo esc_attr( $block->ID ); ?>" <?php selected( $selected_block, $block->ID ); ?>>
                            <?php echo esc_html( $block->post_title ); ?>
                        </option>
                        <?php
                    }
                    ?>
                </select>
            </p>
            <?php
        } else {
            ?>
            <p><?php echo esc_attr__( 'No reusable blocks found.', '@@text_domain' ); ?></p>
            <?php
        }
    }

    /**
     * Processing widget options on save
     *
     * @param array $new_instance new options.
     * @param array $old_instance previous options.
     *
     * @return array
     */
    public function update( $new_instance, $old_instance ) {
        $instance = array(
            'title' => ! empty( $new_instance['title'] ) ? sanitize_text_field( $new_instance['title'] ) : '',
            'block' => ! empty( $new_instance['block'] ) ? sanitize_text_field( $new_instance['block'] ) : '',
        );

        return $instance;
    }
}

/**
 * Register Widget
 */
function ghostkit_register_reusable_widget() {
    register_widget( 'Ghostkit_Reusable_Widget' );
}
add_action( 'widgets_init', 'ghostkit_register_reusable_widget' );
