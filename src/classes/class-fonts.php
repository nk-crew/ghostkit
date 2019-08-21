<?php
/* phpcs:ignoreFile */
/**
 * Fonts for typography component
 *
 * @package @@plugin_name
 */

/**
 * GhostKit_Fonts
 */
class GhostKit_Fonts {
    /**
     * GhostKit_Fonts constructor.
     */
    public function __construct() {
        add_filter( 'gkt_fonts_list', array( $this, 'add_google_fonts' ) );
        add_filter( 'gkt_fonts_list', array( $this, 'add_default_site_fonts' ), 9 );
        // enqueue fonts
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_all_fonts_assets' ), 12 );
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_all_fonts_assets' ), 12 );
    }

    /**
     * Enqueue frontend & editor assets
     */
    public function enqueue_all_fonts_assets() {
        wp_enqueue_script( 'webfont-loader', ghostkit()->plugin_url . 'assets/vendor/webfontloader/webfontloader.js', array(), '', true );
        wp_enqueue_script( 'ghostkit-fonts-loader', ghostkit()->plugin_url . 'assets/js/fonts-loader.js', array(), '', true );
        wp_localize_script( 'webfont-loader', 'webfontList', $this->get_font_loader_list() );
    }

    /**
     * Create Font Loader List for webfont-loader.
     *
     * @return array - Font Loader List.
     */
    public function get_font_loader_list() {
        $post_id = null;
        $fonts_list = apply_filters( 'gkt_fonts_list', array() );
        $default_typography = apply_filters( 'gkt_custom_typography', array() );
        $fonts = $unique_fonts = $webfont_list = array();
        $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : false;
        $global_typography = get_option( 'ghostkit_typography', array() );
        $is_admin_editor = is_admin() && $screen && $screen->is_block_editor;

        if ( is_singular() ) {
            $post_id = get_the_ID();
        } elseif ( $is_admin_editor ) {
            global $post;
            $post_id = $post->ID;
        }

        $is_single = is_singular() && $post_id;
        $is_admin_editor = $is_admin_editor && $post_id;

        // Default Typography.
        if ( isset( $default_typography ) && ! empty( $default_typography ) ) {
            foreach ( $default_typography as $typography ) {
                if ( isset( $typography[ 'defaults' ][ 'font-family' ] ) &&
                    ! empty( $typography[ 'defaults' ][ 'font-family' ] ) &&
                    isset( $typography[ 'defaults' ][ 'font-family-category' ] ) &&
                    ! empty( $typography[ 'defaults' ][ 'font-family-category' ] ) ) {
                    $fonts[] = array(
                        'family' => $typography[ 'defaults' ][ 'font-family-category' ],
                        'label' => $typography[ 'defaults' ][ 'font-family' ],
                    );
                }
            }
        }

        // Global custom Typography.
        if ( $global_typography && isset( $global_typography['ghostkit_typography'] ) && $global_typography['ghostkit_typography'] ) {
            foreach ( json_decode( $global_typography['ghostkit_typography'] ) as $global_typography_key => $global_typography_value ) {
                if ( isset( $global_typography_value->fontFamily ) &&
                    ! empty( $global_typography_value->fontFamily ) &&
                    isset( $global_typography_value->fontFamilyCategory ) &&
                    ! empty( $global_typography_value->fontFamilyCategory ) ) {
                    $fonts[] = array(
                        'family' => $global_typography_value->fontFamilyCategory,
                        'label' => $global_typography_value->fontFamily,
                    );
                }
            }
        }

        // Local custom Typography.
        if ( $is_single || $is_admin_editor ) {
            $meta_typography = get_post_meta( $post_id, 'ghostkit_typography', true );

            if ( ! empty( $meta_typography ) ) {
                //$this->add_custom_css( 'ghostkit-custom-css', $meta_typography );
                foreach ( json_decode( $meta_typography ) as $meta_typography_key => $meta_typography_value ) {
                    if ( isset( $meta_typography_value->fontFamily ) &&
                        ! empty( $meta_typography_value->fontFamily ) &&
                        isset( $meta_typography_value->fontFamilyCategory ) &&
                        ! empty( $meta_typography_value->fontFamilyCategory ) ) {
                        $fonts[] = array(
                            'family' => $meta_typography_value->fontFamilyCategory,
                            'label' => $meta_typography_value->fontFamily,
                        );
                    }
                }
            }
        }

        // clear array to unique
        $unique_fonts = array_map( "unserialize", array_unique( array_map( "serialize", $fonts ) ) );

        foreach ( $unique_fonts as $font ) {
            if ( isset( $font[ 'family' ] ) && ! empty( $font[ 'family' ] ) ) {
                foreach( $fonts_list[ $font[ 'family' ] ][ 'fonts' ] as $find_font ) {
                    if ( $font[ 'label' ] === $find_font[ 'name' ] ) {
                        $webfont_list[ $font[ 'family' ] ][ $font[ 'label' ] ] = array(
                            'widths' => $find_font[ 'widths' ],
                            'category' => $find_font[ 'category' ],
                            'subsets' => $find_font[ 'subsets' ],
                        );
                    }
                }
            }
        }

        return $webfont_list;
    }

