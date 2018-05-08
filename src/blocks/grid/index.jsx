// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import elementIcon from '../_icons/grid.svg';

const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const { addFilter } = wp.hooks;
const {
    BaseControl,
    Button,
    ButtonGroup,
    PanelBody,
    RangeControl,
} = wp.components;
const {
    BlockControls,
    BlockAlignmentToolbar,
    InspectorControls,
    InnerBlocks,
} = wp.blocks;

/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {object} attributes - block attributes.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnLayouts = ( { columns } ) => {
    const result = [];

    for ( let k = 0; k < columns; k++ ) {
        result.push( {
            name: `ghostkit-col-${ k + 1 }`,
            label: sprintf( __( 'Column %d' ), k + 1 ),
            icon: 'columns',
        } );
    }

    return result;
};

class GridBlock extends Component {
    render() {
        const {
            className,
            attributes,
            setAttributes,
        } = this.props;

        const {
            columns,
            gap,
            align,
        } = attributes;

        return (
            <Fragment>
                <BlockControls>
                    <BlockAlignmentToolbar
                        controls={ [ 'wide', 'full' ] }
                        value={ align }
                        onChange={ ( nextAlign ) => {
                            setAttributes( { align: nextAlign } );
                        } }
                    />
                </BlockControls>
                <InspectorControls>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Columns' ) }
                            value={ columns }
                            onChange={ ( nextColumns ) => {
                                setAttributes( {
                                    columns: nextColumns,
                                } );
                            } }
                            min={ 2 }
                            max={ 6 }
                        />
                        <BaseControl label={ __( 'Gap' ) }>
                            <ButtonGroup style={ { marginTop: 15, marginBottom: 10 } }>
                                {
                                    [
                                        {
                                            label: __( 'NO' ),
                                            value: 'none',
                                        },
                                        {
                                            label: __( 'SM' ),
                                            value: 'sm',
                                        },
                                        {
                                            label: __( 'MD' ),
                                            value: 'md',
                                        },
                                        {
                                            label: __( 'LG' ),
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
                <div className={ `${ className || '' } ghostkit-grid-cols-${ columns } ghostkit-grid-gap-${ gap }` }>
                    <InnerBlocks layouts={ getColumnLayouts( attributes ) } />
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/grid';

export const settings = {
    title: __( 'Grid' ),
    description: __( 'CSS Grid System.' ),
    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'layout',
    keywords: [
        __( 'grid' ),
        __( 'column' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
    },
    attributes: {
        columns: {
            type: 'number',
            default: 2,
        },
        gap: {
            type: 'string',
            default: 'md',
        },
        align: {
            type: 'string',
        },
    },

    getEditWrapperProps( attributes ) {
        const { align } = attributes;

        return { 'data-align': align };
    },

    edit: GridBlock,

    save: function( { attributes, className } ) {
        const {
            columns,
            gap,
        } = attributes;

        return (
            <div className={ `${ className || '' } ghostkit-grid ghostkit-grid-cols-${ columns } ghostkit-grid-gap-${ gap }` }>
                <InnerBlocks.Content />
            </div>
        );
    },
};

addFilter( 'blocks.getSaveElement', 'lubus/background/withBackground', ( a ) => {
    //console.log( a, b );
    return a;
} );
