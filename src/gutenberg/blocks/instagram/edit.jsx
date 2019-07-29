/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
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

const {
    applyFilters,
} = wp.hooks;

const {
    withSelect,
} = wp.data;

const {
    InspectorControls,
} = wp.editor;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
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

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

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
                            </PanelBody>
                            <PanelBody>
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
                            icon={ getIcon( 'block-instagram' ) }
                            label={ __( 'Instagram' ) }
                            instructions={ __( 'A valid Access Token is required to use Instagram feed. You can fill it in the block settings in Inspector.' ) }
                            className={ className }
                        />
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export default withSelect( ( select, props ) => {
    const {
        accessToken,
        count,
    } = props.attributes;

    if ( ! accessToken ) {
        return false;
    }

    return {
        instagramFeed: select( 'ghostkit/blocks/instagram' ).getInstagramFeed( {
            access_token: accessToken,
            count,
        } ),
        instagramProfile: select( 'ghostkit/blocks/instagram' ).getInstagramProfile( {
            access_token: accessToken,
        } ),
    };
} )( BlockEdit );
