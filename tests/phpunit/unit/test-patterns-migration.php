<?php
/**
 * Tests for migration from Ghost Kit Templates to Patterns.
 *
 * @package ghostkit
 */

/**
 * Pattern migration tests.
 */
class GhostKitPatternsMigrationTest extends WP_UnitTestCase {
	/**
	 * Copy content and metadata without changing saved pages or widening access.
	 */
	public function test_migrates_saved_templates_and_keeps_inserted_content() {
		$editor      = self::factory()->user->create( array( 'role' => 'editor' ) );
		$contributor = self::factory()->user->create( array( 'role' => 'contributor' ) );
		wp_set_current_user( $editor );
		register_post_type( 'ghostkit_template', array( 'capability_type' => 'post' ) );
		register_taxonomy( 'ghostkit_template_category', 'ghostkit_template' );

		$markup = '<!-- wp:paragraph {"className":"ghostkit-badge"} --><p class="ghostkit-badge">Template with a \\ and &amp;</p><!-- /wp:paragraph -->';
		$page   = self::factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_content' => wp_slash( $markup ),
			)
		);
		$before = do_blocks( get_post( $page )->post_content );

		$template = self::factory()->post->create(
			array(
				'post_type'    => 'ghostkit_template',
				'post_author'  => $editor,
				'post_status'  => 'private',
				'post_title'   => 'Private Ghost Kit template',
				'post_content' => wp_slash( $markup ),
			)
		);
		$published_template = self::factory()->post->create(
			array(
				'post_type'    => 'ghostkit_template',
				'post_author'  => $editor,
				'post_status'  => 'publish',
				'post_title'   => 'Published Ghost Kit template',
				'post_content' => wp_slash( $markup ),
			)
		);
		wp_set_object_terms( $template, 'Callouts', 'ghostkit_template_category' );
		delete_option( 'ghostkit_patterns_migrated' );


		$lock_name = 'ghostkit_patterns_migration_lock';
		add_option( $lock_name, time() . ':other-request', '', false );
		( new GhostKit_Migrations() )->init();
		$this->assertFalse( get_option( 'ghostkit_patterns_migrated' ) );
		$this->assertSame( 0, (int) wp_count_posts( 'wp_block' )->private );
		update_option( $lock_name, ( time() - HOUR_IN_SECONDS - 1 ) . ':crashed-request' );
		$fail = static function ( $empty, $post ) {
			return $empty || ( 'wp_block' === $post['post_type'] && 'private' === $post['post_status'] );
		};
		add_filter( 'wp_insert_post_empty_content', $fail, 10, 2 );

		try {
			( new GhostKit_Migrations() )->init();
			$this->assertFalse( get_option( 'ghostkit_patterns_migrated' ) );
			$this->assertSame( 1, (int) wp_count_posts( 'wp_block' )->{'auto-draft'} );
		} finally {
			remove_filter( 'wp_insert_post_empty_content', $fail );
		}

		( new GhostKit_Migrations() )->init();
		$this->assertTrue( (bool) get_option( 'ghostkit_patterns_migrated' ) );

		$patterns = get_posts(
			array(
				'post_type'   => 'wp_block',
				'post_status' => 'private',
				'meta_key'    => '_ghostkit_template_id', // phpcs:ignore WordPress.DB.SlowDBQuery
				'meta_value'  => $template, // phpcs:ignore WordPress.DB.SlowDBQuery
			)
		);
		$this->assertCount( 1, $patterns );

		$pattern = $patterns[0];
		$this->assertSame( 'Private Ghost Kit template', $pattern->post_title );
		$this->assertSame( $markup, $pattern->post_content );
		$this->assertSame( $editor, (int) $pattern->post_author );
		$this->assertSame( 'unsynced', get_post_meta( $pattern->ID, 'wp_pattern_sync_status', true ) );
		$this->assertSame( array( 'Callouts' ), wp_get_object_terms( $pattern->ID, 'wp_pattern_category', array( 'fields' => 'names' ) ) );
		$this->assertSame( $markup, get_post( $template )->post_content );
		$this->assertSame( $markup, get_post( $page )->post_content );
		$this->assertSame( $before, do_blocks( get_post( $page )->post_content ) );
		$this->assertStringContainsString( 'class="ghostkit-badge', $before );

		$this->assertFalse( user_can( $contributor, 'read_post', $pattern->ID ) );
		$other_editor = self::factory()->user->create( array( 'role' => 'editor' ) );
		$this->assertTrue( user_can( $other_editor, 'read_post', $pattern->ID ) );

		$route = '/wp/v2/blocks/' . $pattern->ID;
		wp_set_current_user( $contributor );
		$this->assertSame( 403, rest_do_request( $route )->get_status() );
		wp_set_current_user( $other_editor );
		$response = rest_do_request( $route );
		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( $markup, $response->get_data()['content']['raw'] );

		$context = new WP_Block_Editor_Context();
		$this->assertNotContains( $pattern->ID, wp_list_pluck( rest_do_request( '/wp/v2/blocks' )->get_data(), 'id' ) );
		$editor_patterns = get_block_editor_settings( array(), $context )['ghostkitReadablePatterns'] ?? array();
		$this->assertSame( $markup, array_column( $editor_patterns, 'content', 'id' )[ $pattern->ID ] );

		wp_set_current_user( $contributor );
		$editor_patterns = get_block_editor_settings( array(), $context )['ghostkitReadablePatterns'] ?? array();
		$this->assertArrayNotHasKey( $pattern->ID, array_column( $editor_patterns, 'content', 'id' ) );
		$native_list = new WP_REST_Request( 'GET', '/wp/v2/blocks' );
		$native_list->set_param( 'context', 'edit' );
		$native_titles   = wp_list_pluck( wp_list_pluck( rest_do_request( $native_list )->get_data(), 'title' ), 'raw' );
		$inserted_titles = array_merge( $native_titles, array_column( $editor_patterns, 'title' ) );
		$this->assertSame( array( 'Published Ghost Kit template' ), array_values( array_intersect( $inserted_titles, array( get_the_title( $published_template ) ) ) ) );
		wp_set_current_user( $other_editor );

		wp_update_post( array( 'ID' => $pattern->ID, 'post_title' => 'My revised pattern' ) );
		delete_option( 'ghostkit_patterns_migrated' );
		( new GhostKit_Migrations() )->init();

		$this->assertSame( 'My revised pattern', get_post( $pattern->ID )->post_title );
		$this->assertSame( 1, (int) wp_count_posts( 'wp_block' )->private );
		$this->assertSame( 0, (int) wp_count_posts( 'wp_block' )->{'auto-draft'} );
	}

	/**
	 * Retain scheduled dates and the state needed to restore or purge trash.
	 */
	public function test_preserves_future_and_trashed_template_visibility() {
		register_post_type( 'ghostkit_template' );
		delete_option( 'ghostkit_patterns_migrated' );

		$scheduled_at = gmdate( 'Y-m-d H:i:s', time() + DAY_IN_SECONDS );
		self::factory()->post->create(
			array(
				'post_type'     => 'ghostkit_template',
				'post_title'    => 'Scheduled template',
				'post_status'   => 'future',
				'post_date'     => get_date_from_gmt( $scheduled_at ),
				'post_date_gmt' => $scheduled_at,
			)
		);
		$trashed = self::factory()->post->create(
			array(
				'post_type'   => 'ghostkit_template',
				'post_status' => 'publish',
			)
		);
		wp_trash_post( $trashed );
		$trash_time = (string) ( time() - ( EMPTY_TRASH_DAYS + 1 ) * DAY_IN_SECONDS );
		update_post_meta( $trashed, '_wp_trash_meta_time', $trash_time );

		$scheduled_cleanup = static function ( $data ) {
			if ( 'wp_block' === $data['post_type'] && 'trash' === $data['post_status'] ) {
				wp_scheduled_delete();
			}

			return $data;
		};
		add_filter( 'wp_insert_post_data', $scheduled_cleanup );

		try {
			( new GhostKit_Migrations() )->init();
		} finally {
			remove_filter( 'wp_insert_post_data', $scheduled_cleanup );
		}

		$future = get_posts( array( 'post_type' => 'wp_block', 'post_status' => 'future' ) );
		$this->assertCount( 1, $future );
		$this->assertSame( $scheduled_at, $future[0]->post_date_gmt );
		$this->assertSame( 'Scheduled template', $future[0]->post_title );

		$trash = get_posts( array( 'post_type' => 'wp_block', 'post_status' => 'trash' ) );
		$this->assertCount( 1, $trash );
		$this->assertSame( 'publish', get_post_meta( $trash[0]->ID, '_wp_trash_meta_status', true ) );
		$this->assertSame( $trash_time, get_post_meta( $trash[0]->ID, '_wp_trash_meta_time', true ) );
		wp_scheduled_delete();
		$this->assertNull( get_post( $trash[0]->ID ) );
	}

	/**
	 * Expose the child file as a native pattern and fall back to the parent.
	 */
	public function test_theme_patterns_prefer_active_child_files() {
		$base     = dirname( __DIR__ ) . '/fixtures/';
		$parent   = static function () use ( $base ) {
			return $base . 'patterns-parent';
		};
		$child    = static function () use ( $base ) {
			return $base . 'patterns-child';
		};
		$name     = 'ghostkit/legacy-callout';
		$registry = WP_Block_Patterns_Registry::get_instance();

		add_filter( 'template_directory', $parent );
		add_filter( 'stylesheet_directory', $child );
		add_filter( 'should_load_remote_block_patterns', '__return_false' );
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'editor' ) ) );

		try {
			GhostKit_Patterns::register_theme_patterns();
			$pattern = $registry->get_registered( $name );
			$this->assertSame( 'Child callout', $pattern['title'] );
			$this->assertSame( array( 'ghostkit-columns' ), $pattern['categories'] );
			$this->assertStringContainsString( '<p>Child theme callout.</p>', $pattern['content'] );

			$response = rest_do_request( '/wp/v2/block-patterns/patterns' );
			$this->assertSame( 200, $response->get_status() );
			$patterns = array_column( $response->get_data(), null, 'name' );
			$this->assertSame( array( 'ghostkit-columns' ), $patterns[ $name ]['categories'] );

			unregister_block_pattern( $name );
			remove_filter( 'stylesheet_directory', $child );
			add_filter( 'stylesheet_directory', $parent );
			GhostKit_Patterns::register_theme_patterns();
			$this->assertStringContainsString( '<p>Parent theme callout.</p>', $registry->get_registered( $name )['content'] );
		} finally {
			remove_filter( 'should_load_remote_block_patterns', '__return_false' );
			remove_filter( 'template_directory', $parent );
			remove_filter( 'stylesheet_directory', $child );
			remove_filter( 'stylesheet_directory', $parent );
			if ( $registry->is_registered( $name ) ) {
				unregister_block_pattern( $name );
			}
			unregister_block_pattern_category( 'ghostkit-columns' );
		}
	}
}
