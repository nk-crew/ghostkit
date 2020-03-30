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

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import GapSettings from '../../components/gap-settings';
import { TemplatesModal } from '../../plugins/templates';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            selectedLayout: false,
            isTemplatesModalOpen: false,
        };

        this.getColumnsTemplate = this.getColumnsTemplate.bind( this );
        this.onLayoutSelect = this.onLayoutSelect.bind( this );
        this.getColumnsFromLayout = this.getColumnsFromLayout.bind( this );
        this.getLayoutsSelector = this.getLayoutsSelector.bind( this );
    }

    componentDidUpdate() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let {
            columns,
        } = attributes;

        // update columns number
        if ( this.state.selectedLayout ) {
            const columnsData = this.getColumnsFromLayout( this.state.selectedLayout );
            columns = columnsData.length;

            setAttributes( {
                columns,
            } );

            this.setState( {
                selectedLayout: false,
            } );
        }
    }

    /**
     * Returns the layouts configuration for a given number of columns.
     *
     * @return {Object[]} Columns layout configuration.
     */
    getColumnsTemplate() {
        const {
            attributes,
        } = this.props;

        let {
            columns,
        } = attributes;

        const result = [];

        // Appender added in Gutenberg 5.7.0, so we need to add fallback to columns.
        const appenderExist = typeof InnerBlocks.ButtonBlockAppender !== 'undefined';

        // create columns from selected layout.
        if ( columns < 1 && this.state.selectedLayout ) {
            const columnsData = this.getColumnsFromLayout( this.state.selectedLayout );
            columns = columnsData.length;

            columnsData.forEach( ( colAttrs ) => {
                result.push( [
                    'ghostkit/grid-column',
                    colAttrs,
                    appenderExist ? [] : [ [ 'core/paragraph', { content: 'Column ' + ( colAttrs.size === 'auto' ? 'Auto' : colAttrs.size ) } ] ],
                ] );
            } );

        // create columns template from columns count.
        } else {
            for ( let k = 1; k <= columns; k++ ) {
                result.push( [ 'ghostkit/grid-column' ] );
            }
        }

        return result;
    }

    /**
     * Get columns sizes array from layout string
     *
     * @param {string} layout - layout data. Example: `3-6-3`
     *
     * @return {array}.
     */
    getColumnsFromLayout( layout ) {
        const result = [];
        const columnsData = layout.split( '-' );

        columnsData.forEach( ( col ) => {
            const colAttrs = {
                size: col === 'a' ? 'auto' : col,
            };

            // responsive.
            if ( columnsData.length === 2 ) {
                colAttrs.md_size = '12';
            }
            if ( columnsData.length === 3 ) {
                colAttrs.lg_size = '12';
            }
            if ( columnsData.length === 4 ) {
                colAttrs.md_size = '12';
                colAttrs.lg_size = '6';
            }
            if ( columnsData.length === 5 ) {
                colAttrs.sm_size = '12';
                colAttrs.md_size = '5';
                colAttrs.lg_size = '4';
            }
            if ( columnsData.length === 6 ) {
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
                            <button
                                key={ `layout-${ layout }` }
                                className="ghostkit-grid-layout-preview-btn"
                                onClick={ () => this.onLayoutSelect( layout ) }
                            >
                                { columnsData.map( ( colAttrs, i ) => {
                                    return (
                                        <div
                                            key={ `layout-${ layout }-col-${ i }` }
                                            className={ classnames( 'ghostkit-col', `ghostkit-col-${ colAttrs.size }` ) }
                                        />
                                    );
                                } ) }
                            </button>
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
                                const {
                                    removeBlock,
                                } = wp.data.dispatch( 'core/block-editor' );

                                removeBlock( this.props.clientId );
                            }
                        } }
                    />
                ) : '' }
            </Placeholder>
        );
    }

    /**
     * Select predefined layout.
     *
     * @param {String} layout layout string.
     */
    onLayoutSelect( layout ) {
        this.setState( {
            selectedLayout: layout,
        } );
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        let { className = '' } = this.props;

        const {
            columns,
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
                { columns > 0 ? (
                    <BlockControls>
                        <Toolbar controls={ [
                            {
                                icon: getIcon( 'icon-vertical-top' ),
                                title: __( 'Content Vertical Start', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: '' } ),
                                isActive: verticalAlign === '',
                            },
                            {
                                icon: getIcon( 'icon-vertical-center' ),
                                title: __( 'Content Vertical Center', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                isActive: verticalAlign === 'center',
                            },
                            {
                                icon: getIcon( 'icon-vertical-bottom' ),
                                title: __( 'Content Vertical End', '@@text_domain' ),
                                onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                isActive: verticalAlign === 'end',
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
                                value={ columns }
                                onChange={ ( value ) => setAttributes( { columns: value } ) }
                                min={ 1 }
                                max={ 12 }
                            />
                        </PanelBody>
                    </ApplyFilters>
                </InspectorControls>
                { columns > 0 ? (
                    <InspectorControls>
                        <PanelBody>
                            <BaseControl
                                label={ __( 'Vertical alignment', '@@text_domain' ) }
                            >
                                <Toolbar controls={ [
                                    {
                                        icon: getIcon( 'icon-vertical-top' ),
                                        title: __( 'Start', '@@text_domain' ),
                                        onClick: () => setAttributes( { verticalAlign: '' } ),
                                        isActive: verticalAlign === '',
                                    },
                                    {
                                        icon: getIcon( 'icon-vertical-center' ),
                                        title: __( 'Center', '@@text_domain' ),
                                        onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                        isActive: verticalAlign === 'center',
                                    },
                                    {
                                        icon: getIcon( 'icon-vertical-bottom' ),
                                        title: __( 'End', '@@text_domain' ),
                                        onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                        isActive: verticalAlign === 'end',
                                    },
                                ] }
                                />
                            </BaseControl>
                            <BaseControl
                                label={ __( 'Horizontal alignment', '@@text_domain' ) }
                            >
                                <Toolbar controls={ [
                                    {
                                        icon: getIcon( 'icon-horizontal-start' ),
                                        title: __( 'Start', '@@text_domain' ),
                                        onClick: () => setAttributes( { horizontalAlign: '' } ),
                                        isActive: horizontalAlign === '',
                                    },
                                    {
                                        icon: getIcon( 'icon-horizontal-center' ),
                                        title: __( 'Center', '@@text_domain' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'center' } ),
                                        isActive: horizontalAlign === 'center',
                                    },
                                    {
                                        icon: getIcon( 'icon-horizontal-end' ),
                                        title: __( 'End', '@@text_domain' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'end' } ),
                                        isActive: horizontalAlign === 'end',
                                    },
                                    {
                                        icon: getIcon( 'icon-horizontal-around' ),
                                        title: __( 'Around', '@@text_domain' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'around' } ),
                                        isActive: horizontalAlign === 'around',
                                    },
                                    {
                                        icon: getIcon( 'icon-horizontal-between' ),
                                        title: __( 'Between', '@@text_domain' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'between' } ),
                                        isActive: horizontalAlign === 'between',
                                    },
                                ] }
                                />
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
                    <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={ this.props }></ApplyFilters>
                </InspectorControls>
                <div className={ className }>
                    { columns > 0 || this.state.selectedLayout ? (
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
                                template={ this.getColumnsTemplate() }
                                templateLock="all"
                                allowedBlocks={ [ 'ghostkit/grid-column' ] }
                            />
                        </Fragment>
                    ) : this.getLayoutsSelector() }
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
