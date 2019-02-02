// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../_utils/get-icon.jsx';
import deprecatedArray from './deprecated.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';
import ColorPicker from '../_components/color-picker.jsx';

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
    RangeControl,
    Placeholder,
    Toolbar,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
} = wp.editor;

class GridBlock extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            selectedLayout: false,
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

        // create columns from selected layout.
        if ( columns < 1 && this.state.selectedLayout ) {
            const columnsData = this.getColumnsFromLayout( this.state.selectedLayout );
            columns = columnsData.length;

            columnsData.forEach( ( colAttrs ) => {
                result.push( [ 'ghostkit/grid-column', colAttrs, [
                    [ 'core/paragraph', { content: 'Column ' + ( colAttrs.size === 'auto' ? 'Auto' : colAttrs.size ) } ],
                ] ] );
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
                icon={ getIcon( 'block-grid', true ) }
                label={ __( 'Grid' ) }
                instructions={ __( 'Select one layout to get started.' ) }
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
            verticalAlign,
            horizontalAlign,
            awb_color, // eslint-disable-line
        } = attributes;

        className = classnames(
            className,
            'ghostkit-grid',
            `ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
        );

        // background
        let background = '';
        // eslint-disable-next-line
        if ( awb_color ) {
            background = (
                <div className="awb-gutenberg-preview-block">
                    <div className="nk-awb-overlay" style={ { 'background-color': awb_color } }></div>
                </div>
            );
        }

        background = applyFilters( 'ghostkit.editor.grid.background', background, this.props );

        if ( background ) {
            className = classnames( className, 'ghostkit-grid-with-bg' );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                { columns > 1 ? (
                    <BlockControls>
                        <Toolbar controls={ [
                            {
                                icon: getIcon( 'icon-vertical-top', true ),
                                title: __( 'Content Vertical Start' ),
                                onClick: () => setAttributes( { verticalAlign: '' } ),
                                isActive: verticalAlign === '',
                            },
                            {
                                icon: getIcon( 'icon-vertical-center', true ),
                                title: __( 'Content Vertical Center' ),
                                onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                isActive: verticalAlign === 'center',
                            },
                            {
                                icon: getIcon( 'icon-vertical-bottom', true ),
                                title: __( 'Content Vertical End' ),
                                onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                isActive: verticalAlign === 'end',
                            },
                        ] }
                        />
                    </BlockControls>
                ) : '' }
                { columns > 1 ? (
                    <InspectorControls>
                        <ApplyFilters name="ghostkit.editor.controls" attribute="columns" props={ this.props }>
                            <PanelBody>
                                <RangeControl
                                    label={ __( 'Columns' ) }
                                    value={ columns }
                                    onChange={ ( value ) => setAttributes( { columns: value } ) }
                                    min={ 2 }
                                    max={ 12 }
                                />
                            </PanelBody>
                        </ApplyFilters>
                        <PanelBody>
                            <BaseControl
                                label={ __( 'Vertical alignment' ) }
                            >
                                <Toolbar controls={ [
                                    {
                                        icon: getIcon( 'icon-vertical-top', true ),
                                        title: __( 'Start' ),
                                        onClick: () => setAttributes( { verticalAlign: '' } ),
                                        isActive: verticalAlign === '',
                                    },
                                    {
                                        icon: getIcon( 'icon-vertical-center', true ),
                                        title: __( 'Center' ),
                                        onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                        isActive: verticalAlign === 'center',
                                    },
                                    {
                                        icon: getIcon( 'icon-vertical-bottom', true ),
                                        title: __( 'End' ),
                                        onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                        isActive: verticalAlign === 'end',
                                    },
                                ] }
                                />
                            </BaseControl>
                            <BaseControl
                                label={ __( 'Horizontal alignment' ) }
                            >
                                <Toolbar controls={ [
                                    {
                                        icon: getIcon( 'icon-horizontal-start', true ),
                                        title: __( 'Start' ),
                                        onClick: () => setAttributes( { horizontalAlign: '' } ),
                                        isActive: horizontalAlign === '',
                                    },
                                    {
                                        icon: getIcon( 'icon-horizontal-center', true ),
                                        title: __( 'Center' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'center' } ),
                                        isActive: horizontalAlign === 'center',
                                    },
                                    {
                                        icon: getIcon( 'icon-horizontal-end', true ),
                                        title: __( 'End' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'end' } ),
                                        isActive: horizontalAlign === 'end',
                                    },
                                    {
                                        icon: getIcon( 'icon-horizontal-around', true ),
                                        title: __( 'Around' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'around' } ),
                                        isActive: horizontalAlign === 'around',
                                    },
                                    {
                                        icon: getIcon( 'icon-horizontal-between', true ),
                                        title: __( 'Between' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'between' } ),
                                        isActive: horizontalAlign === 'between',
                                    },
                                ] }
                                />
                            </BaseControl>
                        </PanelBody>
                        <PanelBody>
                            <BaseControl label={ __( 'Gap' ) }>
                                <ButtonGroup>
                                    {
                                        [
                                            {
                                                label: __( 'none' ),
                                                value: 'no',
                                            },
                                            {
                                                label: __( 'sm' ),
                                                value: 'sm',
                                            },
                                            {
                                                label: __( 'md' ),
                                                value: 'md',
                                            },
                                            {
                                                label: __( 'lg' ),
                                                value: 'lg',
                                            },
                                        ].map( ( val ) => {
                                            const selected = gap === val.value;

                                            return (
                                                <Button
                                                    isLarge
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
                        <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={ this.props }>
                            <PanelBody
                                title={ __( 'Background' ) }
                                initialOpen={ false }
                            >
                                <ColorPicker
                                    label={ __( 'Background Color' ) }
                                    value={ awb_color } // eslint-disable-line
                                    onChange={ ( val ) => setAttributes( { awb_color: val } ) }
                                    alpha={ true }
                                />
                                <p>
                                    { __( 'Install AWB plugin to set image, video backgrounds with parallax support.' ) }
                                </p>
                                <a
                                    className="components-button is-button is-default is-small"
                                    href="https://wordpress.org/plugins/advanced-backgrounds/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    { __( 'Install' ) }
                                </a>
                            </PanelBody>
                        </ApplyFilters>
                    </InspectorControls>
                ) : '' }
                <div className={ className }>
                    { columns > 0 || this.state.selectedLayout ? (
                        <Fragment>
                            { background }
                            { ! isSelected ? (
                                <div className="ghostkit-grid-button-select">
                                    { __( 'Select Grid' ) }
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

export const name = 'ghostkit/grid';

export const settings = {
    title: __( 'Grid' ),
    description: __( 'Responsive grid block to build layouts of all shapes and sizes thanks to a twelve column system. Visual columns size and order change.' ),
    icon: getIcon( 'block-grid' ),
    category: 'ghostkit',
    keywords: [
        __( 'grid' ),
        __( 'row' ),
        __( 'columns' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/grid/',
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
        columns: {
            type: 'number',
            default: 0,
        },
        gap: {
            type: 'string',
            default: 'md',
        },
        verticalAlign: {
            type: 'string',
        },
        horizontalAlign: {
            type: 'string',
        },

        // Should be used in Deprecated block
        columnsSettings: {
            type: 'object',
            default: {},
        },

        // AWB support.
        awb_type: {
            type: 'string',
            default: 'color',
        },
        awb_color: {
            type: 'string',
            default: '',
        },
    },

    edit: GridBlock,

    save: function( props ) {
        const {
            verticalAlign,
            horizontalAlign,
            gap,
            awb_color, // eslint-disable-line
        } = props.attributes;

        let className = classnames(
            'ghostkit-grid',
            `ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
        );

        // background
        let background = '';
        // eslint-disable-next-line
        if ( awb_color ) {
            background = (
                <div className="nk-awb">
                    <div className="nk-awb-wrap" data-awb-type="color">
                        <div className="nk-awb-overlay" style={ { 'background-color': awb_color } }></div>
                    </div>
                </div>
            );
        }

        background = applyFilters( 'ghostkit.blocks.grid.background', background, {
            ...{
                name,
            },
            ...props,
        } );

        if ( background ) {
            className = classnames( className, 'ghostkit-grid-with-bg' );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className }>
                { background }
                <InnerBlocks.Content />
            </div>
        );
    },

    deprecated: deprecatedArray,
};
