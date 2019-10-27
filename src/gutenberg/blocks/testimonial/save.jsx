/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const {
    InnerBlocks,
    RichText,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import fixXmlImportedContent from '../../utils/fix-xml-imported-content';

import IconPicker from '../../components/icon-picker';

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
            photoTag,
            icon,
            source,
            stars,
            starsIcon,
        } = attributes;

        let className = 'ghostkit-testimonial';

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className }>
                { icon ? (
                    <div className="ghostkit-testimonial-icon">
                        <IconPicker.Render name={ icon } />
                    </div>
                ) : '' }
                <div className="ghostkit-testimonial-content">
                    <InnerBlocks.Content />
                </div>
                { photoTag ? (
                    <div className="ghostkit-testimonial-photo"
                        dangerouslySetInnerHTML={ {
                            __html: photoTag,
                        } }
                    />
                ) : '' }
                { ! RichText.isEmpty( attributes.name ) || ! RichText.isEmpty( source ) ? (
                    <div className="ghostkit-testimonial-meta">
                        { ! RichText.isEmpty( attributes.name ) ? (
                            <div className="ghostkit-testimonial-name">
                                <RichText.Content value={ attributes.name } />
                            </div>
                        ) : '' }
                        { ! RichText.isEmpty( source ) ? (
                            <div className="ghostkit-testimonial-source">
                                <RichText.Content value={ source } />
                            </div>
                        ) : '' }
                    </div>
                ) : '' }
                { typeof stars === 'number' && starsIcon ? (
                    <div className="ghostkit-testimonial-stars">
                        <div className="ghostkit-testimonial-stars-wrap">
                            <div className="ghostkit-testimonial-stars-front" style={ { width: `${ 100 * stars / 5 }%` } }>
                                <IconPicker.Render name={ starsIcon } />
                                <IconPicker.Render name={ starsIcon } />
                                <IconPicker.Render name={ starsIcon } />
                                <IconPicker.Render name={ starsIcon } />
                                <IconPicker.Render name={ starsIcon } />
                            </div>
                            <div className="ghostkit-testimonial-stars-back">
                                <IconPicker.Render name={ starsIcon } />
                                <IconPicker.Render name={ starsIcon } />
                                <IconPicker.Render name={ starsIcon } />
                                <IconPicker.Render name={ starsIcon } />
                                <IconPicker.Render name={ starsIcon } />
                            </div>
                        </div>
                    </div>
                ) : '' }
            </div>
        );
    }
}

export default BlockSave;
