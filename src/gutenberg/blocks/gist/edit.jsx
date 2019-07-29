/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    PanelBody,
    TextControl,
    ToggleControl,
    Placeholder,
    Toolbar,
} = wp.components;

const {
    InspectorControls,
    BlockControls,
} = wp.editor;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import GistFilesSelect from './file-select';

const { jQuery } = window;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor() {
        super( ...arguments );
        this.state = {
            url: '',
        };

        this.onUpdate = this.onUpdate.bind( this );
        this.urlOnChange = this.urlOnChange.bind( this );
        this.getValidGistUrl = this.getValidGistUrl.bind( this );
    }

    componentDidMount() {
        this.setState( { url: this.props.attributes.url } );
        this.onUpdate();
    }
    componentDidUpdate() {
        this.onUpdate();
    }

    getValidGistUrl() {
        const {
            url,
        } = this.props.attributes;

        if ( url ) {
            const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec( url );

            if ( match && typeof match[ 1 ] !== 'undefined' ) {
                return match[ 1 ].split( '#' )[ 0 ];
            }
        }

        return false;
    }

    onUpdate() {
        const {
            url,
            file,
            caption,
            showFooter,
            showLineNumbers,
        } = this.props.attributes;

        if ( ! url || ! this.gistNode ) {
            return;
        }

        const validUrl = this.getValidGistUrl();

        if ( ! validUrl ) {
            return;
        }

        if ( typeof jQuery.fn.gistsimple === 'undefined' ) {
            // eslint-disable-next-line
            console.warn( __( 'Gist Simple plugin is not defined.' ) );
            return;
        }

        // cache request to prevent reloading.
        const cachedRequest = validUrl + file + caption + ( showFooter ? 1 : 0 ) + ( showLineNumbers ? 1 : 0 );
        if ( cachedRequest === this.cachedRequest ) {
            return;
        }
        this.cachedRequest = cachedRequest;

        setTimeout( () => {
            const $gist = jQuery( this.gistNode );

            if ( $gist[ 0 ].GistSimple ) {
                $gist.gistsimple( 'destroy' );
            }

            $gist.gistsimple( {
                id: validUrl,
                file: file,
                caption: caption,
                showFooter: showFooter,
                showLineNumbers: showLineNumbers,
            } );
        }, 0 );
    }

    urlOnChange( value, timeout = 1000 ) {
        this.setState( { url: value } );

        clearTimeout( this.urlTimeout );

        this.urlTimeout = setTimeout( () => {
            this.props.setAttributes( { url: value } );
        }, timeout );
    }

    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            url,
            file,
            caption,
            showFooter,
            showLineNumbers,
        } = attributes;

        className = classnames( 'ghostkit-gist', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <BlockControls>
                    { url ? (
                        <Toolbar>
                            <TextControl
                                type="url"
                                value={ this.state.url }
                                placeholder={ __( 'Gist URL' ) }
                                onChange={ this.urlOnChange }
                                onKeyDown={ ( e ) => {
                                    if ( e.keyCode === 13 ) {
                                        this.urlOnChange( this.state.url, 0 );
                                    }
                                } }
                                className="ghostkit-gist-toolbar-url"
                            />
                        </Toolbar>
                    ) : '' }
                    { this.getValidGistUrl() ? (
                        <Toolbar>
                            <GistFilesSelect
                                label={ __( 'File' ) }
                                url={ url }
                                value={ file }
                                isToolbar={ true }
                                onChange={ ( value ) => setAttributes( { file: value } ) }
                            />
                        </Toolbar>
                    ) : '' }
                </BlockControls>
                <InspectorControls>
                    <PanelBody>
                        <TextControl
                            label={ __( 'URL' ) }
                            type="url"
                            value={ this.state.url }
                            onChange={ this.urlOnChange }
                            onKeyDown={ ( e ) => {
                                if ( e.keyCode === 13 ) {
                                    this.urlOnChange( this.state.url, 0 );
                                }
                            } }
                        />
                        <GistFilesSelect
                            label={ __( 'File' ) }
                            url={ url }
                            value={ file }
                            onChange={ ( value ) => setAttributes( { file: value } ) }
                        />
                    </PanelBody>
                    <PanelBody>
                        <TextControl
                            label={ __( 'Caption' ) }
                            value={ caption }
                            onChange={ ( value ) => setAttributes( { caption: value } ) }
                        />
                        <ToggleControl
                            label={ __( 'Show footer' ) }
                            checked={ !! showFooter }
                            onChange={ ( val ) => setAttributes( { showFooter: val } ) }
                        />
                        <ToggleControl
                            label={ __( 'Show line numbers' ) }
                            checked={ !! showLineNumbers }
                            onChange={ ( val ) => setAttributes( { showLineNumbers: val } ) }
                        />
                    </PanelBody>
                </InspectorControls>

                <div>
                    { ! url ? (
                        <Placeholder
                            icon={ getIcon( 'block-gist' ) }
                            label={ __( 'Gist URL' ) }
                            className={ className }
                        >
                            <TextControl
                                placeholder={ __( 'https://gist.github.com/...' ) }
                                value={ this.state.url }
                                onChange={ this.urlOnChange }
                                onKeyDown={ ( e ) => {
                                    if ( e.keyCode === 13 ) {
                                        this.urlOnChange( this.state.url, 0 );
                                    }
                                } }
                            />
                            <a href="https://gist.github.com/" target="_blank" rel="noopener noreferrer">{ __( 'Visit GitHub Gist site' ) }</a>
                        </Placeholder>
                    ) : '' }
                    { url ? (
                        <div
                            ref={ gistNode => this.gistNode = gistNode }
                            className={ className }
                            data-url={ url }
                            data-file={ file }
                            data-caption={ caption }
                            data-show-footer={ showFooter ? 'true' : 'false' }
                            data-show-line-numbers={ showLineNumbers ? 'true' : 'false' }
                        />
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
