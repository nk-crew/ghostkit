/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    PanelBody,
    ToggleControl,
    Button,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
} = wp.blockEditor;

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
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor( props ) {
        super( props );

        this.getAccordionsTemplate = this.getAccordionsTemplate.bind( this );
        this.maybeUpdateItemsCount = this.maybeUpdateItemsCount.bind( this );
    }

    componentDidMount() {
        this.maybeUpdateItemsCount();
    }

    componentDidUpdate() {
        this.maybeUpdateItemsCount();
    }

    /**
     * Returns the layouts configuration for a given number of items.
     *
     * @param {number} attributes items attributes.
     *
     * @return {Object[]} Tabs layout configuration.
     */
    getAccordionsTemplate() {
        const {
            itemsCount,
        } = this.props.attributes;

        const result = [];

        for ( let k = 1; k <= itemsCount; k += 1 ) {
            result.push( [ 'ghostkit/accordion-item' ] );
        }

        return result;
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

        if ( block && block.innerBlocks && itemsCount !== block.innerBlocks.length ) {
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
                            label={ __( 'Collapse one item only', '@@text_domain' ) }
                            checked={ !! collapseOne }
                            onChange={ ( val ) => setAttributes( { collapseOne: val } ) }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <InnerBlocks
                        template={ this.getAccordionsTemplate() }
                        allowedBlocks={ [ 'ghostkit/accordion-item' ] }
                    />
                </div>
                { isSelectedBlockInRoot ? (
                    <div className="ghostkit-accordion-add-item">
                        <Button
                            isSecondary
                            icon="insert"
                            onClick={ () => {
                                insertAccordionItem();
                            } }
                        >
                            { __( 'Add Accordion Item', '@@text_domain' ) }
                        </Button>
                    </div>
                ) : '' }
            </Fragment>
        );
    }
}

export default compose( [
    withSelect( ( select, ownProps ) => {
        const {
            getBlock,
            isBlockSelected,
            hasSelectedInnerBlock,
        } = select( 'core/block-editor' );

        const { clientId } = ownProps;

        return {
            block: getBlock( clientId ),
            isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId, true ),
        };
    } ),
    withDispatch( ( dispatch, ownProps ) => {
        const {
            insertBlock,
        } = dispatch( 'core/block-editor' );

        const { clientId } = ownProps;

        return {
            insertAccordionItem() {
                insertBlock( createBlock( 'ghostkit/accordion-item' ), undefined, clientId );
            },
        };
    } ),
] )( BlockEdit );
