// External Dependencies.
if ( ! global._babelPolyfill ) {
    require( '@babel/polyfill' );
}
import classnames from 'classnames/dedupe';
import ColorPicker from '../_components/color-picker.jsx';
import IconPicker from '../_components/icon-picker.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';
import ImagePicker from '../_components/image-picker.jsx';

import ImgAspectRatio32 from './aspect-ratio/aspect-ratio-3-2.png';
import ImgAspectRatio43 from './aspect-ratio/aspect-ratio-4-3.png';
import ImgAspectRatio169 from './aspect-ratio/aspect-ratio-16-9.png';
import ImgAspectRatio219 from './aspect-ratio/aspect-ratio-21-9.png';

// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import getIcon from '../_utils/get-icon.jsx';
import deprecatedArray from './deprecated.jsx';
import transforms from './transforms.jsx';
import './store.jsx';

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
 * Camel case to Title case.
 * https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 *
 * @param {string} str - camel case string.
 *
 * @return {string} title case string.
 */
function toTitleCase( str ) {
    return str.split( /[.,/ \-_]/ ).map( ( word ) => {
        return word && word.length ? word.replace( word[ 0 ], word[ 0 ].toUpperCase() ) : word;
    } ).join( ' ' );
}

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

class VideoBlockEdit extends Component {
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

