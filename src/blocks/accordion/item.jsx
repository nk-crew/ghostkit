// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/accordion.svg';

const { GHOSTKIT } = window;

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

        const availableVariants = GHOSTKIT.getVariants( 'accordion-item' );

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
                    <RichText
                        tagName="div"
                        className="ghostkit-accordion-item-heading"
                        placeholder={ __( 'Item label…' ) }
                        value={ heading }
                        onChange={ ( value ) => {
                            setAttributes( { heading: value } );
                        } }
                        formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                        format="string"
                        inlineToolbar
                    />
                    <button
                        className="ghostkit-accordion-item-collapse"
                        onClick={ () => setAttributes( { active: ! active } ) }
                    >
                        <span className="fas fa-angle-right" />
                    </button>
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
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'layout',
    supports: {
        html: false,
        className: false,
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        heading: {
            type: 'string',
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

    save: function( { attributes } ) {
        const {
            variant,
            heading,
            active,
            itemNumber,
        } = attributes;

        let {
            className,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-accordion-item',
            active ? 'ghostkit-accordion-item-active' : ''
        );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-accordion-item-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                <a href={ `#accordion-${ itemNumber }` } className="ghostkit-accordion-item-heading">
                    { heading }
                    <span className="ghostkit-accordion-item-collapse">
                        <span className="fas fa-angle-right" />
                    </span>
                </a>
                <div className="ghostkit-accordion-item-content"><InnerBlocks.Content /></div>
            </div>
        );
    },
};
