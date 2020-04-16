/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import fixXmlImportedContent from '../../utils/fix-xml-imported-content';
import IconPicker from '../../components/icon-picker';

import metadata from './block.json';

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
            photoTag,
            icon,
            source,
            stars,
            starsIcon,
            url,
            target,
            rel,
        } = attributes;

        let className = classnames(
            'ghostkit-testimonial',
            url ? 'ghostkit-testimonial-with-link' : ''
        );

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className }>
                { url ? (
                    <a className="ghostkit-testimonial-link" href={ url } target={ target || false } rel={ rel || false }>
                        <span />
                    </a>
                ) : '' }
                { icon ? (
                    <IconPicker.Render
                        name={ icon }
                        tag="div"
                        className="ghostkit-testimonial-icon"
                    />
                ) : '' }
                <div className="ghostkit-testimonial-content">
                    <InnerBlocks.Content />
                </div>
                { photoTag ? (
                    <div
                        className="ghostkit-testimonial-photo"
                        // eslint-disable-next-line react/no-danger
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
                { 'number' === typeof stars && starsIcon ? (
                    <div className="ghostkit-testimonial-stars">
                        <div className="ghostkit-testimonial-stars-wrap">
                            <div className="ghostkit-testimonial-stars-front" style={ { width: `${ ( 100 * stars ) / 5 }%` } }>
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
