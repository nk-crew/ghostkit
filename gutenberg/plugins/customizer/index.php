<?php
/**
 * Customizer plugin.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Customizer_Plugin
 */
class GhostKit_Customizer_Plugin {
	/**
	 * Custom options.
	 *
	 * @var array
	 */
	public $custom_options = array();

	/**
	 * GhostKit_Customizer_Plugin constructor.
	 */
	public function __construct() {
		add_action( 'template_redirect', array( $this, 'maybe_find_options' ) );
		add_action( 'init', array( $this, 'register_meta' ) );

		add_action(
			'wp_loaded',
			function () {
				$allow_customizer = 'false';

				// Don't parse customizer controls if a block theme is activated and no plugins use the customizer.
				if ( ( function_exists( 'wp_is_block_theme' ) && ! wp_is_block_theme() ) || has_action( 'customize_register' ) ) {
					add_action( 'customize_register', array( $this, 'parse_customizer_controls' ), 99999 );
					$allow_customizer = 'true';
				}

				// Disable customizer settings from GhostKit.
				wp_add_inline_script( 'ghostkit-helper', 'if (ghostkitVariables) { ghostkitVariables.allowPluginCustomizer = ' . $allow_customizer . '; }', 'before' );
			},
			9
		);
	}

	/**
	 * Try to find meta data to replace options.
	 */
	public function maybe_find_options() {
		$this->custom_options = json_decode( urldecode( get_post_meta( get_queried_object_id(), 'ghostkit_customizer_options', true ) ), true );

		if ( $this->custom_options && ! empty( $this->custom_options ) ) {
			foreach ( $this->custom_options as $opt ) {
				add_filter( ( isset( $opt['type'] ) ? $opt['type'] : 'theme_mod' ) . '_' . $opt['id'], array( $this, 'replace_option' ) );
			}
		}
	}

	/**
	 * Replace option value.
	 *
	 * @param mixed $val - current option value.
	 *
	 * @return mixed
	 */
	public function replace_option( $val ) {
		if ( $this->custom_options && ! empty( $this->custom_options ) ) {
			$this_id = current_filter();

			foreach ( $this->custom_options as $opt ) {
				$id = ( isset( $opt['type'] ) ? $opt['type'] : 'theme_mod' ) . '_' . $opt['id'];
				if ( $id === $this_id ) {
					$val = $opt['value'];
				}
			}
		}
		return $val;
	}

	/**
	 * Register meta.
	 */
	public function register_meta() {
		register_meta(
			'post',
			'ghostkit_customizer_options',
			array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			)
		);
	}

	/**
	 * Prepare customizer data and save it to the options for further use.
	 *
	 * @param {object} $wp_customize - customizer data.
	 */
	public function parse_customizer_controls( $wp_customize ) {
		$settings = array();
		foreach ( $wp_customize->settings() as $setting ) {
			if ( isset( $setting->type ) && ( 'theme_mod' === $setting->type || 'option' === $setting->type ) ) {
				$control = $wp_customize->get_control( $setting->id );

				// get section and panel.
				$section = false;
				$panel   = false;

				if ( isset( $control->section ) ) {
					$section_object = $wp_customize->get_section( $control->section );
					if ( $section_object ) {
						$section = array(
							'id'          => isset( $section_object->id ) ? $section_object->id : false,
							'title'       => isset( $section_object->title ) ? $section_object->title : false,
							'description' => isset( $section_object->description ) ? $section_object->description : false,
						);
						if ( isset( $section_object->panel ) ) {
							$panel_object = $wp_customize->get_panel( $section_object->panel );
							if ( $panel_object ) {
								$panel = array(
									'id'          => isset( $panel_object->id ) ? $panel_object->id : false,
									'title'       => isset( $panel_object->title ) ? $panel_object->title : false,
									'description' => isset( $panel_object->description ) ? $panel_object->description : false,
								);
							}
						}
					}
				}

				// get control data.
				$settings[] = array(
					'id'           => $setting->id,
					'type'         => $setting->type,
					'default'      => $setting->default,
					'section'      => $section,
					'panel'        => $panel,
					'label'        => isset( $control->label ) ? $control->label : false,
					'description'  => isset( $control->description ) ? $control->description : false,
					'choices'      => isset( $control->choices ) ? $control->choices : false,
					'control_type' => isset( $control->type ) ? $control->type : false,
				);
			}
		}

		update_option( 'ghostkit_customizer_fields', $settings );
	}
}
new GhostKit_Customizer_Plugin();
