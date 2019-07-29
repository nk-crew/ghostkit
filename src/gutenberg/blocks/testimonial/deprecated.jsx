/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const {
    applyFilters,
} = wp.hooks;

const {
    InnerBlocks,
    RichText,
} = wp.editor;

/**
 * Internal dependencies
 */
import fixXmlImportedContent from '../../utils/fix-xml-imported-content';
import IconPicker from '../../components/icon-picker';

export default [
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
            anchor: true,
            align: [ 'wide', 'full' ],
        },
        attributes: {
            icon: {
                type: 'string',
                default: 'fas fa-quote-left',
            },
            photo: {
                type: 'number',
                default: '',
            },
            photoTag: {
                type: 'string',
                default: '',
            },
            photoSizes: {
                type: 'object',
                default: '',
            },
            photoSize: {
                type: 'string',
                default: 'thumbnail',
            },
            name: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-testimonial-name',
                default: [
                    {
                        props: {
                            children: [ 'Katrina Craft' ],
                        },
                        type: 'strong',
                    },
                ],
            },
            source: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-testimonial-source',
                default: 'Designer',
            },
        },
        save: class TestimonialBlockSave extends Component {
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
                } = attributes;

                let className = 'ghostkit-testimonial';

                className = applyFilters( 'ghostkit.blocks.className', className, {
                    ...{
                        name: 'ghostkit/testimonial',
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
                        { ( attributes.name && attributes.name.length > 0 ) || ( source && source.length > 0 ) ? (
                            <div className="ghostkit-testimonial-meta">
                                { ! RichText.isEmpty( attributes.name ) ? (
                                    <RichText.Content
                                        tagName="div"
                                        className="ghostkit-testimonial-name"
                                        value={ attributes.name }
                                    />
                                ) : '' }
                                { ! RichText.isEmpty( source ) ? (
                                    <RichText.Content
                                        tagName="small"
                                        className="ghostkit-testimonial-source"
                                        value={ source }
                                    />
                                ) : '' }
                            </div>
                        ) : '' }
                    </div>
                );
            }
        },
    },
];
