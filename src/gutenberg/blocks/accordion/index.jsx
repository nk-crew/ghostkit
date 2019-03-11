// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    ToggleControl,
    IconButton,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
} = wp.editor;

const {
    createBlock,
} = wp.blocks;

const {
    compose,
} = wp.compose;
const {
    withSelect,
    withDispatch,
} = wp.data;

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
    constructor() {
        super( ...arguments );

        this.maybeUpdateItemsCount = this.maybeUpdateItemsCount.bind( this );
    }

    componentDidMount() {
        this.maybeUpdateItemsCount();
    }
    componentDidUpdate() {
        this.maybeUpdateItemsCount();
    }

    /**
     * Update current items number.
     */
    maybeUpdateItemsCount() {
        const {
            itemsCount,
        } = this.props.attributes;

        const {
            block,
            setAttributes,
        } = this.props;

        if ( itemsCount !== block.innerBlocks.length ) {
            setAttributes( {
                itemsCount: block.innerBlocks.length,
            } );
        }
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelectedBlockInRoot,
            insertAccordionItem,
        } = this.props;

        let { className = '' } = this.props;

        const {
            collapseOne,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-accordion'
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
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
                        allowedBlocks={ [ 'ghostkit/accordion-item' ] }
                    />
                </div>
                { isSelectedBlockInRoot ? (
                    <div className="ghostkit-accordion-add-item">
                        <IconButton
                            icon={ 'insert' }
                            onClick={ () => {
                                insertAccordionItem();
                            } }
                        >
                            { __( 'Add Accordion Item' ) }
                        </IconButton>
                    </div>
                ) : '' }
            </Fragment>
        );
    }
}

export const name = 'ghostkit/accordion';

export const settings = {
    title: __( 'Accordion' ),
    description: __( 'Toggle the visibility of content across your project.' ),
    icon: getIcon( 'block-accordion', true ),
    category: 'ghostkit',
    keywords: [
        __( 'accordion' ),
        __( 'collapsible' ),
        __( 'collapse' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/accordion/',
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
        itemsCount: {
            type: 'number',
            default: 2,
        },
        collapseOne: {
            type: 'boolean',
            default: false,
        },
    },

    edit: compose( [
        withSelect( ( select, ownProps ) => {
            const {
                getBlock,
                isBlockSelected,
                hasSelectedInnerBlock,
            } = select( 'core/editor' );

            const { clientId } = ownProps;

            return {
                block: getBlock( clientId ),
                isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId, true ),
            };
        } ),
        withDispatch( ( dispatch, ownProps ) => {
            const {
                insertBlock,
            } = dispatch( 'core/editor' );

            const { clientId } = ownProps;

            return {
                insertAccordionItem() {
                    insertBlock( createBlock( 'ghostkit/accordion-item' ), undefined, clientId );
                },
            };
        } ),
    ] )( AccordionBlock ),

    save: function( props ) {
        const {
            itemsCount,
            collapseOne,
        } = props.attributes;

        let className = classnames(
            'ghostkit-accordion',
            `ghostkit-accordion-${ itemsCount }`,
            collapseOne ? 'ghostkit-accordion-collapse-one' : ''
        );

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
