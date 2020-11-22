<?php
/**
 * Breakpoints
 *
 * @package @@plugin_name
 */

/**
 * GhostKit_Breakpoints class
 */
class GhostKit_Breakpoints {
    /**
     * Extra Small Default Breakpoint.
     *
     * @var int
     */
    private static $default_xs = 576;

    /**
     * Mobile Default Breakpoint.
     *
     * @var int
     */
    private static $default_sm = 768;

    /**
     * Tablet Breakpoint.
     *
     * @var int
     */
    private static $default_md = 992;

    /**
     * Desktop Breakpoint.
     *
     * @var int
     */
    private static $default_lg = 1200;

    /**
     * Scss Configurations.
     *
     * @var array
     */
    private static $scss_configs = array(
        'gutenberg/style.scss',
        'gutenberg/editor.scss',
        'gutenberg/blocks/*/styles/style.scss',
    );

    /**
     * Compile Scss Configurations.
     *
     * @var array
     */
    private $compile_scss_configs;

    /**
     * GhostKit_Breakpoints constructor.
     */
    public function __construct() {
        $this->compile_scss_configs = self::get_compile_scss_configs();
        add_filter( 'style_loader_src', array( $this, 'change_style_src_to_compile' ), 10, 1 );
        add_action( 'gkt_before_assets_register', array( $this, 'maybe_compile_scss_files' ) );
    }

    /**
     * Get compile scss configurations.
     *
     * @return array
     */
    private static function get_compile_scss_configs() {
        $upload_dir           = wp_upload_dir();
        $compile_scss_configs = array();
        $plugin_path          = ghostkit()->plugin_path;

        foreach ( self::$scss_configs as $scss_config ) {
            foreach ( glob( $plugin_path . $scss_config ) as $template ) {
                $output_file = str_replace( ghostkit()->plugin_path, $upload_dir['basedir'] . '/@@plugin_name/', $template );
                $output_file = str_replace( '.scss', '.min.css', $output_file );

                $compile_scss_configs[] = array(
                    'input_file'  => $template,
                    'output_file' => $output_file,
                );
            }
        }

        return $compile_scss_configs;
    }

    /**
     * Change style src to compile css files.
     *
     * @param string $src - Url to style.
     * @return string
     */
    public function change_style_src_to_compile( $src ) {
        $breakpoints              = self::get_breakpoints();
        $breakpoints_hash         = self::get_breakpoints_hash( $breakpoints );
        $default_breakpoints_hash = self::get_default_breakpoints_hash();

        if ( $breakpoints_hash !== $default_breakpoints_hash ) {
            $is_plugin_file = strstr( $src, ghostkit()->plugin_url );

            if ( $is_plugin_file ) {
                $configs       = $this->compile_scss_configs;
                $relative_uri  = str_replace( ghostkit()->plugin_url, '', $is_plugin_file );
                $relative_path = str_replace( '?ver=@@plugin_version', '', $relative_uri );
                $upload_dir    = wp_upload_dir();
                $output_file   = $upload_dir['basedir'] . '/@@plugin_name/' . $relative_path;

                foreach ( $configs as $config ) {
                    if (
                        $config['output_file'] === $output_file &&
                        file_exists( $output_file )
                    ) {
                        $src = $upload_dir['baseurl'] . '/@@plugin_name/' . $relative_uri;
                    }
                }
            }
        }

        return $src;
    }

    /**
     * Get Breakpoints.
     */
    public static function get_breakpoints() {
        $xs = self::get_breakpoint_xs();
        $xs = ( ! empty( $xs ) && $xs ) ? $xs : self::$default_xs;

        $sm = self::get_breakpoint_sm();
        $sm = ( ! empty( $sm ) && $sm ) ? $sm : self::$default_sm;

        $md = self::get_breakpoint_md();
        $md = ( ! empty( $md ) && $md ) ? $md : self::$default_md;

        $lg = self::get_breakpoint_lg();
        $lg = ( ! empty( $lg ) && $lg ) ? $lg : self::$default_lg;

        return array(
            'xs' => $xs,
            'sm' => $sm,
            'md' => $md,
            'lg' => $lg,
        );
    }

