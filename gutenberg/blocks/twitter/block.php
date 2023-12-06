<?php
/**
 * Twitter block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Twitter_Block
 */
class GhostKit_Twitter_Block {
	/**
	 * GhostKit_Twitter_Block constructor.
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
	 * Get twitter feed from REST
	 *
	 * @param Array $data - data to get feed.
	 * @return array
	 */
	public function get_feed( $data ) {
		$request = new WP_REST_Request( 'GET', '/ghostkit/v1/get_twitter_feed' );
		$request->set_query_params( $data );
		$response = rest_do_request( $request );
		$server   = rest_get_server();
		$data     = $server->response_to_data( $response, false );

		return isset( $data['response'] ) && isset( $data['success'] ) && $data['success'] ? $data['response'] : false;
	}

	/**
	 * Get twitter profile from REST
	 *
	 * @param Array $data - data to get profile.
	 * @return array
	 */
	public function get_profile( $data ) {
		$request = new WP_REST_Request( 'GET', '/ghostkit/v1/get_twitter_profile' );
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
		ob_start();

		$attributes = array_merge(
			array(
				'variant'                => 'default',
				'consumerKey'            => '',
				'consumerSecret'         => '',
				'accessToken'            => '',
				'accessTokenSecret'      => '',
				'userName'               => 'nkdevv',

				'count'                  => 3,
				'showReplies'            => false,
				'showRetweets'           => true,
				'showFeedAvatar'         => true,
				'feedAvatarSize'         => 48,
				'showFeedName'           => true,
				'showFeedDate'           => true,
				'feedTextMode'           => '',
				'feedTextConvertLinks'   => 'links_media',
				'showFeedActions'        => true,

				'showProfile'            => true,
				'showProfileAvatar'      => true,
				'profileAvatarSize'      => 70,
				'showProfileName'        => true,
				'showProfileStats'       => true,
				'showProfileDescription' => true,
				'showProfileWebsite'     => true,
				'showProfileLocation'    => true,

				'className'              => '',
			),
			$attributes
		);

		$api_data_ready = $attributes['consumerKey'] && $attributes['consumerSecret'] && $attributes['accessToken'] && $attributes['accessTokenSecret'];

		$attributes['showProfile'] = $attributes['showProfile'] && ( $attributes['showProfileAvatar'] || $attributes['showProfileName'] || $attributes['showProfileDescription'] || $attributes['showProfileWebsite'] || $attributes['showProfileStats'] || $attributes['showProfileLocation'] );

		$class = 'ghostkit-twitter';

		// variant classname.
		if ( 'default' !== $attributes['variant'] ) {
			$class .= ' ghostkit-twitter-variant-' . $attributes['variant'];
		}

		if ( $attributes['className'] ) {
			$class .= ' ' . $attributes['className'];
		}

		if ( $api_data_ready && $attributes['userName'] ) {
			$profile = $this->get_profile(
				array(
					'consumer_key'        => $attributes['consumerKey'],
					'consumer_secret'     => $attributes['consumerSecret'],
					'access_token'        => $attributes['accessToken'],
					'access_token_secret' => $attributes['accessTokenSecret'],
					'screen_name'         => $attributes['userName'],
				)
			);
			$feed    = $this->get_feed(
				array(
					'consumer_key'        => $attributes['consumerKey'],
					'consumer_secret'     => $attributes['consumerSecret'],
					'access_token'        => $attributes['accessToken'],
					'access_token_secret' => $attributes['accessTokenSecret'],
					'count'               => $attributes['count'],
					'exclude_replies'     => $attributes['showReplies'] ? 'false' : 'true',
					'include_rts'         => $attributes['showRetweets'] ? 'true' : 'false',
					'tweet_mode_extended' => 'full' === $attributes['feedTextMode'] ? 'true' : 'false',
					'screen_name'         => $attributes['userName'],
				)
			);

			if ( $feed || $profile ) {
				?>
				<div class="<?php echo esc_attr( $class ); ?>">
					<?php
					if ( $profile && $attributes['showProfile'] ) {
						?>
						<div class="ghostkit-twitter-profile">
							<?php
							$url = 'https://twitter.com/' . $profile['screen_name'] . '/';
							?>
							<?php if ( $attributes['showProfileAvatar'] && isset( $profile['profile_images_https'] ) ) : ?>
								<div class="ghostkit-twitter-profile-avatar">
									<a href="<?php echo esc_url( $url ); ?>" target="_blank"><img src="<?php echo esc_url( $profile['profile_images_https']['original'] ); ?>" alt="<?php echo esc_attr( $profile['name'] ); ?>" width="<?php echo esc_attr( $attributes['profileAvatarSize'] ); ?>" height="<?php echo esc_attr( $attributes['profileAvatarSize'] ); ?>" /></a>
								</div>
							<?php endif; ?>
							<div class="ghostkit-twitter-profile-side">
								<?php if ( $attributes['showProfileName'] && isset( $profile['name'] ) ) : ?>
									<div class="ghostkit-twitter-profile-name">
										<h2 class="ghostkit-twitter-profile-fullname">
											<a href="<?php echo esc_url( $url ); ?>" target="_blank"><?php echo esc_html( $profile['name'] ); ?></a>
											<?php if ( $profile['verified'] ) : ?>
												<span class="ghostkit-twitter-profile-verified"><?php echo esc_html__( 'Verified account', 'ghostkit' ); ?></span>
											<?php endif; ?>
										</h2>
										<h3 class="ghostkit-twitter-profile-username">
											<a href="<?php echo esc_url( $url ); ?>" target="_blank">@<?php echo esc_html( $profile['screen_name'] ); ?></a>
										</h3>
									</div>
								<?php endif; ?>
								<?php if ( $attributes['showProfileStats'] ) : ?>
									<div class="ghostkit-twitter-profile-stats">
										<div>
											<strong><?php echo esc_html( $profile['statuses_count_short'] ); ?></strong> <span><?php echo esc_html__( 'Tweets', 'ghostkit' ); ?></span>
										</div>
										<div>
											<strong><?php echo esc_html( $profile['friends_count_short'] ); ?></strong> <span><?php echo esc_html__( 'Following', 'ghostkit' ); ?></span>
										</div>
										<div>
											<strong><?php echo esc_html( $profile['followers_count_short'] ); ?></strong> <span><?php echo esc_html__( 'Followers', 'ghostkit' ); ?></span>
										</div>
									</div>
								<?php endif; ?>
								<?php if ( $attributes['showProfileDescription'] && isset( $profile['description_entitled'] ) && $profile['description_entitled'] ) : ?>
									<div class="ghostkit-twitter-profile-description"><?php echo wp_kses_post( $profile['description_entitled'] ); ?></div>
								<?php endif; ?>
								<?php if ( $attributes['showProfileWebsite'] && isset( $profile['url_entitled'] ) && $profile['url_entitled'] ) : ?>
									<div class="ghostkit-twitter-profile-website">
										<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.348 7.40994L14.378 5.37894C14.9421 4.82384 15.7027 4.51411 16.4941 4.51724C17.2855 4.52037 18.0436 4.8361 18.6033 5.39565C19.163 5.9552 19.4789 6.71324 19.4822 7.50465C19.4855 8.29606 19.176 9.05672 18.621 9.62094L15.621 12.6209C15.3171 12.9248 14.9514 13.1598 14.5488 13.3101C14.1462 13.4604 13.7159 13.5224 13.2873 13.492C12.8586 13.4616 12.4414 13.3394 12.064 13.1337C11.6867 12.928 11.3579 12.6437 11.1 12.2999C10.9804 12.1408 10.8025 12.0357 10.6054 12.0077C10.4083 11.9798 10.2081 12.0313 10.049 12.1509C9.8899 12.2705 9.7848 12.4484 9.75686 12.6455C9.72892 12.8426 9.78041 13.0428 9.90003 13.2019C10.2869 13.7176 10.7801 14.1442 11.3462 14.4527C11.9123 14.7612 12.5381 14.9445 13.1812 14.9901C13.8243 15.0357 14.4697 14.9426 15.0737 14.7171C15.6777 14.4915 16.2262 14.1388 16.682 13.6829L19.682 10.6829C20.1082 10.2669 20.4475 9.77059 20.6804 9.22251C20.9133 8.67443 21.0351 8.08558 21.0387 7.49008C21.0423 6.89459 20.9277 6.30429 20.7016 5.75342C20.4754 5.20254 20.1421 4.70204 19.721 4.28092C19.3 3.8598 18.7995 3.52644 18.2487 3.30016C17.6978 3.07388 17.1076 2.95919 16.5121 2.96273C15.9166 2.96626 15.3277 3.08796 14.7796 3.32077C14.2315 3.55357 13.735 3.89285 13.319 4.31894L11.289 6.34894C11.1523 6.49033 11.0766 6.67975 11.0782 6.8764C11.0799 7.07305 11.1586 7.26119 11.2976 7.40032C11.4366 7.53944 11.6247 7.6184 11.8213 7.6202C12.018 7.62201 12.2075 7.5465 12.349 7.40994H12.348ZM5.37803 14.3789L8.37803 11.3789C8.68201 11.0747 9.04784 10.8395 9.45072 10.689C9.8536 10.5386 10.2841 10.4766 10.713 10.5071C11.142 10.5377 11.5593 10.6601 11.9369 10.866C12.3144 11.072 12.6432 11.3567 12.901 11.7009C13.0206 11.86 13.1985 11.9651 13.3956 11.9931C13.5927 12.021 13.7929 11.9695 13.952 11.8499C14.1111 11.7303 14.2162 11.5524 14.2442 11.3553C14.2721 11.1582 14.2206 10.958 14.101 10.7989C13.7141 10.2832 13.2209 9.85667 12.6548 9.54816C12.0887 9.23965 11.4629 9.05638 10.8198 9.01077C10.1767 8.96516 9.5313 9.05827 8.92731 9.28379C8.32332 9.50932 7.77485 9.862 7.31903 10.3179L4.31803 13.3179C3.47411 14.1618 3 15.3064 3 16.4999C3 17.6934 3.47411 18.838 4.31803 19.6819C5.16195 20.5258 6.30655 20.9999 7.50003 20.9999C8.69351 20.9999 9.83811 20.5258 10.682 19.6819L12.712 17.6519C12.8487 17.5105 12.9244 17.3211 12.9228 17.1245C12.9211 16.9278 12.8424 16.7397 12.7034 16.6005C12.5644 16.4614 12.3763 16.3824 12.1796 16.3806C11.983 16.3788 11.7935 16.4543 11.652 16.5909L9.62203 18.6209C9.34432 18.9032 9.01346 19.1278 8.64854 19.2816C8.28361 19.4354 7.89184 19.5155 7.49582 19.5172C7.09981 19.5188 6.70738 19.442 6.34118 19.2913C5.97498 19.1405 5.64225 18.9187 5.36219 18.6387C5.08212 18.3588 4.86027 18.0261 4.70942 17.6599C4.55857 17.2937 4.48171 16.9013 4.48328 16.5053C4.48484 16.1093 4.5648 15.7175 4.71854 15.3525C4.87228 14.9876 5.09676 14.6567 5.37903 14.3789H5.37803Z" fill="currentColor"/></svg>
										<?php echo wp_kses_post( $profile['url_entitled'] ); ?>
									</div>
								<?php endif; ?>
								<?php if ( $attributes['showProfileLocation'] && isset( $profile['location'] ) && $profile['location'] ) : ?>
									<div class="ghostkit-twitter-profile-location">
										<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2806 20.6368C5.98328 13.2316 5 12.4715 5 9.75C5 6.02207 8.13399 3 12 3C15.866 3 19 6.02207 19 9.75C19 12.4715 18.0167 13.2316 12.7194 20.6368C12.3718 21.1211 11.6282 21.121 11.2806 20.6368ZM12 12.5625C13.6108 12.5625 14.9167 11.3033 14.9167 9.75C14.9167 8.19669 13.6108 6.9375 12 6.9375C10.3892 6.9375 9.08333 8.19669 9.08333 9.75C9.08333 11.3033 10.3892 12.5625 12 12.5625Z" fill="currentColor"/></svg>
										<?php echo esc_html( $profile['location'] ); ?>
									</div>
								<?php endif; ?>
							</div>
						</div>
						<?php
					}

					if ( $feed ) {
						?>
						<div class="ghostkit-twitter-items">
							<?php
							foreach ( $feed as $item ) {
								$old_item   = $item;
								$is_retweet = false;

								if ( isset( $item['retweeted_status'] ) ) {
									$item       = $item['retweeted_status'];
									$is_retweet = true;
								}

								$url = 'https://twitter.com/' . $item['user']['screen_name'] . '/status/' . $item['id_str'];
								?>
								<div class="ghostkit-twitter-item">
									<?php if ( $attributes['showFeedAvatar'] ) : ?>
										<div class="ghostkit-twitter-item-avatar">
											<?php if ( $is_retweet ) : ?>
												<br>
											<?php endif; ?>
											<a href="https://twitter.com/<?php echo esc_attr( $item['user']['screen_name'] ); ?>/" target="_blank">
												<img src="<?php echo esc_url( $item['user']['profile_images_https']['bigger'] ); ?>" alt="<?php echo esc_attr( $item['user']['screen_name'] ); ?>" width="<?php echo esc_attr( $attributes['feedAvatarSize'] ); ?>" height="<?php echo esc_attr( $attributes['feedAvatarSize'] ); ?>">
											</a>
										</div>
									<?php endif; ?>
									<div class="ghostkit-twitter-item-content">
										<?php if ( $is_retweet ) : ?>
											<div class="ghostkit-twitter-item-retweeted">
												<span class="ghostkit-twitter-item-retweeted-icon"><svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16L19 19L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 6L15.6667 6C16.5507 6 17.3986 6.30436 18.0237 6.84614C18.6488 7.38791 19 8.12271 19 8.88889L19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 9L5 6L8 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L8.33333 19C7.44928 19 6.60143 18.6956 5.97631 18.1539C5.35119 17.6121 5 16.8773 5 16.1111L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
												<a href="https://twitter.com/<?php echo esc_attr( $old_item['user']['screen_name'] ); ?>/" target="_blank">
													<strong><?php echo esc_html( $old_item['user']['name'] ); ?></strong>
												</a>
												<?php echo esc_html__( 'Retweeted', 'ghostkit' ); ?>
											</div>
										<?php endif; ?>
										<?php if ( $attributes['showFeedName'] || $attributes['showFeedDate'] ) : ?>
											<div class="ghostkit-twitter-item-meta">
												<?php if ( $attributes['showFeedName'] ) : ?>
													<div class="ghostkit-twitter-item-meta-name">
														<a href="https://twitter.com/<?php echo esc_attr( $item['user']['screen_name'] ); ?>/" target="_blank">
															<strong><?php echo esc_html( $item['user']['name'] ); ?></strong>
															<?php if ( $item['user']['verified'] ) : ?>
																<span class="ghostkit-twitter-item-meta-name-verified"><?php echo esc_html__( 'Verified account', 'ghostkit' ); ?></span>
															<?php endif; ?>
															<span>@<?php echo esc_html( $item['user']['screen_name'] ); ?></span>
														</a>
													</div>
												<?php endif; ?>
												<?php if ( $attributes['showFeedDate'] ) : ?>
													<div class="ghostkit-twitter-item-meta-date">
														<a href="<?php echo esc_url( $url ); ?>" target="_blank"><?php echo esc_html( $item['date_formatted'] ); ?></a>
													</div>
												<?php endif; ?>
											</div>
										<?php endif; ?>
										<?php if ( 'links_media' === $attributes['feedTextConvertLinks'] ) : ?>
											<div class="ghostkit-twitter-item-text"><?php echo wp_kses_post( $item['text_entitled'] ); ?></div>
										<?php elseif ( 'links' === $attributes['feedTextConvertLinks'] ) : ?>
											<div class="ghostkit-twitter-item-text"><?php echo wp_kses_post( $item['text_entitled_no_media'] ); ?></div>
										<?php else : ?>
											<div class="ghostkit-twitter-item-text"><?php echo wp_kses_post( $item['text'] ); ?></div>
										<?php endif; ?>
										<?php if ( $attributes['showFeedActions'] ) : ?>
											<div class="ghostkit-twitter-item-actions">
												<div class="ghostkit-twitter-item-actions-retweet">
													<a href="<?php echo esc_url( $url ); ?>" target="_blank">
														<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16L19 19L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 6L15.6667 6C16.5507 6 17.3986 6.30436 18.0237 6.84614C18.6488 7.38791 19 8.12271 19 8.88889L19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 9L5 6L8 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L8.33333 19C7.44928 19 6.60143 18.6956 5.97631 18.1539C5.35119 17.6121 5 16.8773 5 16.1111L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
														<?php if ( $item['retweet_count_short'] ) : ?>
															<span><?php echo esc_html( $item['retweet_count_short'] ); ?></span>
														<?php endif; ?>
													</a>
												</div>
												<div class="ghostkit-twitter-item-actions-like">
													<a href="<?php echo esc_url( $url ); ?>" target="_blank">
														<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.25 5C5.41421 5 3.5 6.66421 3.5 9C3.5 11.7695 5.57359 14.3251 7.86118 16.2727C8.98201 17.2269 10.1066 17.9947 10.9527 18.5245C11.375 18.7889 11.726 18.9928 11.9699 19.1298C11.9801 19.1356 11.9901 19.1412 12 19.1467C12.0098 19.1412 12.0199 19.1356 12.0301 19.1298C12.274 18.9928 12.625 18.7889 13.0473 18.5245C13.8934 17.9947 15.018 17.2269 16.1388 16.2727C18.4264 14.3251 20.5 11.7695 20.5 9C20.5 6.66421 18.5858 5 16.75 5C14.8879 5 13.3816 6.22683 12.7115 8.23717C12.6094 8.54343 12.3228 8.75 12 8.75C11.6772 8.75 11.3906 8.54343 11.2885 8.23717C10.6184 6.22683 9.11212 5 7.25 5ZM12 20C11.6574 20.6672 11.6572 20.6671 11.6569 20.6669L11.6479 20.6623L11.6251 20.6504C11.6057 20.6402 11.5777 20.6254 11.5418 20.6062C11.4699 20.5676 11.3662 20.5112 11.2352 20.4376C10.9732 20.2904 10.6016 20.0744 10.1567 19.7958C9.26844 19.2397 8.08049 18.4294 6.88882 17.4148C4.5514 15.4249 2 12.4805 2 9C2 5.83579 4.58579 3.5 7.25 3.5C9.30732 3.5 10.9728 4.57857 12 6.23441C13.0272 4.57857 14.6927 3.5 16.75 3.5C19.4142 3.5 22 5.83579 22 9C22 12.4805 19.4486 15.4249 17.1112 17.4148C15.9195 18.4294 14.7316 19.2397 13.8433 19.7958C13.3984 20.0744 13.0268 20.2904 12.7648 20.4376C12.6338 20.5112 12.5301 20.5676 12.4582 20.6062C12.4223 20.6254 12.3943 20.6402 12.3749 20.6504L12.3521 20.6623L12.3431 20.6669C12.3428 20.6671 12.3426 20.6672 12 20ZM12 20L12.3426 20.6672C12.1276 20.7776 11.8724 20.7776 11.6574 20.6672L12 20Z" fill="currentColor"/></svg>
														<?php if ( $item['favorite_count_short'] ) : ?>
															<span><?php echo esc_html( $item['favorite_count_short'] ); ?></span>
														<?php endif; ?>
													</a>
												</div>
											</div>
										<?php endif; ?>
									</div>
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
new GhostKit_Twitter_Block();
