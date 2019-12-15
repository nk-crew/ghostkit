<?php
/**
 * Templates
 *
 * @package @@plugin_name
 */

/**
 * GhostKit_Templates
 */
class GhostKit_Templates {
    /**
     * GhostKit_Templates constructor.
     */
    public function __construct() {
        // Register custom post type.
        add_action( 'init', array( $this, 'add_custom_post_type' ) );
    }

    /**
     * Register custom post type.
     */
    public function add_custom_post_type() {
        register_post_type(
            'ghostkit_template',
            array(
                'labels'              => array(
                    'name'                => _x( 'Templates', 'Post Type General Name', '@@text_domain' ),
                    'singular_name'       => _x( 'Template', 'Post Type Singular Name', '@@text_domain' ),
                    'menu_name'           => __( 'Templates', '@@text_domain' ),
                    'parent_item_colon'   => __( 'Parent Template', '@@text_domain' ),
                    'all_items'           => __( 'Templates', '@@text_domain' ),
                    'view_item'           => __( 'View Template', '@@text_domain' ),
                    'add_new_item'        => __( 'Add New Template', '@@text_domain' ),
                    'add_new'             => __( 'Add New', '@@text_domain' ),
                    'edit_item'           => __( 'Edit Template', '@@text_domain' ),
                    'update_item'         => __( 'Update Template', '@@text_domain' ),
                    'search_items'        => __( 'Search Template', '@@text_domain' ),
                    'not_found'           => __( 'Not Found', '@@text_domain' ),
                    'not_found_in_trash'  => __( 'Not found in Trash', '@@text_domain' ),
                ),
                'public'              => false, // true?
                'publicly_queryable'  => false, // true?
                'has_archive'         => false,
                'show_ui'             => true,
                'exclude_from_search' => true,
                'show_in_nav_menus'   => false,
                'rewrite'             => false,
                'menu_icon'           => 'dashicons-admin-ghostkit-templates',
                'menu_position'       => 57,
                'hierarchical'        => false,
                'show_in_menu'        => true,
                'show_in_admin_bar'   => true,
                'show_in_rest'        => true,
                'taxonomies'          => array(
                    'ghostkit_template_category',
                ),
                'capability_type'     => 'post',
                'supports'            => array(
                    'title',
                    'editor',
                    'thumbnail',
                ),
            )
        );

        register_taxonomy(
            'ghostkit_template_category',
            'ghostkit_template',
            array(
                'label'              => esc_html__( 'Categories', '@@text_domain' ),
                'labels'             => array(
                    'menu_name' => esc_html__( 'Categories', '@@text_domain' ),
                ),
                'rewrite'            => false,
                'hierarchical'       => false,
                'publicly_queryable' => false,
                'show_in_nav_menus'  => false,
                'show_in_rest'       => true,
                'show_admin_column'  => true,
            )
        );
    }
}

new GhostKit_Templates();
