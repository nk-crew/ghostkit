<?php
/**
 * Extensions for blocks
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extensions
 */
class GhostKit_Extensions {
	/**
	 * Registered extensions.
	 *
	 * @var array
	 */
	private static $extensions = array();

	/**
	 * The list of default settings to extend Core blocks.
	 *
	 * @var array
	 */
	private static $default_supports = array();

	/**
	 * The list of unsupported Core blocks to add extension.
	 *
	 * @var array
	 */
	private static $unsupported_blocks = array(
		'core/shortcode',
		'core/block',
		'core/legacy-widget',
		'core/freeform',
		'core/html',
	);

	/**
	 * GhostKit_Extensions constructor.
	 */
	public static function init() {
		add_action(
			'init',
			function() {
				// Register the block support.
				WP_Block_Supports::get_instance()->register(
					'ghostkit',
					array(
						'register_attribute' => 'GhostKit_Extensions::register_attribute',
					)
				);

				add_filter( 'render_block', 'GhostKit_Extensions::render_block', 10, 2 );
			}
		);
	}

	/**
	 * Register extension.
	 *
	 * @param string $extension_name - new extension name.
	 * @param array  $extension_data - new extension data.
	 */
	public static function register( $extension_name, $extension_data ) {
		self::$extensions[ $extension_name ] = array_merge(
			$extension_data,
			array( 'name' => $extension_name )
		);

		self::$default_supports = array_merge(
			self::$default_supports,
			$extension_data['default_supports'] ?? array()
		);
	}

	/**
	 * Registers the `ghostkit` block attribute for block types that support it.
	 *
	 * @param WP_Block_Type $block_type Block Type.
	 */
	public static function register_attribute( $block_type ) {
		$has_ghostkit_support = block_has_support( $block_type, array( 'ghostkit' ), false );

		// Add ghostkit extensions support to all Ghost Kit and Core blocks.
		if (
			! $has_ghostkit_support &&
			$block_type->name &&
			(
				substr( $block_type->name, 0, 5 ) === 'core/' ||
				substr( $block_type->name, 0, 9 ) === 'ghostkit/'
			) &&
			! in_array( $block_type->name, self::$unsupported_blocks, true )
		) {
			$has_ghostkit_support = true;
		}

		if ( ! $has_ghostkit_support ) {
			return;
		}

		// Add supports.
		if ( ! $block_type->supports ) {
			$block_type->supports = array();
		}
		if ( ! array_key_exists( 'ghostkit', $block_type->supports ) ) {
			$block_type->supports['ghostkit'] = self::$default_supports;
		} else {
			$new_supports = self::$default_supports;

			// Change defaults to user custom configs.
			if ( is_array( $block_type->supports['ghostkit'] ) ) {
				foreach ( $block_type->supports['ghostkit'] as $k => $val ) {
					if ( true !== $val ) {
						$new_supports[ $k ] = $val;
					}
				}
			}

			$block_type->supports['ghostkit'] = $new_supports;
		}

		// Add attribute.
		if ( ! $block_type->attributes ) {
			$block_type->attributes = array();
		}
		if ( ! array_key_exists( 'ghostkit', $block_type->attributes ) ) {
			$block_type->attributes['ghostkit'] = array(
				'type' => 'object',
			);
		}
	}

	/**
	 * Renders block with extensions.
	 *
	 * @param  string $block_content Rendered block content.
	 * @param  array  $block         Block object.
	 *
	 * @return string                Filtered block content.
	 */
	public static function render_block( $block_content, $block ) {
		$block_type = WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] );

		foreach ( self::$extensions as $block_extension_config ) {
			$has_extension_support = block_has_support( $block_type, array( 'ghostkit', $block_extension_config['name'] ), false );

			if ( ! $has_extension_support || ! isset( $block_extension_config['render_block'] ) ) {
				continue;
			}

			$block_content = call_user_func(
				$block_extension_config['render_block'],
				$block_content,
				$block,
				$block_type
			);

			$block_content = apply_filters( 'gkt_extension_' . $block_extension_config['name'] . '_render_block', $block_content, $block, $block_type );
		}

		return $block_content;
	}
}

require_once ghostkit()->plugin_path . 'gutenberg/extend/deprecated/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/attributes/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/styles/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/position/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/spacings/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/frame/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/transform/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/custom-css/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/display/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/effects/index.php';

GhostKit_Extensions::init();
