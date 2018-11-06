// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/accordion.svg';

const { GHOSTKIT } = window;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
} = wp.editor;

/**
 * Returns the layouts configuration for a given number of items.
 *
 * @param {number} attributes items attributes.
 *
 * @return {Object[]} Tabs layout configuration.
 */
const getTabsTemplate = ( attributes ) => {
    const {
        itemsCount,
    } = attributes;
    const result = [];

    for ( let k = 1; k <= itemsCount; k++ ) {
        result.push( [ 'ghostkit/accordion-item', { itemNumber: k } ] );
    }

    return result;
};

class AccordionBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            itemsCount,
            collapseOne,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'accordion' );

        className = classnames(
            className,
            'ghostkit-accordion'
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-accordion-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

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
                        <RangeControl
                            label={ __( 'Items' ) }
                            value={ itemsCount }
                            onChange={ ( value ) => setAttributes( { itemsCount: value } ) }
                            min={ 1 }
                            max={ 6 }
                        />
                        <ToggleControl
                            label={ __( 'Collapse one item only' ) }
                            checked={ !! collapseOne }
                            onChange={ ( val ) => setAttributes( { collapseOne: val } ) }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <InnerBlocks
                        template={ getTabsTemplate( attributes ) }
                        templateLock="all"
                        allowedBlocks={ [ 'ghostkit/accordion-item' ] }
                    />
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/accordion';

export const settings = {
    title: __( 'Accordion' ),
    description: __( 'Accordion.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'accordion' ),
        __( 'tab' ),
        __( 'ghostkit' ),
    ],
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
        itemsCount: {
            type: 'number',
            default: 2,
        },
        collapseOne: {
            type: 'boolean',
            default: false,
        },
    },

    edit: AccordionBlock,

    save: function( props ) {
        const {
            variant,
            itemsCount,
            collapseOne,
        } = props.attributes;

        let {
            className,
        } = props.attributes;

        className = classnames(
            className,
            'ghostkit-accordion',
            `ghostkit-accordion-${ itemsCount }`,
            collapseOne ? 'ghostkit-accordion-collapse-one' : ''
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-accordion-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className }>
                <InnerBlocks.Content />
            </div>
        );
    },
};
