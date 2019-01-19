// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import ElementIcon from '../_icons/block-gist.svg';
import GistFilesSelect from './file-select.jsx';

const { GHOSTKIT, jQuery } = window;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
    TextControl,
    ToggleControl,
    Placeholder,
    Toolbar,
} = wp.components;

const {
    InspectorControls,
    BlockControls,
} = wp.editor;

const {
    createBlock,
} = wp.blocks;

class GistBlock extends Component {
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

        if ( typeof jQuery.fn.gist === 'undefined' ) {
            // eslint-disable-next-line
            console.warn( __( 'Gist Embed plugin is not defined.' ) );
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

            $gist.data( 'gist-id', validUrl );
            $gist.data( 'gist-file', file );
            $gist.data( 'gist-caption', caption );
            $gist.data( 'gist-hide-footer', ! showFooter );
            $gist.data( 'gist-hide-line-numbers', ! showLineNumbers );
            $gist.data( 'gist-show-spinner', true );
            $gist.data( 'gist-enable-cache', true );

            $gist.gist();
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
            ghostkitClassname,
            variant,
            url,
            file,
            caption,
            showFooter,
            showLineNumbers,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'gist' );

        className = classnames( 'ghostkit-gist', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-gist-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

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
                    { Object.keys( availableVariants ).length > 1 ? (
                        <PanelBody>
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        </PanelBody>
                    ) : '' }
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
                            icon={ <ElementIcon /> }
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

export const name = 'ghostkit/gist';

export const settings = {
    title: __( 'GitHub Gist' ),
    description: __( 'Embed code parts form GitHub Gist to your site or documentation.' ),
    icon: ElementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'github' ),
        __( 'gist' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/github-gist/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        url: {
            type: 'string',
            default: '',
        },
        file: {
            type: 'string',
            default: '',
        },
        caption: {
            type: 'string',
            default: '',
        },
        showFooter: {
            type: 'boolean',
            default: true,
        },
        showLineNumbers: {
            type: 'boolean',
            default: true,
        },
    },

    transforms: {
        from: [ {
            type: 'raw',
            priority: 1,
            isMatch: ( node ) => {
                const match = node.nodeName === 'P' && /^https:\/\/gist.github.com?.+\/(.+)/g.exec( node.textContent );

                if ( match && typeof match[ 1 ] !== 'undefined' ) {
                    return true;
                }

                return false;
            },
            transform: ( node ) => {
                return createBlock( 'ghostkit/gist', {
                    url: node.textContent.trim(),
                } );
            },
        } ],
    },

    edit: GistBlock,

    save: function( props ) {
        const {
            variant,
            url,
            file,
            caption,
            showFooter,
            showLineNumbers,
        } = props.attributes;

        let className = 'ghostkit-gist';

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-gist-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className } data-url={ url } data-file={ file } data-caption={ caption } data-show-footer={ showFooter ? 'true' : 'false' } data-show-line-numbers={ showLineNumbers ? 'true' : 'false' } />
        );
    },
};
