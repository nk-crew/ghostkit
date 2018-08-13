// External Dependencies.
import { ChromePicker } from 'react-color';
import classnames from 'classnames/dedupe';

// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import elementIcon from '../_icons/video.svg';
import deprecatedArray from './deprecated.jsx';

const { GHOSTKIT } = window;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    PanelBody,
    SelectControl,
    Button,
    ButtonGroup,
    RangeControl,
    TextControl,
    PanelColor,
    withAPIData,
} = wp.components;

const {
    InspectorControls,
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
    constructor( props ) {
        super( props );
        this.onUpdate = this.onUpdate.bind( this );
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
        if ( attributes.poster && posterData && ! posterData.isLoading && posterData.data && posterData.data.success ) {
            setAttributes( { posterTag: posterData.data.response } );
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

    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,

            type,
            video,
            videoPosterPreview,
            videoMp4,
            videoOgv,
            videoWebm,
            videoAspectRatio,
            videoVolume,
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

        const availableVariants = GHOSTKIT.getVariants( 'video' );

        className = classnames(
            'ghostkit-video',
            className
        );

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        { Object.keys( availableVariants ).length > 1 ? (
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        ) : '' }

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
                        { type === 'video' && ( videoMp4 || videoOgv || videoWebm ) && (
                            <video controls>
                                { videoMp4 && (
                                    <source src={ videoMp4 } type="video/mp4" />
                                ) }
                                { videoOgv && (
                                    <source src={ videoOgv } type="video/ogg" />
                                ) }
                                { videoWebm && (
                                    <source src={ videoWebm } type="video/webm" />
                                ) }
                            </video>
                        ) }

                        { /* Select Videos */ }
                        { type === 'video' && ! videoMp4 && (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    setAttributes( {
                                        videoMp4: '',
                                    } );
                                    wp.media.attachment( media.id ).fetch().then( ( data ) => {
                                        setAttributes( {
                                            videoMp4: data.url,
                                        } );
                                    } );
                                } }
                                type="video"
                                value={ videoMp4 }
                                render={ ( { open } ) => (
                                    <div style={ { marginBottom: 13 } }>
                                        <Button onClick={ open } isPrimary>
                                            { __( 'Select MP4' ) }
                                        </Button>
                                    </div>
                                ) }
                            />
                        ) }
                        { type === 'video' && videoMp4 && (
                            <div>
                                <span>{ videoMp4.substring( videoMp4.lastIndexOf( '/' ) + 1 ) } </span>
                                <a
                                    href="#"
                                    onClick={ ( e ) => {
                                        setAttributes( {
                                            videoMp4: '',
                                        } );
                                        e.preventDefault();
                                    } }
                                >
                                    { __( '(Remove)' ) }
                                </a>
                                <div style={ { marginBottom: 13 } } />
                            </div>
                        ) }
                        { type === 'video' && ! videoOgv && (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    setAttributes( {
                                        videoOgv: '',
                                    } );
                                    wp.media.attachment( media.id ).fetch().then( ( data ) => {
                                        setAttributes( {
                                            videoOgv: data.url,
                                        } );
                                    } );
                                } }
                                type="video"
                                value={ videoOgv }
                                render={ ( { open } ) => (
                                    <div style={ { marginBottom: 13 } }>
                                        <Button onClick={ open } isPrimary>
                                            { __( 'Select OGV' ) }
                                        </Button>
                                    </div>
                                ) }
                            />
                        ) }
                        { type === 'video' && videoOgv && (
                            <div>
                                <span>{ videoOgv.substring( videoOgv.lastIndexOf( '/' ) + 1 ) } </span>
                                <a
                                    href="#"
                                    onClick={ ( e ) => {
                                        setAttributes( {
                                            videoOgv: '',
                                        } );
                                        e.preventDefault();
                                    } }
                                >
                                    { __( '(Remove)' ) }
                                </a>
                                <div style={ { marginBottom: 13 } } />
                            </div>
                        ) }
                        { type === 'video' && ! videoWebm && (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    setAttributes( {
                                        videoWebm: '',
                                    } );
                                    wp.media.attachment( media.id ).fetch().then( ( data ) => {
                                        setAttributes( {
                                            videoWebm: data.url,
                                        } );
                                    } );
                                } }
                                type="video"
                                value={ videoWebm }
                                render={ ( { open } ) => (
                                    <div style={ { marginBottom: 13 } }>
                                        <Button onClick={ open } isPrimary>
                                            { __( 'Select WEBM' ) }
                                        </Button>
                                    </div>
                                ) }
                            />
                        ) }
                        { type === 'video' && videoWebm && (
                            <div>
                                <span>{ videoWebm.substring( videoWebm.lastIndexOf( '/' ) + 1 ) } </span>
                                <a
                                    href="#"
                                    onClick={ ( e ) => {
                                        setAttributes( {
                                            videoWebm: '',
                                        } );
                                        e.preventDefault();
                                    } }
                                >
                                    { __( '(Remove)' ) }
                                </a>
                                <div style={ { marginBottom: 13 } } />
                            </div>
                        ) }
                        <SelectControl
                            label={ __( 'Aspect ratio' ) }
                            value={ videoAspectRatio }
                            options={ [
                                {
                                    value: '16:9',
                                    label: __( '16:9' ),
                                }, {
                                    value: '21:9',
                                    label: __( '21:9' ),
                                }, {
                                    value: '4:3',
                                    label: __( '4:3' ),
                                },
                            ] }
                            onChange={ ( value ) => setAttributes( { videoAspectRatio: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Volume' ) }
                            value={ videoVolume }
                            min="0"
                            max="100"
                            onChange={ v => setAttributes( { videoVolume: v } ) }
                        />
                        <TextControl
                            label={ __( 'Play Icon' ) }
                            value={ iconPlay }
                            help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                            onChange={ ( value ) => setAttributes( { iconPlay: value } ) }
                        />
                        <TextControl
                            label={ __( 'Loading Icon' ) }
                            value={ iconLoading }
                            help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                            onChange={ ( value ) => setAttributes( { iconLoading: value } ) }
                        />

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
                                <PanelColor title={ __( 'Fullscreen background color' ) } colorValue={ fullscreenBackgroundColor }>
                                    <ChromePicker
                                        color={ fullscreenBackgroundColor }
                                        onChangeComplete={ ( picker ) => {
                                            let newColor = picker.hex;

                                            if ( picker.rgb && picker.rgb.a < 1 ) {
                                                newColor = `rgba(${ picker.rgb.r }, ${ picker.rgb.g }, ${ picker.rgb.b }, ${ picker.rgb.a })`;
                                            }

                                            setAttributes( { fullscreenBackgroundColor: newColor } );
                                        } }
                                        style={ { width: '100%' } }
                                        disableAlpha={ false }
                                    />
                                </PanelColor>
                                <TextControl
                                    label={ __( 'Fullscreen close icon' ) }
                                    value={ fullscreenActionCloseIcon }
                                    help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                                    onChange={ ( value ) => setAttributes( { fullscreenActionCloseIcon: value } ) }
                                />
                            </Fragment>
                        ) : '' }
                    </PanelBody>

                    <PanelBody title={ __( 'Poster Image' ) }>
                        { ! poster && (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    onPosterSelect( media, setAttributes );
                                } }
                                type="image"
                                value={ poster }
                                render={ ( { open } ) => (
                                    <Button onClick={ open } isPrimary>
                                        { __( 'Select image' ) }
                                    </Button>
                                ) }
                            />
                        ) }

                        { poster && posterTag && (
                            <Fragment>
                                <MediaUpload
                                    onSelect={ ( media ) => {
                                        onPosterSelect( media, setAttributes );
                                    } }
                                    type="image"
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
                                { posterSizes && (
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
                                ) }
                            </Fragment>
                        ) }
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
                            <span className={ iconPlay } />
                        </div>
                    ) : '' }
                    { iconLoading ? (
                        <div className="ghostkit-video-loading-icon">
                            <span className={ iconLoading } />
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
            className,
        } = this.props;

        const {
            variant,

            type,
            video,
            videoMp4,
            videoOgv,
            videoWebm,
            videoAspectRatio,
            videoVolume,
            iconPlay,
            iconLoading,

            posterTag,

            clickAction,
            fullscreenActionCloseIcon,
            fullscreenBackgroundColor,
        } = attributes;

        const resultAttrs = {};

        resultAttrs.className = classnames(
            'ghostkit-video',
            className
        );
        if ( 'default' !== variant ) {
            resultAttrs.className = classnames( resultAttrs.className, `ghostkit-video-variant-${ variant }` );
        }

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
            resultAttrs[ 'data-fullscreen-action-close-icon' ] = fullscreenActionCloseIcon;
            resultAttrs[ 'data-fullscreen-background-color' ] = fullscreenBackgroundColor;
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
                        <span className={ iconPlay } />
                    </div>
                ) : '' }
                { iconLoading ? (
                    <div className="ghostkit-video-loading-icon">
                        <span className={ iconLoading } />
                    </div>
                ) : '' }
            </div>
        );
    }
}

export const name = 'ghostkit/video';

export const settings = {
    title: __( 'Video' ),
    description: __( 'YouTube/Vimeo video block.' ),
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'ghostkit',
    keywords: [
        __( 'video' ),
        __( 'youtube' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
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
        videoOgv: {
            type: 'string',
            default: '',
        },
        videoWebm: {
            type: 'string',
            default: '',
        },
        videoAspectRatio: {
            type: 'string',
            default: '16:9',
        },
        videoVolume: {
            type: 'number',
            default: 100,
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
            type: 'string',
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

    edit: withAPIData( ( { attributes } ) => {
        const { poster } = attributes;
        if ( ! poster ) {
            return {};
        }

        const query = `size=${ encodeURIComponent( attributes.posterSize ) }`;

        return {
            posterData: `/ghostkit/v1/get_attachment_image/${ poster }?${ query }`,
        };
    } )( VideoBlockEdit ),

    save: VideoBlockSave,

    deprecated: deprecatedArray,
};
