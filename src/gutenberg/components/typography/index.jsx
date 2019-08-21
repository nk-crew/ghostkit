/**
 * Import CSS
 */
import './editor.scss';

/**
 * External dependencies
 */
import InputDrag from '../input-drag';
import Select from 'react-select';
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

    const fontList = [
        { value: '', label: __( 'Default Site Font' ), family: 'default' },
    ];

    Object.keys( fonts ).forEach( ( family ) => {
        Object.keys( fonts[ family ].fonts ).forEach( ( fontKey ) => {
            fontList.push(
                { value: fonts[ family ].fonts[ fontKey ].name, label: fonts[ family ].fonts[ fontKey ].name, family: family }
            );
        } );
    } );

    return fontList;
}

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
 * @param {string} family - font family.
 * @return {Array} - all font widths.
 */
function getFontWeights( font, family ) {
    const {
        fonts,
    } = GHOSTKIT;

    const fontWeights = [];

    if ( font !== '' && family !== '' && font !== undefined && family !== undefined ) {
        Object.keys( fonts[ family ].fonts ).forEach( ( fontKey ) => {
            if ( fonts[ family ].fonts[ fontKey ].name === font ) {
                Object.keys( fonts[ family ].fonts[ fontKey ].widths ).forEach( ( widthKey ) => {
                    const width = fonts[ family ].fonts[ fontKey ].widths[ widthKey ];
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
            fontWeights = getFontWeights( this.props.fontFamily === undefined || this.props.fontFamily === '' ? '' : this.props.fontFamily.label, this.props.fontFamilyCategory ),
        } = this.props;

        return (
            <div className={ 'ghostkit-typography' }>
                <h4>{ label }</h4>
                <div className="ghostkit-control-typography">
                    <div className="ghostkit-typography-font-control">
                        <Tooltip text={ __( 'Font Family' ) }>
                            <div>
                                <Select
                                    value={ this.props.fontFamily }
                                    onChange={ ( opt ) => {
                                        this.props.fontFamily = opt;
                                        this.props.fontFamilyCategory = opt.family;
                                        this.props.fontWeight = { value: '400', label: 'Regular' };
                                        this.props.fontWeights = getFontWeights( opt.label, this.props.fontFamilyCategory );
                                        onChange( {
                                            ...this.props,
                                        } );
                                    } }
                                    options={ fontFamilies }
                                    formatGroupLabel={ data => (
                                        <div>
                                            <span>{ data.label }</span>
                                        </div>
                                    ) }
                                    placeholder={ __( '--- Select font ---' ) }
                                    className="ghostkit-typography-font-selector"
                                    classNamePrefix="ghostkit-typography-font-selector"
                                    menuPosition="fixed"
                                />
                            </div>
                        </Tooltip>
                    </div>
                    <div className="ghostkit-typography-weight-control">
                        <Tooltip text={ __( 'Font Weight' ) }>
                            <div>
                                <Select
                                    value={ this.props.fontWeight }
                                    onChange={ ( opt ) => {
                                        this.props.fontWeight = opt;
                                        onChange( {
                                            ...this.props,
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
                                    value={ this.props.fontSize }
                                    placeholder="-"
                                    onChange={ value => {
                                        this.props.fontSize = value;
                                        onChange( {
                                            ...this.props,
                                        } );
                                    } }
                                    autoComplete="off"
                                    icon={ getIcon( 'icon-font-size' ) }
                                />
                            </div>
                        </Tooltip>
                    </div>
                    {
                        this.props.lineHeight !== undefined &&
                            <div className="ghostkit-typography-line-control">
                                <Tooltip text={ __( 'Line Height' ) }>
                                    <div>
                                        <InputDrag
                                            value={ this.props.lineHeight }
                                            placeholder="-"
                                            onChange={ value => {
                                                this.props.lineHeight = value;
                                                onChange( {
                                                    ...this.props,
                                                } );
                                            } }
                                            autoComplete="off"
                                            icon={ getIcon( 'icon-line-height' ) }
                                        />
                                    </div>
                                </Tooltip>
                            </div>
                    }
                    {
                        this.props.letterSpacing !== undefined &&
                        <div className="ghostkit-typography-letter-control">
                            <Tooltip text={ __( 'Letter Spacing' ) }>
                                <div>
                                    <InputDrag
                                        value={ this.props.letterSpacing }
                                        placeholder="-"
                                        onChange={ value => {
                                            this.props.letterSpacing = value;
                                            this.setState( {
                                                letterSpacing: value,
                                            }, () => {
                                                onChange( {
                                                    ...this.props,
                                                } );
                                            } );
                                        } }
                                        autoComplete="off"
                                        icon={ getIcon( 'icon-letter-spacing' ) }
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
