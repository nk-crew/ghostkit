/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import Select from '../select';
import InputDrag from '../input-drag';
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../apply-filters';

const {
    Component,
} = wp.element;

const {
    Tooltip,
    DropdownMenu,
    MenuGroup,
    MenuItem,
    ExternalLink,
} = wp.components;

const { __ } = wp.i18n;

const {
    applyFilters,
} = wp.hooks;

const { GHOSTKIT } = window;

/**
 * Get Default Font
 * @param {string} fontFamily - Current Font.
 * @return {*} - Current font or default label if font is empty.
 */
function getDefaultFont( fontFamily ) {
    return '' === fontFamily ? __( 'Default Site Font', '@@text_domain' ) : fontFamily;
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
            const fontData = fonts[ fontFamilyCategory ].fonts[ fontKey ];
            let fontValue = fontData.name;

            if ( 'default' === fontFamilyCategory ) {
                fontValue = '';
            }

            if ( category === fontFamilyCategory || 'default' === fontFamilyCategory ) {
                fontList.push(
                    { value: fontValue, label: fontData.label || fontData.name, fontFamilyCategory }
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
    // no default
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

    if ( '' !== font
        && '' !== fontFamilyCategory
        && 'undefined' !== typeof font
        && 'undefined' !== typeof fontFamilyCategory
        && 'undefined' !== typeof fonts[ fontFamilyCategory ] ) {
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
export default class Typography extends Component {
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

        const fontsIcon = `icon-typography-${ 'default' === fontFamilyCategory ? 'google-fonts' : fontFamilyCategory }`;
        const allowFontSelectors = applyFilters( 'ghostkit.typography.allow.fonts', 'adobe-fonts' !== fontFamilyCategory && 'custom-fonts' !== fontFamilyCategory, fontFamilyCategory );
        const fontFamilyValue = { value: fontFamily, label: getDefaultFont( fontFamily ), fontFamilyCategory };
        const fontWeightValue = { value: fontWeight, label: getFontWeightLabel( fontWeight ) };
        const fontSizeValue = 'undefined' === typeof fontSize ? '' : fontSize;
        let fontFamilies;

        if ( 'default' === fontFamilyCategory ) {
            fontFamilies = getFonts( 'google-fonts' );
        } else {
            fontFamilies = getFonts( fontFamilyCategory );
        }

        // Find actual label.
        if ( fontFamilyValue.value ) {
            fontFamilies.forEach( ( familyData ) => {
                if ( fontFamilyValue.value === familyData.value ) {
                    fontFamilyValue.label = familyData.label;
                }
            } );
        }

        return (
            <div className={ `ghostkit-typography${ childOf ? ` ghostkit-typography-child ghostkit-typography-child-of-${ childOf }` : '' }` }>
                <h4>{ label }</h4>
                <div className="ghostkit-control-typography">
                    { 'undefined' !== typeof fontFamilyCategory ? (
                        <DropdownMenu
                            icon={ getIcon( fontsIcon, false ) }
                            label={ __( 'Font Family Category', '@@text_domain' ) }
                            popoverProps={ {
                                position: 'bottom right',
                            } }
                            menuProps={ {
                                className: 'ghostkit-typography-font-category-control-menu',
                            } }
                            toggleProps={ {
                                className: 'ghostkit-typography-font-category-control-toggle',
                            } }
                            hasArrowIndicator
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
                                        <span className="ghostkit-typography-badge-pro">{ __( 'PRO', '@@text_domain' ) }</span>
                                    </MenuItem>
                                    <MenuItem
                                        icon={ getIcon( 'icon-typography-custom-fonts', false ) }
                                        onClick={ () => {
                                            onChange( {
                                                fontFamilyCategory: 'custom-fonts',
                                                fontFamily: '',
                                                fontWeight: '',
                                            } );
                                            onClose();
                                        } }
                                    >
                                        { __( 'Custom Fonts', '@@text_domain' ) }
                                        <span className="ghostkit-typography-badge-pro">{ __( 'PRO', '@@text_domain' ) }</span>
                                    </MenuItem>
                                </MenuGroup>
                            ) }
                        </DropdownMenu>
                    ) : '' }
                    <ApplyFilters name="ghostkit.typography.fontFamilySelector.info" props={ this.props }>
                        { 'adobe-fonts' === fontFamilyCategory ? (
                            <div className="ghostkit-typography-information-control ghostkit-typography-font-control">
                                { __( 'Adobe Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ', '@@text_domain' ) }
                                <ExternalLink href="https://ghostkit.io/pricing/">https://ghostkit.io/pricing/</ExternalLink>
                            </div>
                        ) : '' }
                        { 'custom-fonts' === fontFamilyCategory ? (
                            <div className="ghostkit-typography-information-control ghostkit-typography-font-control">
                                { __( 'Custom Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ', '@@text_domain' ) }
                                <ExternalLink href="https://ghostkit.io/pricing/">https://ghostkit.io/pricing/</ExternalLink>
                            </div>
                        ) : '' }
                    </ApplyFilters>
                    { 'undefined' !== typeof fontFamily && allowFontSelectors ? (
                        <div className="ghostkit-typography-font-control">
                            <Tooltip text={ __( 'Font Family', '@@text_domain' ) }>
                                <div>
                                    <Select
                                        value={ fontFamilyValue }
                                        onChange={ ( opt ) => {
                                            onChange( {
                                                fontFamily: opt && opt.value ? opt.value : '',
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
                    { 'undefined' !== typeof fontWeight && allowFontSelectors ? (
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
                    { 'undefined' !== typeof fontSize ? (
                        <div className="ghostkit-typography-size-control">
                            <Tooltip text={ __( 'Font Size', '@@text_domain' ) }>
                                <div>
                                    <InputDrag
                                        value={ fontSizeValue }
                                        placeholder={ ( placeholders[ 'font-size' ] ) }
                                        onChange={ ( value ) => {
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
                    { 'undefined' !== typeof lineHeight ? (
                        <div className="ghostkit-typography-line-control">
                            <Tooltip text={ __( 'Line Height', '@@text_domain' ) }>
                                <div>
                                    <InputDrag
                                        value={ lineHeight }
                                        placeholder={ ( placeholders[ 'line-height' ] ) }
                                        onChange={ ( value ) => {
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
                    { 'undefined' !== typeof letterSpacing ? (
                        <div className="ghostkit-typography-letter-control">
                            <Tooltip text={ __( 'Letter Spacing', '@@text_domain' ) }>
                                <div>
                                    <InputDrag
                                        value={ letterSpacing }
                                        placeholder={ ( placeholders[ 'letter-spacing' ] ) }
                                        onChange={ ( value ) => {
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
