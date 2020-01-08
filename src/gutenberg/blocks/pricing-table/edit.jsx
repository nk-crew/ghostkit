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
    BaseControl,
    Button,
    ButtonGroup,
    PanelBody,
    Toolbar,
    IconButton,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
    AlignmentToolbar,
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
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor() {
        super( ...arguments );

        this.getInnerBlocksTemplate = this.getInnerBlocksTemplate.bind( this );
        this.maybeUpdateColumnsNumber = this.maybeUpdateColumnsNumber.bind( this );
    }

    /**
     * Returns the layouts configuration for a given number of items.
     *
     * @return {Object[]} Items layout configuration.
     */
    getInnerBlocksTemplate() {
        const {
            attributes,
        } = this.props;

        const {
            count,
        } = attributes;

        const result = [];

        if ( count > 0 ) {
            for ( let k = 1; k <= count; k++ ) {
                result.push( [ 'ghostkit/pricing-table-item' ] );
            }
        }

        return result;
    }

    componentDidMount() {
        this.maybeUpdateColumnsNumber();
    }
    componentDidUpdate() {
        this.maybeUpdateColumnsNumber();
    }

    /**
     * Update current columns number.
     */
    maybeUpdateColumnsNumber() {
        const {
            count,
        } = this.props.attributes;

        const {
            block,
            setAttributes,
        } = this.props;

        if ( block && block.innerBlocks && count !== block.innerBlocks.length ) {
            setAttributes( {
                count: block.innerBlocks.length,
            } );
        }
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelectedBlockInRoot,
            insertPricingItem,
        } = this.props;

        let { className = '' } = this.props;

        const {
            count,
            gap,
            verticalAlign,
            horizontalAlign,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-pricing-table',
            `ghostkit-pricing-table-gap-${ gap }`,
            verticalAlign ? `ghostkit-pricing-table-items-${ count }` : false,
            verticalAlign ? `ghostkit-pricing-table-align-vertical-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-pricing-table-align-horizontal-${ horizontalAlign }` : false
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <BlockControls>
                    <AlignmentToolbar
                        value={ horizontalAlign }
                        onChange={ ( val ) => setAttributes( { horizontalAlign: val } ) }
                    />
                </BlockControls>
                { count > 1 ? (
                    <BlockControls>
                        <Toolbar controls={ [
                            {
                                icon: getIcon( 'icon-vertical-top' ),
                                title: __( 'ItemsVertical Start', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: '' } ),
                                isActive: verticalAlign === '',
                            },
                            {
                                icon: getIcon( 'icon-vertical-center' ),
                                title: __( 'ItemsVertical Center', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                isActive: verticalAlign === 'center',
                            },
                            {
                                icon: getIcon( 'icon-vertical-bottom' ),
                                title: __( 'ItemsVertical End', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                isActive: verticalAlign === 'end',
                            },
                        ] }
                        />
                    </BlockControls>
                ) : '' }
                <InspectorControls>
                    <PanelBody>
                        <BaseControl label={ __( 'Vertical align', '@@text_domain' ) }>
                            <Toolbar controls={ [
                                {
                                    icon: getIcon( 'icon-vertical-top' ),
                                    title: __( 'ItemsVertical Start', '@@text_domain' ),
                                    onClick: () => setAttributes( { verticalAlign: '' } ),
                                    isActive: verticalAlign === '',
                                },
                                {
                                    icon: getIcon( 'icon-vertical-center' ),
                                    title: __( 'ItemsVertical Center', '@@text_domain' ),
                                    onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                    isActive: verticalAlign === 'center',
                                },
                                {
                                    icon: getIcon( 'icon-vertical-bottom' ),
                                    title: __( 'ItemsVertical End', '@@text_domain' ),
                                    onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                    isActive: verticalAlign === 'end',
                                },
                            ] }
                            />
                        </BaseControl>
                        <BaseControl label={ __( 'Horizontal align', '@@text_domain' ) }>
                            <AlignmentToolbar
                                value={ horizontalAlign }
                                onChange={ ( val ) => setAttributes( { horizontalAlign: val } ) }
                                isCollapsed={ false }
                            />
                        </BaseControl>
                    </PanelBody>
                    <PanelBody>
                        <BaseControl label={ __( 'Gap', '@@text_domain' ) }>
                            <ButtonGroup>
                                {
                                    [
                                        {
                                            label: __( 'none', '@@text_domain' ),
                                            value: 'no',
                                        },
                                        {
                                            label: __( 'sm', '@@text_domain' ),
                                            value: 'sm',
                                        },
                                        {
                                            label: __( 'md', '@@text_domain' ),
                                            value: 'md',
                                        },
                                        {
                                            label: __( 'lg', '@@text_domain' ),
                                            value: 'lg',
                                        },
                                    ].map( ( val ) => {
                                        const selected = gap === val.value;

                                        return (
                                            <Button
                                                isDefault
                                                isPrimary={ selected }
                                                aria-pressed={ selected }
                                                onClick={ () => setAttributes( { gap: val.value } ) }
                                                key={ `gap_${ val.label }` }
                                            >
                                                { val.label }
                                            </Button>
                                        );
                                    } )
                                }
                            </ButtonGroup>
                        </BaseControl>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { count > 0 ? (
                        <InnerBlocks
                            template={ this.getInnerBlocksTemplate() }
                            allowedBlocks={ [ 'ghostkit/pricing-table-item' ] }
                        />
                    ) : '' }
                </div>
                { isSelectedBlockInRoot && count < 6 ? (
                    <div className="ghostkit-accordion-add-item">
                        <IconButton
                            icon={ 'insert' }
                            onClick={ () => {
                                insertPricingItem();
                            } }
                        >
                            { __( 'Add Pricing Table', '@@text_domain' ) }
                        </IconButton>
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
            insertPricingItem() {
                insertBlock( createBlock( 'ghostkit/pricing-table-item' ), undefined, clientId );
            },
        };
    } ),
] )( BlockEdit );
