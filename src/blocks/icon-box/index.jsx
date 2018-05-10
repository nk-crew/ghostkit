// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import elementIcon from '../_icons/icon-box.svg';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
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
        ghostkitClassname,
        ghostkitGetStylesAttr,
        iconSize,
        iconColor,
    } = attributes;

    if ( ! ghostkitClassname || ! ghostkitGetStylesAttr ) {
        return false;
    }

    const style = {};
    style[ `.${ ghostkitClassname } .ghostkit-icon-box-icon` ] = {
        fontSize: iconSize,
        color: iconColor,
    };

    return ghostkitGetStylesAttr( style );
}

class IconBoxBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            icon,
            iconPosition,
            iconSize,
            iconColor,
        } = attributes;

        className += ' ' + ghostkitClassname;

        return (
            <Fragment>
                <InspectorControls>
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
                </InspectorControls>
                <div className={ className } { ...getStyles( attributes ) }>
                    { icon && (
                        <div
                            className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition ? iconPosition : 'left' }` }
                            dangerouslySetInnerHTML={ { __html: `<span class="${ icon }"></span>` } }
                        />
                    ) }
                    <div className="ghostkit-icon-box-content">
                        { /* TODO: Add default blocks when this will be possible https://github.com/WordPress/gutenberg/issues/5448 */ }
                        <InnerBlocks />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/icon-box';

export const settings = {
    title: __( 'Icon Box' ),
    description: __( 'Icon Box.' ),
    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
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

    save: function( { attributes, className = '' } ) {
        const {
            ghostkitClassname,
            icon,
            iconPosition,
        } = attributes;

        className += ' ' + ghostkitClassname;

        return (
            <div className={ className } { ...getStyles( attributes ) }>
                { icon && (
                    <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition ? iconPosition : 'left' }` }>
                        <span className={ icon } />
                    </div>
                ) }
                <div className="ghostkit-icon-box-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
};
