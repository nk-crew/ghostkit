/**
 * External dependencies
 */
import { debounce } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import CodeEditor from '../../gutenberg/components/code-editor';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;

const { apiFetch } = wp;

const { __ } = wp.i18n;

const { compose } = wp.compose;

const {
    withSelect,
    withDispatch,
} = wp.data;

const {
    Spinner,
} = wp.components;

const { GHOSTKIT } = window;

class CssJs extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            settings: GHOSTKIT.settings || {},
            customCSS: false,
            customJSHead: false,
            customJSFoot: false,
        };

        this.maybePrepareCode = this.maybePrepareCode.bind( this );
        this.updateCustomCode = this.updateCustomCode.bind( this );
        this.updateCustomCodeDebounce = debounce( 1000, this.updateCustomCodeDebounce.bind( this ) );
    }

    componentDidMount() {
        this.maybePrepareCode();
    }

    componentDidUpdate() {
        this.maybePrepareCode();
    }

    maybePrepareCode() {
        const {
            customCode = {},
        } = this.props;

        if (
            customCode
            && false === this.state.customCSS
            && false === this.state.customJSHead
            && false === this.state.customJSFoot
        ) {
            this.setState( {
                customCSS: customCode.ghostkit_custom_css || '',
                customJSHead: customCode.ghostkit_custom_js_head || '',
                customJSFoot: customCode.ghostkit_custom_js_foot || '',
            } );
        }
    }

    updateCustomCode( name, val ) {
        if ( this.state[ name ] === val ) {
            return;
        }

        this.setState( {
            [ name ]: val,
        }, () => {
            this.updateCustomCodeDebounce();
        } );
    }

    updateCustomCodeDebounce() {
        this.props.updateCustomCode( {
            ghostkit_custom_css: this.state.customCSS,
            ghostkit_custom_js_head: this.state.customJSHead,
            ghostkit_custom_js_foot: this.state.customJSFoot,
        } );
    }

    render() {
        const {
            icons,
        } = GHOSTKIT;

        return (
            <div className="ghostkit-settings-content-wrapper ghostkit-settings-css-js">
                { icons && Object.keys( icons ).length ? (
                    <Fragment>
                        <h4 style={ { marginTop: 0 } }>{ __( 'CSS', '@@text_domain' ) }</h4>
                        { false !== this.state.customCSS ? (
                            <CodeEditor
                                mode="css"
                                onChange={ ( value ) => {
                                    this.updateCustomCode( 'customCSS', value );
                                } }
                                value={ this.state.customCSS || '' }
                                maxLines={ 20 }
                                minLines={ 5 }
                                height="300px"
                            />
                        ) : (
                            <Spinner />
                        ) }
                        <h4>{ __( 'JavaScript', '@@text_domain' ) }</h4>
                        { false !== this.state.customJSHead && false !== this.state.customJSFoot ? (
                            <Fragment>
                                <p className="ghostkit-help-text">{ __( 'Add custom JavaScript code in <head> section or in the end of <body> tag. Insert Google Analytics, Tag Manager or other JavaScript code snippets.', '@@text_domain' ) }</p>
                                <p>
                                    <code className="ghostkit-code">{ '<head>' }</code>
                                    { ' ' }
                                    :
                                </p>
                                <CodeEditor
                                    mode="javascript"
                                    onChange={ ( value ) => {
                                        this.updateCustomCode( 'customJSHead', value );
                                    } }
                                    value={ this.state.customJSHead }
                                    maxLines={ 20 }
                                    minLines={ 5 }
                                    height="300px"
                                />
                                <p>
                                    <code className="ghostkit-code">{ '<foot>' }</code>
                                    { ' ' }
                                    :
                                </p>
                                <CodeEditor
                                    mode="javascript"
                                    onChange={ ( value ) => {
                                        this.updateCustomCode( 'customJSFoot', value );
                                    } }
                                    value={ this.state.customJSFoot }
                                    maxLines={ 20 }
                                    minLines={ 5 }
                                    height="300px"
                                />
                            </Fragment>
                        ) : (
                            <Spinner />
                        ) }
                    </Fragment>
                ) : '' }
            </div>
        );
    }
}

export default compose( [
    withSelect( ( select ) => {
        const customCode = select( 'ghostkit/plugins/custom-code' ).getCustomCode();

        return {
            customCode,
        };
    } ),
    withDispatch( ( dispatch ) => ( {
        updateCustomCode( value ) {
            dispatch( 'ghostkit/plugins/custom-code' ).setCustomCode( value );

            apiFetch( {
                path: '/ghostkit/v1/update_custom_code',
                method: 'POST',
                data: {
                    data: value,
                },
            } );
        },
    } ) ),
] )( CssJs );
