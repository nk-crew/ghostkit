// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/grid.svg';
import deprecatedArray from './deprecated.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';
import ColorPicker from '../_components/color-picker.jsx';

// layout icons.
import IconLayout12 from './icons/layout-12.svg';
import IconLayout66 from './icons/layout-6-6.svg';
import IconLayout57 from './icons/layout-5-7.svg';
import IconLayout75 from './icons/layout-7-5.svg';
import IconLayout444 from './icons/layout-4-4-4.svg';
import IconLayout336 from './icons/layout-3-3-6.svg';
import IconLayout363 from './icons/layout-3-6-3.svg';
import IconLayout633 from './icons/layout-6-3-3.svg';
import IconLayout282 from './icons/layout-2-8-2.svg';
import IconLayout3333 from './icons/layout-3-3-3-3.svg';
import IconLayoutaaaaa from './icons/layout-a-a-a-a-a.svg';
import IconLayout222222 from './icons/layout-2-2-2-2-2-2.svg';

import IconVerticalTop from './icons/vertical-top.svg';
import IconVerticalCenter from './icons/vertical-center.svg';
import IconVerticalBottom from './icons/vertical-bottom.svg';

import IconVerticalTopWhite from './icons/vertical-top-white.svg';
import IconVerticalCenterWhite from './icons/vertical-center-white.svg';
import IconVerticalBottomWhite from './icons/vertical-bottom-white.svg';

import IconHorizontalStart from './icons/horizontal-start.svg';
import IconHorizontalCenter from './icons/horizontal-center.svg';
import IconHorizontalEnd from './icons/horizontal-end.svg';
import IconHorizontalAround from './icons/horizontal-around.svg';
import IconHorizontalBetween from './icons/horizontal-between.svg';

import IconHorizontalCenterWhite from './icons/horizontal-center-white.svg';
import IconHorizontalStartWhite from './icons/horizontal-start-white.svg';
import IconHorizontalEndWhite from './icons/horizontal-end-white.svg';
import IconHorizontalAroundWhite from './icons/horizontal-around-white.svg';
import IconHorizontalBetweenWhite from './icons/horizontal-between-white.svg';

