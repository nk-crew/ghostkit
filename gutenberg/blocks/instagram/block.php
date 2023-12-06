<?php
/**
 * Instagram block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Instagram_Block
 */
class GhostKit_Instagram_Block {
	/**
	 * GhostKit_Instagram_Block constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

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
	 * Get instagram feed from REST
	 *
	 * @param Array $data - data to get feed.
	 * @return array
	 */
	public function get_feed( $data ) {
		$request = new WP_REST_Request( 'GET', '/ghostkit/v1/get_instagram_feed' );
		$request->set_query_params( $data );
		$response = rest_do_request( $request );
		$server   = rest_get_server();
		$data     = $server->response_to_data( $response, false );
		$data     = isset( $data['response'] ) ? $data['response'] : false;

		return isset( $data['data'] ) ? $data['data'] : false;
	}

	/**
	 * Get instagram profile from REST
	 *
	 * @param Array $data - data to get profile.
	 * @return array
	 */
	public function get_profile( $data ) {
		$request = new WP_REST_Request( 'GET', '/ghostkit/v1/get_instagram_profile' );
		$request->set_query_params( $data );
		$response = rest_do_request( $request );
		$server   = rest_get_server();
		$data     = $server->response_to_data( $response, false );
		$data     = isset( $data['response'] ) ? $data['response'] : false;

		return isset( $data['data'] ) ? $data['data'] : false;
	}

	/**
	 * Register gutenberg block output
	 *
	 * @param array $attributes - block attributes.
	 *
	 * @return string
	 */
	public function block_render( $attributes ) {
		ob_start();

		$attributes = array_merge(
			array(
				'variant'            => 'default',
				'accessToken'        => '',
				'count'              => 8,
				'columns'            => 4,
				'gap'                => 'sm',
				'showProfile'        => true,
				'showProfileAvatar'  => true,
				'profileAvatarSize'  => 70,
				'showProfileName'    => true,
				'showProfileBio'     => true,
				'showProfileWebsite' => true,
				'showProfileStats'   => true,
				'className'          => '',
			),
			$attributes
		);

		$attributes['showProfile'] = $attributes['showProfile'] && ( $attributes['showProfileAvatar'] || $attributes['showProfileName'] || $attributes['showProfileBio'] || $attributes['showProfileWebsite'] || $attributes['showProfileStats'] );

		$class = 'ghostkit-instagram';

		// variant classname.
		if ( 'default' !== $attributes['variant'] ) {
			$class .= ' ghostkit-instagram-variant-' . $attributes['variant'];
		}

		if ( $attributes['gap'] ) {
			$class .= ' ghostkit-instagram-gap-' . $attributes['gap'];
		}

		if ( $attributes['columns'] ) {
			$class .= ' ghostkit-instagram-columns-' . $attributes['columns'];
		}

		if ( $attributes['className'] ) {
			$class .= ' ' . $attributes['className'];
		}

		if ( $attributes['accessToken'] ) {
			$feed    = $this->get_feed(
				array(
					'access_token' => $attributes['accessToken'],
					'count'        => $attributes['count'],
				)
			);
			$profile = $this->get_profile(
				array(
					'access_token' => $attributes['accessToken'],
				)
			);

			if ( $feed || $profile ) {
				?>
				<div class="<?php echo esc_attr( $class ); ?>">
					<?php
					if ( $profile && $attributes['showProfile'] ) {
						$url = 'https://www.instagram.com/' . esc_attr( $profile['username'] ) . '/';

						?>
						<div class="ghostkit-instagram-profile">
							<?php if ( $attributes['showProfileAvatar'] && isset( $profile['profile_picture'] ) ) : ?>
								<div class="ghostkit-instagram-profile-avatar">
									<a href="<?php echo esc_url( $url ); ?>" target="_blank"><img src="<?php echo esc_url( $profile['profile_picture'] ); ?>" alt="<?php echo esc_attr( $profile['full_name'] ); ?>" width="<?php echo esc_attr( $attributes['profileAvatarSize'] ); ?>" height="<?php echo esc_attr( $attributes['profileAvatarSize'] ); ?>" /></a>
								</div>
							<?php endif; ?>
							<div class="ghostkit-instagram-profile-side">
								<?php if ( $attributes['showProfileName'] && isset( $profile['full_name'] ) ) : ?>
									<div class="ghostkit-instagram-profile-name">
										<a href="<?php echo esc_url( $url ); ?>" target="_blank"><?php echo esc_html( $profile['username'] ); ?></a>
									</div>
								<?php endif; ?>
								<?php if ( $attributes['showProfileStats'] && isset( $profile['counts'] ) ) : ?>
									<div class="ghostkit-instagram-profile-stats">
										<div>
											<strong><?php echo esc_html( $profile['counts']['media'] ); ?></strong> <span><?php echo esc_html__( 'Posts', 'ghostkit' ); ?></span>
										</div>
										<div>
											<strong><?php echo esc_html( $profile['counts']['followed_by'] ); ?></strong> <span><?php echo esc_html__( 'Followers', 'ghostkit' ); ?></span>
										</div>
										<div>
											<strong><?php echo esc_html( $profile['counts']['follows'] ); ?></strong> <span><?php echo esc_html__( 'Following', 'ghostkit' ); ?></span>
										</div>
									</div>
								<?php endif; ?>
								<?php if ( $attributes['showProfileBio'] && isset( $profile['bio'] ) ) : ?>
									<div class="ghostkit-instagram-profile-bio">
										<h2><?php echo esc_html( $profile['full_name'] ); ?></h2>
										<div><?php echo wp_kses_post( $profile['bio'] ); ?></div>
									</div>
								<?php endif; ?>
								<?php if ( $attributes['showProfileWebsite'] && isset( $profile['website'] ) ) : ?>
									<div class="ghostkit-instagram-profile-website">
										<a href="<?php echo esc_url( $profile['website'] ); ?>" target="_blank"><?php echo esc_url( $profile['website'] ); ?></a>
									</div>
								<?php endif; ?>
							</div>
						</div>
						<?php
					}
					if ( $feed ) {
						?>
						<div class="ghostkit-instagram-items">
							<?php
							foreach ( $feed as $item ) {
								?>
								<div class="ghostkit-instagram-item">
									<a href="<?php echo esc_url( $item['link'] ); ?>" target="_blank">
										<img
											src="<?php echo esc_url( $item['images']['standard_resolution']['url'] ); ?>"
											width="<?php echo esc_attr( $item['images']['standard_resolution']['width'] ); ?>"
											height="<?php echo esc_attr( $item['images']['standard_resolution']['height'] ); ?>"
											alt="<?php echo esc_attr( isset( $item['caption']['text'] ) ? $item['caption']['text'] : '' ); ?>"
										>
									</a>
								</div>
								<?php
							}
							?>
						</div>
						<?php
					}
					?>
				</div>
				<?php
			}
		}

		return ob_get_clean();
	}
}
new GhostKit_Instagram_Block();
