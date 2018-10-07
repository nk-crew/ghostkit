// Import CSS
import './editor.scss';
import './style.scss';

// external Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import ElementIcon from '../_icons/twitter.svg';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    SelectControl,
    PanelBody,
    Placeholder,
    TextControl,
    RangeControl,
    ToggleControl,
    Spinner,
} = wp.components;

const { apiFetch } = wp;
const {
    registerStore,
    withSelect,
} = wp.data;

const {
    InspectorControls,
} = wp.editor;

const actions = {
    setTwitterFeed( query, feed ) {
        return {
            type: 'SET_TWITTER_FEED',
            query,
            feed,
        };
    },
    getTwitterFeed( query ) {
        return {
            type: 'GET_TWITTER_FEED',
            query,
        };
    },
    setTwitterProfile( query, profile ) {
        return {
            type: 'SET_TWITTER_PROFILE',
            query,
            profile,
        };
    },
    getTwitterProfile( query ) {
        return {
            type: 'GET_TWITTER_PROFILE',
            query,
        };
    },
};
registerStore( 'ghostkit/twitter', {
    reducer( state = { feeds: {}, profiles: {} }, action ) {
        switch ( action.type ) {
        case 'SET_TWITTER_FEED':
            if ( ! state.feeds[ action.query ] && action.feed ) {
                state.feeds[ action.query ] = action.feed;
            }
            return state;
        case 'GET_TWITTER_FEED':
            return action.feeds[ action.query ];
        case 'SET_TWITTER_PROFILE':
            if ( ! state.profiles[ action.query ] && action.profile ) {
                state.profiles[ action.query ] = action.profile;
            }
            return state;
        case 'GET_TWITTER_PROFILE':
            return action.profiles[ action.query ];
        // no default
        }
        return state;
    },
    actions,
    selectors: {
        getTwitterFeed( state, query ) {
            return state.feeds[ query ];
        },
        getTwitterProfile( state, query ) {
            return state.profiles[ query ];
        },
    },
    resolvers: {
        * getTwitterFeed( state, query ) {
            const feed = apiFetch( { path: query } )
                .then( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.success && fetchedData.response ) {
                        return actions.setTwitterFeed( query, fetchedData.response );
                    }
                    return false;
                } );
            yield feed;
        },
        * getTwitterProfile( state, query ) {
            const profile = apiFetch( { path: query } )
                .then( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.success && fetchedData.response ) {
                        return actions.setTwitterProfile( query, fetchedData.response );
                    }
                    return false;
                } );
            yield profile;
        },
    },
} );

