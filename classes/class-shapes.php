<?php
/**
 * Shapes for Shape Divider block
 *
 * @package ghostkit
 */

/**
 * GhostKit_Shapes_List
 */
class GhostKit_Shapes_List {
    /**
     * GhostKit_Shapes_List constructor.
     */
    public function __construct() {
        add_filter( 'gkt_shapes_list', array( $this, 'add_default_shapes' ), 9 );
        add_filter( 'gkt_shapes_list', array( $this, 'prepare_shapes_data' ), 99999 );
    }

    /**
     * Add default set of shapes.
     *
     * @param array $shapes - shapes list.
     *
     * @return array
     */
    public static function add_default_shapes( $shapes = array() ) {
        $shapes['default'] = array(
            'name'   => esc_html__( 'Default', '@@text_domain' ),
            'shapes' => array(
                array(
                    'label'                 => esc_html__( 'Wave', '@@text_domain' ),
                    'name'                  => 'wave',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => true,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/wave.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Waves', '@@text_domain' ),
                    'name'                  => 'waves',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => true,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/waves.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Tilt', '@@text_domain' ),
                    'name'                  => 'tilt',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => true,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/tilt.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Tilts', '@@text_domain' ),
                    'name'                  => 'tilts',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => true,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/tilts.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Triangle', '@@text_domain' ),
                    'name'                  => 'triangle',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => false,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/triangle.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Triangles', '@@text_domain' ),
                    'name'                  => 'triangles',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => false,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/triangles.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Triangle Asymm', '@@text_domain' ),
                    'name'                  => 'triangle-asymmetrical',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => true,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/triangle-asymmetrical.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Triangles Asymm', '@@text_domain' ),
                    'name'                  => 'triangles-asymmetrical',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => true,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/triangles-asymmetrical.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Ellipse', '@@text_domain' ),
                    'name'                  => 'ellipse',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => false,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/ellipse.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Ellipses', '@@text_domain' ),
                    'name'                  => 'ellipses',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => false,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/ellipses.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Arrow', '@@text_domain' ),
                    'name'                  => 'arrow',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => false,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/arrow.svg',
                ),
                array(
                    'label'                 => esc_html__( 'Arrow Curve', '@@text_domain' ),
                    'name'                  => 'arrow-curve',
                    'allow_flip_vertical'   => true,
                    'allow_flip_horizontal' => false,
                    'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/arrow-curve.svg',
                ),
            ),
        );

        return $shapes;
    }

    /**
     * Prepare shapes data (get SVG string).
     *
     * @param array $shapes - shapes list.
     *
     * @return array
     */
    public static function prepare_shapes_data( $shapes = array() ) {
        foreach ( $shapes as $k => $shape_cat ) {
            if ( ! isset( $shape_cat['shapes'] ) ) {
                continue;
            }

            foreach ( $shape_cat['shapes'] as $i => $shape ) {
                // phpcs:ignore
                $shapes[ $k ]['shapes'][ $i ]['svg'] = file_get_contents( $shape['path'] );
            }
        }

        return $shapes;
    }
}

new GhostKit_Shapes_List();
