/**
 * Import CSS
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
const {
    Component,
} = wp.element;

const {
    Tooltip,
    DropdownMenu,
    MenuGroup,
    MenuItem,
} = wp.components;

const { __ } = wp.i18n;

const {
    applyFilters,
} = wp.hooks;

/**
 * Internal dependencies
 */
import Select from '../select';
import InputDrag from '../input-drag';
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';

const { GHOSTKIT } = window;

/**
 * Get Default Font
 * @param {string} fontFamily - Current Font.
 * @return {*} - Current font or default label if font is empty.
 */
function getDefaultFont( fontFamily ) {
    return fontFamily === '' ? __( 'Default Site Font', '@@text_domain' ) : fontFamily;
}

/**
 * Go over each fonts.
 *
 * @param {string} category - Font Family Category.
 * @return {*[]} - Fonts List.
 */
function getFonts( category = 'google-fonts' ) {
    const {
        fonts,
    } = GHOSTKIT;

    const fontList = [];

    Object.keys( fonts ).forEach( ( fontFamilyCategory ) => {
        Object.keys( fonts[ fontFamilyCategory ].fonts ).forEach( ( fontKey ) => {
            let fontValue = fonts[ fontFamilyCategory ].fonts[ fontKey ].name;
            if ( fontFamilyCategory === 'default' ) {
                fontValue = '';
            }
            if ( category === fontFamilyCategory || fontFamilyCategory === 'default' ) {
                fontList.push(
                    { value: fontValue, label: fonts[ fontFamilyCategory ].fonts[ fontKey ].name, fontFamilyCategory: fontFamilyCategory }
                );
            }
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
    case '':
        label = __( 'Default', '@@text_domain' );
        break;
    case '100':
        label = __( 'Thin', '@@text_domain' );
        break;
    case '100i':
        label = __( 'Thin Italic', '@@text_domain' );
        break;
    case '200':
        label = __( 'Extra Light', '@@text_domain' );
        break;
    case '200i':
        label = __( 'Extra Light Italic', '@@text_domain' );
        break;
    case '300':
        label = __( 'Light', '@@text_domain' );
        break;
    case '300i':
        label = __( 'Light Italic', '@@text_domain' );
        break;
    case '400':
        label = __( 'Regular', '@@text_domain' );
        break;
    case '400i':
        label = __( 'Regular Italic', '@@text_domain' );
        break;
    case '500':
        label = __( 'Medium', '@@text_domain' );
        break;
    case '500i':
        label = __( 'Medium Italic', '@@text_domain' );
        break;
    case '600':
        label = __( 'Semi Bold', '@@text_domain' );
        break;
    case '600i':
        label = __( 'Semi Bold Italic', '@@text_domain' );
        break;
    case '700':
        label = __( 'Bold', '@@text_domain' );
        break;
    case '700i':
        label = __( 'Bold Italic', '@@text_domain' );
        break;
    case '800':
        label = __( 'Extra Bold', '@@text_domain' );
        break;
    case '800i':
        label = __( 'Extra Bold Italic', '@@text_domain' );
        break;
    case '900':
        label = __( 'Black', '@@text_domain' );
        break;
    case '900i':
        label = __( 'Black Italic', '@@text_domain' );
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

    if ( font !== '' &&
        fontFamilyCategory !== '' &&
        typeof font !== 'undefined' &&
        typeof fontFamilyCategory !== 'undefined' &&
        typeof fonts[ fontFamilyCategory ] !== 'undefined' ) {
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
            fontFamilyCategory,
        } = this.props;

        const {
            onChange,
            placeholders,
            label,
            fontFamily,
            fontWeight,
            fontSize,
            lineHeight,
            letterSpacing,
            childOf,
            fontWeights = getFontWeights( getDefaultFont( fontFamily ), fontFamilyCategory ),
        } = this.props;

        const fontsIcon = fontFamilyCategory === 'default' ? 'icon-typography-google-fonts' : 'icon-typography-' + fontFamilyCategory;
        const showFontSelectors = applyFilters( 'ghostkit.typography.allow.fonts', fontFamilyCategory !== 'adobe-fonts', fontFamilyCategory );
        const fontFamilyValue = { value: fontFamily, label: getDefaultFont( fontFamily ), fontFamilyCategory: fontFamilyCategory };
        const fontWeightValue = { value: fontWeight, label: getFontWeightLabel( fontWeight ) };
        const fontSizeValue = typeof fontSize === 'undefined' ? '' : fontSize;
        const childOfClass = childOf !== '' ? ' ghostkit-typography-child' + ' ghostkit-typography-child-of-' + childOf : '';
        let fontFamilies;

        if ( 'default' === fontFamilyCategory ) {
            fontFamilies = getFonts( 'google-fonts' );
        } else {
            fontFamilies = getFonts( fontFamilyCategory );
        }

        return (
            <div className={ 'ghostkit-typography' + childOfClass }>
                <h4>{ label }</h4>
                <div className="ghostkit-control-typography">
                    { typeof fontFamilyCategory !== 'undefined' ? (
                        <div className="ghostkit-typography-font-category-control">
                            <div>
                                <DropdownMenu
                                    icon={ getIcon( fontsIcon, false ) }
                                    label="Font Family Category"
                                >
                                    { ( { onClose } ) => (
                                        <MenuGroup>
                                            <MenuItem
                                                icon={ getIcon( 'icon-typography-google-fonts', false ) }
                                                onClick={ () => {
                                                    onChange( {
                                                        fontFamilyCategory: 'google-fonts',
                                                        fontFamily: '',
                                                        fontWeight: '',
                                                    } );
                                                    onClose();
                                                } }
                                            >
                                                { __( 'Google Fonts', '@@text_domain' ) }
                                            </MenuItem>
                                            <MenuItem
                                                icon={ getIcon( 'icon-typography-adobe-fonts', false ) }
                                                onClick={ () => {
                                                    onChange( {
                                                        fontFamilyCategory: 'adobe-fonts',
                                                        fontFamily: '',
                                                        fontWeight: '',
                                                    } );
                                                    onClose();
                                                } }
                                            >
                                                { __( 'Adobe Fonts', '@@text_domain' ) }
                                                <span className="ghostkit-typography-badge-pro-container">
                                                    <span className="ghostkit-typography-badge-pro">PRO</span>
                                                </span>
                                            </MenuItem>
                                        </MenuGroup>
                                    ) }
                                </DropdownMenu>
                            </div>
                        </div>
                    ) : '' }
                    <ApplyFilters name="ghostkit.typography.fontFamilySelector.info" props={ this.props }>
                        { fontFamilyCategory === 'adobe-fonts' ? (
                            <div className="ghostkit-typography-information-control">
                                { __( 'Adobe and Custom user fonts available for PRO users only. Read more about Ghost Kit PRO plugin here - ', '@@text_domain' ) }
                                <a target={ '_blank' } href={ 'https://ghostkit.io/pricing/' }>https://ghostkit.io/pricing/</a>
                            </div>
                        ) : '' }
                    </ApplyFilters>
                    { typeof fontFamily !== 'undefined' && showFontSelectors ? (
                        <div className="ghostkit-typography-font-control">
                            <Tooltip text={ __( 'Font Family', '@@text_domain' ) }>
                                <div>
                                    <Select
                                        value={ fontFamilyValue }
                                        onChange={ ( opt ) => {
                                            onChange( {
                                                fontFamily: opt && opt.value ? opt.value : '',
                                                fontFamilyCategory: opt && opt.fontFamilyCategory ? opt.fontFamilyCategory : '',
                                                fontWeight: opt && opt.value ? '400' : '',
                                            } );
                                        } }
                                        options={ fontFamilies }
                                        placeholder={ __( '--- Select Font Family ---', '@@text_domain' ) }
                                        className="ghostkit-typography-font-selector"
                                        menuPosition="fixed"
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    ) : '' }
                    { typeof fontWeight !== 'undefined' && showFontSelectors ? (
                        <div className="ghostkit-typography-weight-control">
                            <Tooltip text={ __( 'Font Weight', '@@text_domain' ) }>
                                <div>
                                    <Select
                                        value={ fontWeightValue }
                                        onChange={ ( opt ) => {
                                            onChange( {
                                                fontWeight: opt && opt.value ? opt.value : '',
                                            } );
                                        } }
                                        options={ fontWeights }
                                        placeholder={ __( '--- Select Weight ---', '@@text_domain' ) }
                                        className="ghostkit-typography-weight-selector"
                                        classNamePrefix="ghostkit-typography-weight-selector"
                                        menuPosition="fixed"
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    ) : '' }
                    { typeof fontSize !== 'undefined' ? (
                        <div className="ghostkit-typography-size-control">
                            <Tooltip text={ __( 'Font Size', '@@text_domain' ) }>
                                <div>
                                    <InputDrag
                                        value={ fontSizeValue }
                                        placeholder={ ( placeholders[ 'font-size' ] ) }
                                        onChange={ value => {
                                            onChange( {
                                                fontSize: value,
                                            } );
                                        } }
                                        autoComplete="off"
                                        icon={ getIcon( 'icon-typography-font-size' ) }
                                        defaultUnit="px"
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    ) : '' }
                    { typeof lineHeight !== 'undefined' ? (
                        <div className="ghostkit-typography-line-control">
                            <Tooltip text={ __( 'Line Height', '@@text_domain' ) }>
                                <div>
                                    <InputDrag
                                        value={ lineHeight }
                                        placeholder={ ( placeholders[ 'line-height' ] ) }
                                        onChange={ value => {
                                            onChange( {
                                                lineHeight: value,
                                            } );
                                        } }
                                        autoComplete="off"
                                        icon={ getIcon( 'icon-typography-line-height' ) }
                                        step={ 0.1 }
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    ) : '' }
                    { typeof letterSpacing !== 'undefined' ? (
                        <div className="ghostkit-typography-letter-control">
                            <Tooltip text={ __( 'Letter Spacing', '@@text_domain' ) }>
                                <div>
                                    <InputDrag
                                        value={ letterSpacing }
                                        placeholder={ ( placeholders[ 'letter-spacing' ] ) }
                                        onChange={ value => {
                                            onChange( {
                                                letterSpacing: value,
                                            } );
                                        } }
                                        autoComplete="off"
                                        icon={ getIcon( 'icon-typography-letter-spacing' ) }
                                        defaultUnit="em"
                                        step={ 0.01 }
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    ) : '' }
                </div>
            </div>
        );
    }
}
