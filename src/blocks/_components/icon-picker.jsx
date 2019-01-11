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
                { iconData.preview ? (
                    <span dangerouslySetInnerHTML={ { __html: iconData.preview } }></span>
                ) : (
                    <span className={ iconData.class }></span>
                ) }
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

        const {
            icons,
            settings,
        } = GHOSTKIT;

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
                                <span dangerouslySetInnerHTML={ { __html: `<span class="${ value }"></span>` } }></span>
                            </button>
                        </Tooltip>
                    ) }
                    renderContent={ () => {
                        const result = [];

                        Object.keys( icons ).forEach( ( key ) => {
                            const allow = typeof settings[ `icon_pack_${ key }` ] === 'undefined' || settings[ `icon_pack_${ key }` ];

                            if ( allow ) {
                                const iconsData = icons[ key ];
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
                            }
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
