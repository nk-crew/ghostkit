/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    BaseControl,
    PanelBody,
    SelectControl,
    Button,
    ButtonGroup,
    ToggleControl,
    RangeControl,
    TextControl,
    Toolbar,
    Dropdown,
    IconButton,
} = wp.components;

const {
    withSelect,
} = wp.data;

const {
    InspectorControls,
    BlockControls,
    MediaUpload,
} = wp.editor;

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ApplyFilters from '../../components/apply-filters';
import ImagePicker from '../../components/image-picker';

import ImgAspectRatio32 from './aspect-ratio/aspect-ratio-3-2.png';
import ImgAspectRatio43 from './aspect-ratio/aspect-ratio-4-3.png';
import ImgAspectRatio169 from './aspect-ratio/aspect-ratio-16-9.png';
import ImgAspectRatio219 from './aspect-ratio/aspect-ratio-21-9.png';

import getIcon from '../../utils/get-icon';
import dashCaseToTitle from '../../utils/dash-case-to-title';

/**
 * Select poster
 *
 * @param {array} media - media data.
 * @param {function} setAttributes - set attributes function.
 */
function onPosterSelect( media, setAttributes ) {
    setAttributes( {
        poster: '',
        posterSizes: '',
    } );

    wp.media.attachment( media.id ).fetch().then( ( data ) => {
        if ( data && data.sizes ) {
            const url = ( data.sizes[ 'post-thumbnail' ] || data.sizes.medium || data.sizes.medium_large || data.sizes.full ).url;
            if ( url ) {
                setAttributes( {
                    poster: media.id,
                    posterSizes: data.sizes,
                } );
            }
        }
    } );
}

/**
 * Load YouTube / Vimeo poster image
 */
