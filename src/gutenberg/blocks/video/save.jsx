/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';
import fixXmlImportedContent from '../../utils/fix-xml-imported-content';
import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
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

export default BlockSave;
