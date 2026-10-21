<?php
/**
 * Rest API functions
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Rest
 */
class GhostKit_Rest extends WP_REST_Controller {
	/**
	 * Namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'ghostkit/v';

	/**
	 * Version.
	 *
	 * @var string
	 */
	protected $version = '1';

	/**
	 * GhostKit_Rest constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register rest routes.
	 */
	public function register_routes() {
		$namespace = $this->namespace . $this->version;

		// Get layouts list.
		register_rest_route(
			$namespace,
			'/get_customizer/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_customizer' ),
				'permission_callback' => array( $this, 'get_customizer_permission' ),
			)
		);

		// Get attachment image <img> tag.
		register_rest_route(
			$namespace,
			'/get_attachment_image/(?P<id>[\d]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_attachment_image' ),
				'permission_callback' => array( $this, 'get_attachment_image_permission' ),
			)
		);

		// Get icons list for the icon picker.
		register_rest_route(
			$namespace,
			'/get_icons/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_icons' ),
				'permission_callback' => array( $this, 'get_icons_permission' ),
			)
		);

		// Get TOC.
		register_rest_route(
			$namespace,
			'/get_table_of_contents/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_table_of_contents' ),
				'args'                => array(
					'headings'       => array(
						'default'           => array(),
						'sanitize_callback' => array( $this, 'sanitize_toc_headings' ),
					),
					'allowedHeaders' => array(
						'default'           => array(),
						'sanitize_callback' => array( $this, 'sanitize_toc_allowed_headers' ),
					),
					'listStyle'      => array(
						'default'           => 'ol',
						'sanitize_callback' => array( $this, 'sanitize_toc_list_style' ),
					),
				),
				'permission_callback' => '__return_true',
			)
		);

		// Get Templates.
		register_rest_route(
			$namespace,
			'/get_templates/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_templates' ),
				'permission_callback' => array( $this, 'get_templates_permission' ),
			)
		);

		// Get template data.
		register_rest_route(
			$namespace,
			'/get_template_data/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_template_data' ),
				'permission_callback' => array( $this, 'get_template_data_permission' ),
			)
		);

		// Get Custom Code.
		register_rest_route(
			$namespace,
			'/get_custom_code/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_custom_code' ),
				'permission_callback' => array( $this, 'get_custom_code_permission' ),
			)
		);

		// Update Custom Code.
		register_rest_route(
			$namespace,
			'/update_custom_code/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_custom_code' ),
				'permission_callback' => array( $this, 'update_custom_code_permission' ),
			)
		);

		// Update Color Palette.
		register_rest_route(
			$namespace,
			'/update_color_palette/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_color_palette' ),
				'permission_callback' => array( $this, 'update_color_palette_permission' ),
			)
		);

		// Get Typography.
		register_rest_route(
			$namespace,
			'/get_custom_typography/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_custom_typography' ),
				'permission_callback' => array( $this, 'get_custom_typography_permission' ),
			)
		);

		// Update Typography.
		register_rest_route(
			$namespace,
			'/update_custom_typography/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_custom_typography' ),
				'permission_callback' => array( $this, 'update_custom_typography_permission' ),
			)
		);

		// Update Google Maps API key.
		register_rest_route(
			$namespace,
			'/update_google_maps_api_key/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_google_maps_api_key' ),
				'permission_callback' => array( $this, 'update_google_maps_api_key_permission' ),
			)
		);

		// Update Google reCaptcha keys.
		register_rest_route(
			$namespace,
			'/update_google_recaptcha_keys/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_google_recaptcha_keys' ),
				'permission_callback' => array( $this, 'update_google_recaptcha_keys_permission' ),
			)
		);

		// Update Disabled Blocks.
		register_rest_route(
			$namespace,
			'/update_disabled_blocks/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_disabled_blocks' ),
				'permission_callback' => array( $this, 'update_disabled_blocks_permission' ),
			)
		);

		// Update Settings.
		register_rest_route(
			$namespace,
			'/update_settings/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_settings' ),
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);

		// Get Custom Fonts.
		register_rest_route(
			$namespace,
			'/get_custom_fonts/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_custom_fonts' ),
				'permission_callback' => array( $this, 'get_custom_fonts_permission' ),
			)
		);

		// Update Custom Fonts.
		register_rest_route(
			$namespace,
			'/update_custom_fonts/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_custom_fonts' ),
				'permission_callback' => array( $this, 'update_custom_fonts_permission' ),
			)
		);
	}

	/**
	 * Get read fonts permissions.
	 *
	 * @return bool
	 */
	public function get_custom_fonts_permission() {
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get edit fonts permissions.
	 *
	 * @return bool
	 */
	public function update_custom_fonts_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get read customizer permissions.
	 *
	 * @return bool
	 */
	public function get_customizer_permission() {
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change Customizer options.', 'ghostkit' ), true );
		}
		return true;
	}

	/**
	 * Get attachment image <img> tag permissions.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return bool|WP_Error
	 */
	public function get_attachment_image_permission( WP_REST_Request $request ) {
		// Users who can browse the media library see every attachment there; others only those they may read.
		if (
			! current_user_can( 'edit_posts' ) ||
			! ( current_user_can( 'upload_files' ) || current_user_can( 'read_post', (int) $request->get_param( 'id' ) ) )
		) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to read this image.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get icons list permissions.
	 * The list is static plugin data, so any user who can edit posts of a post type
	 * shown in the block editor gets it, including users who edit only pages.
	 *
	 * @return bool|WP_Error
	 */
	public function get_icons_permission() {
		if ( current_user_can( 'edit_posts' ) ) {
			return true;
		}

		foreach ( get_post_types( array( 'show_in_rest' => true ), 'objects' ) as $post_type ) {
			if ( current_user_can( $post_type->cap->edit_posts ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Get templates list permissions.
	 *
	 * @return bool|WP_Error
	 */
	public function get_templates_permission() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to read templates.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get template data permissions.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return bool|WP_Error
	 */
	public function get_template_data_permission( WP_REST_Request $request ) {
		$allowed = $this->get_templates_permission();

		if ( true !== $allowed ) {
			return $allowed;
		}

		if ( 'local' === $request->get_param( 'type' ) ) {
			$post = get_post( (int) $request->get_param( 'id' ) );

			if ( $post && 'ghostkit_template' === $post->post_type && ! current_user_can( 'read_post', $post->ID ) ) {
				return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to read this template.', 'ghostkit' ), true );
			}
		}

		return true;
	}

	/**
	 * Get read custom code permissions.
	 *
	 * @return bool
	 */
	public function get_custom_code_permission() {
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get edit custom code permissions.
	 *
	 * @return bool
	 */
	public function update_custom_code_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get edit color palette permissions.
	 *
	 * @return bool
	 */
	public function update_color_palette_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get read typography permissions.
	 *
	 * @return bool
	 */
	public function get_custom_typography_permission() {
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get edit typography permissions.
	 *
	 * @return bool
	 */
	public function update_custom_typography_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get read Google Maps API key permissions.
	 *
	 * @return bool
	 */
	public function update_google_maps_api_key_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get read Google reCaptcha API keys permissions.
	 *
	 * @return bool
	 */
	public function update_google_recaptcha_keys_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get edit options permissions.
	 *
	 * @return bool
	 */
	public function update_disabled_blocks_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get edit options permissions.
	 *
	 * @return bool
	 */
	public function update_settings_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', 'ghostkit' ), true );
		}

		return true;
	}

	/**
	 * Get custom fonts.
	 *
	 * @return mixed
	 */
	public function get_custom_fonts() {
		$fonts = get_option( 'ghostkit_fonts_settings', array() );
		$fonts = apply_filters( 'gkt_rest_get_custom_fonts', $fonts );

		if ( is_array( $fonts ) ) {
			return $this->success( $fonts );
		} else {
			return $this->error( 'no_fonts', __( 'Custom fonts not found.', 'ghostkit' ) );
		}
	}

	/**
	 * Update fonts.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_custom_fonts( WP_REST_Request $request ) {
		$new_fonts      = $request->get_param( 'data' );
		$updated_option = array();

		$new_fonts = apply_filters( 'gkt_rest_update_custom_fonts', $new_fonts );

		if ( is_array( $new_fonts ) ) {
			$current_fonts = get_option( 'ghostkit_fonts_settings', array() );

			$updated_option = array_merge( is_array( $current_fonts ) ? $current_fonts : array(), $new_fonts );

			update_option( 'ghostkit_fonts_settings', $updated_option );
		}

		return $this->success( $updated_option );
	}

	/**
	 * Get customizer data.
	 *
	 * @return mixed
	 */
	public function get_customizer() {
		$options = get_option( 'ghostkit_customizer_fields' );

		if ( ! empty( $options ) ) {
			return $this->success( $options );
		} else {
			return $this->error( 'no_options_found', __( 'Options not found.', 'ghostkit' ) );
		}
	}

	/**
	 * Get attachment image <img> tag.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_attachment_image( WP_REST_Request $request ) {
		$id      = $request->get_param( 'id' );
		$size    = $request->get_param( 'size' );
		$icon    = $request->get_param( 'icon' );
		$attr    = $request->get_param( 'attr' );
		$div_tag = $request->get_param( 'div_tag' );

		if ( ! $id ) {
			return $this->error( 'no_id_found', __( 'Provide image ID.', 'ghostkit' ) );
		}

		$attr = isset( $attr ) && $attr && is_array( $attr ) ? $attr : array();

		if ( $div_tag ) {
			$image_url = wp_get_attachment_image_url( $id, $size, $icon );

			if ( ! isset( $attr['style'] ) ) {
				$attr['style'] = '';
			}

			$attr['style'] .= 'background-image: url("' . esc_url( $image_url ) . '");';

			$attr  = array_map( 'esc_attr', $attr );
			$image = '<div';

			foreach ( $attr as $name => $value ) {
				$image .= " $name=" . '"' . $value . '"';
			}

			$image .= '></div>';
		} else {
			$image_src = wp_get_attachment_image_src( $id, $size, $icon );

			if ( $image_src ) {
				list( $src, $width, $height ) = $image_src;

				$alt = trim( wp_strip_all_tags( get_post_meta( $id, '_wp_attachment_image_alt', true ) ) );

				if ( $alt ) {
					$attr['alt'] = $alt;
				}

				if ( ! isset( $attr['class'] ) ) {
					$attr['class'] = 'wp-image-' . $id;
				} else {
					$attr['class'] = 'wp-image-' . $id . ' ' . $attr['class'];
				}

				$attr['width']  = $width;
				$attr['height'] = $height;

				$attrs_str = '';

				if ( isset( $attr ) && is_array( $attr ) ) {
					foreach ( $attr as $name => $val ) {
						$attrs_str .= ' ' . $name . '="' . esc_attr( $val ) . '"';
					}
				}

				$image = '<img src="' . esc_url( $src ) . '"' . $attrs_str . ' />';
			}
		}

		if ( isset( $image ) && $image ) {
			return $this->success( $image );
		} else {
			return $this->error( 'no_image_found', __( 'Image not found.', 'ghostkit' ) );
		}
	}

	/**
	 * Get icons list with SVG of every icon.
	 *
	 * @return mixed
	 */
	public function get_icons() {
		return $this->success( apply_filters( 'gkt_icons_list', array() ) );
	}

	/**
	 * Sanitize TOC headings list.
	 *
	 * @param mixed $headings request headings.
	 * @return array
	 */
	public function sanitize_toc_headings( $headings ) {
		if ( ! is_array( $headings ) ) {
			return array();
		}

		$sanitized = array();

		foreach ( $headings as $heading ) {
			if ( ! is_array( $heading ) ) {
				continue;
			}

			$level = isset( $heading['level'] ) ? absint( $heading['level'] ) : 0;

			if ( $level < 1 || $level > 6 ) {
				continue;
			}

			$sanitized[] = array(
				'level'   => $level,
				'content' => isset( $heading['content'] ) ? wp_kses_post( $heading['content'] ) : '',
				'anchor'  => isset( $heading['anchor'] ) ? sanitize_text_field( $heading['anchor'] ) : '',
			);
		}

		return $sanitized;
	}

	/**
	 * Sanitize TOC allowed headers list.
	 *
	 * @param mixed $allowed_headers request allowed headers.
	 * @return array
	 */
	public function sanitize_toc_allowed_headers( $allowed_headers ) {
		if ( ! is_array( $allowed_headers ) ) {
			return array();
		}

		$sanitized = array_values(
			array_unique(
				array_filter(
					array_map( 'absint', $allowed_headers ),
					static function ( $level ) {
						return $level >= 1 && $level <= 6;
					}
				)
			)
		);

		return $sanitized;
	}

	/**
	 * Sanitize TOC list style.
	 *
	 * @param mixed $list_style request list style.
	 * @return string
	 */
	public function sanitize_toc_list_style( $list_style ) {
		$list_style = is_string( $list_style ) ? sanitize_text_field( $list_style ) : 'ol';
		$allowed    = array( 'ol', 'ul', 'ol-styled', 'ul-styled' );

		return in_array( $list_style, $allowed, true ) ? $list_style : 'ol';
	}

	/**
	 * Get TOC.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_table_of_contents( WP_REST_Request $request ) {
		$headings        = $request->get_param( 'headings' );
		$allowed_headers = $request->get_param( 'allowedHeaders' );
		$list_style      = $request->get_param( 'listStyle' );

		$html = '';

		if ( empty( $allowed_headers ) || empty( $headings ) ) {
			return $this->success( $html );
		}

		$current_depth      = 6;
		$numbered_items     = array();
		$numbered_items_min = null;
		$count              = count( $headings );

		// find the minimum heading to establish our baseline.
		for ( $i = 0; $i < $count; $i++ ) {
			if ( $current_depth > (int) $headings[ $i ]['level'] ) {
				$current_depth = (int) $headings[ $i ]['level'];
			}
		}

		$numbered_items[ $current_depth ] = 0;
		$numbered_items_min               = $current_depth;
		for ( $i = 0; $i < $count; $i++ ) {
			if ( $current_depth === (int) $headings[ $i ]['level'] ) {
				$html .= '<li>';
			}

			// start lists.
			if ( $current_depth !== (int) $headings[ $i ]['level'] ) {
				for ( $current_depth; $current_depth < (int) $headings[ $i ]['level']; $current_depth++ ) {
					$numbered_items[ $current_depth + 1 ] = 0;

					if ( ! in_array( $current_depth, $allowed_headers, true ) ) {
						continue;
					}

					$html .= '<ul>';
					$html .= '<li>';
				}
			}

			$html .= '<a href="' . esc_attr( '#' . $headings[ $i ]['anchor'] ) . '">' . wp_kses_post( $headings[ $i ]['content'] ) . '</a>';

			// end lists.
			if ( $i !== $count - 1 ) {
				if ( $current_depth > (int) $headings[ $i + 1 ]['level'] ) {
					for ( $current_depth; $current_depth > (int) $headings[ $i + 1 ]['level']; $current_depth-- ) {
						$numbered_items[ $current_depth ] = 0;

						if ( ! in_array( $current_depth, $allowed_headers, true ) ) {
							continue;
						}

						$html .= '</li>';
						$html .= '</ul>';
					}
				}
				if ( isset( $headings[ $i + 1 ]['level'] ) && (int) $headings[ $i + 1 ]['level'] === $current_depth ) {
					$html .= '</li>';
				}
			} else {
				// this is the last item, make sure we close off all tags.
				for ( $current_depth; $current_depth >= $numbered_items_min; $current_depth-- ) {
					if ( ! in_array( $current_depth, $allowed_headers, true ) ) {
						continue;
					}

					$html .= '</li>';
					if ( $current_depth !== $numbered_items_min ) {
						$html .= '</ul>';
					}
				}
			}
		}

		// Wrapper.
		if ( $html ) {
			$list            = 'ol';
			$list_class_name = '';

			switch ( $list_style ) {
				case 'ul':
					$list = 'ul';
					break;
				case 'ul-styled':
					$list            = 'ul';
					$list_class_name = 'is-style-styled';
					break;
				case 'ol-styled':
					$list_class_name = 'is-style-styled';
					break;
			}

			$html = '<' . $list . ( $list_class_name ? ( ' class="' . $list_class_name . '"' ) : '' ) . '>' . $html . '</' . $list . '>';
		}

		return $this->success( $html );
	}

	/**
	 * Get templates.
	 *
	 * @return mixed
	 */
	public function get_templates() {
		$url       = 'https://library.ghostkit.io/wp-json/ghostkit-library/v1/get_library/';
		$templates = get_transient( 'ghostkit_remote_templates', false );

		/*
		 * Get remote templates.
		 */
		if ( ! $templates ) {
			$requested_templates = wp_remote_get(
				add_query_arg(
					array(
						'ghostkit_version'     => GHOSTKIT_VERSION,
						'ghostkit_pro'         => function_exists( 'ghostkit_pro' ),
						'ghostkit_pro_version' => function_exists( 'ghostkit_pro' ) ? ghostkit_pro()->plugin_version : null,
					),
					$url
				)
			);

			if ( ! is_wp_error( $requested_templates ) ) {
				$new_templates = wp_remote_retrieve_body( $requested_templates );
				$new_templates = json_decode( $new_templates, true );

				if ( $new_templates && isset( $new_templates['response'] ) && is_array( $new_templates['response'] ) ) {
					$templates = $new_templates['response'];
					set_transient( 'ghostkit_remote_templates', $templates, DAY_IN_SECONDS );
				}
			}
		}

		// Remove Pro templates from array, cause for now there is no way to check if pro addon is activated.
		if ( $templates ) {
			foreach ( $templates as $k => $template ) {
				$is_pro = false;

				if ( isset( $template['types'] ) && is_array( $template['types'] ) ) {
					foreach ( $template['types'] as $type ) {
						$is_pro = $is_pro || 'pro' === $type['slug'];
					}
				}

				if ( $is_pro ) {
					unset( $templates[ $k ] );
				}
			}
		}

		/*
		 * Get user templates from db.
		 */

		// Stupid hack.
		// https://core.trac.wordpress.org/ticket/18408.
		global $post;
		$backup_global_post = $post;
		$local_templates    = array();

		$local_templates_query = new WP_Query(
			array(
				'post_type'      => 'ghostkit_template',
				'posts_per_page' => -1,
				'showposts'      => -1,
				'paged'          => -1,
			)
		);

		while ( $local_templates_query->have_posts() ) {
			$local_templates_query->the_post();
			$db_template = get_post();

			$categories     = array();
			$category_terms = get_the_terms( $db_template->ID, 'ghostkit_template_category' );

			if ( $category_terms ) {
				foreach ( $category_terms as $cat ) {
					$categories[] = array(
						'slug' => $cat->slug,
						'name' => $cat->name,
					);
				}
			}

			$image_id   = get_post_thumbnail_id( $db_template->ID );
			$image_data = wp_get_attachment_image_src( $image_id, 'large' );

			$local_templates[] = array(
				'id'               => $db_template->ID,
				'title'            => $db_template->post_title,
				'types'            => array(
					array(
						'slug' => 'local',
					),
				),
				'categories'       => empty( $categories ) ? false : $categories,
				'url'              => get_post_permalink( $db_template->ID ),
				'thumbnail'        => isset( $image_data[0] ) ? $image_data[0] : false,
				'thumbnail_width'  => isset( $image_data[1] ) ? $image_data[1] : false,
				'thumbnail_height' => isset( $image_data[2] ) ? $image_data[2] : false,
			);
		}

		// Restore the global $post as it was before custom WP_Query.
        // phpcs:ignore
        $post = $backup_global_post;

		/*
		 * Get theme templates.
		 */
		$theme_templates      = array();
		$theme_templates_data = array();

		foreach ( glob( get_template_directory() . '/ghostkit/templates/*/content.php' ) as $template ) {
			$template_path = dirname( $template );
			$template_url  = get_template_directory_uri() . str_replace( get_template_directory(), '', $template_path );
			$slug          = basename( $template_path );

			$theme_templates_data[ $slug ] = array(
				'slug' => $slug,
				'path' => $template_path,
				'url'  => $template_url,
			);
		}

		// get child theme templates.
		if ( get_stylesheet_directory() !== get_template_directory() ) {
			foreach ( glob( get_stylesheet_directory() . '/ghostkit/templates/*/content.php' ) as $template ) {
				$template_path = dirname( $template );
				$template_url  = get_stylesheet_directory_uri() . str_replace( get_stylesheet_directory(), '', $template_path );
				$slug          = basename( $template_path );

				$theme_templates_data[ $slug ] = array(
					'slug' => $slug,
					'path' => $template_path,
					'url'  => $template_url,
				);
			}
		}

		// natural sort.
		array_multisort( array_keys( $theme_templates_data ), SORT_NATURAL, $theme_templates_data );

		foreach ( $theme_templates_data as $template_data ) {
			$file_data = get_file_data(
				$template_data['path'] . '/content.php',
				array(
					'name'     => 'Name',
					'category' => 'Category',
					'source'   => 'Source',
				)
			);

			$thumbnail        = false;
			$thumbnail_width  = false;
			$thumbnail_height = false;

			if ( file_exists( $template_data['path'] . '/thumbnail.png' ) ) {
				$thumbnail = $template_data['url'] . '/thumbnail.png';

				list($thumbnail_width, $thumbnail_height) = getimagesize( $thumbnail );
			}

			if ( file_exists( $template_data['path'] . '/thumbnail.jpg' ) ) {
				$thumbnail = $template_data['url'] . '/thumbnail.jpg';
			}

			$theme_templates[] = array(
				'id'               => basename( $template_data['path'] ),
				'title'            => $file_data['name'],
				'types'            => array(
					array(
						'slug' => 'theme',
					),
				),
				'categories'       => isset( $file_data['category'] ) && $file_data['category'] ? array(
					array(
						'slug' => $file_data['category'],
						'name' => $file_data['category'],
					),
				) : false,
				'url'              => false,
				'thumbnail'        => $thumbnail,
				'thumbnail_width'  => $thumbnail_width,
				'thumbnail_height' => $thumbnail_height,
			);
		}

		// merge all available templates.
		$templates = array_merge( $templates, $local_templates, $theme_templates );

		if ( is_array( $templates ) ) {
			return $this->success( $templates );
		} else {
			return $this->error( 'no_templates', __( 'Templates not found.', 'ghostkit' ) );
		}
	}

	/**
	 * Get templates.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_template_data( WP_REST_Request $request ) {
		$url           = 'https://library.ghostkit.io/wp-json/ghostkit-library/v1/get_library_item/';
		$id            = $request->get_param( 'id' );
		$type          = $request->get_param( 'type' );
		$template_data = false;

		// Validation and security checks.
		if ( empty( $id ) || ! preg_match( '/^[a-zA-Z0-9_-]+$/', $id ) ) {
			return $this->error( 'invalid_id', __( 'Invalid template ID.', 'ghostkit' ) );
		}

		switch ( $type ) {
			case 'remote':
				$template_data = get_transient( 'ghostkit_template_' . $type . '_' . $id, false );

				if ( ! $template_data ) {
					$requested_template_data = wp_remote_get(
						add_query_arg(
							array(
								'id'                   => $id,
								'ghostkit_version'     => GHOSTKIT_VERSION,
								'ghostkit_pro'         => function_exists( 'ghostkit_pro' ),
								'ghostkit_pro_version' => function_exists( 'ghostkit_pro' ) ? ghostkit_pro()->plugin_version : null,
							),
							$url
						)
					);

					if ( ! is_wp_error( $requested_template_data ) ) {
						$new_template_data = wp_remote_retrieve_body( $requested_template_data );
						$new_template_data = json_decode( $new_template_data, true );

						if ( $new_template_data && isset( $new_template_data['response'] ) && is_array( $new_template_data['response'] ) ) {
							$template_data = $new_template_data['response'];
							set_transient( 'ghostkit_template_' . $type . '_' . $id, $template_data, DAY_IN_SECONDS );
						}
					}
				}
				break;
			case 'local':
				$post = get_post( $id );

				if ( $post && 'ghostkit_template' === $post->post_type ) {
					$template_data = array(
						'id'      => $post->ID,
						'title'   => $post->post_title,
						'content' => $post->post_content,
					);
				}

				break;
			case 'theme':
				$template_content_file = get_stylesheet_directory() . '/ghostkit/templates/' . $id . '/content.php';

				if ( ! file_exists( $template_content_file ) ) {
					$template_content_file = get_template_directory() . '/ghostkit/templates/' . $id . '/content.php';
				}

				if ( file_exists( $template_content_file ) ) {
					ob_start();
					include $template_content_file;
					$template_content = ob_get_clean();

					if ( $template_content ) {
						$template_data = get_file_data(
							$template_content_file,
							array(
								'name' => 'Name',
							)
						);

						$template_data = array(
							'id'      => $id,
							'title'   => $template_data['name'],
							'content' => $template_content,
						);
					}
				}
				break;
		}

		if ( is_array( $template_data ) ) {
			return $this->success( $template_data );
		} else {
			return $this->error( 'no_template_data', __( 'Template data not found.', 'ghostkit' ) );
		}
	}

	/**
	 * Get custom code.
	 *
	 * @return mixed
	 */
	public function get_custom_code() {
		$custom_code = get_option( 'ghostkit_custom_code', array() );

		if ( is_array( $custom_code ) ) {
			return $this->success( $custom_code );
		} else {
			return $this->error( 'no_custom_code', __( 'Custom code not found.', 'ghostkit' ) );
		}
	}

	/**
	 * Update custom code.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_custom_code( WP_REST_Request $request ) {
		$new_code = $request->get_param( 'data' );

		if ( is_array( $new_code ) ) {
			$current_code = get_option( 'ghostkit_custom_code', array() );

			// Global JS is printed unescaped on every page, so changing it needs the same capability as per-post JS.
			if ( ! current_user_can( 'unfiltered_html' ) ) {
				foreach ( array( 'ghostkit_custom_js_head', 'ghostkit_custom_js_foot' ) as $js_key ) {
					$current_js = isset( $current_code[ $js_key ] ) ? $current_code[ $js_key ] : '';

					if ( array_key_exists( $js_key, $new_code ) && (string) $new_code[ $js_key ] !== (string) $current_js ) {
						return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change custom JavaScript.', 'ghostkit' ), true );
					}
				}
			}

			update_option( 'ghostkit_custom_code', array_merge( $current_code, $new_code ) );
		}

		return $this->success( true );
	}

	/**
	 * Update color palette.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_color_palette( WP_REST_Request $request ) {
		$colors = $request->get_param( 'data' );

		if ( is_array( $colors ) ) {
			update_option( 'ghostkit_color_palette', $colors );
		}

		return $this->success( true );
	}

	/**
	 * Get custom typography.
	 *
	 * @return mixed
	 */
	public function get_custom_typography() {
		$typography = get_option( 'ghostkit_typography', array() );

		if ( is_array( $typography ) ) {
			return $this->success( $typography );
		} else {
			return $this->error( 'no_typography', __( 'Typography not found.', 'ghostkit' ) );
		}
	}

	/**
	 * Update typography.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_custom_typography( WP_REST_Request $request ) {
		$new_typography = $request->get_param( 'data' );
		$updated_option = array();

		if ( is_array( $new_typography ) ) {
			$current_typography = get_option( 'ghostkit_typography', array() );

			if ( empty( $current_typography ) ) {
				$updated_option = $new_typography;
			} else {
				$current_typography['ghostkit_typography'] = json_decode( $current_typography['ghostkit_typography'], true );
				$new_typography['ghostkit_typography']     = json_decode( $new_typography['ghostkit_typography'], true );

				$updated_option = array_merge( $current_typography, $new_typography );

				$updated_option['ghostkit_typography'] = wp_json_encode( $updated_option['ghostkit_typography'] );
			}

			update_option( 'ghostkit_typography', $updated_option );
		}

		return $this->success( true );
	}

	/**
	 * Update Google Maps API key.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_google_maps_api_key( WP_REST_Request $request ) {
		update_option( 'ghostkit_google_maps_api_key', $request->get_param( 'key' ) );

		return $this->success( true );
	}

	/**
	 * Update Google reCaptcha API keys.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_google_recaptcha_keys( WP_REST_Request $request ) {
		update_option( 'ghostkit_google_recaptcha_api_site_key', $request->get_param( 'site_key' ) );
		update_option( 'ghostkit_google_recaptcha_api_secret_key', $request->get_param( 'secret_key' ) );

		return $this->success( true );
	}

	/**
	 * Update Disabled Blocks.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_disabled_blocks( WP_REST_Request $request ) {
		$new_disabled_blocks = $request->get_param( 'blocks' );

		if ( is_array( $new_disabled_blocks ) ) {
			$disabled_blocks = array_merge( get_option( 'ghostkit_disabled_blocks', array() ), $new_disabled_blocks );
			$result          = array();

			foreach ( $disabled_blocks as $k => $block_disabled ) {
				if ( $block_disabled ) {
					$result[ $k ] = true;
				}
			}

			update_option( 'ghostkit_disabled_blocks', $result );
		}

		return $this->success( true );
	}

	/**
	 * Update Settings.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_settings( WP_REST_Request $request ) {
		$new_settings = $request->get_param( 'settings' );

		if ( is_array( $new_settings ) ) {
			$current_settings = get_option( 'ghostkit_settings', array() );
			update_option( 'ghostkit_settings', array_merge( $current_settings, $new_settings ) );
		}

		return $this->success( true );
	}

	/**
	 * Success rest.
	 *
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function success( $response ) {
		return new WP_REST_Response(
			array(
				'success'  => true,
				'response' => $response,
			),
			200
		);
	}

	/**
	 * Error rest.
	 *
	 * @param mixed   $code       error code.
	 * @param mixed   $response   response data.
	 * @param boolean $true_error use true error response to stop the code processing.
	 * @return mixed
	 */
	public function error( $code, $response, $true_error = false ) {
		if ( $true_error ) {
			return new WP_Error( $code, $response, array( 'status' => rest_authorization_required_code() ) );
		}

		return new WP_REST_Response(
			array(
				'error'      => true,
				'success'    => false,
				'error_code' => $code,
				'response'   => $response,
			),
			401
		);
	}
}
new GhostKit_Rest();
