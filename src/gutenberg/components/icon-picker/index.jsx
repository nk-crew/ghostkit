/**
 * Import CSS
 */
import './editor.scss';
import 'react-virtualized/styles.css';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from 'react-virtualized';

/**
 * WordPress dependencies
 */
const {
    Component,
    Fragment,
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

        this.cellMCache = new CellMeasurerCache( {
            defaultHeight: 65,
            fixedWidth: true,
        } );

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

        const rows = [
            {
                key: 'form',
                render: (
                    <Fragment key="form">
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
                            onChange={ ( searchVal ) => (
                                this.setState( { search: searchVal }, () => {
                                    this.cellMCache.clearAll();
                                } )
                            ) }
                            placeholder={ __( 'Type to search...' ) }
                        />
                    </Fragment>
                ),
            },
        ];

        eachIcons( ( iconsData ) => {
            rows.push( {
                key: `title-${ iconsData.name }`,
                render: (
                    <div className="ghostkit-component-icon-picker-list-title">
                        { iconsData.name }
                    </div>
                ),
            } );

            const allIcons = iconsData.icons.filter( ( iconData ) => {
                if (
                    ! this.state.search ||
                    ( this.state.search && iconData.keys.indexOf( this.state.search ) > -1 )
                ) {
                    return true;
                }

                return false;
            } ).map( ( iconData ) => {
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
            } );

            let currentIcons = [];
            allIcons.forEach( ( icon, i ) => {
                currentIcons.push( icon );

                if ( 3 === currentIcons.length || allIcons.length === ( i + 1 ) ) {
                    rows.push( {
                        key: 'icons',
                        render: (
                            <div className="ghostkit-component-icon-picker-list">
                                { currentIcons }
                            </div>
                        ),
                    } );
                    currentIcons = [];
                }
            } );
        } );

        const dropdown = (
            <Dropdown
                className={ className }
                contentClassName="ghostkit-component-icon-picker-content"
                renderToggle={ renderToggle }
                focusOnMount={ false }
                renderContent={ () => {
                    const result = (
                        <AutoSizer>
                            { ( { width, height } ) => (
                                <List
                                    className="ghostkit-component-icon-picker-list-wrap"
                                    width={ width }
                                    height={ height }
                                    rowCount={ rows.length }
                                    rowHeight={ this.cellMCache.rowHeight }
                                    rowRenderer={ ( data ) => {
                                        const {
                                            index,
                                            style,
                                            parent,
                                            key,
                                        } = data;

                                        return (
                                            <CellMeasurer
                                                cache={ this.cellMCache }
                                                columnIndex={ 0 }
                                                key={ key }
                                                rowIndex={ index }
                                                parent={ parent }
                                            >
                                                { () => (
                                                    <div style={ style }>
                                                        { rows[ index ].render || '' }
                                                    </div>
                                                ) }
                                            </CellMeasurer>
                                        );
                                    } }
                                />
                            ) }
                        </AutoSizer>
                    );

                    return (
                        <Fragment>
                            <div className="ghostkit-component-icon-picker-sizer" />
                            <div className="ghostkit-component-icon-picker">
                                { result }
                            </div>
                        </Fragment>
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
