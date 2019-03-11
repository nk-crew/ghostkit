<?php
/**
 * Rest API functions
 *
 * @package @@plugin_name
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
    protected $version   = '1';

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
            $namespace, '/get_customizer/', array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_customizer' ),
                'permission_callback' => array( $this, 'get_customizer_permission' ),
            )
        );

        // Get attachment image <img> tag.
        register_rest_route(
            $namespace, '/get_attachment_image/(?P<id>[\d]+)', array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_attachment_image' ),
                'permission_callback' => array( $this, 'get_attachment_image_permission' ),
            )
        );

        // Get Instagram profile.
        register_rest_route(
            $namespace, '/get_instagram_profile/', array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_instagram_profile' ),
                'permission_callback' => array( $this, 'get_instagram_profile_permission' ),
            )
        );

        // Get Instagram feed.
        register_rest_route(
            $namespace, '/get_instagram_feed/', array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_instagram_feed' ),
                'permission_callback' => array( $this, 'get_instagram_feed_permission' ),
            )
        );

        // Get Twitter profile.
        register_rest_route(
            $namespace, '/get_twitter_profile/', array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_twitter_profile' ),
                'permission_callback' => array( $this, 'get_twitter_profile_permission' ),
            )
        );

        // Get Twitter feed.
        register_rest_route(
            $namespace, '/get_twitter_feed/', array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_twitter_feed' ),
                'permission_callback' => array( $this, 'get_twitter_feed_permission' ),
            )
        );

        // Get Templates.
        register_rest_route(
            $namespace, '/get_templates/', array(
                'methods'  => WP_REST_Server::READABLE,
                'callback' => array( $this, 'get_templates' ),
            )
        );

        // Get template data.
        register_rest_route(
            $namespace, '/get_template_data/', array(
                'methods'  => WP_REST_Server::READABLE,
                'callback' => array( $this, 'get_template_data' ),
            )
        );

        // Get Custom Code.
        register_rest_route(
            $namespace, '/get_custom_code/', array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_custom_code' ),
                'permission_callback' => array( $this, 'get_custom_code_permission' ),
            )
        );

        // Update Custom Code.
        register_rest_route(
            $namespace, '/update_custom_code/', array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_custom_code' ),
                'permission_callback' => array( $this, 'update_custom_code_permission' ),
            )
        );

        // Update Google Maps API key.
        register_rest_route(
            $namespace, '/update_google_maps_api_key/', array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_google_maps_api_key' ),
                'permission_callback' => array( $this, 'update_google_maps_api_key_permission' ),
            )
        );

        // Update Disabled Blocks.
        register_rest_route(
            $namespace, '/update_disabled_blocks/', array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_disabled_blocks' ),
                'permission_callback' => array( $this, 'update_disabled_blocks_permission' ),
            )
        );

        // Update Settings.
        register_rest_route(
            $namespace, '/update_settings/', array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_settings' ),
                'permission_callback' => array( $this, 'update_settings_permission' ),
            )
        );
    }

    /**
     * Get read customizer permissions.
     *
     * @return bool
     */
    public function get_customizer_permission() {
        if ( ! current_user_can( 'edit_theme_options' ) ) {
            return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change Customizer options.', '@@text_domain' ) );
        }
        return true;
    }

    /**
     * Get attachment image <img> tag permissions.
     *
     * @param WP_REST_Request $request  request object.
     *
     * @return bool
     */
    public function get_attachment_image_permission( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );

        if ( ! $id ) {
            return $this->error( 'no_id_found', __( 'Provide image ID.', '@@text_domain' ) );
        }
        return true;
    }

    /**
     * Get Instagram feed permissions.
     *
     * @param WP_REST_Request $request  request object.
     *
     * @return bool
     */
    public function get_instagram_feed_permission( WP_REST_Request $request ) {
        $access_token = $request->get_param( 'access_token' );

        if ( ! $access_token ) {
            return $this->error( 'no_token_found', __( 'Provide Instagram Access Token.', '@@text_domain' ) );
        }
        return true;
    }

    /**
     * Get Instagram profile permissions.
     *
     * @param WP_REST_Request $request  request object.
     *
     * @return bool
     */
    public function get_instagram_profile_permission( WP_REST_Request $request ) {
        $access_token = $request->get_param( 'access_token' );

        if ( ! $access_token ) {
            return $this->error( 'no_token_found', __( 'Provide Instagram Access Token.', '@@text_domain' ) );
        }
        return true;
    }

    /**
     * Get Twitter feed permissions.
     *
     * @param WP_REST_Request $request  request object.
     *
     * @return bool
     */
    public function get_twitter_feed_permission( WP_REST_Request $request ) {
        $consumer_key = $request->get_param( 'consumer_key' );
        $consumer_secret = $request->get_param( 'consumer_secret' );
        $access_token = $request->get_param( 'access_token' );
        $access_token_secret = $request->get_param( 'access_token_secret' );
        $screen_name = $request->get_param( 'screen_name' );

        if ( ! $consumer_key ) {
            return $this->error( 'no_consumer_key_found', __( 'Provide Twitter Consumer Key.', '@@text_domain' ) );
        }
        if ( ! $consumer_secret ) {
            return $this->error( 'no_consumer_secret_found', __( 'Provide Twitter Consumer Secret.', '@@text_domain' ) );
        }
        if ( ! $access_token ) {
            return $this->error( 'no_access_token_found', __( 'Provide Twitter Access Token.', '@@text_domain' ) );
        }
        if ( ! $access_token_secret ) {
            return $this->error( 'no_access_token_secret_found', __( 'Provide Twitter Access Token Secret.', '@@text_domain' ) );
        }
        if ( ! $screen_name ) {
            return $this->error( 'no_screen_name_found', __( 'Provide Username.', '@@text_domain' ) );
        }

        return true;
    }

    /**
     * Get Twitter profile permissions.
     *
     * @param WP_REST_Request $request  request object.
     *
     * @return bool
     */
    public function get_twitter_profile_permission( WP_REST_Request $request ) {
        $consumer_key = $request->get_param( 'consumer_key' );
        $consumer_secret = $request->get_param( 'consumer_secret' );
        $access_token = $request->get_param( 'access_token' );
        $access_token_secret = $request->get_param( 'access_token_secret' );
        $screen_name = $request->get_param( 'screen_name' );

        if ( ! $consumer_key ) {
            return $this->error( 'no_consumer_key_found', __( 'Provide Twitter Consumer Key.', '@@text_domain' ) );
        }
        if ( ! $consumer_secret ) {
            return $this->error( 'no_consumer_secret_found', __( 'Provide Twitter Consumer Secret.', '@@text_domain' ) );
        }
        if ( ! $access_token ) {
            return $this->error( 'no_access_token_found', __( 'Provide Twitter Access Token.', '@@text_domain' ) );
        }
        if ( ! $access_token_secret ) {
            return $this->error( 'no_access_token_secret_found', __( 'Provide Twitter Access Token Secret.', '@@text_domain' ) );
        }
        if ( ! $screen_name ) {
            return $this->error( 'no_screen_name_found', __( 'Provide Username.', '@@text_domain' ) );
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
            return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', '@@text_domain' ) );
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
            return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', '@@text_domain' ) );
        }
        return true;
    }

    /**
     * Get read google maps api key permissions.
     *
     * @return bool
     */
    public function update_google_maps_api_key_permission() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', '@@text_domain' ) );
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
            return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', '@@text_domain' ) );
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
            return $this->error( 'user_dont_have_permission', __( 'User don\'t have permissions to change options.', '@@text_domain' ) );
        }
        return true;
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
            return $this->error( 'no_options_found', __( 'Options not found.', '@@text_domain' ) );
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
        $id = $request->get_param( 'id' );
        $size = $request->get_param( 'size' );
        $icon = $request->get_param( 'icon' );
        $attr = $request->get_param( 'attr' );
        $div_tag = $request->get_param( 'div_tag' );

        if ( $div_tag ) {
            $image_url = wp_get_attachment_image_url( $id, $size, $icon );
            $attr = isset( $attr ) && $attr && is_array( $attr ) ? $attr : array();

            if ( ! isset( $attr['style'] ) ) {
                $attr['style'] = '';
            }

            $attr['style'] .= 'background-image: url("' . esc_url( $image_url ) . '");';

            $attr = array_map( 'esc_attr', $attr );
            $image = '<div';
            foreach ( $attr as $name => $value ) {
                $image .= " $name=" . '"' . $value . '"';
            }
            $image .= '></div>';
        } else {
            $image = wp_get_attachment_image( $id, $size, $icon, $attr );
        }

        if ( $image ) {
            return $this->success( $image );
        } else {
            return $this->error( 'no_image_found', __( 'Image not found.', '@@text_domain' ) );
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
        $cache_name = 'ghostkit_instagram_feed_cache';
        $cache_expiration = $request->get_param( 'cache_expiration' ) ? : 60 * 60 * 24; // 1 day in seconds.
        $count = $request->get_param( 'count' ) ? : 6;
        $access_token = $request->get_param( 'access_token' );

        $hash = md5(
            json_encode(
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
            return $this->error( 'no_instagram_data_loaded', __( 'Instagram data failed to load.', '@@text_domain' ) );
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
        $cache_name = 'ghostkit_instagram_profile_cache';
        $cache_expiration = $request->get_param( 'cache_expiration' ) ? : 60 * 60 * 24; // 1 day in seconds.
        $access_token = $request->get_param( 'access_token' );

        $hash = md5(
            json_encode(
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
            return $this->error( 'no_instagram_data_loaded', __( 'Instagram data failed to load.', '@@text_domain' ) );
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
        $cache_name = 'ghostkit_twitter_profile_cache';
        $cache_expiration = $request->get_param( 'cache_expiration' ) ? : 60 * 60 * 24; // 1 day in seconds.

        $consumer_key = $request->get_param( 'consumer_key' );
        $consumer_secret = $request->get_param( 'consumer_secret' );
        $access_token = $request->get_param( 'access_token' );
        $access_token_secret = $request->get_param( 'access_token_secret' );
        $screen_name = $request->get_param( 'screen_name' );

        $api_data_ready = $consumer_key && $consumer_secret && $access_token && $access_token_secret;

        $hash = md5(
            json_encode(
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
            $profile = $this->request_api_twitter( array(
                'url' => 'https://api.twitter.com/1.1/users/show.json',
                'consumer_key' => $consumer_key,
                'consumer_secret' => $consumer_secret,
                'access_token' => $access_token,
                'access_token_secret' => $access_token_secret,
                'include_entities' => 'true',
                'screen_name' => $screen_name,
            ) );

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
                $result['followers_count_short'] = $this->convert_number_short( $result['followers_count'] );
                $result['friends_count_short'] = $this->convert_number_short( $result['friends_count'] );
                $result['listed_count_short'] = $this->convert_number_short( $result['listed_count'] );
                $result['favourites_count_short'] = $this->convert_number_short( $result['favourites_count'] );
                $result['statuses_count_short'] = $this->convert_number_short( $result['statuses_count'] );

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
            return $this->error( 'no_twitter_data_loaded', __( 'Twitter data failed to load.', '@@text_domain' ) );
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
        $cache_name = 'ghostkit_twitter_feed_cache';
        $cache_expiration = $request->get_param( 'cache_expiration' ) ? : 60 * 60 * 24; // 1 day in seconds.

        $count = (int) $request->get_param( 'count' ) ? : 6;
        $consumer_key = $request->get_param( 'consumer_key' );
        $consumer_secret = $request->get_param( 'consumer_secret' );
        $access_token = $request->get_param( 'access_token' );
        $access_token_secret = $request->get_param( 'access_token_secret' );
        $screen_name = $request->get_param( 'screen_name' );
        $exclude_replies = 'true' === $request->get_param( 'exclude_replies' );
        $include_rts = 'true' === $request->get_param( 'include_rts' );

        $api_data_ready = $consumer_key && $consumer_secret && $access_token && $access_token_secret;

        $hash = md5(
            json_encode(
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
        $feed = get_transient( $cache_name );

        $result = array();

        if ( $api_data_ready ) {
            // if there is no cache available, request twitter feed.
            if ( false === $feed ) {
                $feed = $this->request_api_twitter( array(
                    'url' => 'https://api.twitter.com/1.1/statuses/user_timeline.json',
                    'consumer_key' => $consumer_key,
                    'consumer_secret' => $consumer_secret,
                    'access_token' => $access_token,
                    'access_token_secret' => $access_token_secret,
                    'screen_name' => $screen_name,
                    'exclude_replies' => 'false',
                    'include_rts' => 'true',
                    'count' => 200,
                ) );

                if ( $feed && ! ( isset( $feed['errors'] ) && count( $feed['errors'] ) > 0 ) ) {
                    set_transient( $cache_name, $feed, $cache_expiration );
                } else {
                    $feed = false;
                }
            }

            $tweets_count = $feed ? count( $feed ) : 0;
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

                    // prepare tweet content.
                    $new_item = $this->prepare_tweet_content( $new_item );

                    if ( isset( $new_item['retweeted_status'] ) ) {
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
            return $this->error( 'no_twitter_data_loaded', __( 'Twitter data failed to load.', '@@text_domain' ) );
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
        $data = array_merge( array(
            'url' => 'https://api.twitter.com/1.1/statuses/user_timeline.json',
            'consumer_key' => '',
            'consumer_secret' => '',
            'access_token' => '',
            'access_token_secret' => '',
            'screen_name' => '',
            'exclude_replies' => '',
            'include_rts' => '',
            'count' => '',
            'include_entities' => '',
        ), $data );

        $oauth = array(
            'oauth_consumer_key' => $data['consumer_key'],
            'oauth_nonce' => time(),
            'oauth_signature_method' => 'HMAC-SHA1',
            'oauth_token' => $data['access_token'],
            'oauth_timestamp' => time(),
            'oauth_version' => '1.0',
        );

        $base_info_url = $data['url'];

        if ( $data['screen_name'] ) {
            $data['url'] .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
            $data['url'] .= 'screen_name=' . $data['screen_name'];
            $oauth['screen_name'] = $data['screen_name'];
        }
        if ( $data['exclude_replies'] ) {
            $data['url'] .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
            $data['url'] .= 'exclude_replies=' . $data['exclude_replies'];
            $oauth['exclude_replies'] = $data['exclude_replies'];
        }
        if ( $data['include_rts'] ) {
            $data['url'] .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
            $data['url'] .= 'include_rts=' . $data['include_rts'];
            $oauth['include_rts'] = $data['include_rts'];
        }
        if ( $data['count'] ) {
            $data['url'] .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
            $data['url'] .= 'count=' . $data['count'];
            $oauth['count'] = $data['count'];
        }
        if ( $data['include_entities'] ) {
            $data['url'] .= strpos( $data['url'], '?' ) !== false ? '&' : '?';
            $data['url'] .= 'include_entities=' . $data['include_entities'];
            $oauth['include_entities'] = $data['include_entities'];
        }

        $base_info = $this->build_base_string( $base_info_url, 'GET', $oauth );
        $composite_key = rawurlencode( $data['consumer_secret'] ) . '&' . rawurlencode( $data['access_token_secret'] );
        $oauth_signature = base64_encode( hash_hmac( 'sha1', $base_info, $composite_key, true ) );
        $oauth['oauth_signature'] = $oauth_signature;

        // Make Requests.
        $header = array( $this->build_authorization_header( $oauth ), 'Expect:' );
        $options_buf = wp_remote_get(
            $data['url'], array(
                'headers' => implode( "\n", $header ),
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
        $r = 'Authorization: OAuth ';
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
        $tweet['retweet_count_short'] = $this->convert_number_short( $tweet['retweet_count'] );
        $tweet['favorite_count_short'] = $this->convert_number_short( $tweet['favorite_count'] );

        // user friendly date.
        $date = strtotime( $tweet['created_at'] );
        $now = time();
        $diff_date = $now - $date;

        if ( $diff_date / 60 < 1 ) {
            // seconds.
            // translators: %d - seconds.
            $date = sprintf( esc_html__( '%ds', '@@text_domain' ), intval( $diff_date % 60 ) );
        } elseif ( $diff_date / 60 < 60 ) {
            // minutes.
            // translators: %d - minutes.
            $date = sprintf( esc_html__( '%dm', '@@text_domain' ), intval( $diff_date / 60 ) );
        } elseif ( $diff_date / 3600 < 24 ) {
            // hours.
            // translators: %d - hours.
            $date = sprintf( esc_html__( '%dh', '@@text_domain' ), intval( $diff_date / 3600 ) );
        } elseif ( date( 'Y' ) === date( 'Y', $date ) ) {
            // current year.
            $date = date( esc_html__( 'M j', '@@text_domain' ), $date );
        } else {
            // past years.
            $date = date( esc_html__( 'Y M j', '@@text_domain' ), $date );
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
                list ($start, $end) = $hashtag['indices'];
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
                list ($start, $end) = $mention['indices'];
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
            $x = round( $num );
            $x_number_format = number_format( $x );
            $x_array = explode( ',', $x_number_format );
            $x_parts = array( 'K', 'M', 'B', 'T' );
            $x_count_parts = count( $x_array ) - 1;
            $x_display = $x;
            $x_display = $x_array[0] . ( (int) 0 !== $x_array[1][0] ? '.' . $x_array[1][0] : '' );
            $x_display .= $x_parts[ $x_count_parts - 1 ];

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
                'normal' => $url,
                'bigger' => str_replace( '_normal.jpg', '_bigger.jpg', $url ),
                'mini' => str_replace( '_normal.jpg', '_mini.jpg', $url ),
                'original' => str_replace( '_normal.jpg', '.jpg', $url ),
            );
        }

        return array(
            'normal' => $url,
            'bigger' => str_replace( '_normal.png', '_bigger.png', $url ),
            'mini' => str_replace( '_normal.png', '_mini.png', $url ),
            'original' => str_replace( '_normal.png', '.png', $url ),
        );
    }

    /**
     * Get templates.
     *
     * @return mixed
     */
    public function get_templates() {
        $url = 'https://library.ghostkit.io/wp-json/ghostkit-library/v1/get_library/';
        $templates = get_transient( 'ghostkit_templates', false );

        if ( ! $templates ) {
            $requested_templates = wp_remote_get( add_query_arg( array(
                'ghostkit_version'     => '@@plugin_version',
                'ghostkit_pro'         => function_exists( 'ghostkit_pro' ),
                'ghostkit_pro_version' => function_exists( 'ghostkit_pro' ) ? ghostkit_pro()->$plugin_version : null,
            ), $url ) );

            if ( ! is_wp_error( $requested_templates ) ) {
                $new_templates = wp_remote_retrieve_body( $requested_templates );
                $new_templates = json_decode( $new_templates, true );

                if ( $new_templates && isset( $new_templates['response'] ) && is_array( $new_templates['response'] ) ) {
                    $templates = $new_templates['response'];
                    set_transient( 'ghostkit_templates', $templates, WEEK_IN_SECONDS );
                }
            }
        }

        if ( is_array( $templates ) ) {
            return $this->success( $templates );
        } else {
            return $this->error( 'no_templates', __( 'Templates not found.', '@@text_domain' ) );
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
        $url = 'https://library.ghostkit.io/wp-json/ghostkit-library/v1/get_library_item/';
        $id = $request->get_param( 'id' );
        $template_data = get_transient( 'ghostkit_template_' . $id, false );

        if ( ! $template_data ) {
            $requested_template_data = wp_remote_get( add_query_arg( array(
                'id'                   => $id,
                'ghostkit_version'     => '@@plugin_version',
                'ghostkit_pro'         => function_exists( 'ghostkit_pro' ),
                'ghostkit_pro_version' => function_exists( 'ghostkit_pro' ) ? ghostkit_pro()->$plugin_version : null,
            ), $url ) );

            if ( ! is_wp_error( $requested_template_data ) ) {
                $new_template_data = wp_remote_retrieve_body( $requested_template_data );
                $new_template_data = json_decode( $new_template_data, true );

                if ( $new_template_data && isset( $new_template_data['response'] ) && is_array( $new_template_data['response'] ) ) {
                    $template_data = $new_template_data['response'];
                    set_transient( 'ghostkit_template_' . $id, $template_data, WEEK_IN_SECONDS );
                }
            }
        }

        if ( is_array( $template_data ) ) {
            return $this->success( $template_data );
        } else {
            return $this->error( 'no_template_data', __( 'Template data not found.', '@@text_domain' ) );
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
            return $this->error( 'no_custom_code', __( 'Custom code not found.', '@@text_domain' ) );
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
        $updated = '';

        if ( is_array( $new_code ) ) {
            $current_code = get_option( 'ghostkit_custom_code', array() );
            $updated = update_option( 'ghostkit_custom_code', array_merge( $current_code, $new_code ) );
        }

        if ( ! empty( $updated ) ) {
            return $this->success( true );
        } else {
            return $this->error( 'no_code_updated', __( 'Failed to update custom code.', '@@text_domain' ) );
        }
    }

    /**
     * Update Google Maps API key.
     *
     * @param WP_REST_Request $request  request object.
     *
     * @return mixed
     */
    public function update_google_maps_api_key( WP_REST_Request $request ) {
        $updated = update_option( 'ghostkit_google_maps_api_key', $request->get_param( 'key' ) );

        if ( ! empty( $updated ) ) {
            return $this->success( $updated );
        } else {
            return $this->error( 'no_options_found', __( 'Failed to update option.', '@@text_domain' ) );
        }
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
        $updated = '';

        if ( is_array( $new_disabled_blocks ) ) {
            $disabled_blocks = array_merge( get_option( 'ghostkit_disabled_blocks', array() ), $new_disabled_blocks );
            $result = array();

            foreach ( $disabled_blocks as $k => $block_disabled ) {
                if ( $block_disabled ) {
                    $result[ $k ] = true;
                }
            }

            $updated = update_option( 'ghostkit_disabled_blocks', $result );
        }

        if ( ! empty( $updated ) ) {
            return $this->success( true );
        } else {
            return $this->error( 'no_disabled_blocks_updated', __( 'Failed to update disabled blocks.', '@@text_domain' ) );
        }
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
        $updated = '';

        if ( is_array( $new_settings ) ) {
            $current_settings = get_option( 'ghostkit_settings', array() );
            $updated = update_option( 'ghostkit_settings', array_merge( $current_settings, $new_settings ) );
        }

        if ( ! empty( $updated ) ) {
            return $this->success( true );
        } else {
            return $this->error( 'no_settings_updated', __( 'Failed to update settings.', '@@text_domain' ) );
        }
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
                'success' => true,
                'response' => $response,
            ), 200
        );
    }

    /**
     * Error rest.
     *
     * @param mixed $code     error code.
     * @param mixed $response response data.
     * @return mixed
     */
    public function error( $code, $response ) {
        return new WP_REST_Response(
            array(
                'error' => true,
                'success' => false,
                'error_code' => $code,
                'response' => $response,
            ), 401
        );
    }
}
new GhostKit_Rest();
