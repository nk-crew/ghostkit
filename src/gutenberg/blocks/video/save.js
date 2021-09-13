/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';
import fixXmlImportedContent from '../../utils/fix-xml-imported-content';
import {
    hasClass,
} from '../../utils/classes-replacer';

import metadata from './block.json';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    constructor( props ) {
        super( props );

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
            videoLoop,

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

        if ( 'fullscreen' === clickAction ) {
            resultAttrs[ 'data-fullscreen-background-color' ] = fullscreenBackgroundColor;
        } else {
            if ( videoAutoplay ) {
                resultAttrs[ 'data-video-autoplay' ] = 'true';
            }
            if ( videoAutopause ) {
                resultAttrs[ 'data-video-autopause' ] = 'true';
            }
            if ( videoLoop ) {
                resultAttrs[ 'data-video-loop' ] = 'true';
            }
        }

        return (
            <div { ...resultAttrs }>
                { posterTag && ! hasClass( resultAttrs.className, 'is-style-icon-only' ) ? (
                    <div
                        className="ghostkit-video-poster"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={ {
                            __html: posterTag,
                        } }
                    />
                ) : '' }
                { iconPlay ? (
                    <IconPicker.Render
                        name={ iconPlay }
                        tag="div"
                        className="ghostkit-video-play-icon"
                    />
                ) : '' }
                { iconLoading ? (
                    <IconPicker.Render
                        name={ iconLoading }
                        tag="div"
                        className="ghostkit-video-loading-icon"
                    />
                ) : '' }
                { 'fullscreen' === clickAction && fullscreenActionCloseIcon ? (
                    <IconPicker.Render
                        name={ fullscreenActionCloseIcon }
                        tag="div"
                        className="ghostkit-video-fullscreen-close-icon"
                    />
                ) : '' }
            </div>
        );
    }
}

export default BlockSave;
