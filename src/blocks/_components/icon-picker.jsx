import classnames from 'classnames/dedupe';

const {
    Component,
} = wp.element;

const { __ } = wp.i18n;

const { GHOSTKIT } = window;

const {
    Dropdown,
    Tooltip,
    BaseControl,
    TextControl,
} = wp.components;

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
            <button
                className={ classnames( 'ghostkit-component-icon-picker-button', active ? 'ghostkit-component-icon-picker-button-active' : '' ) }
                onClick={ onClick }
            >
                <IconPicker.Preview data={ iconData } />
            </button>
        );
    }
}

export default class IconPicker extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            search: '',
        };
    }

    render() {
        const {
            value,
            onChange,
            label,
        } = this.props;

        return (
            <BaseControl
                label={ label }
                className="ghostkit-component-icon-picker-wrapper"
            >
                <Dropdown
                    renderToggle={ ( { isOpen, onToggle } ) => (
                        <Tooltip text={ __( 'Custom color picker' ) }>
                            <button
                                type="button"
                                aria-expanded={ isOpen }
                                onClick={ onToggle }
                                className="ghostkit-component-icon-picker-button"
                            >
                                <IconPicker.Preview name={ value } />
                            </button>
                        </Tooltip>
                    ) }
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
            </BaseControl>
        );
    }
}

// preview icon.
IconPicker.Preview = ( { data, name } ) => {
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

    if ( data && data.preview ) {
        return <span dangerouslySetInnerHTML={ { __html: data.preview } }></span>;
    } else if ( name || ( data && data.class ) ) {
        return <IconPicker.Render name={ name || data.class } />;
    }

    return '';
};

// render icon.
IconPicker.Render = ( { name } ) => {
    return <span className={ name } />;
};
