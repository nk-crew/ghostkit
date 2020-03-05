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
 * Internal dependencies
 */
import getUniqueSlug from '../../utils/get-unique-slug';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor() {
        super( ...arguments );

        this.updateSlug = this.updateSlug.bind( this );
        this.findParentAccordion = this.findParentAccordion.bind( this );
        this.removeItem = this.removeItem.bind( this );
    }

    componentDidUpdate( prevProps ) {
        const {
            attributes,
        } = this.props;

        const {
            attributes: prevAttributes,
        } = prevProps;

        if ( attributes.heading !== prevAttributes.heading || ! attributes.slug ) {
            this.updateSlug();
        }
    }

    updateSlug() {
        const {
            attributes,
            setAttributes,
            clientId,
        } = this.props;

        const {
            heading,
        } = attributes;

        const newSlug = getUniqueSlug( `accordion ${ heading }`, clientId );

        setAttributes( {
            slug: newSlug,
        } );
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

    removeItem() {
        const {
            rootBlock,
            removeBlock,
            clientId,
        } = this.props;

        const parentAccordion = this.findParentAccordion( rootBlock );

        if ( parentAccordion && parentAccordion.clientId ) {
            removeBlock( clientId );

            if ( parentAccordion.innerBlocks.length <= 1 ) {
                removeBlock( parentAccordion.clientId );
            }
        }
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
                            placeholder={ __( 'Write label…', '@@text_domain' ) }
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
                            <svg className="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.21967 6.2197C9.51256 5.9268 9.98744 5.9268 10.2803 6.2197L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L10.2803 17.7803C9.98744 18.0732 9.51256 18.0732 9.21967 17.7803C8.92678 17.4874 8.92678 17.0126 9.21967 16.7197L13.9393 12L9.21967 7.2803C8.92678 6.9874 8.92678 6.5126 9.21967 6.2197Z" fill="currentColor" /></svg>
                        </button>

                        <RemoveButton
                            show={ isSelectedBlockInRoot }
                            tooltipText={ __( 'Remove accordion item?', '@@text_domain' ) }
                            onRemove={ this.removeItem }
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
