<?php
/**
 * Scss Compiler
 *
 * @package ghostkit
 */

/**
 * GhostKit_Scss_Compiler
 */
class GhostKit_Scss_Compiler {
	/**
	 * Arguments for compile scss file
	 *
	 * @var array
	 */
	private $args;

	/**
	 * Information about folders and name input scss file
	 *
	 * @var array
	 */
	private $input_file_info;

	/**
	 * Information about folders and name output css file
	 *
	 * @var array
	 */
	private $output_file_info;

	/**
	 * Input SCSS file content.
	 *
	 * @var string
	 */
	private $scss_in;

	/**
	 * GhostKit_Scss_Compiler constructor.
	 *
	 * @param array $args - Arguments for compile scss file.
	 */
	public function __construct( $args = null ) {
		$this->args = $args;

		if ( $this->validation_of_arguments() ) {
			$this->input_file_info  = pathinfo( $this->args['input_file'] );
			$this->output_file_info = pathinfo( $this->args['output_file'] );
			$this->scss_in          = $this->get_input_file_contents( $this->args['input_file'] );
			$is_dir                 = $this->check_and_create_non_exist_output_folder();

			if (
				$this->scss_in &&
				$is_dir &&
				isset( $this->input_file_info['dirname'] ) &&
				! empty( $this->input_file_info['dirname'] )
			) {
				$this->scss();
			}
		}
	}

	/**
	 * Compilation scss and save css output file.
	 *
	 * @return void
	 */
	private function scss() {
		require_once ghostkit()->plugin_path . 'composer-libraries/vendor/autoload.php';

		$scss = new ScssPhp\ScssPhp\Compiler();
		$scss->setOutputStyle( ScssPhp\ScssPhp\OutputStyle::COMPRESSED );
		$scss->addImportPath( $this->input_file_info['dirname'] );
		$scss->setVariables( $this->args['variables'] );

		// Compile scss.
		$result = $scss->compile( $this->scss_in );

		// Prepare RTL.
		$parser = new Sabberworm\CSS\Parser( $result );
		$tree   = $parser->parse();
		$rtlcss = new MoodleHQ\RTLCSS\RTLCSS( $tree );
		$rtlcss->flip();

        // phpcs:ignore
        file_put_contents( trailingslashit( $this->output_file_info['dirname'] ) . '/' . $this->output_file_info['basename'], $result );

        // phpcs:ignore
        file_put_contents(
			trailingslashit( $this->output_file_info['dirname'] ) . '/' . $this->input_file_info['filename'] . '-rtl.min.' . $this->output_file_info['extension'],
			$tree->render()
		);
	}

	/**
	 * Validation of compile arguments.
	 *
	 * @return bool
	 */
	private function validation_of_arguments() {
		$validation = false;

		if (
			! empty( $this->args ) &&
			is_array( $this->args ) &&
			isset( $this->args['input_file'] ) &&
			isset( $this->args['output_file'] ) &&
			isset( $this->args['variables'] )
		) {
			$validation = true;
		}

		return $validation;
	}

	/**
	 * Get content of input scss file.
	 *
	 * @param string $file_name - Absolute path to file.
	 * @return string
	 */
	private function get_input_file_contents( $file_name ) {
		$contents = false;
		if ( file_exists( $file_name ) ) {
            // phpcs:ignore
            $contents = file_get_contents( $file_name );
		}

		return $contents;
	}

	/**
	 * Check and Create non exist output folder.
	 *
	 * @return bool
	 */
	private function check_and_create_non_exist_output_folder() {
		$is_dir = false;

		if (
			isset( $this->output_file_info['dirname'] )
		) {
			$dirname = $this->output_file_info['dirname'];
			$is_dir  = is_dir( $dirname );
			if ( ! $is_dir ) {
				$is_dir = mkdir( $dirname, 0777, true );
			}
		}

		return $is_dir;
	}
}
