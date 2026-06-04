<?php
/**
 * Detect frontend asset handles from parsed or rendered blocks.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Assets_Detector
 */
class GhostKit_Assets_Detector {
	/**
	 * Content / className markers → asset handles.
	 *
	 * @return array<string, array{styles: string[], scripts: string[], match?: string}>
	 */
	private static function get_content_markers() {
		return array(
			'ghostkit-badge'             => array(
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'ghostkit-text-uppercase'    => array(
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'ghostkit-has-transform'     => array(
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'ghostkit-d-'                => array(
				'match'   => 'prefix',
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'ghostkit-paragraph-columns' => array(
				'match'   => 'prefix',
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'ghostkit-list-columns'      => array(
				'match'   => 'prefix',
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'is-style-styled'            => array(
				'styles'  => array( 'ghostkit' ),
				'scripts' => array( 'ghostkit-style-variant-core-list' ),
			),
			'is-style-icon'              => array(
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'is-style-none'              => array(
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'is-style-numbered'          => array(
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
			'data-gkt-effects'           => array(
				'styles'  => array(),
				'scripts' => array( 'ghostkit-extension-effects' ),
			),
			'ghostkit-count-up'          => array(
				'styles'  => array(),
				'scripts' => array( 'ghostkit-extension-effects' ),
			),
			'data-ghostkit-sr'           => array(
				'styles'  => array( 'ghostkit' ),
				'scripts' => array(),
			),
		);
	}

	/**
	 * Detect assets for a list of blocks (includes innerBlocks).
	 *
	 * @param array  $blocks  Parsed blocks.
	 * @param string $context Context: parse|render.
	 *
	 * @return array{styles: string[], scripts: string[]}
	 */
	public static function detect_from_blocks( array $blocks, string $context = 'parse' ): array {
		$assets = array(
			'styles'  => array(),
			'scripts' => array(),
		);

		foreach ( $blocks as $block ) {
			if ( ! is_array( $block ) ) {
				continue;
			}

			$assets = self::merge_assets( $assets, self::detect_from_block( $block, $context ) );

			if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$assets = self::merge_assets( $assets, self::detect_from_blocks( $block['innerBlocks'], $context ) );
			}
		}

		return $assets;
	}

	/**
	 * Detect assets for a single block.
	 *
	 * @param array  $block         Block array.
	 * @param string $context       Context: parse|render.
	 * @param string $block_content Rendered HTML (render context only).
	 *
	 * @return array{styles: string[], scripts: string[]}
	 */
	public static function detect_from_block( array $block, string $context = 'parse', string $block_content = '' ): array {
		$assets = array(
			'styles'  => array(),
			'scripts' => array(),
		);

		$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';

		// Block.json handles are collected at parse-time; render-time covers attrs/HTML markers only.
		if ( 'parse' === $context && $block_name ) {
			$registry = WP_Block_Type_Registry::get_instance();
			$assets   = self::merge_assets( $assets, self::get_handles_from_block_type( $registry->get_registered( $block_name ) ) );
		}

		$assets = self::merge_assets( $assets, self::detect_from_attrs( $block ) );

		$class_name = _wp_array_get( $block, array( 'attrs', 'className' ), '' );
		if ( is_string( $class_name ) && '' !== $class_name ) {
			$assets = self::merge_assets( $assets, self::detect_from_content_string( $class_name ) );
		}

		$content_string = self::get_block_content_string( $block, 'render' === $context ? $block_content : '' );
		if ( '' !== $content_string ) {
			$assets = self::merge_assets( $assets, self::detect_from_content_string( $content_string ) );
		}

		if ( $block_name && in_array( $block_name, array( 'ghostkit/counter-box', 'ghostkit/progress' ), true ) ) {
			$assets = self::merge_assets(
				$assets,
				array(
					'styles'  => array(),
					'scripts' => array( 'ghostkit-extension-effects' ),
				)
			);
		}

		$assets = apply_filters( 'gkt_detect_block_assets', $assets, $block, $context, $block_content );

		return array(
			'styles'  => array_values( array_unique( $assets['styles'] ) ),
			'scripts' => array_values( array_unique( $assets['scripts'] ) ),
		);
	}

	/**
	 * Collect innerHTML / innerContent / optional rendered content.
	 *
	 * @param array  $block         Block array.
	 * @param string $block_content Rendered HTML.
	 *
	 * @return string
	 */
	public static function get_block_content_string( array $block, string $block_content = '' ): string {
		$parts = array();

		if ( ! empty( $block['innerHTML'] ) && is_string( $block['innerHTML'] ) ) {
			$parts[] = $block['innerHTML'];
		}

		if ( ! empty( $block['innerContent'] ) && is_array( $block['innerContent'] ) ) {
			foreach ( $block['innerContent'] as $chunk ) {
				if ( is_string( $chunk ) && '' !== $chunk ) {
					$parts[] = $chunk;
				}
			}
		}

		if ( '' !== $block_content ) {
			$parts[] = $block_content;
		}

		return implode( '', $parts );
	}

	/**
	 * Read style/script handles from a registered block type.
	 *
	 * @param WP_Block_Type|null $block_type Block type.
	 *
	 * @return array{styles: string[], scripts: string[]}
	 */
	public static function get_handles_from_block_type( $block_type ): array {
		$assets = array(
			'styles'  => array(),
			'scripts' => array(),
		);

		if ( ! $block_type instanceof WP_Block_Type ) {
			return $assets;
		}

		$assets['styles'] = array_merge(
			(array) ( $block_type->style_handles ?? array() ),
			(array) ( $block_type->view_style_handles ?? array() )
		);

		$assets['scripts'] = array_merge(
			(array) ( $block_type->script_handles ?? array() ),
			(array) ( $block_type->view_script_handles ?? array() )
		);

		return array(
			'styles'  => array_values( array_unique( $assets['styles'] ) ),
			'scripts' => array_values( array_unique( $assets['scripts'] ) ),
		);
	}

	/**
	 * Store detected handles for early enqueue (parse-time).
	 *
	 * @param array $assets Detected assets.
	 */
	public static function store_detected_assets( array $assets ): void {
		self::store_detected_handles( $assets['styles'] ?? array(), 'style', 9 );
		self::store_detected_handles( $assets['scripts'] ?? array(), 'script', 11 );
	}

	/**
	 * Queue registered handles for deferred enqueue.
	 *
	 * @param string[] $handles  Asset handles.
	 * @param string   $type     style|script.
	 * @param int      $priority Store priority.
	 */
	private static function store_detected_handles( array $handles, string $type, int $priority ): void {
		foreach ( $handles as $handle ) {
			if ( ! is_string( $handle ) || '' === $handle ) {
				continue;
			}

			$is_registered = 'style' === $type
				? wp_style_is( $handle, 'registered' )
				: wp_script_is( $handle, 'registered' );

			if ( $is_registered ) {
				GhostKit_Assets::store_used_assets( $handle, true, $type, $priority );
				continue;
			}

			/**
			 * Fires when a detected asset handle is not registered.
			 *
			 * @param string $handle Asset handle.
			 * @param string $type   Asset type: style|script.
			 */
			do_action( 'gkt_assets_detector_missing_handle', $handle, $type );
		}
	}

	/**
	 * Enqueue detected handles on render (with guards).
	 *
	 * @param array $assets Detected assets.
	 */
	public static function enqueue_detected_assets( array $assets ): void {
		self::enqueue_detected_handles( $assets['styles'] ?? array(), 'style' );
		self::enqueue_detected_handles( $assets['scripts'] ?? array(), 'script' );
	}

	/**
	 * Enqueue registered handles that are not already enqueued.
	 *
	 * @param string[] $handles Asset handles.
	 * @param string   $type    style|script.
	 */
	private static function enqueue_detected_handles( array $handles, string $type ): void {
		foreach ( $handles as $handle ) {
			if ( ! is_string( $handle ) || '' === $handle ) {
				continue;
			}

			if ( 'style' === $type ) {
				if ( wp_style_is( $handle, 'registered' ) && ! wp_style_is( $handle, 'enqueued' ) ) {
					wp_enqueue_style( $handle );
				}
				continue;
			}

			if ( wp_script_is( $handle, 'registered' ) && ! wp_script_is( $handle, 'enqueued' ) ) {
				wp_enqueue_script( $handle );
			}
		}
	}

	/**
	 * Detect from block attrs (ghostkit object and deprecated keys).
	 *
	 * @param array $block Block array.
	 *
	 * @return array{styles: string[], scripts: string[]}
	 */
	private static function detect_from_attrs( array $block ): array {
		$assets = array(
			'styles'  => array(),
			'scripts' => array(),
		);

		$attrs = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();

		$ghostkit_data = _wp_array_get( $attrs, array( 'ghostkit' ), null );
		if ( is_array( $ghostkit_data ) ) {
			if ( self::is_non_empty_value( _wp_array_get( $ghostkit_data, array( 'styles' ), null ) ) ) {
				$assets['styles'][] = 'ghostkit';
			}

			if ( self::is_non_empty_value( _wp_array_get( $ghostkit_data, array( 'effects' ), null ) ) ) {
				$assets['scripts'][] = 'ghostkit-extension-effects';
			}
		}

		if ( self::is_non_empty_value( _wp_array_get( $attrs, array( 'ghostkitCustomCSS' ), null ) ) ) {
			$assets['styles'][] = 'ghostkit';
		}

		if (
			self::is_non_empty_value( _wp_array_get( $attrs, array( 'ghostkitListIcon' ), null ) ) ||
			self::is_non_empty_value( _wp_array_get( $attrs, array( 'ghostkitListIconColor' ), null ) )
		) {
			$assets['styles'][] = 'ghostkit';
		}

		if ( self::is_non_empty_value( _wp_array_get( $attrs, array( 'ghostkitSR' ), null ) ) ) {
			$assets['styles'][] = 'ghostkit';
		}

		return array(
			'styles'  => array_values( array_unique( $assets['styles'] ) ),
			'scripts' => array_values( array_unique( $assets['scripts'] ) ),
		);
	}

	/**
	 * Match content markers in a string.
	 *
	 * @param string $content Content to scan.
	 *
	 * @return array{styles: string[], scripts: string[]}
	 */
	private static function detect_from_content_string( string $content ): array {
		$assets = array(
			'styles'  => array(),
			'scripts' => array(),
		);

		foreach ( self::get_content_markers() as $marker => $config ) {
			$match_type = isset( $config['match'] ) ? $config['match'] : 'substring';

			if ( ! self::content_matches_marker( $content, $marker, $match_type ) ) {
				continue;
			}

			$assets = self::merge_assets(
				$assets,
				array(
					'styles'  => $config['styles'] ?? array(),
					'scripts' => $config['scripts'] ?? array(),
				)
			);
		}

		return $assets;
	}

	/**
	 * Whether a marker is present in content.
	 *
	 * @param string $content    String to scan (className, HTML fragment, etc.).
	 * @param string $marker     Marker string.
	 * @param string $match_type substring|prefix.
	 *
	 * @return bool
	 */
	private static function content_matches_marker( string $content, string $marker, string $match_type ): bool {
		if ( 'prefix' === $match_type ) {
			return self::content_has_class_prefix( $content, $marker );
		}

		return false !== strpos( $content, $marker );
	}

	/**
	 * Whether any whitespace-delimited class token starts with the given prefix.
	 *
	 * Example: prefix `ghostkit-paragraph-columns` matches `lala test ghostkit-paragraph-columns-2 wow`.
	 *
	 * @param string $content Class list or HTML containing class names.
	 * @param string $prefix  Class name prefix.
	 *
	 * @return bool
	 */
	private static function content_has_class_prefix( string $content, string $prefix ): bool {
		if ( '' === $prefix ) {
			return false;
		}

		$quoted_prefix = preg_quote( $prefix, '/' );

		// Class token at start of string or after whitespace / quote; optional suffix after prefix.
		$pattern = '/(?:^|[\s"\'])' . $quoted_prefix . '[a-zA-Z0-9_-]*/';

		return 1 === preg_match( $pattern, $content );
	}

	/**
	 * Merge two asset arrays.
	 *
	 * @param array $a First assets.
	 * @param array $b Second assets.
	 *
	 * @return array{styles: string[], scripts: string[]}
	 */
	private static function merge_assets( array $a, array $b ): array {
		return array(
			'styles'  => array_values(
				array_unique(
					array_merge(
						$a['styles'] ?? array(),
						$b['styles'] ?? array()
					)
				)
			),
			'scripts' => array_values(
				array_unique(
					array_merge(
						$a['scripts'] ?? array(),
						$b['scripts'] ?? array()
					)
				)
			),
		);
	}

	/**
	 * Whether an attribute value is non-empty.
	 *
	 * @param mixed $value Value.
	 *
	 * @return bool
	 */
	private static function is_non_empty_value( $value ): bool {
		if ( null === $value ) {
			return false;
		}

		if ( is_string( $value ) ) {
			return trim( $value ) !== '';
		}

		if ( is_array( $value ) ) {
			return ! empty( $value );
		}

		return (bool) $value;
	}
}
