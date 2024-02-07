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
			'name'   => esc_html__( 'Default', 'ghostkit' ),
			'shapes' => array(
				array(
					'label'                 => esc_html__( 'Wave', 'ghostkit' ),
					'name'                  => 'wave',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => true,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/wave.svg',
				),
				array(
					'label'                 => esc_html__( 'Waves', 'ghostkit' ),
					'name'                  => 'waves',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => true,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/waves.svg',
				),
				array(
					'label'                 => esc_html__( 'Tilt', 'ghostkit' ),
					'name'                  => 'tilt',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => true,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/tilt.svg',
				),
				array(
					'label'                 => esc_html__( 'Tilts', 'ghostkit' ),
					'name'                  => 'tilts',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => true,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/tilts.svg',
				),
				array(
					'label'                 => esc_html__( 'Triangle', 'ghostkit' ),
					'name'                  => 'triangle',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => false,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/triangle.svg',
				),
				array(
					'label'                 => esc_html__( 'Triangles', 'ghostkit' ),
					'name'                  => 'triangles',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => false,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/triangles.svg',
				),
				array(
					'label'                 => esc_html__( 'Triangle Asymm', 'ghostkit' ),
					'name'                  => 'triangle-asymmetrical',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => true,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/triangle-asymmetrical.svg',
				),
				array(
					'label'                 => esc_html__( 'Triangles Asymm', 'ghostkit' ),
					'name'                  => 'triangles-asymmetrical',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => true,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/triangles-asymmetrical.svg',
				),
				array(
					'label'                 => esc_html__( 'Ellipse', 'ghostkit' ),
					'name'                  => 'ellipse',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => false,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/ellipse.svg',
				),
				array(
					'label'                 => esc_html__( 'Ellipses', 'ghostkit' ),
					'name'                  => 'ellipses',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => false,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/ellipses.svg',
				),
				array(
					'label'                 => esc_html__( 'Arrow', 'ghostkit' ),
					'name'                  => 'arrow',
					'allow_flip_vertical'   => true,
					'allow_flip_horizontal' => false,
					'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/arrow.svg',
				),
				array(
					'label'                 => esc_html__( 'Arrow Curve', 'ghostkit' ),
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