const videoPosterCache = {};
let videoPosterTimeout;
function getVideoPoster( url, cb ) {
    if ( videoPosterCache[ url ] ) {
        cb( videoPosterCache[ url ] );
        return;
    }

    if ( typeof window.VideoWorker === 'undefined' ) {
        cb( '' );
        return;
    }

    clearTimeout( videoPosterTimeout );
    videoPosterTimeout = setTimeout( () => {
        const videoObject = new window.VideoWorker( url );

        if ( videoObject.isValid() ) {
            videoObject.getImageURL( ( videoPosterUrl ) => {
                videoPosterCache[ url ] = videoPosterUrl;
                cb( videoPosterUrl );
            } );
        } else {
            cb( '' );
        }
    }, 500 );
}

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor() {
        super( ...arguments );

        this.onUpdate = this.onUpdate.bind( this );
        this.getAspectRatioPicker = this.getAspectRatioPicker.bind( this );
    }
    componentDidMount() {
        this.onUpdate();
    }
    componentDidUpdate() {
        this.onUpdate();
    }
    onUpdate() {
        const {
            posterData,
            setAttributes,
            attributes,
        } = this.props;

        // set poster tag to attribute
        if ( attributes.poster && posterData ) {
            setAttributes( { posterTag: posterData } );
        }

        // load YouTube / Vimeo poster
        if ( ! attributes.poster && attributes.type === 'yt_vm_video' && attributes.video ) {
            getVideoPoster( attributes.video, ( url ) => {
                if ( url !== attributes.videoPosterPreview ) {
                    setAttributes( { videoPosterPreview: url } );
                }
            } );
        }
    }

    getAspectRatioPicker() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        const {
            videoAspectRatio,
        } = attributes;

        return (
            <ImagePicker
                label={ __( 'Aspect ratio' ) }
                value={ videoAspectRatio }
                options={ [
                    {
                        value: '16:9',
                        label: __( 'Wide' ),
                        image: ImgAspectRatio169,
                    },
                    {
                        value: '21:9',
                        label: __( 'Ultra Wide' ),
                        image: ImgAspectRatio219,
                    },
                    {
                        value: '4:3',
                        label: __( 'TV' ),
                        image: ImgAspectRatio43,
                    },
                    {
                        value: '3:2',
                        label: __( 'Classic Film' ),
                        image: ImgAspectRatio32,
                    },
                ] }
                onChange={ ( value ) => setAttributes( { videoAspectRatio: value } ) }
            />
        );
    }

    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            type,
            video,
            videoPosterPreview,
            videoMp4,
            videoOgv,
            videoWebm,
            videoAspectRatio,
            videoVolume,
            videoAutoplay,
            videoAutopause,

            iconPlay,
            iconLoading,

            poster,
            posterTag,
            posterSizes,
            posterSize,

            clickAction,
            fullscreenBackgroundColor,
            fullscreenActionCloseIcon,
        } = attributes;

        className = classnames(
            'ghostkit-video',
            className
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        let toolbarAspectRatioIcon = getIcon( 'icon-aspect-ratio-16-9' );
        if ( '3:2' === videoAspectRatio ) {
            toolbarAspectRatioIcon = getIcon( 'icon-aspect-ratio-3-2' );
        }
        if ( '4:3' === videoAspectRatio ) {
            toolbarAspectRatioIcon = getIcon( 'icon-aspect-ratio-4-3' );
        }
        if ( '21:9' === videoAspectRatio ) {
            toolbarAspectRatioIcon = getIcon( 'icon-aspect-ratio-21-9' );
        }

        return (
            <Fragment>
                <BlockControls>
                    <Toolbar>
                        <Dropdown
                            renderToggle={ ( { onToggle } ) => (
                                <IconButton
                                    label={ __( 'Aspect Ratio' ) }
                                    icon={ toolbarAspectRatioIcon }
                                    className="components-toolbar__control"
                                    onClick={ onToggle }
                                />
                            ) }
                            renderContent={ () => {
                                return (
                                    <div style={ {
                                        padding: 15,
                                        paddingTop: 10,
                                        paddingBottom: 0,
                                    } }>
                                        { this.getAspectRatioPicker() }
                                    </div>
                                );
                            } }
                        />
                    </Toolbar>
                    { type === 'yt_vm_video' ? (
                        <Toolbar>
                            <TextControl
                                type="url"
                                value={ video }
                                placeholder={ __( 'YouTube / Vimeo URL' ) }
                                onChange={ ( value ) => setAttributes( { video: value } ) }
                                className="ghostkit-video-toolbar-url"
                            />
                        </Toolbar>
                    ) : '' }
                </BlockControls>
                <InspectorControls>
                    <PanelBody>
                        <ButtonGroup aria-label={ __( 'Type' ) } style={ { marginBottom: 10 } }>
                            {
                                [
                                    {
                                        label: __( 'YouTube / Vimeo' ),
                                        value: 'yt_vm_video',
                                    }, {
                                        label: __( 'Local Hosted' ),
                                        value: 'video',
                                    },
                                ].map( val => (
                                    <Button
                                        isLarge
                                        isPrimary={ type === val.value }
                                        aria-pressed={ type === val.value }
                                        onClick={ () => setAttributes( { type: val.value } ) }
                                        key={ `type_${ val.label }` }
                                    >
                                        { val.label }
                                    </Button>
                                ) )
                            }
                        </ButtonGroup>
                        { type === 'yt_vm_video' &&
                            <TextControl
                                label={ __( 'Video URL' ) }
                                type="url"
                                value={ video }
                                onChange={ ( value ) => setAttributes( { video: value } ) }
                            />
                        }

                        { /* Preview Video */ }
                        { type === 'video' && ( videoMp4 || videoOgv || videoWebm ) ? (
                            <video controls>
                                { videoMp4 ? (
                                    <source src={ videoMp4 } type="video/mp4" />
                                ) : '' }
                                { videoOgv ? (
                                    <source src={ videoOgv } type="video/ogg" />
                                ) : '' }
                                { videoWebm ? (
                                    <source src={ videoWebm } type="video/webm" />
                                ) : '' }
                            </video>
                        ) : '' }

                        { /* Select Videos */ }
                        { type === 'video' && ! videoMp4 ? (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    setAttributes( {
                                        videoMp4: '',
                                        videoMp4Id: '',
                                    } );
                                    wp.media.attachment( media.id ).fetch().then( ( data ) => {
                                        setAttributes( {
                                            videoMp4: data.url,
                                            videoMp4Id: data.id,
                                        } );
                                    } );
                                } }
                                allowedTypes={ [ 'video/mp4', 'video/m4v' ] }
                                value={ videoMp4 }
                                render={ ( { open } ) => (
                                    <div style={ { marginBottom: 13 } }>
                                        <Button onClick={ open } isPrimary>
                                            { __( 'Select MP4' ) }
                                        </Button>
                                    </div>
                                ) }
                            />
                        ) : '' }
                        { type === 'video' && videoMp4 ? (
                            <div>
                                <span>{ videoMp4.substring( videoMp4.lastIndexOf( '/' ) + 1 ) } </span>
                                <a
                                    href="#"
                                    onClick={ ( e ) => {
                                        setAttributes( {
                                            videoMp4: '',
                                            videoMp4Id: '',
                                        } );
                                        e.preventDefault();
                                    } }
                                >
                                    { __( '(Remove)' ) }
                                </a>
                                <div style={ { marginBottom: 13 } } />
                            </div>
                        ) : '' }
                        { type === 'video' && ! videoOgv ? (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    setAttributes( {
                                        videoOgv: '',
                                        videoOgvId: '',
                                    } );
                                    wp.media.attachment( media.id ).fetch().then( ( data ) => {
                                        setAttributes( {
                                            videoOgv: data.url,
                                            videoOgvId: data.id,
                                        } );
                                    } );
                                } }
                                allowedTypes={ [ 'video/ogg', 'video/ogv' ] }
                                value={ videoOgv }
                                render={ ( { open } ) => (
                                    <div style={ { marginBottom: 13 } }>
                                        <Button onClick={ open } isPrimary>
                                            { __( 'Select OGV' ) }
                                        </Button>
                                    </div>
                                ) }
                            />
                        ) : '' }
                        { type === 'video' && videoOgv ? (
                            <div>
                                <span>{ videoOgv.substring( videoOgv.lastIndexOf( '/' ) + 1 ) } </span>
                                <a
                                    href="#"
                                    onClick={ ( e ) => {
                                        setAttributes( {
                                            videoOgv: '',
                                            videoOgvId: '',
                                        } );
                                        e.preventDefault();
                                    } }
                                >
                                    { __( '(Remove)' ) }
                                </a>
                                <div style={ { marginBottom: 13 } } />
                            </div>
                        ) : '' }
                        { type === 'video' && ! videoWebm ? (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    setAttributes( {
                                        videoWebm: '',
                                        videoWebmId: '',
                                    } );
                                    wp.media.attachment( media.id ).fetch().then( ( data ) => {
                                        setAttributes( {
                                            videoWebm: data.url,
                                            videoWebmId: data.id,
                                        } );
                                    } );
                                } }
                                allowedTypes={ [ 'video/webm' ] }
                                value={ videoWebm }
                                render={ ( { open } ) => (
                                    <div style={ { marginBottom: 13 } }>
                                        <Button onClick={ open } isPrimary>
                                            { __( 'Select WEBM' ) }
                                        </Button>
                                    </div>
                                ) }
                            />
                        ) : '' }
                        { type === 'video' && videoWebm ? (
                            <div>
                                <span>{ videoWebm.substring( videoWebm.lastIndexOf( '/' ) + 1 ) } </span>
                                <a
                                    href="#"
                                    onClick={ ( e ) => {
                                        setAttributes( {
                                            videoWebm: '',
                                            videoWebmId: '',
                                        } );
                                        e.preventDefault();
                                    } }
                                >
                                    { __( '(Remove)' ) }
                                </a>
                                <div style={ { marginBottom: 13 } } />
                            </div>
                        ) : '' }
                    </PanelBody>
                    <PanelBody>
                        { this.getAspectRatioPicker() }
                    </PanelBody>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Volume' ) }
                            value={ videoVolume }
                            min="0"
                            max="100"
                            onChange={ v => setAttributes( { videoVolume: v } ) }
                        />
                    </PanelBody>
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Play Icon' ) }
                            value={ iconPlay }
                            onChange={ ( value ) => setAttributes( { iconPlay: value } ) }
                        />
                        <IconPicker
                            label={ __( 'Loading Icon' ) }
                            value={ iconLoading }
                            onChange={ ( value ) => setAttributes( { iconLoading: value } ) }
                        />
                    </PanelBody>
                    <PanelBody>
                        <SelectControl
                            label={ __( 'Click action' ) }
                            value={ clickAction }
                            options={ [
                                {
                                    value: 'plain',
                                    label: 'Plain',
                                }, {
                                    value: 'fullscreen',
                                    label: 'Fullscreen',
                                },
                            ] }
                            onChange={ ( value ) => setAttributes( { clickAction: value } ) }
                        />
                        { clickAction === 'fullscreen' ? (
                            <Fragment>
                                <ApplyFilters name="ghostkit.editor.controls" attribute={ 'fullscreenBackgroundColor' } props={ this.props }>
                                    <ColorPicker
                                        label={ __( 'Fullscreen Background' ) }
                                        value={ fullscreenBackgroundColor }
                                        onChange={ ( val ) => setAttributes( { fullscreenBackgroundColor: val } ) }
                                        alpha={ true }
                                    />
                                </ApplyFilters>
                                <IconPicker
                                    label={ __( 'Fullscreen close icon' ) }
                                    value={ fullscreenActionCloseIcon }
                                    onChange={ ( value ) => setAttributes( { fullscreenActionCloseIcon: value } ) }
                                />
                            </Fragment>
                        ) : (
                            <Fragment>
                                <ToggleControl
                                    label={ __( 'Autoplay' ) }
                                    help={ __( 'Automatically play video when block reaches the viewport. The video will be play muted due to browser Autoplay policy.' ) }
                                    checked={ !! videoAutoplay }
                                    onChange={ ( value ) => setAttributes( { videoAutoplay: value } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Autopause' ) }
                                    help={ __( 'Automatically pause video when block out of the viewport.' ) }
                                    checked={ !! videoAutopause }
                                    onChange={ ( value ) => setAttributes( { videoAutopause: value } ) }
                                />
                            </Fragment>
                        ) }
                    </PanelBody>

                    <PanelBody title={ __( 'Poster Image' ) }>
                        { ! poster ? (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    onPosterSelect( media, setAttributes );
                                } }
                                allowedTypes={ [ 'image' ] }
                                value={ poster }
                                render={ ( { open } ) => (
                                    <Button onClick={ open } isPrimary>
                                        { __( 'Select image' ) }
                                    </Button>
                                ) }
                            />
                        ) : '' }

                        { poster && posterTag ? (
                            <Fragment>
                                <MediaUpload
                                    onSelect={ ( media ) => {
                                        onPosterSelect( media, setAttributes );
                                    } }
                                    allowedTypes={ [ 'image' ] }
                                    value={ poster }
                                    render={ ( { open } ) => (
                                        <BaseControl help={ __( 'Click the image to edit or update' ) }>
                                            <a
                                                href="#"
                                                onClick={ open }
                                                className="ghostkit-gutenberg-media-upload"
                                                style={ { display: 'block' } }
                                                dangerouslySetInnerHTML={ { __html: posterTag } }
                                            />
                                        </BaseControl>
                                    ) }
                                />
                                <a
                                    href="#"
                                    onClick={ ( e ) => {
                                        setAttributes( {
                                            poster: '',
                                            posterTag: '',
                                            posterSizes: '',
                                        } );
                                        e.preventDefault();
                                    } }
                                    className="button button-secondary"
                                >
                                    { __( 'Remove image' ) }
                                </a>
                                <div style={ { marginBottom: 13 } } />
                                { posterSizes ? (
                                    <SelectControl
                                        label={ __( 'Size' ) }
                                        value={ posterSize }
                                        options={ ( () => {
                                            const result = [];
                                            Object.keys( posterSizes ).forEach( ( k ) => {
                                                result.push( {
                                                    value: k,
                                                    label: dashCaseToTitle( k ),
                                                } );
                                            } );
                                            return result;
                                        } )() }
                                        onChange={ v => setAttributes( { posterSize: v } ) }
                                    />
                                ) : '' }
                            </Fragment>
                        ) : '' }
                    </PanelBody>
                </InspectorControls>
                <div className={ className } data-video-aspect-ratio={ videoAspectRatio }>
                    { posterTag ? (
                        <div className="ghostkit-video-poster"
                            dangerouslySetInnerHTML={ {
                                __html: posterTag,
                            } }
                        />
                    ) : '' }
                    { ! posterTag && type === 'yt_vm_video' && videoPosterPreview ? (
                        <div className="ghostkit-video-poster">
                            <img src={ videoPosterPreview } alt="" />
                        </div>
                    ) : '' }
                    { iconPlay ? (
                        <div className="ghostkit-video-play-icon">
                            <IconPicker.Dropdown
                                onChange={ ( value ) => setAttributes( { iconPlay: value } ) }
                                value={ iconPlay }
                                renderToggle={ ( { onToggle } ) => (
                                    <IconPicker.Preview
                                        onClick={ onToggle }
                                        name={ iconPlay }
                                    />
                                ) }
                            />
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export default withSelect( ( select, props ) => {
    const { poster } = props.attributes;

    if ( ! poster ) {
        return {};
    }

    return {
        posterData: select( 'ghostkit/base/images' ).getImageTagData( {
            id: poster,
            size: props.attributes.posterSize,
        } ),
    };
} )( BlockEdit );
