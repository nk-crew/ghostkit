// Import CSS
import './editor.scss';
import './style.scss';

// external Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import ElementIcon from '../_icons/instagram.svg';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    Button,
    ButtonGroup,
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
    setInstagramFeed( query, feed ) {
        return {
            type: 'SET_INSTAGRAM_FEED',
            query,
            feed,
        };
    },
    getInstagramFeed( query ) {
        return {
            type: 'GET_INSTAGRAM_FEED',
            query,
        };
    },
    setInstagramProfile( query, profile ) {
        return {
            type: 'SET_INSTAGRAM_PROFILE',
            query,
            profile,
        };
    },
    getInstagramProfile( query ) {
        return {
            type: 'GET_INSTAGRAM_PROFILE',
            query,
        };
    },
};
registerStore( 'ghostkit/instagram', {
    reducer( state = { feeds: {}, profiles: {} }, action ) {
        switch ( action.type ) {
        case 'SET_INSTAGRAM_FEED':
            if ( ! state.feeds[ action.query ] && action.feed ) {
                state.feeds[ action.query ] = action.feed;
            }
            return state;
        case 'GET_INSTAGRAM_FEED':
            return action.feeds[ action.query ];
        case 'SET_INSTAGRAM_PROFILE':
            if ( ! state.profiles[ action.query ] && action.profile ) {
                state.profiles[ action.query ] = action.profile;
            }
            return state;
        case 'GET_INSTAGRAM_PROFILE':
            return action.profiles[ action.query ];
        // no default
        }
        return state;
    },
    actions,
    selectors: {
        getInstagramFeed( state, query ) {
            return state.feeds[ query ];
        },
        getInstagramProfile( state, query ) {
            return state.profiles[ query ];
        },
    },
    resolvers: {
        * getInstagramFeed( state, query ) {
            const feed = apiFetch( { path: query } )
                .then( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.success && fetchedData.response ) {
                        return actions.setInstagramFeed( query, fetchedData.response );
                    }
                    return false;
                } );
            yield feed;
        },
        * getInstagramProfile( state, query ) {
            const profile = apiFetch( { path: query } )
                .then( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.success && fetchedData.response ) {
                        return actions.setInstagramProfile( query, fetchedData.response );
                    }
                    return false;
                } );
            yield profile;
        },
    },
} );

