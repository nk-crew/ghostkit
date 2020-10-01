/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import GapSettings from '../../components/gap-settings';
import { TemplatesModal } from '../../plugins/templates';

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
    PanelBody,
    RangeControl,
    Placeholder,
    Toolbar,
    Tooltip,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
} = wp.blockEditor;

const {
    compose,
} = wp.compose;

const {
    withSelect,
    withDispatch,
} = wp.data;

const { createBlock } = wp.blocks;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            isTemplatesModalOpen: false,
        };

        this.getColumnsFromLayout = this.getColumnsFromLayout.bind( this );
        this.onLayoutSelect = this.onLayoutSelect.bind( this );
        this.getLayoutsSelector = this.getLayoutsSelector.bind( this );
        this.updateColumns = this.updateColumns.bind( this );
    }

    /**
     * Select predefined layout.
     *
     * @param {String} layout layout string.
     */
    onLayoutSelect( layout ) {
        const {
            block,
            replaceInnerBlocks,
        } = this.props;

        const columnsData = this.getColumnsFromLayout( layout );
        const newInnerBlocks = [];

        columnsData.forEach( ( colAttrs ) => {
            newInnerBlocks.push( createBlock( 'ghostkit/grid-column', colAttrs ) );
        } );

        replaceInnerBlocks( block.clientId, newInnerBlocks, false );
    }

    /**
     * Get columns sizes array from layout string
     *
     * @param {string} layout - layout data. Example: `3-6-3`
     *
     * @return {array}.
     */
    // eslint-disable-next-line class-methods-use-this
    getColumnsFromLayout( layout ) {
        const result = [];
        const columnsData = layout.split( '-' );

        columnsData.forEach( ( col ) => {
            const colAttrs = {
                size: 'a' === col ? 'auto' : col,
            };

            // responsive.
            if ( 2 === columnsData.length ) {
                colAttrs.md_size = '12';
            }
            if ( 3 === columnsData.length ) {
                colAttrs.lg_size = '12';
            }
            if ( 4 === columnsData.length ) {
                colAttrs.md_size = '12';
                colAttrs.lg_size = '6';
            }
            if ( 5 === columnsData.length ) {
                colAttrs.sm_size = '12';
                colAttrs.md_size = '5';
                colAttrs.lg_size = '4';
            }
            if ( 6 === columnsData.length ) {
                colAttrs.sm_size = '6';
                colAttrs.md_size = '4';
                colAttrs.lg_size = '3';
            }

            result.push( colAttrs );
        } );

        return result;
    }

    /**
     * Layouts selector when no columns selected.
     *
     * @return {jsx}.
     */
    getLayoutsSelector() {
        const {
            removeBlock,
        } = this.props;

        let layouts = [
            '12',
            '6-6',
            '4-4-4',
            '3-3-3-3',

            '5-7',
            '7-5',
            '3-3-6',
            '3-6-3',

            '6-3-3',
            '2-8-2',
            'a-a-a-a-a',
            '2-2-2-2-2-2',
        ];
        layouts = applyFilters( 'ghostkit.editor.grid.layouts', layouts, this.props );

        return (
            <Placeholder
                icon={ getIcon( 'block-grid' ) }
                label={ __( 'Grid', '@@text_domain' ) }
                instructions={ __( 'Select one layout to get started.', '@@text_domain' ) }
                className="ghostkit-select-layout"
            >
                <div className="ghostkit-grid-layout-preview">
                    { layouts.map( ( layout ) => {
                        const columnsData = this.getColumnsFromLayout( layout );

                        return (
                            <Button
                                key={ `layout-${ layout }` }
                                className="ghostkit-grid-layout-preview-btn ghostkit-grid"
                                onClick={ () => this.onLayoutSelect( layout ) }
                            >
                                { columnsData.map( ( colAttrs, i ) => {
                                    const colName = `layout-${ layout }-col-${ i }`;

                                    return (
                                        <div
                                            key={ colName }
                                            className={ classnames( 'ghostkit-col', `ghostkit-col-${ colAttrs.size }` ) }
                                        />
                                    );
                                } ) }
                            </Button>
                        );
                    } ) }
                </div>
                <Button
                    isPrimary
                    onClick={ () => {
                        this.setState( { isTemplatesModalOpen: true } );
                    } }
                >
                    { __( 'Select Template', '@@text_domain' ) }
                </Button>
                { this.state.isTemplatesModalOpen || this.props.attributes.isTemplatesModalOnly ? (
                    <TemplatesModal
                        replaceBlockId={ this.props.clientId }
                        onRequestClose={ () => {
                            this.setState( { isTemplatesModalOpen: false } );

                            if ( this.props.attributes.isTemplatesModalOnly ) {
                                removeBlock( this.props.clientId );
                            }
                        } }
                    />
                ) : '' }
            </Placeholder>
        );
    }

    /**
     * Updates the column count
     *
     * @param {number} newColumns New column count.
     */
    updateColumns( newColumns ) {
        const {
            block,
            getBlocks,
            replaceInnerBlocks,
            columnsCount,
            removeBlock,
        } = this.props;

        // Remove Grid block.
        if ( 1 > newColumns ) {
            removeBlock( block.clientId );

            // Add new columns.
        } else if ( newColumns > columnsCount ) {
            const newCount = newColumns - columnsCount;
            const newInnerBlocks = [ ...getBlocks( block.clientId ) ];

            for ( let i = 1; i <= newCount; i += 1 ) {
                newInnerBlocks.push( createBlock( 'ghostkit/grid-column', { size: 3 } ) );
            }

            replaceInnerBlocks( block.clientId, newInnerBlocks, false );

            // Remove columns.
        } else if ( newColumns < columnsCount ) {
            const newInnerBlocks = [ ...getBlocks( block.clientId ) ];
            newInnerBlocks.splice( newColumns, columnsCount - newColumns );

            replaceInnerBlocks( block.clientId, newInnerBlocks, false );
        }
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            columnsCount,
        } = this.props;

        let { className = '' } = this.props;

        const {
            gap,
            gapCustom,
            verticalAlign,
            horizontalAlign,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-grid',
            `ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
        );

        // background
        const background = applyFilters( 'ghostkit.editor.grid.background', '', this.props );

        if ( background ) {
            className = classnames( className, 'ghostkit-grid-with-bg' );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                { 0 < columnsCount ? (
                    <BlockControls>
                        <Toolbar controls={ [
                            {
                                icon: getIcon( 'icon-vertical-top' ),
                                title: __( 'Content Vertical Start', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: '' } ),
                                isActive: '' === verticalAlign,
                            },
                            {
                                icon: getIcon( 'icon-vertical-center' ),
                                title: __( 'Content Vertical Center', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                isActive: 'center' === verticalAlign,
                            },
                            {
                                icon: getIcon( 'icon-vertical-bottom' ),
                                title: __( 'Content Vertical End', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                isActive: 'end' === verticalAlign,
                            },
                        ] }
                        />
                    </BlockControls>
                ) : '' }
                <InspectorControls>
                    <ApplyFilters name="ghostkit.editor.controls" attribute="columns" props={ this.props }>
                        <PanelBody>
                            <RangeControl
                                label={ __( 'Columns', '@@text_domain' ) }
                                value={ columnsCount }
                                onChange={ ( value ) => this.updateColumns( value ) }
                                min={ 1 }
                                max={ 12 }
                            />
                        </PanelBody>
                    </ApplyFilters>
                </InspectorControls>
                { 0 < columnsCount ? (
                    <InspectorControls>
                        <PanelBody>
                            <BaseControl
                                label={ __( 'Vertical alignment', '@@text_domain' ) }
                            >
                                <div>
                                    <Toolbar controls={ [
                                        {
                                            icon: getIcon( 'icon-vertical-top' ),
                                            title: __( 'Start', '@@text_domain' ),
                                            onClick: () => setAttributes( { verticalAlign: '' } ),
                                            isActive: '' === verticalAlign,
                                        },
                                        {
                                            icon: getIcon( 'icon-vertical-center' ),
                                            title: __( 'Center', '@@text_domain' ),
                                            onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                            isActive: 'center' === verticalAlign,
                                        },
                                        {
                                            icon: getIcon( 'icon-vertical-bottom' ),
                                            title: __( 'End', '@@text_domain' ),
                                            onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                            isActive: 'end' === verticalAlign,
                                        },
                                    ] }
                                    />
                                </div>
                            </BaseControl>
                            <BaseControl
                                label={ __( 'Horizontal alignment', '@@text_domain' ) }
                            >
                                <div>
                                    <Toolbar controls={ [
                                        {
                                            icon: getIcon( 'icon-horizontal-start' ),
                                            title: __( 'Start', '@@text_domain' ),
                                            onClick: () => setAttributes( { horizontalAlign: '' } ),
                                            isActive: '' === horizontalAlign,
                                        },
                                        {
                                            icon: getIcon( 'icon-horizontal-center' ),
                                            title: __( 'Center', '@@text_domain' ),
                                            onClick: () => setAttributes( { horizontalAlign: 'center' } ),
                                            isActive: 'center' === horizontalAlign,
                                        },
                                        {
                                            icon: getIcon( 'icon-horizontal-end' ),
                                            title: __( 'End', '@@text_domain' ),
                                            onClick: () => setAttributes( { horizontalAlign: 'end' } ),
                                            isActive: 'end' === horizontalAlign,
                                        },
                                        {
                                            icon: getIcon( 'icon-horizontal-around' ),
                                            title: __( 'Around', '@@text_domain' ),
                                            onClick: () => setAttributes( { horizontalAlign: 'around' } ),
                                            isActive: 'around' === horizontalAlign,
                                        },
                                        {
                                            icon: getIcon( 'icon-horizontal-between' ),
                                            title: __( 'Between', '@@text_domain' ),
                                            onClick: () => setAttributes( { horizontalAlign: 'between' } ),
                                            isActive: 'between' === horizontalAlign,
                                        },
                                    ] }
                                    />
                                </div>
                            </BaseControl>
                        </PanelBody>
                        <PanelBody>
                            <GapSettings
                                gap={ gap }
                                gapCustom={ gapCustom }
                                onChange={ ( data ) => {
                                    setAttributes( data );
                                } }
                            />
                        </PanelBody>
                    </InspectorControls>
                ) : '' }
                <InspectorControls>
                    <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={ this.props } />
                </InspectorControls>
                <div className={ className }>
                    { 0 < columnsCount ? (
                        <Fragment>
                            { background }
                            { ! isSelected ? (
                                <div className="ghostkit-grid-button-select">
                                    <Tooltip text={ __( 'Select Grid', '@@text_domain' ) }>
                                        { getIcon( 'block-grid' ) }
                                    </Tooltip>
                                </div>
                            ) : '' }
                            <InnerBlocks
                                allowedBlocks={ [ 'ghostkit/grid-column' ] }
                                orientation="horizontal"
                                renderAppender={ false }
                            />
                        </Fragment>
                    ) : this.getLayoutsSelector() }
                </div>
            </Fragment>
        );
    }
}

export default compose( [
    withSelect( ( select, ownProps ) => {
        const {
            getBlock,
            getBlocks,
            getBlockCount,
            isBlockSelected,
            hasSelectedInnerBlock,
        } = select( 'core/block-editor' );

        const { clientId } = ownProps;

        return {
            getBlocks,
            columnsCount: getBlockCount( clientId ),
            block: getBlock( clientId ),
            isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId, true ),
        };
    } ),
    withDispatch( ( dispatch ) => {
        const {
            updateBlockAttributes,
            removeBlock,
            replaceInnerBlocks,
        } = dispatch( 'core/block-editor' );

        return {
            updateBlockAttributes,
            removeBlock,
            replaceInnerBlocks,
        };
    } ),
] )( BlockEdit );
