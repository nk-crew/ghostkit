// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/grid.svg';
import deprecatedArray from './deprecated.jsx';

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
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
} = wp.editor;

/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {number} columns Number of columns.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnsTemplate = ( columns ) => {
    const result = [];

    for ( let k = 1; k <= columns; k++ ) {
        result.push( [ 'ghostkit/grid-column' ] );
    }

    return result;
};

class GridBlock extends Component {
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
                    <InnerBlocks
                        template={ getColumnsTemplate( columns ) }
                        templateLock="all"
                        allowedBlocks={ [ 'ghostkit/grid-column' ] }
                    />
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
        ghostkitIndents: true,
        ghostkitDisplay: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        columns: {
            type: 'number',
            default: 2,
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