        let toolbarAspectRatioIcon = getIcon( 'icon-aspect-ratio-16-9', true );
        if ( '3:2' === videoAspectRatio ) {
            toolbarAspectRatioIcon = getIcon( 'icon-aspect-ratio-3-2', true );
        }
        if ( '4:3' === videoAspectRatio ) {
            toolbarAspectRatioIcon = getIcon( 'icon-aspect-ratio-4-3', true );
        }
        if ( '21:9' === videoAspectRatio ) {
            toolbarAspectRatioIcon = getIcon( 'icon-aspect-ratio-21-9', true );
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
                                                    label: toTitleCase( k ),
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

class VideoBlockSave extends Component {
    constructor() {
        super( ...arguments );

        // inside exported xml file almost all symbols are escaped.
        const posterTag = this.props.attributes.posterTag;
        if ( posterTag && /^u003c/g.test( posterTag ) ) {
            this.props.attributes.posterTag = posterTag
                .replace( /u003c/g, '<' )
                .replace( /u003e/g, '>' )
                .replace( /u0022/g, '"' )
                .replace( /u0026/g, '&' );
        }
    }

    render() {
        const {
            attributes,
        } = this.props;

        const {
            type,
            video,
            videoMp4,
            videoOgv,
            videoWebm,
            videoAspectRatio,
            videoVolume,
            videoAutoplay,
            videoAutopause,

            iconPlay,
            iconLoading,

            posterTag,

            clickAction,
            fullscreenActionCloseIcon,
            fullscreenBackgroundColor,
        } = attributes;

        const resultAttrs = {};

        resultAttrs.className = 'ghostkit-video';

        resultAttrs.className = applyFilters( 'ghostkit.blocks.className', resultAttrs.className, {
            ...{
                name,
            },
            ...this.props,
        } );

        resultAttrs[ 'data-video-type' ] = type;

        resultAttrs[ 'data-video' ] = '';
        if ( 'video' === type ) {
            if ( videoMp4 ) {
                resultAttrs[ 'data-video' ] += `mp4:${ videoMp4 }`;
            }
            if ( videoOgv ) {
                resultAttrs[ 'data-video' ] += `${ resultAttrs[ 'data-video' ].length ? ',' : '' }ogv:${ videoOgv }`;
            }
            if ( videoWebm ) {
                resultAttrs[ 'data-video' ] += `${ resultAttrs[ 'data-video' ].length ? ',' : '' }webm:${ videoWebm }`;
            }
        } else {
            resultAttrs[ 'data-video' ] = video;
        }

        resultAttrs[ 'data-video-aspect-ratio' ] = videoAspectRatio;

        resultAttrs[ 'data-video-volume' ] = videoVolume;

        resultAttrs[ 'data-click-action' ] = clickAction;

        if ( clickAction === 'fullscreen' ) {
            resultAttrs[ 'data-fullscreen-background-color' ] = fullscreenBackgroundColor;
        } else {
            if ( videoAutoplay ) {
                resultAttrs[ 'data-video-autoplay' ] = 'true';
            }
            if ( videoAutopause ) {
                resultAttrs[ 'data-video-autopause' ] = 'true';
            }
        }

        return (
            <div { ...resultAttrs }>
                { posterTag ? (
                    <div className="ghostkit-video-poster"
                        dangerouslySetInnerHTML={ {
                            __html: posterTag,
                        } }
                    />
                ) : '' }
                { iconPlay ? (
                    <div className="ghostkit-video-play-icon">
                        <IconPicker.Render name={ iconPlay } />
                    </div>
                ) : '' }
                { iconLoading ? (
                    <div className="ghostkit-video-loading-icon">
                        <IconPicker.Render name={ iconLoading } />
                    </div>
                ) : '' }
                { clickAction === 'fullscreen' && fullscreenActionCloseIcon ? (
                    <div className="ghostkit-video-fullscreen-close-icon">
                        <IconPicker.Render name={ fullscreenActionCloseIcon } />
                    </div>
                ) : '' }
            </div>
        );
    }
}

export const name = 'ghostkit/video';

export const settings = {
    title: __( 'Video' ),
    description: __( 'Plain and Fullscreen YouTube, Vimeo and Self-Hosted videos.' ),
    icon: getIcon( 'block-video' ),
    category: 'ghostkit',
    keywords: [
        __( 'video' ),
        __( 'youtube' ),
        __( 'vimeo' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/video/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        type: {
            type: 'string',
            default: 'yt_vm_video',
        },
        video: {
            type: 'string',
            default: '',
        },
        videoPosterPreview: {
            type: 'string',
            default: '',
        },
        videoMp4: {
            type: 'string',
            default: '',
        },
        videoMp4Id: {
            type: 'number',
        },
        videoOgv: {
            type: 'string',
            default: '',
        },
        videoOgvId: {
            type: 'number',
        },
        videoWebm: {
            type: 'string',
            default: '',
        },
        videoWebmId: {
            type: 'number',
        },
        videoAspectRatio: {
            type: 'string',
            default: '16:9',
        },
        videoVolume: {
            type: 'number',
            default: 100,
        },
        videoAutoplay: {
            type: 'boolean',
            default: false,
        },
        videoAutopause: {
            type: 'boolean',
            default: false,
        },

        iconPlay: {
            type: 'string',
            default: 'fas fa-play',
        },
        iconLoading: {
            type: 'string',
            default: 'ghostkit-video-spinner',
        },

        poster: {
            type: 'number',
            default: '',
        },
        posterTag: {
            type: 'string',
            default: '',
        },
        posterSizes: {
            type: 'object',
            default: '',
        },
        posterSize: {
            type: 'string',
            default: 'full',
        },

        clickAction: {
            type: 'string',
            default: 'plain',
        },
        fullscreenBackgroundColor: {
            type: 'string',
            default: 'rgba(0, 0, 0, .9)',
        },
        fullscreenActionCloseIcon: {
            type: 'string',
            default: 'fas fa-times',
        },
    },

    edit: withSelect( ( select, props ) => {
        const { poster } = props.attributes;

        if ( ! poster ) {
            return {};
        }

        const query = `size=${ encodeURIComponent( props.attributes.posterSize ) }`;

        return {
            posterData: select( 'ghostkit/video' ).getImageTagData( `/ghostkit/v1/get_attachment_image/${ poster }?${ query }` ),
        };
    } )( VideoBlockEdit ),

    save: VideoBlockSave,

    transforms,
    deprecated: deprecatedArray,
};
