// Import CSS
import './editor.scss';

// external Dependencies.
import Select from 'react-select';

// Internal Dependencies.
import elementIcon from '../_icons/customizer.svg';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    TextControl,
    SelectControl,
    withAPIData,
    Placeholder,
    Spinner,
} = wp.components;

class CustomizerBlock extends Component {
    constructor() {
        super( ...arguments );
        this.jsonOptions = false;
        this.getOptionCategory = this.getOptionCategory.bind( this );
        this.getSelectedOptions = this.getSelectedOptions.bind( this );
        this.getSelectValues = this.getSelectValues.bind( this );
        this.updateOptions = this.updateOptions.bind( this );
    }

    /**
     * Get options category label and slug by option data.
     *
     * @param {Object} opt - option data.
     * @returns {{slug: string, label: string}} - slug and label.
     */
    getOptionCategory( opt ) {
        let slug = '';
        let label = '';

        if ( opt.panel && opt.panel.id ) {
            slug = opt.panel.id;
            label = opt.panel.title;
        }
        if ( opt.section && opt.section.id ) {
            slug += opt.section.id;
            label += ( label ? ' > ' : '' ) + opt.section.title;
        }

        label = label || __( 'Uncategorized' );
        slug = slug || 'uncategorized';

        return {
            slug,
            label,
        };
    }

    /**
     * Get current selected options.
     *
     * @returns {array} - options array.
     */
    getSelectedOptions() {
        const {
            attributes,
            customizerOptions,
        } = this.props;

        let {
            options = '',
        } = attributes;

        if ( ! this.jsonOptions ) {
            try {
                options = JSON.parse( decodeURI( options ) );
            } catch ( e ) {
                options = [];
            }
        } else {
            options = this.jsonOptions;
        }

        if ( customizerOptions && customizerOptions.data && customizerOptions.data.data && customizerOptions.data.data.success ) {
            Object.keys( customizerOptions.data.data.response ).map( ( k ) => {
                const opt = customizerOptions.data.data.response[ k ];
                options.forEach( ( val, n ) => {
                    if ( options[ n ] && options[ n ].id === opt.id ) {
                        const choices = [];

                        if ( opt.choices && Object.keys( opt.choices ).length ) {
                            choices.push( {
                                value: '',
                                label: '',
                            } );
                            Object.keys( opt.choices ).map( ( name ) => {
                                choices.push( {
                                    value: name,
                                    label: `${ opt.choices[ name ] } [${ name }]`,
                                } );
                            } );
                        }

                        options[ n ].label = opt.label || opt.id;
                        options[ n ].default = opt.default;
                        options[ n ].type = opt.type;
                        options[ n ].choices = choices;
                        options[ n ].category = this.getOptionCategory( opt );
                    }
                } );
            } );
        }

        return options;
    }

