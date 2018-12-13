// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/accordion.svg';
import deprecatedArray from './deprecated.jsx';

const { GHOSTKIT } = window;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    RichText,
} = wp.editor;

class AccordionItemBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        let {
            className = '',
        } = this.props;

        const {
            variant,
            heading,
            active,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-accordion-item',
            active ? 'ghostkit-accordion-item-active' : ''
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-accordion-item-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        const availableVariants = GHOSTKIT.getVariants( 'accordion_item' );

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
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <div className="ghostkit-accordion-item-heading">
                        <RichText
                            tagName="div"
                            className="ghostkit-accordion-item-label"
                            placeholder={ __( 'Item label…' ) }
                            value={ heading }
                            onChange={ ( value ) => {
                                setAttributes( { heading: value } );
                            } }
                            formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                            isSelected={ isSelected }
                            keepPlaceholderOnFocus
                        />
                        <button
                            className="ghostkit-accordion-item-collapse"
                            onClick={ () => setAttributes( { active: ! active } ) }
                        >
                            <span className="fas fa-angle-right" />
                        </button>
                    </div>
                    <div className="ghostkit-accordion-item-content"><InnerBlocks templateLock={ false } /></div>
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/accordion-item';

export const settings = {
    title: __( 'Item' ),
    parent: [ 'ghostkit/accordion' ],
    description: __( 'A single item within a accordion block.' ),
    icon: elementIcon,
    category: 'ghostkit',
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitSpacings: true,
        ghostkitDisplay: true,
        ghostkitSR: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        heading: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-accordion-item-label',
            default: 'Accordion Item',
        },
        active: {
            type: 'boolean',
            default: false,
        },
        itemNumber: {
            type: 'number',
        },
    },

    edit: AccordionItemBlock,

    save: function( { attributes, className = '' } ) {
        const {
            variant,
            heading,
            active,
            itemNumber,
        } = attributes;

        className = classnames(
            'ghostkit-accordion-item',
            className,
            active ? 'ghostkit-accordion-item-active' : ''
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-accordion-item-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                <a href={ `#accordion-${ itemNumber }` } className="ghostkit-accordion-item-heading">
                    <RichText.Content
                        className="ghostkit-accordion-item-label"
                        tagName="span"
                        value={ heading }
                    />
                    <span className="ghostkit-accordion-item-collapse">
                        <span className="fas fa-angle-right" />
                    </span>
                </a>
                <div className="ghostkit-accordion-item-content"><InnerBlocks.Content /></div>
            </div>
        );
    },

    deprecated: deprecatedArray,
};
