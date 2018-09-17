// External Dependencies.
import classnames from 'classnames/dedupe';

export default [
    {
        supports: {
            html: false,
            className: false,
            align: [ 'wide', 'full' ],
            ghostkitStyles: true,
            ghostkitSpacings: true,
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
        save: function( { attributes, className = '' } ) {
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
            } = attributes;

            const resultAttrs = {};

            resultAttrs.className = classnames(
                'ghostkit-video',
                'ghostkit-video-aspect-ratio-' + videoAspectRatio,
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
