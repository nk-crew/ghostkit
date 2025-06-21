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

		// Get Instagram profile.
		register_rest_route(
			$namespace,
			'/get_instagram_profile/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_instagram_profile' ),
				'permission_callback' => array( $this, 'get_instagram_profile_permission' ),
			)
		);

		// Get Instagram feed.
		register_rest_route(
			$namespace,
			'/get_instagram_feed/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_instagram_feed' ),
				'permission_callback' => array( $this, 'get_instagram_feed_permission' ),
			)
		);

		// Get Twitter profile.
		register_rest_route(
			$namespace,
			'/get_twitter_profile/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_twitter_profile' ),
				'permission_callback' => array( $this, 'get_twitter_profile_permission' ),
			)
		);

		// Get Twitter feed.
		register_rest_route(
			$namespace,
			'/get_twitter_feed/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_twitter_feed' ),
				'permission_callback' => array( $this, 'get_twitter_feed_permission' ),
			)
		);

		// Get TOC.
		register_rest_route(
			$namespace,
			'/get_table_of_contents/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_table_of_contents' ),
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
				'permission_callback' => '__return_true',
			)
		);

		// Get template data.
		register_rest_route(
			$namespace,
			'/get_template_data/',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_template_data' ),
				'permission_callback' => '__return_true',
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
	 * @return bool
	 */
	public function get_attachment_image_permission() {
		return true;
	}

	/**
	 * Get Instagram feed permissions.
	 *
	 * @return bool
	 */
	public function get_instagram_feed_permission() {
		return true;
	}

	/**
	 * Get Instagram profile permissions.
	 *
	 * @return bool
	 */
	public function get_instagram_profile_permission() {
		return true;
	}

	/**
	 * Get Twitter feed permissions.
	 *
	 * @return bool
	 */
	public function get_twitter_feed_permission() {
		return true;
	}

	/**
	 * Get Twitter profile permissions.
	 *
	 * @return bool
	 */
	public function get_twitter_profile_permission() {
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
	 * Get Instagram feed.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_instagram_feed( WP_REST_Request $request ) {
		$cache_name       = 'ghostkit_instagram_feed_cache';
		$cache_expiration = $request->get_param( 'cache_expiration' ) ? $request->get_param( 'cache_expiration' ) : DAY_IN_SECONDS;
		$count            = $request->get_param( 'count' ) ? $request->get_param( 'count' ) : 6;
		$access_token     = $request->get_param( 'access_token' );

		if ( ! $access_token ) {
			return $this->error( 'no_token_found', __( 'Provide Instagram Access Token.', 'ghostkit' ) );
		}

		$hash = md5(
			wp_json_encode(
				array(
					$access_token,
					$count,
					$cache_expiration,
				)
			)
		);

		$cache_name = $cache_name . '_' . $hash;

		// get cached data.
		$result = get_transient( $cache_name );

		// if there is no cache available, request instagram feed.
		if ( false === $result && $access_token ) {
			// Make Requests.
			$feed = wp_remote_get( 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' . $access_token . '&count=' . $count );

			if ( ! is_wp_error( $feed ) && isset( $feed['body'] ) ) {
				$feed = json_decode( $feed['body'], true );
			} else {
				$feed = false;
			}

			if ( $feed && is_array( $feed ) ) {
				$result = $feed;
				set_transient( $cache_name, $result, $cache_expiration );
			}
		}

		if ( $result ) {
			return $this->success( $result );
		} else {
			return $this->error( 'no_instagram_data_loaded', __( 'Instagram data failed to load.', 'ghostkit' ) );
		}
	}

	/**
	 * Get Instagram profile.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_instagram_profile( WP_REST_Request $request ) {
		$cache_name       = 'ghostkit_instagram_profile_cache';
		$cache_expiration = $request->get_param( 'cache_expiration' ) ? $request->get_param( 'cache_expiration' ) : DAY_IN_SECONDS;
		$access_token     = $request->get_param( 'access_token' );

		if ( ! $access_token ) {
			return $this->error( 'no_token_found', __( 'Provide Instagram Access Token.', 'ghostkit' ) );
		}

		$hash = md5(
			wp_json_encode(
				array(
					$access_token,
					$cache_expiration,
				)
			)
		);

		$cache_name = $cache_name . '_' . $hash;

		// get cached data.
		$result = get_transient( $cache_name );

		// if there is no cache available, request instagram feed.
		if ( false === $result && $access_token ) {
			// Make Requests.
			$profile = wp_remote_get( 'https://api.instagram.com/v1/users/self/?access_token=' . $access_token );

			if ( ! is_wp_error( $profile ) && isset( $profile['body'] ) ) {
				$profile = json_decode( $profile['body'], true );
			} else {
				$profile = false;
			}

			if ( $profile && is_array( $profile ) ) {
				$result = $profile;
				set_transient( $cache_name, $result, $cache_expiration );
			}
		}

		if ( $result ) {
			return $this->success( $result );
		} else {
			return $this->error( 'no_instagram_data_loaded', __( 'Instagram data failed to load.', 'ghostkit' ) );
		}
	}

	/**
	 * Get Twitter profile.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_twitter_profile( WP_REST_Request $request ) {
		$cache_name       = 'ghostkit_twitter_profile_cache';
		$cache_expiration = $request->get_param( 'cache_expiration' ) ? $request->get_param( 'cache_expiration' ) : DAY_IN_SECONDS;

		$consumer_key        = $request->get_param( 'consumer_key' );
		$consumer_secret     = $request->get_param( 'consumer_secret' );
		$access_token        = $request->get_param( 'access_token' );
		$access_token_secret = $request->get_param( 'access_token_secret' );
		$screen_name         = $request->get_param( 'screen_name' );

		if ( ! $consumer_key ) {
			return $this->error( 'no_consumer_key_found', __( 'Provide Twitter Consumer Key.', 'ghostkit' ) );
		}
		if ( ! $consumer_secret ) {
			return $this->error( 'no_consumer_secret_found', __( 'Provide Twitter Consumer Secret.', 'ghostkit' ) );
		}
		if ( ! $access_token ) {
			return $this->error( 'no_access_token_found', __( 'Provide Twitter Access Token.', 'ghostkit' ) );
		}
		if ( ! $access_token_secret ) {
			return $this->error( 'no_access_token_secret_found', __( 'Provide Twitter Access Token Secret.', 'ghostkit' ) );
		}
		if ( ! $screen_name ) {
			return $this->error( 'no_screen_name_found', __( 'Provide Username.', 'ghostkit' ) );
		}

		$api_data_ready = $consumer_key && $consumer_secret && $access_token && $access_token_secret;

		$hash = md5(
			wp_json_encode(
				array(
					$consumer_key,
					$consumer_secret,
					$access_token,
					$access_token_secret,
					$cache_expiration,
				)
			)
		);

		$cache_name = $cache_name . '_' . $screen_name . '_' . $hash;

		// get cached data.
		$result = get_transient( $cache_name );

		// if there is no cache available, request twitter feed.
		if ( false === $result && $api_data_ready ) {
			// request_api_twitter.
			$profile = $this->request_api_twitter(
				array(
					'url'                 => 'https://api.twitter.com/1.1/users/show.json',
					'consumer_key'        => $consumer_key,
					'consumer_secret'     => $consumer_secret,
					'access_token'        => $access_token,
					'access_token_secret' => $access_token_secret,
					'include_entities'    => 'true',
					'screen_name'         => $screen_name,
				)
			);

			if ( $profile && isset( $profile['screen_name'] ) ) {
				$result = $profile;

				// prepare different profile image sizes.
				if ( $result['profile_image_url'] ) {
					$result['profile_images'] = $this->get_twitter_profile_images( $result['profile_image_url'] );
				}
				if ( $result['profile_image_url_https'] ) {
					$result['profile_images_https'] = $this->get_twitter_profile_images( $result['profile_image_url_https'] );
				}

				// prepare short counts.
				$result['followers_count_short']  = $this->convert_number_short( $result['followers_count'] );
				$result['friends_count_short']    = $this->convert_number_short( $result['friends_count'] );
				$result['listed_count_short']     = $this->convert_number_short( $result['listed_count'] );
				$result['favourites_count_short'] = $this->convert_number_short( $result['favourites_count'] );
				$result['statuses_count_short']   = $this->convert_number_short( $result['statuses_count'] );

				// prepare url link.
				if ( $result['url'] && isset( $result['entities']['url'] ) ) {
					$result['url_entitled'] = $this->add_tweet_entity_links( $result['url'], $result['entities']['url'] );
				}

				// description with links.
				if ( isset( $result['entities']['description'] ) ) {
					$result['description_entitled'] = $this->add_tweet_entity_links( $result['description'], $result['entities']['description'] );
				}

				set_transient( $cache_name, $result, $cache_expiration );
			}
		}

		if ( $result ) {
			return $this->success( $result );
		} else {
			return $this->error( 'no_twitter_data_loaded', __( 'Twitter data failed to load.', 'ghostkit' ) );
		}
	}

	/**
	 * Get Twitter feed.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_twitter_feed( WP_REST_Request $request ) {
		$cache_name       = 'ghostkit_twitter_feed_cache';
		$cache_expiration = $request->get_param( 'cache_expiration' ) ? $request->get_param( 'cache_expiration' ) : DAY_IN_SECONDS;

		$count               = (int) ( $request->get_param( 'count' ) ? $request->get_param( 'count' ) : 6 );
		$consumer_key        = $request->get_param( 'consumer_key' );
		$consumer_secret     = $request->get_param( 'consumer_secret' );
		$access_token        = $request->get_param( 'access_token' );
		$access_token_secret = $request->get_param( 'access_token_secret' );
		$screen_name         = $request->get_param( 'screen_name' );
		$exclude_replies     = 'true' === $request->get_param( 'exclude_replies' );
		$include_rts         = 'true' === $request->get_param( 'include_rts' );
		$tweet_mode_extended = 'true' === $request->get_param( 'tweet_mode_extended' );

		$api_data_ready = $consumer_key && $consumer_secret && $access_token && $access_token_secret;

		if ( ! $consumer_key ) {
			return $this->error( 'no_consumer_key_found', __( 'Provide Twitter Consumer Key.', 'ghostkit' ) );
		}
		if ( ! $consumer_secret ) {
			return $this->error( 'no_consumer_secret_found', __( 'Provide Twitter Consumer Secret.', 'ghostkit' ) );
		}
		if ( ! $access_token ) {
			return $this->error( 'no_access_token_found', __( 'Provide Twitter Access Token.', 'ghostkit' ) );
		}
		if ( ! $access_token_secret ) {
			return $this->error( 'no_access_token_secret_found', __( 'Provide Twitter Access Token Secret.', 'ghostkit' ) );
		}
		if ( ! $screen_name ) {
			return $this->error( 'no_screen_name_found', __( 'Provide Username.', 'ghostkit' ) );
		}

		$hash = md5(
			wp_json_encode(
				array(
					$consumer_key,
					$consumer_secret,
					$access_token,
					$access_token_secret,
					$cache_expiration,
					$tweet_mode_extended,
				)
			)
		);

		$cache_name = $cache_name . '_' . $screen_name . '_' . $hash;

		// get cached data.
		$feed = get_transient( $cache_name );

		$result = array();

		if ( $api_data_ready ) {
			// if there is no cache available, request twitter feed.
			if ( false === $feed ) {
				$feed = $this->request_api_twitter(
					array(
						'url'                 => 'https://api.twitter.com/1.1/statuses/user_timeline.json',
						'consumer_key'        => $consumer_key,
						'consumer_secret'     => $consumer_secret,
						'access_token'        => $access_token,
						'access_token_secret' => $access_token_secret,
						'screen_name'         => $screen_name,
						'tweet_mode_extended' => $tweet_mode_extended,
						'exclude_replies'     => 'false',
						'include_rts'         => 'true',
						'count'               => 200,
					)
				);

				if ( $feed && ! ( isset( $feed['errors'] ) && count( $feed['errors'] ) > 0 ) ) {
					set_transient( $cache_name, $feed, $cache_expiration );
				} else {
					$feed = false;
				}
			}

			$tweets_count     = $feed ? count( $feed ) : 0;
			$limit_to_display = min( $count, $tweets_count );

			if ( $limit_to_display > 0 ) {
				for ( $i = 0; $i < $tweets_count; $i++ ) {
					$new_item = $feed[ $i ];

					// check for replies.
					if ( $exclude_replies && $new_item['in_reply_to_user_id'] ) {
						continue;
					}

					// check for retweets.
					if ( ! $include_rts && isset( $new_item['retweeted_status'] ) ) {
						continue;
					}

					// full text.
					if ( $tweet_mode_extended || ! isset( $new_item['text'] ) ) {
						$text = isset( $new_item['full_text'] ) ? $new_item['full_text'] : null;

						if ( null === $text ) {
							$text = isset( $new_item['text'] ) ? $new_item['text'] : '';
						}

						$new_item['text'] = $text;
					}

					// prepare tweet content.
					$new_item = $this->prepare_tweet_content( $new_item );

					if ( isset( $new_item['retweeted_status'] ) ) {
						// full text.
						if ( $tweet_mode_extended || ! isset( $new_item['retweeted_status']['text'] ) ) {
							$text = isset( $new_item['retweeted_status']['full_text'] ) ? $new_item['retweeted_status']['full_text'] : null;

							if ( null === $text ) {
								$text = isset( $new_item['retweeted_status']['text'] ) ? $new_item['retweeted_status']['text'] : '';
							}

							$new_item['retweeted_status']['text'] = $text;
						}

						$new_item['retweeted_status'] = $this->prepare_tweet_content( $new_item['retweeted_status'] );
					}

					$result[] = $new_item;

					if ( count( $result ) >= $limit_to_display ) {
						break;
					}
				}
			}
		}

		if ( $result ) {
			return $this->success( $result );
		} else {
			return $this->error( 'no_twitter_data_loaded', __( 'Twitter data failed to load.', 'ghostkit' ) );
		}
	}

	/**
	 * Get Twitter API url result
	 *
	 * @param array $data - api request data.
	 *
	 * @return bool|mixed
	 */
	public function request_api_twitter( $data ) {
		$data = array_merge(
			array(
				'url'                 => 'https://api.twitter.com/1.1/statuses/user_timeline.json',
				'consumer_key'        => '',
				'consumer_secret'     => '',
				'access_token'        => '',
				'access_token_secret' => '',
				'screen_name'         => '',
				'exclude_replies'     => '',
				'include_rts'         => '',
				'count'               => '',
				'include_entities'    => '',
				'tweet_mode_extended' => '',
			),
			$data
		);

		$oauth = array(
			'oauth_consumer_key'     => $data['consumer_key'],
			'oauth_nonce'            => time(),
			'oauth_signature_method' => 'HMAC-SHA1',
			'oauth_token'            => $data['access_token'],
			'oauth_timestamp'        => time(),
			'oauth_version'          => '1.0',
		);

		$base_info_url = $data['url'];

		if ( $data['screen_name'] ) {
			$data['url']         .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
			$data['url']         .= 'screen_name=' . $data['screen_name'];
			$oauth['screen_name'] = $data['screen_name'];
		}
		if ( $data['exclude_replies'] ) {
			$data['url']             .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
			$data['url']             .= 'exclude_replies=' . $data['exclude_replies'];
			$oauth['exclude_replies'] = $data['exclude_replies'];
		}
		if ( $data['include_rts'] ) {
			$data['url']         .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
			$data['url']         .= 'include_rts=' . $data['include_rts'];
			$oauth['include_rts'] = $data['include_rts'];
		}
		if ( $data['count'] ) {
			$data['url']   .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
			$data['url']   .= 'count=' . $data['count'];
			$oauth['count'] = $data['count'];
		}
		if ( $data['include_entities'] ) {
			$data['url']              .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
			$data['url']              .= 'include_entities=' . $data['include_entities'];
			$oauth['include_entities'] = $data['include_entities'];
		}

		// Tweet Mode.
		if ( $data['tweet_mode_extended'] ) {
			$data['url']        .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
			$data['url']        .= 'tweet_mode=extended';
			$oauth['tweet_mode'] = 'extended';
		}

		$base_info     = $this->build_base_string( $base_info_url, 'GET', $oauth );
		$composite_key = rawurlencode( $data['consumer_secret'] ) . '&' . rawurlencode( $data['access_token_secret'] );

        // phpcs:ignore
        $oauth_signature          = base64_encode( hash_hmac( 'sha1', $base_info, $composite_key, true ) );
		$oauth['oauth_signature'] = $oauth_signature;

		// Make Requests.
		$header      = array( $this->build_authorization_header( $oauth ), 'Expect:' );
		$options_buf = wp_remote_get(
			$data['url'],
			array(
				'headers'   => implode( "\n", $header ),
				'sslverify' => false,
			)
		);

		if ( ! is_wp_error( $options_buf ) && isset( $options_buf['body'] ) ) {
			return json_decode( $options_buf['body'], true );
		} else {
			return false;
		}
	}

	/**
	 * Build base string
	 *
	 * @param string $base_uri - url.
	 * @param string $method - method.
	 * @param array  $params - params.
	 *
	 * @return string
	 */
	private function build_base_string( $base_uri, $method, $params ) {
		$r = array();
		ksort( $params );
		foreach ( $params as $key => $value ) {
			$r[] = "$key=" . rawurlencode( $value );
		}
		return $method . '&' . rawurlencode( $base_uri ) . '&' . rawurlencode( implode( '&', $r ) );
	}

	/**
	 * Build authorization header
	 *
	 * @param array $oauth - auth data.
	 *
	 * @return string
	 */
	private function build_authorization_header( $oauth ) {
		$r      = 'Authorization: OAuth ';
		$values = array();

		foreach ( $oauth as $key => $value ) {
			$values[] = "$key=\"" . rawurlencode( $value ) . '"';
		}

		$r .= implode( ', ', $values );

		return $r;
	}

	/**
	 * Prepare tweet content.
	 *
	 * @param array $tweet - tweet data.
	 *
	 * @return array - new tweet data.
	 */
	public function prepare_tweet_content( $tweet ) {
		// prepare different profile image sizes.
		if ( $tweet['user']['profile_image_url'] ) {
			$tweet['user']['profile_images'] = $this->get_twitter_profile_images( $tweet['user']['profile_image_url'] );
		}
		if ( $tweet['user']['profile_image_url_https'] ) {
			$tweet['user']['profile_images_https'] = $this->get_twitter_profile_images( $tweet['user']['profile_image_url_https'] );
		}

		// prepare short counts.
		$tweet['retweet_count_short']  = $this->convert_number_short( $tweet['retweet_count'] );
		$tweet['favorite_count_short'] = $this->convert_number_short( $tweet['favorite_count'] );

		// user friendly date.
		$date      = strtotime( $tweet['created_at'] );
		$now       = time();
		$diff_date = $now - $date;

		if ( $diff_date / 60 < 1 ) {
			// seconds.
			// translators: %d - seconds.
			$date = sprintf( esc_html__( '%ds', 'ghostkit' ), intval( $diff_date % 60 ) );
		} elseif ( $diff_date / 60 < 60 ) {
			// minutes.
			// translators: %d - minutes.
			$date = sprintf( esc_html__( '%dm', 'ghostkit' ), intval( $diff_date / 60 ) );
		} elseif ( $diff_date / 3600 < 24 ) {
			// hours.
			// translators: %d - hours.
			$date = sprintf( esc_html__( '%dh', 'ghostkit' ), intval( $diff_date / 3600 ) );
		} elseif ( gmdate( 'Y' ) === gmdate( 'Y', $date ) ) {
			// current year.
			$date = gmdate( esc_html__( 'M j', 'ghostkit' ), $date );
		} else {
			// past years.
			$date = gmdate( esc_html__( 'Y M j', 'ghostkit' ), $date );
		}

		$tweet['date_formatted'] = $date;

		// text with links and media.
		$tweet['text_entitled'] = $this->add_tweet_entity_links( $tweet['text'], $tweet['entities'] );

		// text with links only.
		$tweet['text_entitled_no_media'] = $this->add_tweet_entity_links( $tweet['text'], $tweet['entities'], false );

		return $tweet;
	}

	/**
	 * Adds a link around any entities in a twitter feed
	 * twitter entities include urls, user mentions, hashtags and media
	 * http://stackoverflow.com/a/15390225
	 *
	 * @param string  $text - tweet text.
	 * @param array   $entities - available entities.
	 * @param boolean $show_media - show tweet images.
	 *
	 * @return string tweet
	 */
	public function add_tweet_entity_links( $text, $entities, $show_media = true ) {
		$replacements = array();
		if ( isset( $entities['hashtags'] ) ) {
			foreach ( $entities['hashtags'] as $hashtag ) {
				list ($start, $end)     = $hashtag['indices'];
				$replacements[ $start ] = array(
					$start,
					$end,
					"<a href=\"https://twitter.com/hashtag/{$hashtag['text']}\" target=\"_blank\">#{$hashtag['text']}</a>",
				);
			}
		}
		if ( isset( $entities['urls'] ) ) {
			foreach ( $entities['urls'] as $url ) {
				list ($start, $end) = $url['indices'];
				// you can also use $url['expanded_url'] in place of $url['url'].
				$replacements[ $start ] = array(
					$start,
					$end,
					"<a href=\"{$url['url']}\" target=\"_blank\">{$url['display_url']}</a>",
				);
			}
		}
		if ( isset( $entities['user_mentions'] ) ) {
			foreach ( $entities['user_mentions'] as $mention ) {
				list ($start, $end)     = $mention['indices'];
				$replacements[ $start ] = array(
					$start,
					$end,
					"<a href=\"https://twitter.com/{$mention['screen_name']}\" target=\"_blank\">@{$mention['screen_name']}</a>",
				);
			}
		}
		if ( isset( $entities['media'] ) ) {
			foreach ( $entities['media'] as $media ) {
				list ($start, $end) = $media['indices'];

				if ( $show_media ) {
					$replacements[ $start ] = array(
						$start,
						$end,
						"<div><a href=\"{$media['url']}\" target=\"_blank\"><img src=\"{$media['media_url_https']}\" /></a></div>",
					);
				} else {
					$replacements[ $start ] = array(
						$start,
						$end,
						"<a href=\"{$media['url']}\" target=\"_blank\">{$media['url']}</a>",
					);
				}
			}
		}

		// sort in reverse order by start location.
		krsort( $replacements );

		foreach ( $replacements as $replace_data ) {
			list ($start, $end, $replace_text) = $replace_data;

			$text = mb_substr( $text, 0, $start, 'UTF-8' ) . $replace_text . mb_substr( $text, $end, null, 'UTF-8' );
		}

		return $text;
	}

	/**
	 * Convert long numbers to short. eg: 1500 -> 1.5K
	 * Thanks https://code.recuweb.com/2018/php-format-numbers-to-nearest-thousands/ .
	 *
	 * @param number $num - number.
	 * @return string
	 */
	public function convert_number_short( $num ) {
		if ( $num > 1000 ) {
			$x               = round( $num );
			$x_number_format = number_format( $x );
			$x_array         = explode( ',', $x_number_format );
			$x_parts         = array( 'K', 'M', 'B', 'T' );
			$x_count_parts   = count( $x_array ) - 1;
			$x_display       = $x;
			$x_display       = $x_array[0] . ( (int) 0 !== $x_array[1][0] ? '.' . $x_array[1][0] : '' );
			$x_display      .= $x_parts[ $x_count_parts - 1 ];

			return $x_display;
		}

		return $num;
	}

	/**
	 * Prepare profile image urls
	 * https://developer.twitter.com/en/docs/accounts-and-users/user-profile-images-and-banners
	 *
	 * @param string $url - profile image.
	 *
	 * @return array images
	 */
	public function get_twitter_profile_images( $url ) {
		if ( strpos( $url, '.jpg' ) !== false ) {
			return array(
				'normal'   => $url,
				'bigger'   => str_replace( '_normal.jpg', '_bigger.jpg', $url ),
				'mini'     => str_replace( '_normal.jpg', '_mini.jpg', $url ),
				'original' => str_replace( '_normal.jpg', '.jpg', $url ),
			);
		}

		return array(
			'normal'   => $url,
			'bigger'   => str_replace( '_normal.png', '_bigger.png', $url ),
			'mini'     => str_replace( '_normal.png', '_mini.png', $url ),
			'original' => str_replace( '_normal.png', '.png', $url ),
		);
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
		$list_style      = $request->get_param( 'listStyle' ) ? $request->get_param( 'listStyle' ) : 'ol';

		$html = '';

		if ( ! $allowed_headers || empty( $allowed_headers ) ) {
			return $this->success( $html );
		}

		// covert string values to int.
		$allowed_headers = array_map( 'intval', $allowed_headers );

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
		for ( $i = 0; $i < $count; $i ++ ) {
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
			return new WP_Error( $code, $response, array( 'status' => 401 ) );
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
