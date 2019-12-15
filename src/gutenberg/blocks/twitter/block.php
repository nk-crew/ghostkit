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
        if ( function_exists( 'register_block_type' ) ) {
            register_block_type(
                'ghostkit/twitter',
                array(
                    'render_callback' => array( $this, 'block_render' ),
                )
            );
        }
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
                                                <span class="ghostkit-twitter-profile-verified"><?php echo esc_html__( 'Verified account', '@@text_domain' ); ?></span>
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
                                            <strong><?php echo esc_html( $profile['statuses_count_short'] ); ?></strong> <span><?php echo esc_html__( 'Tweets', '@@text_domain' ); ?></span>
                                        </div>
                                        <div>
                                            <strong><?php echo esc_html( $profile['friends_count_short'] ); ?></strong> <span><?php echo esc_html__( 'Following', '@@text_domain' ); ?></span>
                                        </div>
                                        <div>
                                            <strong><?php echo esc_html( $profile['followers_count_short'] ); ?></strong> <span><?php echo esc_html__( 'Followers', '@@text_domain' ); ?></span>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                <?php if ( $attributes['showProfileDescription'] && isset( $profile['description_entitled'] ) && $profile['description_entitled'] ) : ?>
                                    <div class="ghostkit-twitter-profile-description">
                                        <?php echo wp_kses_post( $profile['description_entitled'] ); ?>
                                    </div>
                                <?php endif; ?>
                                <?php if ( $attributes['showProfileWebsite'] && isset( $profile['url_entitled'] ) && $profile['url_entitled'] ) : ?>
                                    <div class="ghostkit-twitter-profile-website">
                                        <span class="fas fa-link"></span> <?php echo wp_kses_post( $profile['url_entitled'] ); ?>
                                    </div>
                                <?php endif; ?>
                                <?php if ( $attributes['showProfileLocation'] && isset( $profile['location'] ) && $profile['location'] ) : ?>
                                    <div class="ghostkit-twitter-profile-location">
                                        <span class="fas fa-map-marker-alt"></span> <?php echo esc_html( $profile['location'] ); ?>
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
                                                <span class="ghostkit-twitter-item-retweeted-icon"><span class="fas fa-retweet"></span></span>
                                                <a href="https://twitter.com/<?php echo esc_attr( $old_item['user']['screen_name'] ); ?>/" target="_blank">
                                                    <strong><?php echo esc_html( $old_item['user']['name'] ); ?></strong>
                                                </a>
                                                <?php echo esc_html__( 'Retweeted', '@@text_domain' ); ?>
                                            </div>
                                        <?php endif; ?>
                                        <?php if ( $attributes['showFeedName'] || $attributes['showFeedDate'] ) : ?>
                                            <div class="ghostkit-twitter-item-meta">
                                                <?php if ( $attributes['showFeedName'] ) : ?>
                                                    <div class="ghostkit-twitter-item-meta-name">
                                                        <a href="https://twitter.com/<?php echo esc_attr( $item['user']['screen_name'] ); ?>/" target="_blank">
                                                            <strong><?php echo esc_html( $item['user']['name'] ); ?></strong>
                                                            <?php if ( $item['user']['verified'] ) : ?>
                                                                <span class="ghostkit-twitter-item-meta-name-verified"><?php echo esc_html__( 'Verified account', '@@text_domain' ); ?></span>
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
                                                        <span class="fas fa-retweet"></span>
                                                        <?php if ( $item['retweet_count_short'] ) : ?>
                                                            <span><?php echo esc_html( $item['retweet_count_short'] ); ?></span>
                                                        <?php endif; ?>
                                                    </a>
                                                </div>
                                                <div class="ghostkit-twitter-item-actions-like">
                                                    <a href="<?php echo esc_url( $url ); ?>" target="_blank">
                                                        <span class="far fa-heart"></span>
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