    /**
     * Get default breakpoints.
     *
     * @return array
     */
    public static function get_default_breakpoints() {
        return array(
            'xs' => self::get_default_breakpoint_xs(),
            'sm' => self::get_default_breakpoint_sm(),
            'md' => self::get_default_breakpoint_md(),
            'lg' => self::get_default_breakpoint_lg(),
        );
    }

    /**
     * Get breakpoints Hash
     *
     * @param array $breakpoints - Breakpoints.
     * @return string
     */
    private static function get_breakpoints_hash( $breakpoints ) {
        return md5(
            wp_json_encode(
                array_merge(
                    $breakpoints,
                    array(
                        '@@plugin_version',
                    )
                )
            )
        );
    }

    /**
     * Get default breakpoints Hash.
     *
     * @return string
     */
    private static function get_default_breakpoints_hash() {
        return self::get_breakpoints_hash(
            array(
                'xs' => self::$default_xs,
                'sm' => self::$default_sm,
                'md' => self::$default_md,
                'lg' => self::$default_lg,
            )
        );
    }

    /**
     * Styles may need to be compiled if breakpoints have been changed.
     *
     * @return void
     */
    public function maybe_compile_scss_files() {
        $breakpoints              = self::get_breakpoints();
        $breakpoints_hash         = self::get_breakpoints_hash( $breakpoints );
        $default_breakpoints_hash = self::get_default_breakpoints_hash();
        $saved_breakpoints_hash   = get_option( 'ghostkit_saved_breakpoints_hash' );

        if (
            $breakpoints_hash !== $saved_breakpoints_hash &&
            $breakpoints_hash !== $default_breakpoints_hash
        ) {
            $compile_scss_configs = $this->compile_scss_configs;

            $breakpoints = self::get_breakpoints();

            $variables = array(
                'media-xs' => $breakpoints['xs'],
                'media-sm' => $breakpoints['sm'],
                'media-md' => $breakpoints['md'],
                'media-lg' => $breakpoints['lg'],
            );

            foreach ( $compile_scss_configs as $compile_scss_config ) {
                new GhostKit_Scss_Compiler(
                    array_merge(
                        $compile_scss_config,
                        array(
                            'variables'   => $variables,
                        )
                    )
                );
            }

            update_option( 'ghostkit_saved_breakpoints_hash', $breakpoints_hash );
        }
    }

    /**
     * Get Default Extra Small Breakpoint.
     *
     * @return int
     */
    public static function get_default_breakpoint_xs() {
        return apply_filters( 'gkt_default_breakpoint_xs', self::$default_xs );
    }

    /**
     * Get Extra Small Breakpoint.
     *
     * @return int
     */
    public static function get_breakpoint_xs() {
        return apply_filters( 'gkt_breakpoint_xs', self::get_default_breakpoint_xs() );
    }

    /**
     * Get Default Mobile Breakpoint.
     *
     * @return int
     */
    public static function get_default_breakpoint_sm() {
        return apply_filters( 'gkt_default_breakpoint_sm', self::$default_sm );
    }

    /**
     * Get Mobile Breakpoint.
     *
     * @return int
     */
    public static function get_breakpoint_sm() {
        return apply_filters( 'gkt_breakpoint_sm', self::get_default_breakpoint_sm() );
    }

    /**
     * Get Default Tablet Breakpoint.
     *
     * @return int
     */
    public static function get_default_breakpoint_md() {
        return apply_filters( 'gkt_default_breakpoint_md', self::$default_md );
    }

    /**
     * Get Tablet Breakpoint.
     *
     * @return int
     */
    public static function get_breakpoint_md() {
        return apply_filters( 'gkt_breakpoint_md', self::get_default_breakpoint_md() );
    }

    /**
     * Get Default Desktop Breakpoint.
     *
     * @return int
     */
    public static function get_default_breakpoint_lg() {
        return apply_filters( 'gkt_default_breakpoint_lg', self::$default_lg );
    }

    /**
     * Get Desktop Breakpoint.
     *
     * @return int
     */
    public static function get_breakpoint_lg() {
        return apply_filters( 'gkt_breakpoint_lg', self::get_default_breakpoint_lg() );
    }
}
new GhostKit_Breakpoints();
