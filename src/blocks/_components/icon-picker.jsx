import classnames from 'classnames/dedupe';

const { Component } = wp.element;

const { __ } = wp.i18n;

const { GHOSTKIT } = window;

const {
    Dropdown,
    Tooltip,
    BaseControl,
    TextControl,
} = wp.components;

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
                                <span dangerouslySetInnerHTML={ { __html: `<span class="${ value }"></span>` } }></span>
                            </button>
                        </Tooltip>
                    ) }
                    renderContent={ () => {
                        const result = [];

                        GHOSTKIT.icons.forEach( ( iconsData ) => {
                            result.push( <span>{ iconsData.name }</span> );
                            result.push(
                                <div className="ghostkit-component-icon-picker-list">
                                    { iconsData.icons.map( ( iconData ) => {
                                        if (
                                            ! this.state.search ||
                                            ( this.state.search && iconData.keys.indexOf( this.state.search ) > -1 )
                                        ) {
                                            return (
                                                <button
                                                    key={ iconData.class }
                                                    className={ classnames( 'ghostkit-component-icon-picker-button', iconData.class === value ? 'ghostkit-component-icon-picker-button-active' : '' ) }
                                                    onClick={ () => {
                                                        onChange( iconData.class );
                                                    } }
                                                >
                                                    { iconData.preview ? (
                                                        <span dangerouslySetInnerHTML={ { __html: iconData.preview } }></span>
                                                    ) : (
                                                        <span className={ iconData.class }></span>
                                                    ) }
                                                </button>
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
