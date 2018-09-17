// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/grid.svg';
import deprecatedArray from './deprecated.jsx';

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
import IconVerticalCenter from './icons/vertical-center.svg';
import IconVerticalTop from './icons/vertical-top.svg';
import IconVerticalBottom from './icons/vertical-bottom.svg';
import IconVerticalCenterWhite from './icons/vertical-center-white.svg';
import IconVerticalTopWhite from './icons/vertical-top-white.svg';
import IconVerticalBottomWhite from './icons/vertical-bottom-white.svg';

const { GHOSTKIT } = window;

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
                    size: col === 'a' ? 'auto' : parseInt( col, 10 ),
                };

                // responsive.
                if ( columnsData.length === 2 ) {
                    colAttrs.md_size = 12;
                }
                if ( columnsData.length === 3 ) {
                    colAttrs.lg_size = 12;
                }
                if ( columnsData.length === 4 ) {
                    colAttrs.md_size = 12;
                    colAttrs.lg_size = 6;
                }
                if ( columnsData.length === 5 ) {
                    colAttrs.sm_size = 12;
                    colAttrs.md_size = 5;
                    colAttrs.lg_size = 4;
                }
                if ( columnsData.length === 6 ) {
                    colAttrs.sm_size = 6;
                    colAttrs.md_size = 4;
                    colAttrs.lg_size = 3;
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
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            columns,
            gap,
            verticalAlign,
            horizontalAlign,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'grid' );

        const tabs = [];

        for ( let val = 1; val <= columns; val++ ) {
            tabs.push( {
                name: 'column_' + val,
                title: val,
                className: 'ghostkit-control-tabs-tab',
            } );
        }

        className = classnames(
            className,
            'ghostkit-grid',
            `ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
        );

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

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
                            label={ __( 'Columns' ) }
                            value={ columns }
                            onChange={ ( value ) => setAttributes( { columns: value } ) }
                            min={ 2 }
                            max={ 12 }
                        />
                        <SelectControl
                            label={ __( 'Vertical alignment' ) }
                            value={ verticalAlign }
                            onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
                            options={ [
                                {
                                    label: __( 'Start' ),
                                    value: '',
                                }, {
                                    label: __( 'Center' ),
                                    value: 'center',
                                }, {
                                    label: __( 'End' ),
                                    value: 'end',
                                },
                            ] }
                        />
                        <SelectControl
                            label={ __( 'Horizontal alignment' ) }
                            value={ horizontalAlign }
                            onChange={ ( value ) => setAttributes( { horizontalAlign: value } ) }
                            options={ [
                                {
                                    label: __( 'Start' ),
                                    value: '',
                                }, {
                                    label: __( 'Center' ),
                                    value: 'center',
                                }, {
                                    label: __( 'End' ),
                                    value: 'end',
                                }, {
                                    label: __( 'Around' ),
                                    value: 'around',
                                }, {
                                    label: __( 'Between' ),
                                    value: 'between',
                                },
                            ] }
                        />
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
                </InspectorControls>
                <div className={ className }>
                    { columns > 0 || this.state.selectedLayout ? (
                        <InnerBlocks
                            template={ this.getColumnsTemplate() }
                            templateLock="all"
                            allowedBlocks={ [ 'ghostkit/grid-column' ] }
                        />
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
    description: __( 'Add a block that displays content in responsive grid columns, then add whatever content blocks you\'d like.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'grid' ),
        __( 'row' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitSpacings: true,
        ghostkitDisplay: true,
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
    },

    edit: GridBlock,

    save: function( { attributes, className = '' } ) {
        const {
            verticalAlign,
            horizontalAlign,
            gap,
            variant,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-grid',
            `ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
        );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-grid-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                <InnerBlocks.Content />
            </div>
        );
    },

    deprecated: deprecatedArray,
};
