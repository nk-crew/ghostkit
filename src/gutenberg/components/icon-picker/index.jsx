/**
 * Import CSS
 */
import './editor.scss';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    Component,
} = wp.element;

const { __ } = wp.i18n;

const {
    Dropdown,
    Tooltip,
    BaseControl,
    TextControl,
} = wp.components;

/**
 * Internal dependencies
 */
const { GHOSTKIT } = window;

/**
 * Go over each icon.
 *
 * @param {Function} callback callback.
 */
function eachIcons( callback ) {
    const {
        icons,
        settings,
    } = GHOSTKIT;

    Object.keys( icons ).forEach( ( key ) => {
        const allow = typeof settings[ `icon_pack_${ key }` ] === 'undefined' || settings[ `icon_pack_${ key }` ];

        if ( allow ) {
            callback( icons[ key ] );
        }
    } );
}

// we need this lazy loading component to prevent a huge lags while first loading SVG icons
class Icon extends Component {
    render() {
        const {
            iconData,
            onClick,
            active,
        } = this.props;

        return (
            <IconPicker.Preview
                className={ classnames( 'ghostkit-component-icon-picker-button', active ? 'ghostkit-component-icon-picker-button-active' : '' ) }
                onClick={ onClick }
                data={ iconData }
            />
        );
    }
}

class IconPickerDropdown extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            search: '',
        };
    }

    render() {
        const {
            label,
            className,
            onChange,
            value,
            renderToggle,
        } = this.props;

        const dropdown = (
            <Dropdown
                className={ className }
                renderToggle={ renderToggle }
                renderContent={ () => {
                    const result = [];

                    eachIcons( ( iconsData ) => {
                        result.push( <span>{ iconsData.name }</span> );
                        result.push(
                            <div className="ghostkit-component-icon-picker-list">
                                { iconsData.icons.map( ( iconData ) => {
                                    if (
                                        ! this.state.search ||
                                        ( this.state.search && iconData.keys.indexOf( this.state.search ) > -1 )
                                    ) {
                                        return (
                                            <Icon
                                                key={ iconData.class }
                                                active={ iconData.class === value }
                                                iconData={ iconData }
                                                onClick={ () => {
                                                    onChange( iconData.class );
                                                } }
                                            />
                                        );
                                    }

                                    return '';
                                } ) }
                            </div>
                        );
                    } );

                    return (
                        <div className="ghostkit-component-icon-picker">
                            <div>
                                <TextControl
                                    label={ __( 'Icon class' ) }
                                    value={ value }
                                    onChange={ ( newClass ) => {
                                        onChange( newClass );
                                    } }
                                    placeholder={ __( 'Icon class' ) }
                                />
                                <TextControl
                                    label={ __( 'Search icon' ) }
                                    value={ this.state.search }
                                    onChange={ ( searchVal ) => this.setState( { search: searchVal } ) }
                                    placeholder={ __( 'Type to search...' ) }
                                />
                            </div>
                            <div className="ghostkit-component-icon-picker-list-wrap">
                                { result }
                            </div>
                        </div>
                    );
                } }
            />
        );

        return label ? (
            <BaseControl
                label={ label }
                className={ className }
            >
                { dropdown }
            </BaseControl>
        ) : (
            dropdown
        );
    }
}

export default class IconPicker extends Component {
    render() {
        const {
            value,
            onChange,
            label,
        } = this.props;

        return (
            <IconPicker.Dropdown
                label={ label }
                className="ghostkit-component-icon-picker-wrapper"
                onChange={ onChange }
                value={ value }
                renderToggle={ ( { isOpen, onToggle } ) => (
                    <Tooltip text={ __( 'Icon Picker' ) }>
                        <IconPicker.Preview
                            className="ghostkit-component-icon-picker-button"
                            aria-expanded={ isOpen }
                            onClick={ onToggle }
                            name={ value }
                            alwaysRender={ true }
                        />
                    </Tooltip>
                ) }
            />
        );
    }
}

// dropdown
IconPicker.Dropdown = IconPickerDropdown;

// preview icon.
IconPicker.Preview = ( props ) => {
    const {
        onClick,
        className,
        alwaysRender = false,
    } = props;

    let {
        data,
        name,
    } = props;

    if ( ! data && name ) {
        eachIcons( ( iconsData ) => {
            iconsData.icons.forEach( ( iconData ) => {
                if ( ! data && iconData.class && iconData.class === name && iconData.preview ) {
                    if ( iconData.preview ) {
                        data = iconData;
                    } else {
                        name = iconData.class;
                    }
                }
            } );
        } );
    }

    let result = '';

    if ( data && data.preview ) {
        result = <span dangerouslySetInnerHTML={ { __html: data.preview } }></span>;
    } else if ( name || ( data && data.class ) ) {
        result = <IconPicker.Render name={ name || data.class } />;
    }

    return ( result || alwaysRender ? (
        <span
            className={ classnames( className, 'ghostkit-component-icon-picker-preview', onClick ? 'ghostkit-component-icon-picker-preview-clickable' : '' ) }
            onClick={ onClick }
            onKeyPress={ () => {} }
            role="button"
            tabIndex={ 0 }
        >
            { result }
        </span>
    ) : '' );
};

// render icon.
IconPicker.Render = ( { name } ) => {
    return <span className={ name } />;
};