const { GHOSTKIT } = window;

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
    SelectControl,
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
            const columnsData = this.state.selectedLayout.split( '-' );
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

        if ( columns < 1 && this.state.selectedLayout ) {
            const columnsData = this.state.selectedLayout.split( '-' );
            columns = columnsData.length;

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

                result.push( [ 'ghostkit/grid-column', colAttrs, [
                    [ 'core/paragraph', { content: 'Column ' + ( col === 'a' ? 'Auto' : col ) } ],
                ] ] );
            } );
        } else {
            for ( let k = 1; k <= columns; k++ ) {
                result.push( [ 'ghostkit/grid-column' ] );
            }
        }

        return result;
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
            ghostkitClassname,
            variant,
            columns,
            gap,
            verticalAlign,
            horizontalAlign,
            awb_color, // eslint-disable-line
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'grid' );

        className = classnames(
            className,
            'ghostkit-grid',
            `ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-grid-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

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
                                icon: verticalAlign === '' ? <IconVerticalTopWhite viewBox="0 0 24 24" /> : <IconVerticalTop viewBox="0 0 24 24" />,
                                title: __( 'Content Vertical Start' ),
                                onClick: () => setAttributes( { verticalAlign: '' } ),
                                isActive: verticalAlign === '',
                            },
                            {
                                icon: verticalAlign === 'center' ? <IconVerticalCenterWhite viewBox="0 0 24 24" /> : <IconVerticalCenter viewBox="0 0 24 24" />,
                                title: __( 'Content Vertical Center' ),
                                onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                isActive: verticalAlign === 'center',
                            },
                            {
                                icon: verticalAlign === 'end' ? <IconVerticalBottomWhite viewBox="0 0 24 24" /> : <IconVerticalBottom viewBox="0 0 24 24" />,
                                title: __( 'Content Vertical End' ),
                                onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                isActive: verticalAlign === 'end',
                            },
                        ] }
                        />
                    </BlockControls>
                ) : '' }
                <InspectorControls>
                    { Object.keys( availableVariants ).length > 1 ? (
                        <PanelBody>
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        </PanelBody>
                    ) : '' }
                    <PanelBody>
                        <ApplyFilters name="ghostkit.editor.controls" attribute="columns" props={ this.props }>
                            <RangeControl
                                label={ __( 'Columns' ) }
                                value={ columns }
                                onChange={ ( value ) => setAttributes( { columns: value } ) }
                                min={ 2 }
                                max={ 12 }
                            />
                        </ApplyFilters>
                        <PanelBody>
                            <BaseControl
                                label={ __( 'Vertical alignment' ) }
                            >
                                <Toolbar controls={ [
                                    {
                                        icon: verticalAlign === '' ? <IconVerticalTopWhite viewBox="0 0 24 24" /> : <IconVerticalTop viewBox="0 0 24 24" />,
                                        title: __( 'Start' ),
                                        onClick: () => setAttributes( { verticalAlign: '' } ),
                                        isActive: verticalAlign === '',
                                    },
                                    {
                                        icon: verticalAlign === 'center' ? <IconVerticalCenterWhite viewBox="0 0 24 24" /> : <IconVerticalCenter viewBox="0 0 24 24" />,
                                        title: __( 'Center' ),
                                        onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                        isActive: verticalAlign === 'center',
                                    },
                                    {
                                        icon: verticalAlign === 'end' ? <IconVerticalBottomWhite viewBox="0 0 24 24" /> : <IconVerticalBottom viewBox="0 0 24 24" />,
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
                                        icon: horizontalAlign === '' ? <IconHorizontalStartWhite viewBox="0 0 24 24" /> : <IconHorizontalStart viewBox="0 0 24 24" />,
                                        title: __( 'Start' ),
                                        onClick: () => setAttributes( { horizontalAlign: '' } ),
                                        isActive: horizontalAlign === '',
                                    },
                                    {
                                        icon: horizontalAlign === 'center' ? <IconHorizontalCenterWhite viewBox="0 0 24 24" /> : <IconHorizontalCenter viewBox="0 0 24 24" />,
                                        title: __( 'Center' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'center' } ),
                                        isActive: horizontalAlign === 'center',
                                    },
                                    {
                                        icon: horizontalAlign === 'end' ? <IconHorizontalEndWhite viewBox="0 0 24 24" /> : <IconHorizontalEnd viewBox="0 0 24 24" />,
                                        title: __( 'End' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'end' } ),
                                        isActive: horizontalAlign === 'end',
                                    },
                                    {
                                        icon: horizontalAlign === 'around' ? <IconHorizontalAroundWhite viewBox="0 0 24 24" /> : <IconHorizontalAround viewBox="0 0 24 24" />,
                                        title: __( 'Around' ),
                                        onClick: () => setAttributes( { horizontalAlign: 'around' } ),
                                        isActive: horizontalAlign === 'around',
                                    },
                                    {
                                        icon: horizontalAlign === 'between' ? <IconHorizontalBetweenWhite viewBox="0 0 24 24" /> : <IconHorizontalBetween viewBox="0 0 24 24" />,
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
                    </PanelBody>
                </InspectorControls>
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
                    ) : (
                        <div className="ghostkit-select-layout">
                            <div>
                                <div className="ghostkit-select-layout-title">{ __( 'Select Layout' ) }</div>
                                <button onClick={ () => this.onLayoutSelect( '12' ) }><IconLayout12 /></button>
                                <button onClick={ () => this.onLayoutSelect( '6-6' ) }><IconLayout66 /></button>
                                <button onClick={ () => this.onLayoutSelect( '4-4-4' ) }><IconLayout444 /></button>
                                <button onClick={ () => this.onLayoutSelect( '3-3-3-3' ) }><IconLayout3333 /></button>

                                <button onClick={ () => this.onLayoutSelect( '5-7' ) }><IconLayout57 /></button>
                                <button onClick={ () => this.onLayoutSelect( '7-5' ) }><IconLayout75 /></button>
                                <button onClick={ () => this.onLayoutSelect( '3-3-6' ) }><IconLayout336 /></button>
                                <button onClick={ () => this.onLayoutSelect( '3-6-3' ) }><IconLayout363 /></button>

                                <button onClick={ () => this.onLayoutSelect( '6-3-3' ) }><IconLayout633 /></button>
                                <button onClick={ () => this.onLayoutSelect( '2-8-2' ) }><IconLayout282 /></button>
                                <button onClick={ () => this.onLayoutSelect( 'a-a-a-a-a' ) }><IconLayoutaaaaa /></button>
                                <button onClick={ () => this.onLayoutSelect( '2-2-2-2-2-2' ) }><IconLayout222222 /></button>
                            </div>
                        </div>
                    ) }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/grid';

export const settings = {
    title: __( 'Grid' ),
    description: __( 'Responsive grid block to build layouts of all shapes and sizes thanks to a twelve column system. Visual columns size and order change.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'grid' ),
        __( 'row' ),
        __( 'ghostkit' ),
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
        variant: {
            type: 'string',
            default: 'default',
        },
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
            variant,
            awb_color, // eslint-disable-line
        } = props.attributes;

        let className = classnames(
            'ghostkit-grid',
            `ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-grid-variant-${ variant }` );
        }

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
