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
    }

    /**
     * Get read portfolios permissions.
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