class TwitterBlock extends Component {
    render() {
        const {
            setAttributes,
            attributes,
            twitterFeed,
            twitterProfile,
        } = this.props;

        let {
            className,
        } = this.props;

        const {
            consumerKey,
            consumerSecret,
            accessToken,
            accessTokenSecret,

            userName,
            count,

            showReplies,
            showRetweets,
            showFeedAvatar,
            feedAvatarSize,
            showFeedName,
            showFeedDate,
            feedTextConvertLinks,
            showFeedActions,

            showProfile,
            showProfileAvatar,
            profileAvatarSize,
            showProfileName,
            showProfileStats,
            showProfileDescription,
            showProfileWebsite,
            showProfileLocation,
        } = attributes;

        className = classnames(
            'ghostkit-twitter',
            className
        );

        const APIDataReady = consumerKey && consumerSecret && accessToken && accessTokenSecret && userName;

        return (
            <Fragment>
                <InspectorControls>
                    { APIDataReady ? (
                        <Fragment>
                            <PanelBody>
                                <TextControl
                                    placeholder={ __( 'Username' ) }
                                    value={ userName }
                                    onChange={ ( value ) => setAttributes( { userName: value } ) }
                                />
                            </PanelBody>
                            <PanelBody title={ __( 'Feed' ) }>
                                <RangeControl
                                    label={ __( 'Tweets Number' ) }
                                    value={ count }
                                    onChange={ ( value ) => setAttributes( { count: value } ) }
                                    min={ 1 }
                                    max={ 20 }
                                />
                                <ToggleControl
                                    label={ __( 'Show Replies' ) }
                                    checked={ !! showReplies }
                                    onChange={ ( value ) => setAttributes( { showReplies: value } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Show Retweets' ) }
                                    checked={ !! showRetweets }
                                    onChange={ ( value ) => setAttributes( { showRetweets: value } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Show Avatar' ) }
                                    checked={ !! showFeedAvatar }
                                    onChange={ ( value ) => setAttributes( { showFeedAvatar: value } ) }
                                />
                                { showFeedAvatar ? (
                                    <RangeControl
                                        label={ __( 'Avatar Size' ) }
                                        value={ feedAvatarSize }
                                        onChange={ ( value ) => setAttributes( { feedAvatarSize: value } ) }
                                        min={ 10 }
                                        max={ 100 }
                                    />
                                ) : '' }
                                <ToggleControl
                                    label={ __( 'Show Name' ) }
                                    checked={ !! showFeedName }
                                    onChange={ ( value ) => setAttributes( { showFeedName: value } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Show Date' ) }
                                    checked={ !! showFeedDate }
                                    onChange={ ( value ) => setAttributes( { showFeedDate: value } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Show Actions' ) }
                                    checked={ !! showFeedActions }
                                    onChange={ ( value ) => setAttributes( { showFeedActions: value } ) }
                                />
                                <SelectControl
                                    label={ __( 'Convert Text Links' ) }
                                    value={ feedTextConvertLinks }
                                    options={ [
                                        {
                                            value: 'links_media',
                                            label: __( 'Links + Media' ),
                                        }, {
                                            value: 'links',
                                            label: __( 'Links' ),
                                        }, {
                                            value: 'no',
                                            label: __( 'No Convert' ),
                                        },
                                    ] }
                                    onChange={ ( value ) => setAttributes( { feedTextConvertLinks: value } ) }
                                />
                            </PanelBody>
                            <PanelBody title={ __( 'Profile' ) }>
                                <ToggleControl
                                    label={ __( 'Show Profile' ) }
                                    checked={ !! showProfile }
                                    onChange={ ( value ) => setAttributes( { showProfile: value } ) }
                                />
                                { showProfile ? (
                                    <Fragment>
                                        <ToggleControl
                                            label={ __( 'Show Avatar' ) }
                                            checked={ !! showProfileAvatar }
                                            onChange={ ( value ) => setAttributes( { showProfileAvatar: value } ) }
                                        />
                                        { showProfileAvatar ? (
                                            <RangeControl
                                                label={ __( 'Avatar Size' ) }
                                                value={ profileAvatarSize }
                                                onChange={ ( value ) => setAttributes( { profileAvatarSize: value } ) }
                                                min={ 30 }
                                                max={ 150 }
                                            />
                                        ) : '' }
                                        <ToggleControl
                                            label={ __( 'Show Name' ) }
                                            checked={ !! showProfileName }
                                            onChange={ ( value ) => setAttributes( { showProfileName: value } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Show Stats' ) }
                                            checked={ !! showProfileStats }
                                            onChange={ ( value ) => setAttributes( { showProfileStats: value } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Show Description' ) }
                                            checked={ !! showProfileDescription }
                                            onChange={ ( value ) => setAttributes( { showProfileDescription: value } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Show Website' ) }
                                            checked={ !! showProfileWebsite }
                                            onChange={ ( value ) => setAttributes( { showProfileWebsite: value } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Show Location' ) }
                                            checked={ !! showProfileLocation }
                                            onChange={ ( value ) => setAttributes( { showProfileLocation: value } ) }
                                        />
                                    </Fragment>
                                ) : '' }
                            </PanelBody>
                        </Fragment>
                    ) : '' }

                    <PanelBody title={ __( 'API Data' ) } initialOpen={ ! APIDataReady }>
                        <TextControl
                            placeholder={ __( 'Consumer Key' ) }
                            value={ consumerKey }
                            onChange={ ( value ) => setAttributes( { consumerKey: value } ) }
                        />
                        <TextControl
                            placeholder={ __( 'Consumer Secret' ) }
                            value={ consumerSecret }
                            onChange={ ( value ) => setAttributes( { consumerSecret: value } ) }
                        />
                        <TextControl
                            placeholder={ __( 'Access Token' ) }
                            value={ accessToken }
                            onChange={ ( value ) => setAttributes( { accessToken: value } ) }
                        />
                        <TextControl
                            placeholder={ __( 'Access Token Secret' ) }
                            value={ accessTokenSecret }
                            onChange={ ( value ) => setAttributes( { accessTokenSecret: value } ) }
                        />
                        <p><em>{ __( 'A valid API data is required to use Twitter feed. How to get it' ) } <a href="http://www.gabfirethemes.com/create-twitter-api-key/" target="_blank" rel="noopener noreferrer">http://www.gabfirethemes.com/create-twitter-api-key/</a></em></p>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { APIDataReady && showProfile && twitterProfile ? (
                        <div className="ghostkit-twitter-profile">
                            { showProfileAvatar && twitterProfile.profile_images_https ? (
                                <div className="ghostkit-twitter-profile-avatar">
                                    <a href={ 'https://twitter.com/' + twitterProfile.screen_name + '/' } target="_blank" rel="noopener noreferrer"><img src={ twitterProfile.profile_images_https.original } alt={ twitterProfile.fullName } width={ profileAvatarSize } height={ profileAvatarSize } /></a>
                                </div>
                            ) : '' }
                            <div className="ghostkit-twitter-profile-side">
                                { showProfileName && twitterProfile.name ? (
                                    <div className="ghostkit-twitter-profile-name">
                                        <h2 className="ghostkit-twitter-profile-fullname">
                                            <a href={ 'https://twitter.com/' + twitterProfile.screen_name + '/' } target="_blank" rel="noopener noreferrer">{ twitterProfile.name }</a>
                                            { twitterProfile.verified ? (
                                                <span className="ghostkit-twitter-profile-verified">{ __( 'Verified account' ) }</span>
                                            ) : '' }
                                        </h2>
                                        <h3 className="ghostkit-twitter-profile-username">
                                            <a href={ 'https://twitter.com/' + twitterProfile.screen_name + '/' } target="_blank" rel="noopener noreferrer">@{ twitterProfile.screen_name }</a>
                                        </h3>
                                    </div>
                                ) : '' }
                                { showProfileStats ? (
                                    <div className="ghostkit-twitter-profile-stats">
                                        <div>
                                            <strong>{ twitterProfile.statuses_count_short }</strong> <span>{ __( 'Tweets' ) }</span>
                                        </div>
                                        <div>
                                            <strong>{ twitterProfile.friends_count_short }</strong> <span>{ __( 'Following' ) }</span>
                                        </div>
                                        <div>
                                            <strong>{ twitterProfile.followers_count_short }</strong> <span>{ __( 'Followers' ) }</span>
                                        </div>
                                    </div>
                                ) : '' }
                                { showProfileDescription && twitterProfile.description_entitled ? (
                                    <div className="ghostkit-twitter-profile-description" dangerouslySetInnerHTML={ { __html: twitterProfile.description_entitled } }></div>
                                ) : '' }
                                { showProfileWebsite && twitterProfile.url_entitled ? (
                                    <div className="ghostkit-twitter-profile-website" dangerouslySetInnerHTML={ { __html: '<span class="fas fa-link"></span> ' + twitterProfile.url_entitled } }></div>
                                ) : '' }
                                { showProfileLocation && twitterProfile.location ? (
                                    <div className="ghostkit-twitter-profile-location">
                                        <span className="fas fa-map-marker-alt"></span>{ ' ' }{ twitterProfile.location }
                                    </div>
                                ) : '' }
                            </div>
                        </div>
                    ) : '' }
                    { APIDataReady && twitterFeed ? (
                        <div className="ghostkit-twitter-items">
                            {
                                twitterFeed.map( ( item, i ) => {
                                    const oldItem = item;
                                    let isRetweet = false;

                                    if ( item.retweeted_status ) {
                                        item = item.retweeted_status;
                                        isRetweet = true;
                                    }

                                    return (
                                        <div className="ghostkit-twitter-item" key={ i }>
                                            { showFeedAvatar ? (
                                                <div className="ghostkit-twitter-item-avatar">
                                                    { isRetweet ? <br /> : '' }
                                                    <a href={ 'https://twitter.com/' + item.user.screen_name + '/' } target="_blank" rel="noopener noreferrer">
                                                        <img src={ item.user.profile_images_https.bigger } alt={ item.user.screen_name } width={ feedAvatarSize } height={ feedAvatarSize } />
                                                    </a>
                                                </div>
                                            ) : '' }
                                            <div className="ghostkit-twitter-item-content">
                                                { isRetweet ? (
                                                    <div className="ghostkit-twitter-item-retweeted">
                                                        <span className="ghostkit-twitter-item-retweeted-icon"><span className="fas fa-retweet"></span></span>
                                                        <a href={ 'https://twitter.com/' + oldItem.user.screen_name + '/' } target="_blank" rel="noopener noreferrer">
                                                            <strong>{ oldItem.user.name }</strong>
                                                        </a>
                                                        { __( 'Retweeted' ) }
                                                    </div>
                                                ) : '' }
                                                { showFeedName || showFeedDate ? (
                                                    <div className="ghostkit-twitter-item-meta">
                                                        { showFeedName ? (
                                                            <div className="ghostkit-twitter-item-meta-name">
                                                                <a href={ 'https://twitter.com/' + item.user.screen_name + '/' } target="_blank" rel="noopener noreferrer">
                                                                    <strong>{ item.user.name }</strong>
                                                                    { ' ' }
                                                                    { item.user.verified ? (
                                                                        <span className="ghostkit-twitter-item-meta-name-verified">{ __( 'Verified account' ) }</span>
                                                                    ) : '' }
                                                                    { ' ' }
                                                                    <span>@{ item.user.screen_name }</span>
                                                                </a>
                                                            </div>
                                                        ) : '' }
                                                        { showFeedDate ? (
                                                            <div className="ghostkit-twitter-item-meta-date">
                                                                <a href={ 'https://twitter.com/' + item.user.screen_name + '/status/' + item.id_str } target="_blank" rel="noopener noreferrer">{ item.date_formatted }</a>
                                                            </div>
                                                        ) : '' }
                                                    </div>
                                                ) : '' }
                                                { 'links_media' === feedTextConvertLinks ? (
                                                    <div className="ghostkit-twitter-item-text" dangerouslySetInnerHTML={ { __html: item.text_entitled } }></div>
                                                ) : '' }
                                                { 'links' === feedTextConvertLinks ? (
                                                    <div className="ghostkit-twitter-item-text" dangerouslySetInnerHTML={ { __html: item.text_entitled_no_media } }></div>
                                                ) : '' }
                                                { 'links_media' !== feedTextConvertLinks && 'links' !== feedTextConvertLinks ? (
                                                    <div className="ghostkit-twitter-item-text" dangerouslySetInnerHTML={ { __html: item.text } }></div>
                                                ) : '' }
                                                { showFeedActions ? (
                                                    <div className="ghostkit-twitter-item-actions">
                                                        <div className="ghostkit-twitter-item-actions-retweet">
                                                            <a href={ 'https://twitter.com/' + item.user.screen_name + '/status/' + item.id_str } target="_blank" rel="noopener noreferrer">
                                                                <span className="fas fa-retweet"></span>
                                                                { item.retweet_count_short ? (
                                                                    <span>{ item.retweet_count_short }</span>
                                                                ) : '' }
                                                            </a>
                                                        </div>
                                                        <div className="ghostkit-twitter-item-actions-like">
                                                            <a href={ 'https://twitter.com/' + item.user.screen_name + '/status/' + item.id_str } target="_blank" rel="noopener noreferrer">
                                                                <span className="far fa-heart"></span>
                                                                { item.favorite_count_short ? (
                                                                    <span>{ item.favorite_count_short }</span>
                                                                ) : '' }
                                                            </a>
                                                        </div>
                                                    </div>
                                                ) : '' }
                                            </div>
                                        </div>
                                    );
                                } )
                            }
                        </div>
                    ) : '' }
                    { APIDataReady && ! twitterFeed ? (
                        <div className="ghostkit-twitter-spinner"><Spinner /></div>
                    ) : '' }
                    { ! APIDataReady ? (
                        <Placeholder
                            icon={ <ElementIcon /> }
                            label={ __( 'Twitter' ) }
                            className={ className }
                        >
                            <div><em>{ __( 'A valid API data is required to use Twitter feed. You can fill it in the block settings in Inspector.' ) }</em></div>
                        </Placeholder>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/twitter';

export const settings = {
    title: __( 'Twitter' ),
    description: __( 'Show twitter feed and user data.' ),
    icon: ElementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'twitter' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        consumerKey: {
            type: 'string',
        },
        consumerSecret: {
            type: 'string',
        },
        accessToken: {
            type: 'string',
        },
        accessTokenSecret: {
            type: 'string',
        },
        userName: {
            type: 'string',
            default: 'nkdevv',
        },
        count: {
            type: 'number',
            default: 3,
        },

        showReplies: {
            type: 'boolean',
            default: false,
        },
        showRetweets: {
            type: 'boolean',
            default: true,
        },
        showFeedAvatar: {
            type: 'boolean',
            default: true,
        },
        feedAvatarSize: {
            type: 'number',
            default: 48,
        },
        showFeedName: {
            type: 'boolean',
            default: true,
        },
        showFeedDate: {
            type: 'boolean',
            default: true,
        },
        feedTextConvertLinks: {
            type: 'string',
            default: 'links_media',
        },
        showFeedActions: {
            type: 'boolean',
            default: true,
        },

        showProfile: {
            type: 'boolean',
            default: true,
        },
        showProfileAvatar: {
            type: 'boolean',
            default: true,
        },
        profileAvatarSize: {
            type: 'number',
            default: 70,
        },
        showProfileName: {
            type: 'boolean',
            default: true,
        },
        showProfileStats: {
            type: 'boolean',
            default: true,
        },
        showProfileDescription: {
            type: 'boolean',
            default: true,
        },
        showProfileWebsite: {
            type: 'boolean',
            default: true,
        },
        showProfileLocation: {
            type: 'boolean',
            default: true,
        },
    },

    edit: withSelect( ( select, props ) => {
        const {
            consumerKey,
            consumerSecret,
            accessToken,
            accessTokenSecret,
            count,
            userName,
            showReplies,
            showRetweets,
        } = props.attributes;

        const APIDataReady = consumerKey && consumerSecret && accessToken && accessTokenSecret && userName;

        if ( ! APIDataReady ) {
            return false;
        }

        const urlData = `consumer_key=${ encodeURIComponent( consumerKey ) }&consumer_secret=${ encodeURIComponent( consumerSecret ) }&access_token=${ encodeURIComponent( accessToken ) }&access_token_secret=${ encodeURIComponent( accessTokenSecret ) }&screen_name=${ encodeURIComponent( userName ) }`;

        return {
            twitterFeed: select( 'ghostkit/twitter' ).getTwitterFeed( `/ghostkit/v1/get_twitter_feed/?count=${ count }&exclude_replies=${ showReplies ? 'false' : 'true' }&include_rts=${ showRetweets ? 'true' : 'false' }&${ urlData }` ),
            twitterProfile: select( 'ghostkit/twitter' ).getTwitterProfile( `/ghostkit/v1/get_twitter_profile/?${ urlData }` ),
        };
    } )( TwitterBlock ),

    save: function() {
        return null;
    },
};
