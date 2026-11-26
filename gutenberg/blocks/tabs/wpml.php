<?php
/**
 * WPML integration for Tabs.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WP_Block_Parser_Block uses camelCase properties.

/**
 * Keep the translated button labels in sync with the serialized tab data.
 *
 * @param WP_Block_Parser_Block $block Translated block.
 * @return WP_Block_Parser_Block
 */
function ghostkit_wpml_sync_tab_titles( $block ) {
	if ( 'ghostkit/tabs-v2' !== $block->blockName ) {
		return $block;
	}

	$tab_button = '~(<button\b[^>]*\sdata-tab="([^"]*)"[^>]*>)(.*?)</button>~s';
	if ( ! preg_match_all( $tab_button, $block->innerHTML, $buttons, PREG_SET_ORDER ) ) {
		return $block;
	}

	$tabs_data = $block->attrs['tabsData'] ?? array();
	$titles    = array();
	foreach ( $buttons as $index => $button ) {
		$titles[ $button[2] ]          = $button[3];
		$tabs_data[ $index ]['slug'] ??= html_entity_decode( $button[2], ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		$tabs_data[ $index ]['title'] = $button[3];
	}
	$block->attrs['tabsData'] = $tabs_data;

	// Older WPML versions can update innerHTML without updating the fragments used to save nested blocks.
	if ( isset( $block->innerContent[0] ) ) {
		$block->innerContent[0] = preg_replace_callback(
			$tab_button,
			static function ( $button ) use ( $titles ) {
				return $button[1] . ( $titles[ $button[2] ] ?? $button[3] ) . '</button>';
			},
			$block->innerContent[0]
		);
	}

	return $block;
}
add_filter( 'wpml_update_strings_in_block', 'ghostkit_wpml_sync_tab_titles' );