    /**
     * Get array ready for ReactSelect.
     *
     * @returns {array} - array with options.
     */
    getSelectValues() {
        const {
            customizerOptions,
        } = this.props;

        let result = false;

        if ( customizerOptions && customizerOptions.data && customizerOptions.data.data && customizerOptions.data.data.success ) {
            result = [];
            const groupedList = {};

            Object.keys( customizerOptions.data.data.response ).map( ( k ) => {
                const val = customizerOptions.data.data.response[ k ];
                let prevent = false;

                // disable some options
                if (
                    'active_theme' === val.id ||
                    ( val.panel && val.panel.id && 'widgets' === val.panel.id ) ||
                    ( val.panel && val.panel.id && 'nav_menus' === val.panel.id ) ||
                    ( ! val.panel && 'option' === val.type && /^widget_/.test( val.id ) ) ||
                    ( ! val.panel && 'option' === val.type && /^sidebars_widgets\[/.test( val.id ) ) ||
                    ( ! val.panel && 'option' === val.type && /^nav_menus_/.test( val.id ) )
                ) {
                    prevent = true;
                }

                if ( ! prevent ) {
                    const category = this.getOptionCategory( val );

                    if ( typeof groupedList[ category.slug ] === 'undefined' ) {
                        groupedList[ category.slug ] = {
                            label: category.label,
                            options: [],
                        };
                    }

                    groupedList[ category.slug ].options.push( {
                        label: val.label || val.id,
                        value: val.id,
                    } );
                }
            } );

            Object.keys( groupedList ).map( ( k ) => {
                result.push( groupedList[ k ] );
            } );
        }

        return result;
    }

    /**
     * Update option when user changed something.
     *
     * @param {string} value - new option value
     * @param {object} opt - option data.
     */
    updateOptions( value, opt ) {
        const {
            setAttributes,
        } = this.props;
        let options = this.getSelectedOptions();

        // remove option.
        if ( value === null ) {
            options = options.filter( ( item ) => {
                return item.id !== opt.id;
            } );

        // add/update option
        } else {
            let updated = false;
            options.forEach( ( val, k ) => {
                if ( options[ k ] && options[ k ].id === opt.id ) {
                    options[ k ].value = value;
                    updated = true;
                }
            } );

            if ( ! updated ) {
                options.unshift( {
                    id: opt.id,
                    value,
                } );
            }
        }
        this.jsonOptions = options;
        setAttributes( { options: encodeURI( JSON.stringify( options ) ) } );
    }

    render() {
        const {
            className,
        } = this.props;

        const options = this.getSelectedOptions();
        const customizerOptionsSelect = this.getSelectValues();

        return (
            <Placeholder
                icon={ <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" /> }
                label={ __( 'Customizer Options' ) }
                className={ className }
            >
                { ! customizerOptionsSelect ? (
                    <div className="ghostkit-customizer-spinner"><Spinner /></div>
                ) : '' }
                { Array.isArray( customizerOptionsSelect ) && customizerOptionsSelect.length ? (
                    <Select
                        value={ '' }
                        onChange={ ( opt ) => {
                            this.updateOptions( '', {
                                id: opt.value,
                            } );
                        } }
                        options={ customizerOptionsSelect }
                        placeholder={ __( '--- Select option ---' ) }
                        className="ghostkit-customizer-select"
                        classNamePrefix="ghostkit-customizer-select"
                        menuPosition="fixed"
                    />
                ) : '' }
                { Array.isArray( customizerOptionsSelect ) && ! customizerOptionsSelect.length ? (
                    <div className="ghostkit-customizer-info">
                        { __( 'No customizer options found. You can manually open ' ) } { <strong>{ __( 'Appearance > Customize' ) }</strong> }{ __( ', and the list will be available here.' ) }
                    </div>
                ) : '' }
                { Array.isArray( options ) && options.length ? (
                    <div className="ghostkit-customizer-list">
                        { options.map( ( opt ) => {
                            return (
                                <div key={ opt.id }>
                                    {
                                        opt.choices && opt.choices.length ? (
                                            <SelectControl
                                                label={ opt.label || opt.id }
                                                value={ opt.value }
                                                options={ opt.choices }
                                                onChange={ ( value ) => {
                                                    this.updateOptions( value, opt );
                                                } }
                                                className="ghostkit-customizer-list-field"
                                            />
                                        ) : (
                                            <TextControl
                                                label={ opt.label || opt.id }
                                                value={ opt.value }
                                                onChange={ ( value ) => {
                                                    this.updateOptions( value, opt );
                                                } }
                                                className="ghostkit-customizer-list-field"
                                            />
                                        )
                                    }
                                    <div className="ghostkit-customizer-list-info">
                                        <small className="ghostkit-customizer-list-info-id">{ opt.id }</small>
                                        { opt.default || typeof( opt.default ) === 'boolean' ? (
                                            <small className="ghostkit-customizer-list-info-default">
                                                { __( 'Default:' ) } <span>{ ( typeof( opt.default ) === 'boolean' ? opt.default.toString() : opt.default ) }</span>
                                            </small>
                                        ) : '' }
                                    </div>
                                    <button
                                        className="ghostkit-customizer-list-remove"
                                        onClick={ ( e ) => {
                                            e.preventDefault();
                                            this.updateOptions( null, opt );
                                        } }
                                    >
                                        <span className="dashicons dashicons-no-alt" />
                                    </button>
                                </div>
                            );
                        } ) }
                    </div>
                ) : '' }
            </Placeholder>
        );
    }
}

export const name = 'ghostkit/customizer';

export const settings = {
    title: __( 'Customizer' ),
    description: __( 'Replace the customizer options for current post.' ),
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'common',
    keywords: [
        __( 'customizer' ),
        __( 'options' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        multiple: false,
        customClassName: false,
    },
    attributes: {
        options: {
            type: 'string',
            source: 'meta',
            meta: 'ghostkit_customizer_options',
        },
    },

    edit: withAPIData( () => {
        return {
            customizerOptions: '/ghostkit/v1/get_customizer/',
        };
    } )( CustomizerBlock ),

    save: function() {
        return null;
    },
};
