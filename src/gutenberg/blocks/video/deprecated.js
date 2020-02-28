/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const {
    applyFilters,
} = wp.hooks;

/**
 * Internal dependencies
 */
import metadata from './block.json';
import save from './save';
import fixXmlImportedContent from '../../utils/fix-xml-imported-content';

export default [
    // v2.8.2
    {
        ghostkit: {
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        supports: metadata.supports,
        attributes: {
            ...metadata.attributes,
            iconPlay: {
                type: 'string',
                default: 'fas fa-play',
            },
            iconLoading: {
                type: 'string',
                default: 'ghostkit-video-spinner',
            },
            fullscreenActionCloseIcon: {
                type: 'string',
                default: 'fas fa-times',
            },
        },
        save,
    },

    // v1.6.3
    {
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
        save: class VideoBlockSave extends Component {
            constructor() {
                super( ...arguments );

                // fix xml imported string.
                this.props.attributes.posterTag = fixXmlImportedContent( this.props.attributes.posterTag );
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
                        name: 'ghostkit/video',
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
                    resultAttrs[ 'data-fullscreen-action-close-icon' ] = fullscreenActionCloseIcon;
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
        },
    },

    // v1.0.0
    {
        ghostkit: {
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
                default: '16-9',
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
        },
        save: function( props ) {
            const {
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
            } = props.attributes;

            const resultAttrs = {};

            resultAttrs.className = classnames(
                'ghostkit-video',
                'ghostkit-video-aspect-ratio-' + videoAspectRatio,
                props.className
            );

            resultAttrs.className = applyFilters( 'ghostkit.blocks.className', resultAttrs.className, props );

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

            resultAttrs[ 'data-video-volume' ] = videoVolume;

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
        },
    },
];
