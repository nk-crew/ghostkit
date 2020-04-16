/**
 * External dependencies
 */
import Select from '../../components/select';
import getIcon from '../../utils/get-icon';
import Modal from '../../components/modal';

/**
 * WordPress dependencies
 */
const {
    Fragment,
} = wp.element;

const { __ } = wp.i18n;
const { Component } = wp.element;

const { compose } = wp.compose;

const { PluginMoreMenuItem } = wp.editPost;

const {
    withSelect,
    withDispatch,
} = wp.data;

const {
    BaseControl,
    TextControl,
    TextareaControl,
    ToggleControl,
    SelectControl,
    RangeControl,
    Spinner,
} = wp.components;

const {
    ColorPalette,
} = wp.blockEditor;

class Customizer extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            jsonOptions: false,
        };

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
    // eslint-disable-next-line class-methods-use-this
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

        label = label || __( 'Uncategorized', '@@text_domain' );
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
            meta,
            customizerOptions,
        } = this.props;

        let options = meta.ghostkit_customizer_options;

        if ( ! this.state.jsonOptions ) {
            try {
                options = JSON.parse( decodeURI( options ) );
            } catch ( e ) {
                options = [];
            }
        } else {
            options = this.state.jsonOptions;
        }

        if ( customizerOptions ) {
            Object.keys( customizerOptions ).forEach( ( k ) => {
                const opt = customizerOptions[ k ];
                options.forEach( ( val, n ) => {
                    if ( options[ n ] && options[ n ].id === opt.id ) {
                        const choices = [];

                        if ( opt.choices && Object.keys( opt.choices ).length ) {
                            choices.push( {
                                value: '',
                                label: '',
                            } );
                            Object.keys( opt.choices ).forEach( ( name ) => {
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

            Object.keys( customizerOptions ).forEach( ( k ) => {
                const val = customizerOptions[ k ];
                let prevent = false;

                // disable some options
                if (
                    'active_theme' === val.id
                    || ( val.panel && val.panel.id && 'widgets' === val.panel.id )
                    || ( val.panel && val.panel.id && 'nav_menus' === val.panel.id )
                    || ( ! val.panel && 'option' === val.type && /^widget_/.test( val.id ) )
                    || ( ! val.panel && 'option' === val.type && /^sidebars_widgets\[/.test( val.id ) )
                    || ( ! val.panel && 'option' === val.type && /^nav_menus_/.test( val.id ) )
                ) {
                    prevent = true;
                }

                if ( ! prevent ) {
                    const category = this.getOptionCategory( val );

                    if ( 'undefined' === typeof groupedList[ category.slug ] ) {
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

            Object.keys( groupedList ).forEach( ( k ) => {
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
        let options = this.getSelectedOptions();

        // remove option.
        if ( null === value ) {
            options = options.filter( ( item ) => item.id !== opt.id );

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

        this.setState( {
            jsonOptions: options,
        } );
    }

    render() {
        const {
            onRequestClose,
            updateMeta,
        } = this.props;

        const options = this.getSelectedOptions();
        const customizerOptionsSelect = this.getSelectValues();

        return (
            <Modal
                className="ghostkit-plugin-customizer-modal"
                position="top"
                size="md"
                title={ __( 'Customizer', '@@text_domain' ) }
                onRequestClose={ () => {
                    updateMeta( { ghostkit_customizer_options: encodeURI( JSON.stringify( options ) ) } );
                    onRequestClose();
                } }
                icon={ getIcon( 'plugin-customizer' ) }
            >
                { ! customizerOptionsSelect ? (
                    <div className="ghostkit-customizer-spinner"><Spinner /></div>
                ) : '' }
                { Array.isArray( customizerOptionsSelect ) && customizerOptionsSelect.length ? (
                    <Fragment>
                        <p className="ghostkit-help-text">{ __( 'Override Customizer options for the current post.', '@@text_domain' ) }</p>
                        <Select
                            value=""
                            onChange={ ( opt ) => {
                                this.updateOptions( '', {
                                    id: opt.value,
                                } );
                            } }
                            options={ customizerOptionsSelect }
                            placeholder={ __( '--- Select Option ---', '@@text_domain' ) }
                            menuPosition="fixed"
                            grouped
                        />
                    </Fragment>
                ) : '' }
                { Array.isArray( customizerOptionsSelect ) && ! customizerOptionsSelect.length ? (
                    <div className="ghostkit-customizer-info">
                        { __( 'No customizer options found. You can manually open ', '@@text_domain' ) }
                        <strong>{ __( 'Appearance > Customize', '@@text_domain' ) }</strong>
                        { __( ', and the list will be available here.', '@@text_domain' ) }
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
                            case 'kirki-slider': {
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
                            }
                            case 'kirki-toggle':
                                control = (
                                    <ToggleControl
                                        label={ opt.label || opt.id }
                                        checked={ 'on' === opt.value }
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
                                        { opt.default || 'boolean' === typeof opt.default ? (
                                            <small className="ghostkit-customizer-list-info-default">
                                                { __( 'Default:', '@@text_domain' ) }
                                                { ' ' }
                                                <span>{ ( 'boolean' === typeof opt.default ? opt.default.toString() : opt.default ) }</span>
                                            </small>
                                        ) : '' }
                                    </div>
                                    { /* eslint-disable-next-line react/button-has-type */ }
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
            </Modal>
        );
    }
}

const CustomizerModalWithSelect = compose( [
    withSelect( ( select ) => {
        const currentMeta = select( 'core/editor' ).getCurrentPostAttribute( 'meta' );
        const editedMeta = select( 'core/editor' ).getEditedPostAttribute( 'meta' );

        return {
            meta: { ...currentMeta, ...editedMeta },
            customizerOptions: select( 'ghostkit/plugins/customizer' ).getCustomizerData(),
        };
    } ),
    withDispatch( ( dispatch ) => ( {
        updateMeta( value ) {
            dispatch( 'core/editor' ).editPost( { meta: value } );
        },
    } ) ),
] )( Customizer );

export { CustomizerModalWithSelect as CustomizerModal };

export const name = 'ghostkit-customizer';

export const icon = null;

export class Plugin extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            isModalOpen: false,
        };
    }

    render() {
        const {
            isModalOpen,
        } = this.state;

        return (
            <Fragment>
                <PluginMoreMenuItem
                    icon={ null }
                    onClick={ () => {
                        this.setState( { isModalOpen: true } );
                    } }
                >
                    { __( 'Customizer', '@@text_domain' ) }
                </PluginMoreMenuItem>
                { isModalOpen ? (
                    <CustomizerModalWithSelect
                        onRequestClose={ () => this.setState( { isModalOpen: false } ) }
                    />
                ) : '' }
            </Fragment>
        );
    }
}
