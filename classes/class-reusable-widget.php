<?php
/**
 * Widget for reusable blocks
 *
 * @package ghostkit
 */

/**
 * GhostKit_Reusable_Widget
 */
class GhostKit_Reusable_Widget extends WP_Widget {
	/**
	 * Sets up the widgets name etc
	 */
	public function __construct() {
		parent::__construct(
			'ghostkit_reusable_widget',
			esc_html__( 'Reusable Block', 'ghostkit' ),
			array(
				'classname'   => 'ghostkit-reusable-widget',
				'description' => esc_html__( 'Display Gutenberg Reusable Blocks.', 'ghostkit' ),
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
		$title    = ! empty( $instance['title'] ) ? apply_filters( 'widget_title', $instance['title'] ) : '';
		$block_id = isset( $instance['block'] ) && ! empty( $instance['block'] ) ? $instance['block'] : '';
		$post     = $block_id ? get_post( $block_id ) : false;

		if ( $block_id && isset( $post->post_content ) && $post->post_content && function_exists( 'has_blocks' ) && function_exists( 'parse_blocks' ) ) {
            // phpcs:disable
            echo $args['before_widget'];

            if ( ! empty( $title ) ) {
                echo $args[ 'before_title' ] . $title . $args[ 'after_title' ];
            }

            // fix for bbPress.
            // filter 'the_content' may not work in bbPress
            // https://github.com/nk-crew/ghostkit/issues/72.
            // https://bbpress.org/forums/topic/the_content-filter-is-removed-by-not-restored-on-custom-wp_query/
            if ( function_exists( 'is_bbpress' ) && is_bbpress() ) {
                bbp_restore_all_filters( 'the_content' );
            }

            echo apply_filters( 'the_content', $post->post_content );

            if ( function_exists( 'is_bbpress' ) && is_bbpress() ) {
                bbp_remove_all_filters( 'the_content' );
            }

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
		$title          = ! empty( $instance['title'] ) ? $instance['title'] : '';
		$selected_block = ! empty( $instance['block'] ) ? $instance['block'] : '';
		$blocks         = get_posts(
			array(
				'post_type'   => 'wp_block',
				'numberposts' => -1,
			)
		);

		GhostKit_Assets::enqueue_script( 'ghostkit-admin-reusable-widget', 'build/assets/admin/js/reusable-widget', array(), null, false );
		?>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title:', 'ghostkit' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>

		<?php
		if ( ! empty( $blocks ) ) {
			?>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'block' ) ); ?>"><?php echo esc_attr__( 'Select Block:', 'ghostkit' ); ?></label>
				<select class="widefat gkt-reusable-block-select" id="<?php echo esc_attr( $this->get_field_id( 'block' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'block' ) ); ?>">
					<option value="" disabled <?php selected( '', $selected_block ); ?>><?php echo esc_html__( '--- Select block ---', 'ghostkit' ); ?></option>
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
			<p><?php echo esc_attr__( 'No reusable blocks found.', 'ghostkit' ); ?></p>
			<?php
		}
		?>
		<p class="gkt-reusable-block-edit-button" style="display: none" data-admin-url="<?php echo esc_url( get_admin_url() ); ?>">
			<label for="<?php echo esc_attr( $this->get_field_id( 'edit_button' ) ); ?>"><?php esc_attr_e( 'Edit:', 'ghostkit' ); ?></label>
			<br>
			<a class="button" id="<?php echo esc_attr( $this->get_field_id( 'edit_button' ) ); ?>" href="" target="_blank">
				<?php esc_attr_e( 'Edit Reusable Block', 'ghostkit' ); ?>
			</a>
		</p>
		<?php
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
	register_widget( 'GhostKit_Reusable_Widget' );
}
add_action( 'widgets_init', 'ghostkit_register_reusable_widget' );
