// External Dependencies.
import shorthash from 'shorthash';

// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import { getCustomStylesAttr } from '../_utils.jsx';
import elementIcon from '../_icons/counter-box.svg';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    RangeControl,
    PanelColor,
    SelectControl,
} = wp.components;
const {
    InspectorControls,
    ColorPalette,
    InnerBlocks,
    RichText,
} = wp.blocks;

/**
 * Get counter-box styles based on attributes.
 *
 * @param {object} attributes - element atts.
 * @return {object} styles object.
 */
function getStyles( attributes ) {
    const {
        id,
        numberSize,
        numberColor,
    } = attributes;

    const ID = `ghostkit-counter-box-${ id }`;

    const style = {};
    style[ `.${ ID }` ] = {
        '.ghostkit-counter-box-number': {
            fontSize: `${ numberSize }px`,
            color: numberColor,
        },
    };

    return style;
}

class CounterBoxBlock extends Component {
    constructor( { attributes } ) {
        super( ...arguments );

        // generate unique ID.
        if ( ! attributes.id ) {
            this.props.setAttributes( { id: shorthash.unique( this.props.id ) } );
        }
    }

    render() {
        const {
            className,
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const {
            id,
            number,
            numberPosition,
            numberSize,
            numberColor,
        } = attributes;

        return [
            isSelected &&
            <InspectorControls key="inspector">
                <RangeControl
                    label={ __( 'Number Size' ) }
                    value={ numberSize }
                    onChange={ ( value ) => setAttributes( { numberSize: value } ) }
                    min={ 20 }
                    max={ 100 }
                    beforeIcon="editor-textcolor"
                    afterIcon="editor-textcolor"
                />
                <SelectControl
                    label={ __( 'Number Position' ) }
                    value={ numberPosition }
                    onChange={ ( value ) => setAttributes( { numberPosition: value } ) }
                    options={ [
                        {
                            label: __( 'Top' ),
                            value: 'top',
                        },
                        {
                            label: __( 'Left' ),
                            value: 'left',
                        },
                        {
                            label: __( 'Right' ),
                            value: 'right',
                        },
                    ] }
                />
                <PanelColor title={ __( 'Number Color' ) } colorValue={ numberColor } >
                    <ColorPalette
                        value={ numberColor }
                        onChange={ ( colorValue ) => setAttributes( { numberColor: colorValue } ) }
                    />
                </PanelColor>
            </InspectorControls>,
            <div className={ `${ className || '' } ghostkit-counter-box-${ id }` } key="counter-box" { ...getCustomStylesAttr( getStyles( attributes ) ) }>
                <div className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }` }>
                    <RichText
                        tagName="div"
                        placeholder={ __( 'Add number…' ) }
                        value={ number }
                        onChange={ ( value ) => setAttributes( { number: value } ) }
                        formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                        isSelected={ isSelected }
                        keepPlaceholderOnFocus
                    />
                </div>
                <div className="ghostkit-counter-box-content">
                    { /* TODO: Add default blocks when this will be possible https://github.com/WordPress/gutenberg/issues/5448 */ }
                    <InnerBlocks />
                </div>
            </div>,
        ];
    }
}

export const name = 'ghostkit/counter-box';

export const settings = {
    title: __( 'Number Box' ),
    description: __( 'Number Box.' ),
    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'common',
    keywords: [
        __( 'number' ),
        __( 'counter' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
    },
    attributes: {
        id: {
            type: 'string',
            default: false,
        },
        number: {
            type: 'string',
            default: '77',
        },
        numberPosition: {
            type: 'string',
            default: 'top',
        },
        numberSize: {
            type: 'number',
            default: 50,
        },
        numberColor: {
            type: 'string',
            default: '#008dbe',
        },
    },

    edit: CounterBoxBlock,

    save: function( { attributes, className } ) {
        const {
            id,
            number,
            numberPosition,
        } = attributes;

        return (
            <div className={ `${ className || '' } ghostkit-counter-box-${ id }` } { ...getCustomStylesAttr( getStyles( attributes ) ) }>
                <div className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }` }>
                    { number }
                </div>
                <div className="ghostkit-counter-box-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
};