class InstagramBlock extends Component {
    render() {
        const {
            setAttributes,
            attributes,
            instagramFeed,
            instagramProfile,
        } = this.props;

        let {
            className,
        } = this.props;

        const {
            accessToken,
            count,
            columns,
            gap,
            showProfileAvatar,
            profileAvatarSize,
            showProfileName,
            showProfileStats,
            showProfileBio,
            showProfileWebsite,
        } = attributes;

        const showProfile = attributes.showProfile && ( showProfileName || showProfileAvatar || showProfileBio || showProfileWebsite || showProfileStats );

        className = classnames(
            'ghostkit-instagram',
            gap ? `ghostkit-instagram-gap-${ gap }` : '',
            columns ? `ghostkit-instagram-columns-${ columns }` : '',
            className
        );

        return (
            <Fragment>
                <InspectorControls>
                    { accessToken ? (
                        <Fragment>
                            <PanelBody>
                                <RangeControl
                                    label={ __( 'Photos Number' ) }
                                    value={ count }
                                    onChange={ ( value ) => setAttributes( { count: value } ) }
                                    min={ 1 }
                                    max={ 20 }
                                />
                                <RangeControl
                                    label={ __( 'Columns' ) }
                                    value={ columns }
                                    onChange={ ( value ) => setAttributes( { columns: value } ) }
                                    min={ 1 }
                                    max={ 8 }
                                />
                                <BaseControl label={ __( 'Gap' ) }>
                                    <ButtonGroup>
                                        {
                                            [
                                                {
                                                    label: __( 'none' ),
                                                    value: 'no',
                                                },
                                                {
                                                    label: __( 'sm' ),
                                                    value: 'sm',
                                                },
                                                {
                                                    label: __( 'md' ),
                                                    value: 'md',
                                                },
                                                {
                                                    label: __( 'lg' ),
                                                    value: 'lg',
                                                },
                                            ].map( ( val ) => {
                                                const selected = gap === val.value;

                                                return (
                                                    <Button
                                                        isLarge
                                                        isPrimary={ selected }
                                                        aria-pressed={ selected }
                                                        onClick={ () => setAttributes( { gap: val.value } ) }
                                                        key={ `gap_${ val.label }` }
                                                    >
                                                        { val.label }
                                                    </Button>
                                                );
                                            } )
                                        }
                                    </ButtonGroup>
                                </BaseControl>
                            </PanelBody>
                            <PanelBody title={ __( 'Profile Info' ) }>
                                <ToggleControl
                                    label={ __( 'Show Profile Info' ) }
                                    checked={ !! attributes.showProfile }
                                    onChange={ ( val ) => setAttributes( { showProfile: val } ) }
                                />
                                { attributes.showProfile ? (
                                    <Fragment>
                                        <ToggleControl
                                            label={ __( 'Show Avatar' ) }
                                            checked={ !! showProfileAvatar }
                                            onChange={ ( val ) => setAttributes( { showProfileAvatar: val } ) }
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
                                            onChange={ ( val ) => setAttributes( { showProfileName: val } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Show Stats' ) }
                                            checked={ !! showProfileStats }
                                            onChange={ ( val ) => setAttributes( { showProfileStats: val } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Show BIO' ) }
                                            checked={ !! showProfileBio }
                                            onChange={ ( val ) => setAttributes( { showProfileBio: val } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Show Website' ) }
                                            checked={ !! showProfileWebsite }
                                            onChange={ ( val ) => setAttributes( { showProfileWebsite: val } ) }
                                        />
                                    </Fragment>
                                ) : '' }
                            </PanelBody>
                        </Fragment>
                    ) : '' }

                    <PanelBody title={ __( 'API Data' ) } initialOpen={ ! accessToken }>
                        <TextControl
                            placeholder={ __( 'Access Token' ) }
                            value={ accessToken }
                            onChange={ ( value ) => setAttributes( { accessToken: value } ) }
                        />
                        <p><em>{ __( 'A valid Access Token is required to use Instagram feed. How to get token' ) } <a href="http://instagram.pixelunion.net/" target="_blank" rel="noopener noreferrer">http://instagram.pixelunion.net/</a></em></p>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { accessToken && showProfile && instagramProfile && instagramProfile.data ? (
                        <div className="ghostkit-instagram-profile">
                            { showProfileAvatar && instagramProfile.data.profile_picture ? (
                                <div className="ghostkit-instagram-profile-avatar">
                                    <img src={ instagramProfile.data.profile_picture } alt={ instagramProfile.data.full_name } width={ profileAvatarSize } height={ profileAvatarSize } />
                                </div>
                            ) : '' }
                            <div className="ghostkit-instagram-profile-side">
                                { showProfileName && instagramProfile.data.username ? (
                                    <div className="ghostkit-instagram-profile-name">
                                        { instagramProfile.data.username }
                                    </div>
                                ) : '' }
                                { showProfileStats && instagramProfile.data.counts ? (
                                    <div className="ghostkit-instagram-profile-stats">
                                        <div>
                                            <strong>{ instagramProfile.data.counts.media }</strong> <span>{ __( 'Posts' ) }</span>
                                        </div>
                                        <div>
                                            <strong>{ instagramProfile.data.counts.followed_by }</strong> <span>{ __( 'Followers' ) }</span>
                                        </div>
                                        <div>
                                            <strong>{ instagramProfile.data.counts.follows }</strong> <span>{ __( 'Following' ) }</span>
                                        </div>
                                    </div>
                                ) : '' }
                                { showProfileBio && instagramProfile.data.bio ? (
                                    <div className="ghostkit-instagram-profile-bio">
                                        <h2>{ instagramProfile.data.full_name }</h2>
                                        <div>{ instagramProfile.data.bio }</div>
                                    </div>
                                ) : '' }
                                { showProfileWebsite && instagramProfile.data.website ? (
                                    <div className="ghostkit-instagram-profile-website">
                                        <a href={ instagramProfile.data.website }>{ instagramProfile.data.website }</a>
                                    </div>
                                ) : '' }
                            </div>
                        </div>
                    ) : '' }
                    { accessToken && instagramFeed && instagramFeed.data ? (
                        <div className="ghostkit-instagram-items">
                            {
                                instagramFeed.data.map( ( item, i ) => (
                                    <div className="ghostkit-instagram-item" key={ i }>
                                        <span>
                                            <img
                                                src={ item.images.standard_resolution.url }
                                                width={ item.images.standard_resolution.width }
                                                height={ item.images.standard_resolution.height }
                                                alt={ item.caption || '' }
                                            />
                                        </span>
                                    </div>
                                ) )
                            }
                        </div>
                    ) : '' }
                    { accessToken && ( ! instagramFeed || ! instagramFeed.data ) ? (
                        <div className="ghostkit-instagram-spinner"><Spinner /></div>
                    ) : '' }
                    { ! accessToken ? (
                        <Placeholder
                            icon={ <ElementIcon /> }
                            label={ __( 'Instagram' ) }
                            className={ className }
                        >
                            <div><em>{ __( 'A valid Access Token is required to use Instagram feed. You can fill it in the block settings in Inspector.' ) }</em></div>
                        </Placeholder>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/instagram';

export const settings = {
    title: __( 'Instagram' ),
    description: __( 'Show instagram feed and user data.' ),
    icon: ElementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'instagram' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        accessToken: {
            type: 'string',
        },
        count: {
            type: 'number',
            default: 8,
        },
        columns: {
            type: 'number',
            default: 4,
        },
        gap: {
            type: 'string',
            default: 'sm',
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
        showProfileBio: {
            type: 'boolean',
            default: true,
        },
        showProfileWebsite: {
            type: 'boolean',
            default: true,
        },
    },

    edit: withSelect( ( select, props ) => {
        const {
            accessToken,
            count,
        } = props.attributes;

        if ( ! accessToken ) {
            return false;
        }

        return {
            instagramFeed: select( 'ghostkit/instagram' ).getInstagramFeed( `/ghostkit/v1/get_instagram_feed/?access_token=${ encodeURIComponent( accessToken ) }&count=${ encodeURIComponent( count ) }` ),
            instagramProfile: select( 'ghostkit/instagram' ).getInstagramProfile( `/ghostkit/v1/get_instagram_profile/?access_token=${ encodeURIComponent( accessToken ) }` ),
        };
    } )( InstagramBlock ),

    save: function() {
        return null;
    },
};
