// External Dependencies.
import shorthash from 'shorthash';

// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import { getCustomStylesAttr } from '../_utils.jsx';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    RangeControl,
    PanelColor,
    SelectControl,
    TextControl,
} = wp.components;
const {
    InspectorControls,
    ColorPalette,
    InnerBlocks,
} = wp.blocks;

/**
 * Get icon-box styles based on attributes.
 *
 * @param {object} attributes - element atts.
 * @return {object} styles object.
 */
function getStyles( attributes ) {
    const {
        id,
        iconSize,
        iconColor,
    } = attributes;

    const ID = `ghostkit-icon-box-${ id }`;

    const style = {};
    style[ `.${ ID }` ] = {
        '.ghostkit-icon-box-icon': {
            fontSize: `${ iconSize }px`,
            color: iconColor,
        },
    };

    return style;
}

class IconBoxBlock extends Component {
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
            icon,
            iconPosition,
            iconSize,
            iconColor,
        } = attributes;

        return [
            isSelected &&
            <InspectorControls key="inspector">
                <TextControl
                    label={ __( 'Icon' ) }
                    value={ icon }
                    help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                    onChange={ ( value ) => setAttributes( { icon: value } ) }
                />
                <RangeControl
                    label={ __( 'Icon Size' ) }
                    value={ iconSize }
                    onChange={ ( value ) => setAttributes( { iconSize: value } ) }
                    min={ 20 }
                    max={ 100 }
                    beforeIcon="editor-textcolor"
                    afterIcon="editor-textcolor"
                />
                <SelectControl
                    label={ __( 'Icon Position' ) }
                    value={ iconPosition }
                    onChange={ ( value ) => setAttributes( { iconPosition: value } ) }
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
                <PanelColor title={ __( 'Icon Color' ) } colorValue={ iconColor } >
                    <ColorPalette
                        value={ iconColor }
                        onChange={ ( colorValue ) => setAttributes( { iconColor: colorValue } ) }
                    />
                </PanelColor>
            </InspectorControls>,
            <div className={ `${ className || '' } ghostkit-icon-box-${ id }` } key="icon-box" { ...getCustomStylesAttr( getStyles( attributes ) ) }>
                <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition ? iconPosition : 'left' }` }
                    dangerouslySetInnerHTML={{ __html: `<span class="${ icon }"></span>` }}
                >
                </div>
                <div className="ghostkit-icon-box-content">
                    { /* TODO: Add default blocks when this will be possible https://github.com/WordPress/gutenberg/issues/5448 */ }
                    <InnerBlocks />
                </div>
            </div>,
        ];
    }
}

export const name = 'ghostkit/icon-box';

export const settings = {
    title: __( 'Icon Box' ),
    description: __( 'Icon Box.' ),
    icon: 'arrow-right-alt',
    category: 'common',
    keywords: [
        __( 'icon' ),
        __( 'icon-box' ),
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
        icon: {
            type: 'string',
            default: 'fab fa-wordpress-simple',
        },
        iconPosition: {
            type: 'string',
            default: 'left',
        },
        iconSize: {
            type: 'number',
            default: 30,
        },
        iconColor: {
            type: 'string',
            default: '#008dbe',
        },
    },

    edit: IconBoxBlock,

    save: function( { attributes, className } ) {
        const {
            id,
            icon,
            iconPosition,
        } = attributes;

        return (
            <div className={ `${ className || '' } ghostkit-icon-box-${ id }` } { ...getCustomStylesAttr( getStyles( attributes ) ) }>
                <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition ? iconPosition : 'left' }` }>
                    <span className={ icon } />
                </div>
                <div className="ghostkit-icon-box-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
};