    /**
     * Add Default fonts list.
     *
     * @param array $fonts - fonts list.
     *
     * @return array
     */
    public function add_default_site_fonts( $fonts ) {
        $fonts['default'] = array(
            'name' => __( 'Default Fonts Site', '@@text_domain' ),
            'fonts' => array(
                array(
                    'name' => 'Default Site Font',
                    'widths' => array(
                        0 => '400',
                    ),
                    'category' => 'sans-serif',
                ),
            )
        );
        return $fonts;
    }

    /**
     * Add Google fonts list.
     *
     * @param array $fonts - fonts list.
     *
     * @return array
     */
    public function add_google_fonts( $fonts ) {

        /*
         * Example:

        $fonts['google-fonts'] = array(
            'name' => 'Google Fonts',
            'fonts' => array(),
        );
        $fonts_json = file_get_contents( ghostkit()->plugin_url . 'gutenberg/fonts/webfonts.json' );
        $fonts_object = json_decode($fonts_json);
        foreach ( $fonts_object->items as $font ) {
            $prepareWidths = array();
            foreach ( $font->variants as $width ) {
                switch ($width) {
                    case '100italic':
                        $prepareWidths[] = '100i';
                        break;
                    case '200italic':
                        $prepareWidths[] = '200i';
                        break;
                    case '300italic':
                        $prepareWidths[] = '300i';
                        break;
                    case 'italic':
                        $prepareWidths[] = '400i';
                        break;
                    case 'regular':
                        $prepareWidths[] = '400';
                        break;
                    case '500italic':
                        $prepareWidths[] = '500i';
                        break;
                    case '600italic':
                        $prepareWidths[] = '600i';
                        break;
                    case '700italic':
                        $prepareWidths[] = '700i';
                        break;
                    case '800italic':
                        $prepareWidths[] = '800i';
                        break;
                    case '900italic':
                        $prepareWidths[] = '900i';
                        break;
                    default:
                        $prepareWidths[] = $width;
                }
            }
            $fonts['google-fonts']['fonts'][] = array(
                'name' => $font->family,
                'widths' => $prepareWidths,
                'category' => $font->category,
                'subsets' => $font->subsets,
            );
        }
        echo '<pre>';
        echo $this->clear_php_string_code( var_export( $fonts, true ) );
        echo '</pre>';
        die();
        */

        $fonts['google-fonts'] =
            array(
                'name' => 'Google Fonts',
                'fonts' => array(
                    array(
                        'name' => 'ABeeZee',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Abel',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Abhaya Libre',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                            4 => '800',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'sinhala',
                        ),
                    ),
                    array(
                        'name' => 'Abril Fatface',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Aclonica',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Acme',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Actor',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Adamina',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Advent Pro',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'greek',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Aguafina Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Akronim',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Aladin',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Aldrich',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Alef',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Alegreya',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '700',
                            5 => '700i',
                            6 => '800',
                            7 => '800i',
                            8 => '900',
                            9 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Alegreya SC',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '700',
                            5 => '700i',
                            6 => '800',
                            7 => '800i',
                            8 => '900',
                            9 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Alegreya Sans',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '700',
                            9 => '700i',
                            10 => '800',
                            11 => '800i',
                            12 => '900',
                            13 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Alegreya Sans SC',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '700',
                            9 => '700i',
                            10 => '800',
                            11 => '800i',
                            12 => '900',
                            13 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Aleo',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Alex Brush',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Alfa Slab One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Alice',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Alike',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Alike Angular',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Allan',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Allerta',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Allerta Stencil',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Allura',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Almendra',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Almendra Display',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Almendra SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Amarante',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Amaranth',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Amatic SC',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'hebrew',
                            2 => 'latin',
                            3 => 'vietnamese',
                            4 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Amethysta',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Amiko',
                        'widths' => array(
                            0 => '400',
                            1 => '600',
                            2 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Amiri',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Amita',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Anaheim',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Andada',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Andika',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Angkor',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Annie Use Your Telescope',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Anonymous Pro',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Antic',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Antic Didone',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Antic Slab',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Anton',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Arapey',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Arbutus',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Arbutus Slab',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Architects Daughter',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Archivo',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Archivo Black',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Archivo Narrow',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Aref Ruqaa',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Arima Madurai',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '700',
                            6 => '800',
                            7 => '900',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Arimo',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'hebrew',
                            3 => 'latin',
                            4 => 'greek-ext',
                            5 => 'vietnamese',
                            6 => 'latin-ext',
                            7 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Arizonia',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Armata',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Arsenal',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Artifika',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Arvo',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Arya',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Asap',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Asap Condensed',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Asar',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Asset',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Assistant',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '600',
                            4 => '700',
                            5 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Astloch',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Asul',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Athiti',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Atma',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'bengali',
                        ),
                    ),
                    array(
                        'name' => 'Atomic Age',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Aubrey',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Audiowide',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Autour One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Average',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Average Sans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Averia Gruesa Libre',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Averia Libre',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Averia Sans Libre',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Averia Serif Libre',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'B612',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'B612 Mono',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bad Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bahiana',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bahianita',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bai Jamjuree',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Baloo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Bhai',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Bhaijaan',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Bhaina',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'oriya',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Chettan',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'malayalam',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Da',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'bengali',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Paaji',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'gurmukhi',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Tamma',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'kannada',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Tammudu',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Baloo Thambi',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Balthazar',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bangers',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Barlow',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Barlow Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Barlow Semi Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Barriecito',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Barrio',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Basic',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Battambang',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Baumans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bayon',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Belgrano',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bellefair',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Belleza',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'BenchNine',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bentham',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Berkshire Swash',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Beth Ellen',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bevan',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bigelow Rules',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bigshot One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bilbo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bilbo Swash Caps',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'BioRhyme',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '700',
                            4 => '800',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'BioRhyme Expanded',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '700',
                            4 => '800',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Biryani',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '600',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Bitter',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Black And White Picture',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Black Han Sans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Black Ops One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Blinker',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '600',
                            5 => '700',
                            6 => '800',
                            7 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bokor',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Bonbon',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Boogaloo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bowlby One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bowlby One SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Brawler',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Bree Serif',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bubblegum Sans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bubbler One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Buda',
                        'widths' => array(
                            0 => '300',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Buenard',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bungee',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bungee Hairline',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bungee Inline',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bungee Outline',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Bungee Shade',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Butcherman',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Butterfly Kids',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cabin',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cabin Condensed',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cabin Sketch',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Caesar Dressing',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Cagliostro',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Cairo',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '600',
                            4 => '700',
                            5 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Calligraffitti',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Cambay',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Cambo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Candal',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Cantarell',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Cantata One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cantora One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Capriola',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cardo',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'greek',
                            1 => 'latin',
                            2 => 'greek-ext',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Carme',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Carrois Gothic',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Carrois Gothic SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Carter One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Catamaran',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Caudex',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'greek',
                            1 => 'latin',
                            2 => 'greek-ext',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Caveat',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Caveat Brush',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cedarville Cursive',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Ceviche One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Chakra Petch',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '500',
                            5 => '500i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Changa',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Changa One',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Chango',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Charm',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Charmonman',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Chathura',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '700',
                            4 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Chau Philomene One',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Chela One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Chelsea Market',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Chenla',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Cherry Cream Soda',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Cherry Swash',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Chewy',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Chicle',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Chivo',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '700i',
                            6 => '900',
                            7 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Chonburi',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Cinzel',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                            2 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cinzel Decorative',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                            2 => '900',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Clicker Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Coda',
                        'widths' => array(
                            0 => '400',
                            1 => '800',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Coda Caption',
                        'widths' => array(
                            0 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Codystar',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Coiny',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Combo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Comfortaa',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'vietnamese',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Coming Soon',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Concert One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Condiment',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Content',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Contrail One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Convergence',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Cookie',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Copse',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Corben',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cormorant',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '500',
                            5 => '500i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cormorant Garamond',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '500',
                            5 => '500i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cormorant Infant',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '500',
                            5 => '500i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cormorant SC',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cormorant Unicase',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cormorant Upright',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Courgette',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cousine',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'hebrew',
                            3 => 'latin',
                            4 => 'greek-ext',
                            5 => 'vietnamese',
                            6 => 'latin-ext',
                            7 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Coustard',
                        'widths' => array(
                            0 => '400',
                            1 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Covered By Your Grace',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Crafty Girls',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Creepster',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Crete Round',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Crimson Pro',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '800',
                            7 => '900',
                            8 => '200i',
                            9 => '300i',
                            10 => '400i',
                            11 => '500i',
                            12 => '600i',
                            13 => '700i',
                            14 => '800i',
                            15 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Crimson Text',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '600',
                            3 => '600i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Croissant One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Crushed',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Cuprum',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cute Font',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Cutive',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Cutive Mono',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'DM Sans',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'DM Serif Display',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'DM Serif Text',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Damion',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Dancing Script',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Dangrek',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Darker Grotesque',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'David Libre',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Dawning of a New Day',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Days One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Dekko',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Delius',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Delius Swash Caps',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Delius Unicase',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Della Respira',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Denk One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Devonshire',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Dhurjati',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Didact Gothic',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Diplomata',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Diplomata SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Do Hyeon',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Dokdo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Domine',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Donegal One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Doppio One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Dorsa',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Dosis',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Dr Sugiyama',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Duru Sans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Dynalight',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'EB Garamond',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                            8 => '800',
                            9 => '800i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Eagle Lake',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'East Sea Dokdo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Eater',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Economica',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Eczar',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                            4 => '800',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'El Messiri',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Electrolize',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Elsie',
                        'widths' => array(
                            0 => '400',
                            1 => '900',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Elsie Swash Caps',
                        'widths' => array(
                            0 => '400',
                            1 => '900',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Emblema One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Emilys Candy',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Encode Sans',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Encode Sans Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Encode Sans Expanded',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Encode Sans Semi Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Encode Sans Semi Expanded',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Engagement',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Englebert',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Enriqueta',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Erica One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Esteban',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Euphoria Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ewert',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Exo',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Exo 2',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Expletus Sans',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Fahkwang',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Fanwood Text',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Farro',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Farsan',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Fascinate',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Fascinate Inline',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Faster One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Fasthand',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Fauna One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Faustina',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Federant',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Federo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Felipa',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fenix',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Finger Paint',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Fira Code',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fira Mono',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '700',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fira Sans',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fira Sans Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fira Sans Extra Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fjalla One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fjord One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Flamenco',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Flavors',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fondamento',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fontdiner Swanky',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Forum',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Francois One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Frank Ruhl Libre',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '700',
                            4 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Freckle Face',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fredericka the Great',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fredoka One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Freehand',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Fresca',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Frijole',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Fruktur',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Fugaz One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'GFS Didot',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'greek',
                        ),
                    ),
                    array(
                        'name' => 'GFS Neohellenic',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'greek',
                        ),
                    ),
                    array(
                        'name' => 'Gabriela',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Gaegu',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Gafata',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Galada',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'bengali',
                        ),
                    ),
                    array(
                        'name' => 'Galdeano',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Galindo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Gamja Flower',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Gentium Basic',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Gentium Book Basic',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Geo',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Geostar',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Geostar Fill',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Germania One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Gidugu',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Gilda Display',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Give You Glory',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Glass Antiqua',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Glegoo',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Gloria Hallelujah',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Goblin One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Gochi Hand',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Gorditas',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Gothic A1',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Goudy Bookletter 1911',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Graduate',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Grand Hotel',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Gravitas One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Great Vibes',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Grenze',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Griffy',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Gruppo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Gudea',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Gugi',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Gurajada',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Habibi',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Halant',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Hammersmith One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Hanalei',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Hanalei Fill',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Handlee',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Hanuman',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Happy Monkey',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Harmattan',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Headland One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Heebo',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Henny Penny',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Herr Von Muellerhoff',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Hi Melody',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Hind',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Hind Guntur',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Hind Madurai',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Hind Siliguri',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'bengali',
                        ),
                    ),
                    array(
                        'name' => 'Hind Vadodara',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Holtwood One SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Homemade Apple',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Homenaje',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IBM Plex Mono',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'IBM Plex Sans',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'vietnamese',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'IBM Plex Sans Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'IBM Plex Serif',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell DW Pica',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell DW Pica SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell Double Pica',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell Double Pica SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell English',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell English SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell French Canon',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell French Canon SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell Great Primer',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'IM Fell Great Primer SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Iceberg',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Iceland',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Imprima',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Inconsolata',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Inder',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Indie Flower',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Inika',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Inknut Antiqua',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Irish Grover',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Istok Web',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Italiana',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Italianno',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Itim',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Jacques Francois',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Jacques Francois Shadow',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Jaldi',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Jim Nightshade',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Jockey One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Jolly Lodger',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Jomhuria',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Josefin Sans',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Josefin Slab',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Joti One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Jua',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Judson',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Julee',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Julius Sans One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Junge',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Jura',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Just Another Hand',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Just Me Again Down Here',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'K2D',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Kadwa',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Kalam',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Kameron',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Kanit',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Kantumruy',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Karla',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Karma',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Katibeh',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Kaushan Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Kavivanar',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Kavoon',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Kdam Thmor',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Keania One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Kelly Slab',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Kenia',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Khand',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Khmer',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Khula',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '600',
                            3 => '700',
                            4 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Kirang Haerang',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Kite One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Knewave',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'KoHo',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Kodchasan',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Kosugi',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'japanese',
                        ),
                    ),
                    array(
                        'name' => 'Kosugi Maru',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'japanese',
                        ),
                    ),
                    array(
                        'name' => 'Kotta One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Koulen',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Kranky',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Kreon',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Kristi',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Krona One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Krub',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Kumar One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Kumar One Outline',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Kurale',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'devanagari',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'La Belle Aurore',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Lacquer',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Laila',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Lakki Reddy',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Lalezar',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Lancelot',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lateef',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Lato',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '700',
                            7 => '700i',
                            8 => '900',
                            9 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'League Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Leckerli One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Ledger',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lekton',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lemon',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Lemonada',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Lexend Deca',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lexend Exa',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lexend Giga',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lexend Mega',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lexend Peta',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lexend Tera',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lexend Zetta',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Libre Barcode 128',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Libre Barcode 128 Text',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Libre Barcode 39',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Libre Barcode 39 Extended',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Libre Barcode 39 Extended Text',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Libre Barcode 39 Text',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Libre Baskerville',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Libre Caslon Display',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Libre Caslon Text',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Libre Franklin',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Life Savers',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                            2 => '800',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lilita One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lily Script One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Limelight',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Linden Hill',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Literata',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                            4 => '400i',
                            5 => '500i',
                            6 => '600i',
                            7 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Liu Jian Mao Cao',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'Lobster',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Lobster Two',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Londrina Outline',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Londrina Shadow',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Londrina Sketch',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Londrina Solid',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '900',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Long Cang',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'Lora',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Love Ya Like A Sister',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Loved by the King',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Lovers Quarrel',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Luckiest Guy',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Lusitana',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Lustria',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'M PLUS 1p',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'hebrew',
                            3 => 'latin',
                            4 => 'greek-ext',
                            5 => 'vietnamese',
                            6 => 'latin-ext',
                            7 => 'cyrillic-ext',
                            8 => 'japanese',
                        ),
                    ),
                    array(
                        'name' => 'M PLUS Rounded 1c',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'hebrew',
                            3 => 'latin',
                            4 => 'greek-ext',
                            5 => 'vietnamese',
                            6 => 'latin-ext',
                            7 => 'cyrillic-ext',
                            8 => 'japanese',
                        ),
                    ),
                    array(
                        'name' => 'Ma Shan Zheng',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'Macondo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Macondo Swash Caps',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Mada',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Magra',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Maiden Orange',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Maitree',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Major Mono Display',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mako',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Mali',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Mallanna',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Mandali',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Manuale',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Marcellus',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Marcellus SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Marck Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Margarine',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Markazi Text',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Marko One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Marmelad',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Martel',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '600',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Martel Sans',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '600',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Marvel',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Mate',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Mate SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Maven Pro',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '700',
                            3 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'McLaren',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Meddon',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'MedievalSharp',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Medula One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Meera Inimai',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Megrim',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Meie Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Merienda',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Merienda One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Merriweather',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '700i',
                            6 => '900',
                            7 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Merriweather Sans',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '700i',
                            6 => '800',
                            7 => '800i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Metal',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Metal Mania',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Metamorphous',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Metrophobic',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Michroma',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Milonga',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Miltonian',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Miltonian Tattoo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Mina',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'bengali',
                        ),
                    ),
                    array(
                        'name' => 'Miniver',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Miriam Libre',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mirza',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Miss Fajardose',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mitr',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Modak',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Modern Antiqua',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mogra',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Molengo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Molle',
                        'widths' => array(
                            0 => '400i',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Monda',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Monofett',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Monoton',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Monsieur La Doulaise',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Montaga',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Montez',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Montserrat',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Montserrat Alternates',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Montserrat Subrayada',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Moul',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Moulpali',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Mountains of Christmas',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Mouse Memoirs',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mr Bedfort',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mr Dafoe',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mr De Haviland',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mrs Saint Delafield',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mrs Sheppards',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mukta',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Mukta Mahee',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'gurmukhi',
                        ),
                    ),
                    array(
                        'name' => 'Mukta Malar',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Mukta Vaani',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Muli',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                            10 => '800',
                            11 => '800i',
                            12 => '900',
                            13 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Mystery Quest',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'NTR',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Nanum Brush Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Nanum Gothic',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                            2 => '800',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Nanum Gothic Coding',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Nanum Myeongjo',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                            2 => '800',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Nanum Pen Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Neucha',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Neuton',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '800',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'New Rocker',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'News Cycle',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Niconne',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Niramit',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Nixie One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nobile',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Nokora',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Norican',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Nosifer',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Notable',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nothing You Could Do',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Noticia Text',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Noto Sans',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'devanagari',
                            7 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Noto Sans HK',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'chinese-hongkong',
                            1 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Noto Sans JP',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'japanese',
                        ),
                    ),
                    array(
                        'name' => 'Noto Sans KR',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Noto Sans SC',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'Noto Sans TC',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'chinese-traditional',
                        ),
                    ),
                    array(
                        'name' => 'Noto Serif',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Noto Serif JP',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'japanese',
                        ),
                    ),
                    array(
                        'name' => 'Noto Serif KR',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Noto Serif SC',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'Noto Serif TC',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'chinese-traditional',
                        ),
                    ),
                    array(
                        'name' => 'Nova Cut',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nova Flat',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nova Mono',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'greek',
                            1 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nova Oval',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nova Round',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nova Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nova Slim',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nova Square',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Numans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Nunito',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                            10 => '800',
                            11 => '800i',
                            12 => '900',
                            13 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Nunito Sans',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                            10 => '800',
                            11 => '800i',
                            12 => '900',
                            13 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Odor Mean Chey',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Offside',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Old Standard TT',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Oldenburg',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Oleo Script',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Oleo Script Swash Caps',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Open Sans',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                            8 => '800',
                            9 => '800i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Open Sans Condensed',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Oranienbaum',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Orbitron',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '700',
                            3 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Oregano',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Orienta',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Original Surfer',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Oswald',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Over the Rainbow',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Overlock',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                            4 => '900',
                            5 => '900i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Overlock SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Overpass',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                            12 => '800',
                            13 => '800i',
                            14 => '900',
                            15 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Overpass Mono',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ovo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Oxygen',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Oxygen Mono',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'PT Mono',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'PT Sans',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'PT Sans Caption',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'PT Sans Narrow',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'PT Serif',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'PT Serif Caption',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Pacifico',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Padauk',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'myanmar',
                            1 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Palanquin',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Palanquin Dark',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Pangolin',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Paprika',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Parisienne',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Passero One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Passion One',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                            2 => '900',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Pathway Gothic One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Patrick Hand',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Patrick Hand SC',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Pattaya',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Patua One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Pavanam',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'tamil',
                        ),
                    ),
                    array(
                        'name' => 'Paytone One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Peddana',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Peralta',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Permanent Marker',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Petit Formal Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Petrona',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Philosopher',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Piedra',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Pinyon Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Pirata One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Plaster',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Play',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'vietnamese',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Playball',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Playfair Display',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                            4 => '900',
                            5 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Playfair Display SC',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                            4 => '900',
                            5 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Podkova',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                            4 => '800',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Poiret One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Poller One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Poly',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Pompiere',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Pontano Sans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Poor Story',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Poppins',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Port Lligat Sans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Port Lligat Slab',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Pragati Narrow',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Prata',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Preahvihear',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Press Start 2P',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Pridi',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Princess Sofia',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Prociono',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Prompt',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Prosto One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Proza Libre',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '600',
                            5 => '600i',
                            6 => '700',
                            7 => '700i',
                            8 => '800',
                            9 => '800i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Puritan',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Purple Purse',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Quando',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Quantico',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Quattrocento',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Quattrocento Sans',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Questrial',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Quicksand',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Quintessential',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Qwigley',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Racing Sans One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Radley',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rajdhani',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Rakkas',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Raleway',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Raleway Dots',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ramabhadra',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Ramaraja',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Rambla',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rammetto One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ranchers',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rancho',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Ranga',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Rasa',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Rationale',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Ravi Prakash',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Red Hat Display',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '700',
                            5 => '700i',
                            6 => '900',
                            7 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Red Hat Text',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '500',
                            3 => '500i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Redressed',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Reem Kufi',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Reenie Beanie',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Revalia',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rhodium Libre',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Ribeye',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ribeye Marrow',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Righteous',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Risque',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Roboto',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '700',
                            9 => '700i',
                            10 => '900',
                            11 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Roboto Condensed',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '700',
                            5 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Roboto Mono',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '700',
                            9 => '700i',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Roboto Slab',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rochester',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Rock Salt',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Rokkitt',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Romanesco',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ropa Sans',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rosario',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Rosarivo',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rouge Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Rozha One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Rubik',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '500',
                            5 => '500i',
                            6 => '700',
                            7 => '700i',
                            8 => '900',
                            9 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'hebrew',
                            2 => 'latin',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rubik Mono One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ruda',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                            2 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rufina',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ruge Boogie',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ruluko',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rum Raisin',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ruslan Display',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Russo One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ruthie',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Rye',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sacramento',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sahitya',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Sail',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Saira',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Saira Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Saira Extra Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Saira Semi Condensed',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Saira Stencil One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Salsa',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Sanchez',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sancreek',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sansita',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                            4 => '800',
                            5 => '800i',
                            6 => '900',
                            7 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sarabun',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Sarala',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Sarina',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sarpanch',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                            4 => '800',
                            5 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Satisfy',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Sawarabi Gothic',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'japanese',
                        ),
                    ),
                    array(
                        'name' => 'Sawarabi Mincho',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'japanese',
                        ),
                    ),
                    array(
                        'name' => 'Scada',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                            3 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Scheherazade',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Schoolbell',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Scope One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Seaweed Script',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Secular One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sedgwick Ave',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sedgwick Ave Display',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sevillana',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Seymour One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Shadows Into Light',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Shadows Into Light Two',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Shanti',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Share',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Share Tech',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Share Tech Mono',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Shojumaru',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Short Stack',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Shrikhand',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'gujarati',
                        ),
                    ),
                    array(
                        'name' => 'Siemreap',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Sigmar One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Signika',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Signika Negative',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '600',
                            3 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Simonetta',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '900',
                            3 => '900i',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Single Day',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Sintony',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sirin Stencil',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Six Caps',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Skranji',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Slabo 13px',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Slabo 27px',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Slackey',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Smokum',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Smythe',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Sniglet',
                        'widths' => array(
                            0 => '400',
                            1 => '800',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Snippet',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Snowburst One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sofadi One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Sofia',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Song Myung',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Sonsie One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sorts Mill Goudy',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Source Code Pro',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '600',
                            5 => '700',
                            6 => '900',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Source Sans Pro',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                            10 => '900',
                            11 => '900i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'vietnamese',
                            5 => 'latin-ext',
                            6 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Source Serif Pro',
                        'widths' => array(
                            0 => '400',
                            1 => '600',
                            2 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Space Mono',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Special Elite',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Spectral',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                            12 => '800',
                            13 => '800i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Spectral SC',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '500',
                            7 => '500i',
                            8 => '600',
                            9 => '600i',
                            10 => '700',
                            11 => '700i',
                            12 => '800',
                            13 => '800i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Spicy Rice',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Spinnaker',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Spirax',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Squada One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Sree Krushnadevaraya',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Sriracha',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Srisakdi',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Staatliches',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Stalemate',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Stalinist One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Stardos Stencil',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Stint Ultra Condensed',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Stint Ultra Expanded',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Stoke',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Strait',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Stylish',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Sue Ellen Francisco',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Suez One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Sumana',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Sunflower',
                        'widths' => array(
                            0 => '300',
                            1 => '500',
                            2 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Sunshiney',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Supermercado One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Sura',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Suranna',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Suravaram',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Suwannaphum',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Swanky and Moo Moo',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Syncopate',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Tajawal',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '800',
                            6 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'arabic',
                        ),
                    ),
                    array(
                        'name' => 'Tangerine',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Taprom',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'khmer',
                        ),
                    ),
                    array(
                        'name' => 'Tauri',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Taviraj',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Teko',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Telex',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Tenali Ramakrishna',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Tenor Sans',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Text Me One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Thasadith',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'The Girl Next Door',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Tienne',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                            2 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Tillana',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '600',
                            3 => '700',
                            4 => '800',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Timmana',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'telugu',
                        ),
                    ),
                    array(
                        'name' => 'Tinos',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'hebrew',
                            3 => 'latin',
                            4 => 'greek-ext',
                            5 => 'vietnamese',
                            6 => 'latin-ext',
                            7 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Titan One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Titillium Web',
                        'widths' => array(
                            0 => '200',
                            1 => '200i',
                            2 => '300',
                            3 => '300i',
                            4 => '400',
                            5 => '400i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                            10 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Trade Winds',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Trirong',
                        'widths' => array(
                            0 => '100',
                            1 => '100i',
                            2 => '200',
                            3 => '200i',
                            4 => '300',
                            5 => '300i',
                            6 => '400',
                            7 => '400i',
                            8 => '500',
                            9 => '500i',
                            10 => '600',
                            11 => '600i',
                            12 => '700',
                            13 => '700i',
                            14 => '800',
                            15 => '800i',
                            16 => '900',
                            17 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                            3 => 'thai',
                        ),
                    ),
                    array(
                        'name' => 'Trocchi',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Trochut',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Trykker',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Tulpen One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Ubuntu',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '500',
                            5 => '500i',
                            6 => '700',
                            7 => '700i',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ubuntu Condensed',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ubuntu Mono',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'greek-ext',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Ultra',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Uncial Antiqua',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Underdog',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Unica One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'UnifrakturCook',
                        'widths' => array(
                            0 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'UnifrakturMaguntia',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Unkempt',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Unlock',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Unna',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'VT323',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'monospace',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'vietnamese',
                            2 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Vampiro One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Varela',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Varela Round',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'hebrew',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Vast Shadow',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Vesper Libre',
                        'widths' => array(
                            0 => '400',
                            1 => '500',
                            2 => '700',
                            3 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Vibur',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Vidaloka',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Viga',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Voces',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Volkhov',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '700',
                            3 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Vollkorn',
                        'widths' => array(
                            0 => '400',
                            1 => '400i',
                            2 => '600',
                            3 => '600i',
                            4 => '700',
                            5 => '700i',
                            6 => '900',
                            7 => '900i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'greek',
                            2 => 'latin',
                            3 => 'vietnamese',
                            4 => 'latin-ext',
                            5 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Vollkorn SC',
                        'widths' => array(
                            0 => '400',
                            1 => '600',
                            2 => '700',
                            3 => '900',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Voltaire',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Waiting for the Sunrise',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Wallpoet',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Walter Turncoat',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Warnes',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Wellfleet',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Wendy One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Wire One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Work Sans',
                        'widths' => array(
                            0 => '100',
                            1 => '200',
                            2 => '300',
                            3 => '400',
                            4 => '500',
                            5 => '600',
                            6 => '700',
                            7 => '800',
                            8 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Yanone Kaffeesatz',
                        'widths' => array(
                            0 => '200',
                            1 => '300',
                            2 => '400',
                            3 => '700',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Yantramanav',
                        'widths' => array(
                            0 => '100',
                            1 => '300',
                            2 => '400',
                            3 => '500',
                            4 => '700',
                            5 => '900',
                        ),
                        'category' => 'sans-serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Yatra One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                            2 => 'devanagari',
                        ),
                    ),
                    array(
                        'name' => 'Yellowtail',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Yeon Sung',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'korean',
                        ),
                    ),
                    array(
                        'name' => 'Yeseva One',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'cyrillic',
                            1 => 'latin',
                            2 => 'vietnamese',
                            3 => 'latin-ext',
                            4 => 'cyrillic-ext',
                        ),
                    ),
                    array(
                        'name' => 'Yesteryear',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Yrsa',
                        'widths' => array(
                            0 => '300',
                            1 => '400',
                            2 => '500',
                            3 => '600',
                            4 => '700',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'ZCOOL KuaiLe',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'ZCOOL QingKe HuangYou',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'ZCOOL XiaoWei',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'Zeyada',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                        ),
                    ),
                    array(
                        'name' => 'Zhi Mang Xing',
                        'widths' => array(
                            0 => '400',
                        ),
                        'category' => 'handwriting',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'chinese-simplified',
                        ),
                    ),
                    array(
                        'name' => 'Zilla Slab',
                        'widths' => array(
                            0 => '300',
                            1 => '300i',
                            2 => '400',
                            3 => '400i',
                            4 => '500',
                            5 => '500i',
                            6 => '600',
                            7 => '600i',
                            8 => '700',
                            9 => '700i',
                        ),
                        'category' => 'serif',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                    array(
                        'name' => 'Zilla Slab Highlight',
                        'widths' => array(
                            0 => '400',
                            1 => '700',
                        ),
                        'category' => 'display',
                        'subsets' => array(
                            0 => 'latin',
                            1 => 'latin-ext',
                        ),
                    ),
                ),
            );
        return $fonts;
    }

    /**
     * Clear PHP string code.
     *
     * @param string $string code string.
     * @return string
     */
    public function clear_php_string_code( $string ) {
        $str_replace = array(
            '  '      => '    ',
            'array (' => 'array(',
        );
        $preg_replace = array(
            '/([ \r\n]+?)array/' => ' array',
            '/[0-9]+ => array/'  => 'array',
            '/\n/'               => "\n    ",
        );
        // change 2-spaces to 4-spaces.
        $string = str_replace( array_keys( $str_replace ), array_values( $str_replace ), $string );
        // correct formats '=> array('.
        // additional spaces.
        $string = preg_replace( array_keys( $preg_replace ), array_values( $preg_replace ), $string );
        return $string;
    }
}
new GhostKit_Fonts();