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

        // Update Google Maps API key.
        register_rest_route(
            $namespace, '/update_google_maps_api_key/', array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'update_google_maps_api_key' ),
                'permission_callback' => array( $this, 'update_google_maps_api_key_permission' ),
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
     * Get read google maps api key permissions.
     *
     * @return bool
     */
    public function update_google_maps_api_key_permission() {
        if ( ! current_user_can( 'edit_theme_options' ) ) {
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

        $image = wp_get_attachment_image( $id, $size, $icon, $attr );

        if ( $image ) {
            return $this->success( $image );
        } else {
            return $this->error( 'no_image_found', __( 'Image not found.', '@@text_domain' ) );
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
        return new WP_Error( $code, $response, array(
            'error'      => true,
            'success'    => false,
        ) );
    }
}
new GhostKit_Rest();
