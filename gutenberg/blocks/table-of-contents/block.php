<?php
/**
 * TOC block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_TOC_Block
 */
class GhostKit_TOC_Block {
	/**
	 * GhostKit_TOC_Block constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );

		add_filter( 'the_content', array( $this, 'parse_toc_headings' ), 8 );
	}

	/**
	 * List with all available page headings for TOC.
	 *
	 * @var boolean
	 */
	private $available_headings = array();

	/**
	 * Is TOC exist in the current page.
	 *
	 * @var boolean
	 */
	private $is_toc_exist = false;

	/**
	 * TOC allowed headers for the current page.
	 *
	 * @var array
	 */
	private $toc_allowed_headers = array();

	/**
	 * Init.
	 */
	public function init() {
		register_block_type_from_metadata(
			dirname( __FILE__ ),
			array(
				'render_callback' => array( $this, 'block_render' ),
			)
		);
	}

	/**
	 * Get heading text from html tag.
	 *
	 * @param String $html heading html.
	 *
	 * @return String heading text.
	 */
	public function get_heading_text( $html ) {
		preg_match_all( '/(<h([1-6]{1})[^>]*>)(.*)<\/h\2>/msuU', $html, $matches, PREG_SET_ORDER );

		return isset( $matches[0][3] ) ? $matches[0][3] : '';
	}

	/**
	 * Get heading text and id from html tag.
	 *
	 * @param String $html heading html.
	 *
	 * @return Array heading data.
	 */
	public function get_heading_data( $html ) {
		$return = array(
			'content' => '',
			'id'      => '',
		);

		preg_match_all( '/(<h([1-6]{1})[^>]*>)(.*)<\/h\2>/msuU', $html, $matches, PREG_SET_ORDER );
		preg_match( '/id=(["\'])(.*?)\1[\s>]/si', $matches[0][1], $matched_ids );

		$content = isset( $matches[0][3] ) ? wp_strip_all_tags( $matches[0][3] ) : '';
		$id      = isset( $matched_ids[2] ) ? $matched_ids[2] : '';

		if ( $content && $id ) {
			$return['content'] = $content;
			$return['id']      = $id;
		}

		return $return;
	}

	/**
	 * Get all available headings.
	 *
	 * @param Array $blocks blocks array.
	 * @param Array $allowed_headers array with allowed headers.
	 *
	 * @return Array headings array.
	 */
	public function get_all_headings( $blocks, $allowed_headers ) {
		$headings = array();

		if ( ! empty( $allowed_headers ) ) {
			foreach ( $blocks as $block ) {
				if ( 'core/heading' !== $block['blockName'] ) {
					if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) ) {
						$headings = array_merge(
							$headings,
							$this->get_all_headings( $block['innerBlocks'], $allowed_headers )
						);
					}

					continue;
				}

				$level = isset( $block['attrs']['level'] ) ? $block['attrs']['level'] : 2;

				if ( in_array( $level, $allowed_headers, true ) ) {
					$data = isset( $block['innerHTML'] ) ? $this->get_heading_data( $block['innerHTML'] ) : '';

					if ( $data['content'] && $data['id'] ) {
						$headings[] = array(
							'level'   => $level,
							'content' => $data['content'],
							'anchor'  => $data['id'],
						);
					}
				}
			}
		}

		return $headings;
	}

	/**
	 * Find toc block.
	 *
	 * @param array $blocks post blocks.
	 *
	 * @return array|bool toc block data.
	 */
	public function find_toc_block( $blocks ) {
		$result = false;

		if ( ! $blocks || empty( $blocks ) ) {
			return false;
		}

		foreach ( $blocks as $block ) {
			if ( 'ghostkit/table-of-contents' === $block['blockName'] ) {
				$result = $block;
				break;
			} elseif ( ! $result && isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) ) {
				$result = $this->find_toc_block( $block['innerBlocks'] );
			}
		}

		return $result;
	}

	/**
	 * Check if TOC block exists and parse headings.
	 *
	 * @param string $content post content.
	 * @return string post content.
	 */
	public function parse_toc_headings( $content ) {
		if ( ! is_singular() || ! function_exists( 'has_blocks' ) || ! function_exists( 'parse_blocks' ) || ! has_blocks( get_the_ID() ) ) {
			return $content;
		}

		$blocks = parse_blocks( $content );
		if ( ! is_array( $blocks ) || empty( $blocks ) ) {
			return '';
		}

		// Find TOC block.
		$toc = $this->find_toc_block( $blocks );

		if ( $toc ) {
			$attrs = array_merge(
				array(
					'allowedHeaders' => array( 2, 3, 4 ),
				),
				$toc['attrs']
			);

			$this->is_toc_exist        = true;
			$this->toc_allowed_headers = $attrs['allowedHeaders'];

			$this->available_headings = $this->get_all_headings( $blocks, $this->toc_allowed_headers );
		}

		return $content;
	}

	/**
	 * Get toc HTML string from REST
	 *
	 * @param Array $data - data for toc.
	 * @return array
	 */
	public function get_toc_html( $data ) {
		$request = new WP_REST_Request( 'GET', '/ghostkit/v1/get_table_of_contents' );
		$request->set_query_params( $data );
		$response = rest_do_request( $request );
		$server   = rest_get_server();
		$data     = $server->response_to_data( $response, false );

		return isset( $data['response'] ) && isset( $data['success'] ) && $data['success'] ? $data['response'] : false;
	}

	/**
	 * Register gutenberg block output
	 *
	 * @param array $attributes - block attributes.
	 *
	 * @return string
	 */
	public function block_render( $attributes ) {
		$attributes = array_merge(
			array(
				'title'          => 'Table of Contents',
				'listStyle'      => 'ol-styled',
				'allowedHeaders' => array( 2, 3, 4 ),
				'className'      => '',
			),
			$attributes
		);

		if ( empty( $this->available_headings ) ) {
			return '';
		}

		$headings_html = $this->get_toc_html(
			array(
				'headings'       => $this->available_headings,
				'allowedHeaders' => $attributes['allowedHeaders'],
				'listStyle'      => $attributes['listStyle'],
			)
		);

		if ( ! $headings_html ) {
			return '';
		}

		ob_start();

		$class = 'ghostkit-toc';

		if ( $attributes['className'] ) {
			$class .= ' ' . $attributes['className'];
		}

		?>
		<div class="<?php echo esc_attr( $class ); ?>">
			<?php if ( $attributes['title'] ) : ?>
				<h5 class="ghostkit-toc-title">
					<?php echo wp_kses_post( $attributes['title'] ); ?>
				</h5>
			<?php endif; ?>
			<div class="ghostkit-toc-list">
				<?php
                // phpcs:ignore
                echo $headings_html;
				?>
			</div>
		</div>
		<?php

		return ob_get_clean();
	}
}
new GhostKit_TOC_Block();
