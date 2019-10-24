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
    Toolbar,
} = wp.components;

const {
    BlockControls,
    InnerBlocks,
    RichText,
} = wp.blockEditor;

const {
    compose,
} = wp.compose;

const {
    withSelect,
    withDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import RemoveButton from '../../components/remove-button';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor() {
        super( ...arguments );

        this.findParentAccordion = this.findParentAccordion.bind( this );
    }

    findParentAccordion( rootBlock ) {
        const {
            block,
        } = this.props;

        let result = false;

        if ( rootBlock.innerBlocks && rootBlock.innerBlocks.length ) {
            rootBlock.innerBlocks.forEach( ( item ) => {
                if ( ! result && item.clientId === block.clientId ) {
                    result = rootBlock;
                } else if ( ! result ) {
                    result = this.findParentAccordion( item );
                }
            } );
        }

        return result;
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            isSelectedBlockInRoot,
        } = this.props;

        let {
            className = '',
        } = this.props;

        const {
            heading,
            active,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-accordion-item',
            active ? 'ghostkit-accordion-item-active' : ''
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <BlockControls>
                    <Toolbar controls={ [
                        {
                            icon: getIcon( 'icon-collapse' ),
                            title: __( 'Collapse', '@@text_domain' ),
                            onClick: () => setAttributes( { active: ! active } ),
                            isActive: active,
                        },
                    ] } />
                </BlockControls>
                <div className={ className }>
                    <div className="ghostkit-accordion-item-heading">
                        <RichText
                            tagName="div"
                            className="ghostkit-accordion-item-label"
                            placeholder={ __( 'Item label…', '@@text_domain' ) }
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

                        <RemoveButton
                            show={ isSelectedBlockInRoot }
                            tooltipText={ __( 'Remove accordion item?', '@@text_domain' ) }
                            onRemove={ () => {
                                const parentAccordion = this.findParentAccordion( this.props.rootBlock );
                                if ( parentAccordion && parentAccordion.clientId ) {
                                    this.props.removeBlock( this.props.clientId );

                                    if ( parentAccordion.innerBlocks.length <= 1 ) {
                                        this.props.removeBlock( parentAccordion.clientId );
                                    }
                                }
                            } }
                            style={ {
                                top: '50%',
                                marginTop: -11,
                            } }
                        />
                    </div>
                    <div className="ghostkit-accordion-item-content"><InnerBlocks templateLock={ false } /></div>
                </div>
            </Fragment>
        );
    }
}

export default compose( [
    withSelect( ( select, ownProps ) => {
        const {
            getBlockHierarchyRootClientId,
            getBlock,
            isBlockSelected,
            hasSelectedInnerBlock,
        } = select( 'core/block-editor' );

        const { clientId } = ownProps;

        return {
            block: getBlock( clientId ),
            isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId, true ),
            rootBlock: clientId ? getBlock( getBlockHierarchyRootClientId( clientId ) ) : null,
        };
    } ),
    withDispatch( ( dispatch ) => {
        const {
            updateBlockAttributes,
            removeBlock,
        } = dispatch( 'core/block-editor' );

        return {
            updateBlockAttributes,
            removeBlock,
        };
    } ),
] )( BlockEdit );
