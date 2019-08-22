/**
 * Import CSS
 */
import './editor.scss';
import 'react-virtualized-select/styles.css';
/**
 * External dependencies
 */
import InputDrag from '../input-drag';
import Select from 'react-virtualized-select';
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const {
    Tooltip,
} = wp.components;
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
const { GHOSTKIT } = window;
const fontFamilies = getFonts();

/**
 * Go over each fonts.
 *
 * @return {*[]} - Fonts List.
 */
function getFonts() {
    const {
        fonts,
    } = GHOSTKIT;

    const fontList = [];

    Object.keys( fonts ).forEach( ( fontFamilyCategory ) => {
        Object.keys( fonts[ fontFamilyCategory ].fonts ).forEach( ( fontKey ) => {
            fontList.push(
                { value: fonts[ fontFamilyCategory ].fonts[ fontKey ].name, label: fonts[ fontFamilyCategory ].fonts[ fontKey ].name, fontFamilyCategory: fontFamilyCategory }
            );
        } );
    } );
    return fontList;
}

/**
 * Get Weight Label.
 *
 * @param {string} weight - Weight Value.
 * @return {string} - Weight Label.
 */
function getFontWeightLabel( weight ) {
    let label = '';

    switch ( weight ) {
    case '100':
        label = __( 'Thin' );
        break;
    case '100i':
        label = __( 'Thin Italic' );
        break;
    case '200':
        label = __( 'ExtraLight' );
        break;
    case '200i':
        label = __( 'ExtraLight Italic' );
        break;
    case '300':
        label = __( 'Light' );
        break;
    case '300i':
        label = __( 'Light Italic' );
        break;
    case '400':
        label = __( 'Regular' );
        break;
    case '400i':
        label = __( 'Regular Italic' );
        break;
    case '500':
        label = __( 'Medium' );
        break;
    case '500i':
        label = __( 'Medium Italic' );
        break;
    case '600':
        label = __( 'SemiBold' );
        break;
    case '600i':
        label = __( 'SemiBold Italic' );
        break;
    case '700':
        label = __( 'Bold' );
        break;
    case '700i':
        label = __( 'Bold Italic' );
        break;
    case '800':
        label = __( 'ExtraBold' );
        break;
    case '800i':
        label = __( 'ExtraBold Italic' );
        break;
    case '900':
        label = __( 'Black' );
        break;
    case '900i':
        label = __( 'Black Italic' );
        break;
    }

    return label;
}

/**
 * Get all font widths.
 *
 * @param {string} font - search font.
 * @param {string} fontFamilyCategory - font fontFamilyCategory.
 * @return {Array} - all font widths.
 */
function getFontWeights( font, fontFamilyCategory ) {
    const {
        fonts,
    } = GHOSTKIT;

    const fontWeights = [];

    if ( font !== '' && fontFamilyCategory !== '' && font !== undefined && fontFamilyCategory !== undefined ) {
        Object.keys( fonts[ fontFamilyCategory ].fonts ).forEach( ( fontKey ) => {
            if ( fonts[ fontFamilyCategory ].fonts[ fontKey ].name === font ) {
                Object.keys( fonts[ fontFamilyCategory ].fonts[ fontKey ].widths ).forEach( ( widthKey ) => {
                    const width = fonts[ fontFamilyCategory ].fonts[ fontKey ].widths[ widthKey ];
                    fontWeights.push(
                        { value: width, label: getFontWeightLabel( width ) }
                    );
                } );
            }
        } );
    }

    return fontWeights;
}

/**
 * Component Class
 */
export default class Typorgaphy extends Component {
    render() {
        const {
            onChange,
            label,
            fontFamily,
            fontFamilyCategory,
            fontWeight,
            fontSize,
            lineHeight,
            letterSpacing,
            fontWeights = getFontWeights( fontFamily, fontFamilyCategory ),
        } = this.props;

        const fontFamilyValue = { value: fontFamily, label: fontFamily, fontFamilyCategory: fontFamilyCategory };
        const fontWeightValue = { value: fontWeight, label: getFontWeightLabel( fontWeight ) };
        const fontSizeValue = fontSize === undefined ? '' : fontSize;

        return (
            <div className={ 'ghostkit-typography' }>
                <h4>{ label }</h4>
                <div className="ghostkit-control-typography">
                    <div className="ghostkit-typography-font-control">
                        <Tooltip text={ __( 'Font Family' ) }>
                            <div>
                                <Select
                                    value={ fontFamilyValue }
                                    onChange={ ( opt ) => {
                                        onChange( {
                                            fontFamily: opt.value,
                                            fontFamilyCategory: opt.fontFamilyCategory,
                                            fontWeight: '400',
                                        } );
                                    } }
                                    options={ fontFamilies }
                                    placeholder={ __( '--- Select font ---' ) }
                                    className="ghostkit-typography-font-selector"
                                />
                            </div>
                        </Tooltip>
                    </div>
                    <div className="ghostkit-typography-weight-control">
                        <Tooltip text={ __( 'Font Weight' ) }>
                            <div>
                                <Select
                                    value={ fontWeightValue }
                                    onChange={ ( opt ) => {
                                        onChange( {
                                            fontWeight: opt.value,
                                        } );
                                    } }
                                    options={ fontWeights }
                                    placeholder={ __( '--- Select weight ---' ) }
                                    className="ghostkit-typography-weight-selector"
                                    classNamePrefix="ghostkit-typography-weight-selector"
                                    menuPosition="fixed"
                                />
                            </div>
                        </Tooltip>
                    </div>
                    <div className="ghostkit-typography-size-control">
                        <Tooltip text={ __( 'Font Size' ) }>
                            <div>
                                <InputDrag
                                    value={ fontSizeValue }
                                    placeholder="-"
                                    onChange={ value => {
                                        onChange( {
                                            fontSize: value,
                                        } );
                                    } }
                                    autoComplete="off"
                                    icon={ getIcon( 'icon-typography-font-size' ) }
                                />
                            </div>
                        </Tooltip>
                    </div>
                    {
                        lineHeight !== undefined &&
                            <div className="ghostkit-typography-line-control">
                                <Tooltip text={ __( 'Line Height' ) }>
                                    <div>
                                        <InputDrag
                                            value={ lineHeight }
                                            placeholder="-"
                                            onChange={ value => {
                                                onChange( {
                                                    lineHeight: value,
                                                } );
                                            } }
                                            autoComplete="off"
                                            icon={ getIcon( 'icon-typography-line-height' ) }
                                        />
                                    </div>
                                </Tooltip>
                            </div>
                    }
                    {
                        letterSpacing !== undefined &&
                        <div className="ghostkit-typography-letter-control">
                            <Tooltip text={ __( 'Letter Spacing' ) }>
                                <div>
                                    <InputDrag
                                        value={ letterSpacing }
                                        placeholder="-"
                                        onChange={ value => {
                                            onChange( {
                                                letterSpacing: value,
                                            } );
                                        } }
                                        autoComplete="off"
                                        icon={ getIcon( 'icon-typography-letter-spacing' ) }
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
