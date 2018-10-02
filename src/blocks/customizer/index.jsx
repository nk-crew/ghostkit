// Import CSS
import './editor.scss';

// external Dependencies.
if ( ! global._babelPolyfill ) {
    require( '@babel/polyfill' );
}
import Select from 'react-select';

// Internal Dependencies.
import ElementIcon from '../_icons/customizer.svg';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    BaseControl,
    TextControl,
    TextareaControl,
    ToggleControl,
    SelectControl,
    RangeControl,
    Placeholder,
    Spinner,
} = wp.components;

const { apiFetch } = wp;
const {
    registerStore,
    withSelect,
} = wp.data;

const {
    ColorPalette,
} = wp.editor;

const actions = {
    setCustomizerData( query, data ) {
        return {
            type: 'SET_CUSTOMIZER_DATA',
            query,
            data,
        };
    },
    getCustomizerData( query ) {
        return {
            type: 'GET_CUSTOMIZER_DATA',
            query,
        };
    },
};
registerStore( 'ghostkit/customizer', {
    reducer( state = { data: false }, action ) {
        switch ( action.type ) {
        case 'SET_CUSTOMIZER_DATA':
            if ( ! state.data && action.data ) {
                state.data = action.data;
            }
            return state;
        case 'GET_CUSTOMIZER_DATA':
            return action.data;
        // no default
        }
        return state;
    },
    actions,
    selectors: {
        getCustomizerData( state ) {
            return state.data;
        },
    },
    resolvers: {
        * getCustomizerData( state, query ) {
            const data = apiFetch( { path: query } )
                .then( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.success && fetchedData.response ) {
                        return actions.setCustomizerData( query, fetchedData.response );
                    }
                    return false;
                } );
            yield data;
        },
    },
} );

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

        if ( customizerOptions ) {
            Object.keys( customizerOptions ).map( ( k ) => {
                const opt = customizerOptions[ k ];
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
                        options[ n ].control_type = opt.control_type;
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

        if ( customizerOptions ) {
            result = [];
            const groupedList = {};

            Object.keys( customizerOptions ).map( ( k ) => {
                const val = customizerOptions[ k ];
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
            isPlugin,
        } = this.props;

        const options = this.getSelectedOptions();
        const customizerOptionsSelect = this.getSelectValues();

        return (
            <Placeholder
                icon={ <ElementIcon /> }
                label={ __( 'Customizer Options' ) }
                className={ className + ( isPlugin ? ' ghostkit-customizer-plugin' : '' ) }
            >
                { ! customizerOptionsSelect ? (
                    <div className="ghostkit-customizer-spinner"><Spinner /></div>
                ) : '' }
                { ! isPlugin ? (
                    <p style={ { color: '#c72323' } }>{ __( 'This block is deprecated, please, use customizer options in the page settings (top right corner after "Update" button).' ) }</p>
                ) : '' }
                { isPlugin ? (
                    <p>{ __( 'Replace customizer options for the current post.' ) }</p>
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
                            let control = '';

                            // Kirki support.
                            switch ( opt.control_type ) {
                            case 'kirki-color':
                                control = (
                                    <BaseControl
                                        label={ opt.label || opt.id }
                                        className="ghostkit-customizer-list-field"
                                    >
                                        <ColorPalette
                                            value={ opt.value }
                                            onChange={ ( value ) => {
                                                this.updateOptions( value, opt );
                                            } }
                                        />
                                    </BaseControl>
                                );
                                break;
                            case 'kirki-slider':
                                const sliderAttrs = {
                                    min: '',
                                    max: '',
                                    step: '',
                                };
                                if ( opt.choices && opt.choices ) {
                                    if ( opt.choices.min ) {
                                        sliderAttrs.min = opt.choices.min;
                                    }
                                    if ( opt.choices.max ) {
                                        sliderAttrs.max = opt.choices.max;
                                    }
                                    if ( opt.choices.step ) {
                                        sliderAttrs.step = opt.choices.step;
                                    }
                                }
                                control = (
                                    <RangeControl
                                        label={ opt.label || opt.id }
                                        value={ opt.value }
                                        onChange={ ( value ) => {
                                            this.updateOptions( value, opt );
                                        } }
                                        className="ghostkit-customizer-list-field"
                                        { ...sliderAttrs }
                                    />
                                );
                                break;
                            case 'kirki-toggle':
                                control = (
                                    <ToggleControl
                                        label={ opt.label || opt.id }
                                        checked={ opt.value === 'on' }
                                        onChange={ ( value ) => {
                                            this.updateOptions( value ? 'on' : 'off', opt );
                                        } }
                                        className="ghostkit-customizer-list-field"
                                    />
                                );
                                break;
                            case 'kirki-editor':
                                control = (
                                    <TextareaControl
                                        label={ opt.label || opt.id }
                                        value={ opt.value }
                                        onChange={ ( value ) => {
                                            this.updateOptions( value, opt );
                                        } }
                                        className="ghostkit-customizer-list-field"
                                    />
                                );
                                break;
                            case 'kirki-image':
                                opt.choices = [];
                            // fallthrough
                            default:
                                if ( opt.choices && opt.choices.length ) {
                                    control = (
                                        <SelectControl
                                            label={ opt.label || opt.id }
                                            value={ opt.value }
                                            options={ opt.choices }
                                            onChange={ ( value ) => {
                                                this.updateOptions( value, opt );
                                            } }
                                            className="ghostkit-customizer-list-field"
                                        />
                                    );
                                } else {
                                    control = (
                                        <TextControl
                                            label={ opt.label || opt.id }
                                            value={ opt.value }
                                            onChange={ ( value ) => {
                                                this.updateOptions( value, opt );
                                            } }
                                            className="ghostkit-customizer-list-field"
                                        />
                                    );
                                }
                                break;
                            }

                            return (
                                <div key={ opt.id }>
                                    { control }
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
    icon: ElementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'customizer' ),
        __( 'options' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        customClassName: false,
        inserter: false,
    },
    attributes: {
        options: {
            type: 'string',
            source: 'meta',
            meta: 'ghostkit_customizer_options',
        },
    },

    edit: withSelect( ( select ) => {
        return {
            customizerOptions: select( 'ghostkit/customizer' ).getCustomizerData( '/ghostkit/v1/get_customizer/' ),
        };
    } )( CustomizerBlock ),

    save: function() {
        return null;
    },
};
