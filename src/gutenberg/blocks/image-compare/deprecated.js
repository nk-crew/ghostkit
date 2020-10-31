/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const {
    Component,
} = wp.element;

const {
    RichText,
} = wp.blockEditor;

export default [
    // 2.15.0
    {
        ...metadata,
        ghostkit: {
            previewUrl: 'https://ghostkit.io/blocks/image-compare/',
            customStylesCallback( attributes ) {
                return {
                    '--gkt-image-compare__position': 'undefined' !== typeof attributes.position ? `${ attributes.position }%` : undefined,
                };
            },
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        save: class BlockSave extends Component {
            render() {
                const {
                    caption,
                    beforeId,
                    beforeUrl,
                    beforeAlt,
                    beforeWidth,
                    beforeHeight,
                    afterId,
                    afterUrl,
                    afterAlt,
                    afterWidth,
                    afterHeight,
                } = this.props.attributes;

                if ( ! beforeUrl || ! afterUrl ) {
                    return null;
                }

                let {
                    className,
                } = this.props.attributes;

                className = classnames(
                    'ghostkit-image-compare',
                    className
                );

                return (
                    <figure className={ className }>
                        <div className="ghostkit-image-compare-images">
                            <div className="ghostkit-image-compare-image-before">
                                <img
                                    src={ beforeUrl }
                                    alt={ beforeAlt }
                                    className={ beforeId ? `wp-image-${ beforeId }` : null }
                                    width={ beforeWidth }
                                    height={ beforeHeight }
                                />
                            </div>
                            <div className="ghostkit-image-compare-image-after">
                                <img
                                    src={ afterUrl }
                                    alt={ afterAlt }
                                    className={ afterId ? `wp-image-${ afterId }` : null }
                                    width={ afterWidth }
                                    height={ afterHeight }
                                />
                            </div>
                            <div className="ghostkit-image-compare-images-divider">
                                <div className="ghostkit-image-compare-images-divider-button-arrow-left">
                                    <svg width="24" height="24" viewbox="0 0 24 24" fill="none"><path d="M14 7l-5 5 5 5" stroke="currentColor" strokewidth="1.5" strokelinecap="round" strokelinejoin="round" fill="transparent" /></svg>
                                </div>
                                <div className="ghostkit-image-compare-images-divider-button-arrow-right">
                                    <svg width="24" height="24" viewbox="0 0 24 24" fill="none"><path d="M10 17l5-5-5-5" stroke="currentColor" strokewidth="1.5" strokelinecap="round" strokelinejoin="round" fill="transparent" /></svg>
                                </div>
                            </div>
                        </div>
                        { ! RichText.isEmpty( caption ) ? (
                            <RichText.Content className="ghostkit-image-compare-caption" tagName="figcaption" value={ caption } />
                        ) : '' }
                    </figure>
                );
            }
        },
    },
];
