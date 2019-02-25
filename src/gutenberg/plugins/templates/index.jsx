// External Dependencies.
import Masonry from 'react-masonry-component';
import classnames from 'classnames/dedupe';

// Import CSS
import './editor.scss';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';
import Modal from '../../components/modal';

const {
    Fragment,
    RawHTML,
} = wp.element;

const { __, sprintf } = wp.i18n;
const { Component } = wp.element;
const { apiFetch } = wp;

const { compose } = wp.compose;

const { PluginMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;

const {
    withSelect,
    withDispatch,
} = wp.data;

const {
    applyFilters,
} = wp.hooks;

const {
    parse,
} = wp.blocks;

const {
    TabPanel,
    Tooltip,
    Spinner,
    SelectControl,
} = wp.components;

class TemplatesModal extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            loading: false,
            activeCategory: {},
            error: false,
        };

        this.getSelectedCategory = this.getSelectedCategory.bind( this );
        this.printCategorySelect = this.printCategorySelect.bind( this );
        this.getTemplates = this.getTemplates.bind( this );
    }

    getSelectedCategory( type ) {
        return this.state.activeCategory[ type ] || false;
    }

    printCategorySelect( type ) {
        const templates = this.getTemplates( type, '' );
        const categories = {};
        const selectData = [];

        templates.forEach( ( template ) => {
            if ( template.categories && template.categories.length ) {
                template.categories.forEach( ( catData ) => {
                    if ( ! categories[ catData.slug ] ) {
                        categories[ catData.slug ] = true;
                        selectData.push( {
                            value: catData.slug,
                            label: catData.name,
                        } );
                    }
                } );
            }
        } );

        if ( selectData.length ) {
            selectData.unshift( {
                value: '',
                label: __( '-- Select Category --' ),
            } );
            return (
                <SelectControl
                    value={ this.getSelectedCategory( type ) }
                    options={ selectData }
                    onChange={ ( value ) => {
                        this.setState( {
                            activeCategory: {
                                ...this.state.activeCategory,
                                ...{
                                    [ type ]: value,
                                },
                            },
                        } );
                    } }
                    style={ {
                        maxWidth: 170,
                        marginBottom: 10,
                    } }
                />
            );
        }

        return '';
    }

    getTemplates( type, categorySelected = null ) {
        const {
            templates = false,
        } = this.props;

        if ( ! templates ) {
            return templates;
        }

        const result = [];

        categorySelected = null === categorySelected ? this.getSelectedCategory( type ) : '';
        let allow = false;

        templates.forEach( ( template ) => {
            // type check.
            if ( template.types ) {
                template.types.forEach( ( typeData ) => {
                    if ( typeData.slug && type === typeData.slug ) {
                        allow = true;
                    }
                } );
            }

            // category check.
            if ( allow && categorySelected && template.categories ) {
                let categoryAllow = false;
                template.categories.forEach( ( catData ) => {
                    if ( catData.slug && categorySelected === catData.slug ) {
                        categoryAllow = true;
                    }
                } );
                allow = categoryAllow;
            }

            if ( allow ) {
                result.push( template );
            }
        } );

        return result;
    }

    render() {
        const {
            insertTemplate,
            getTemplateData,
            onRequestClose,
        } = this.props;

        return (
            <Modal
                className={ classnames( 'ghostkit-plugin-templates-modal', this.state.loading ? 'ghostkit-plugin-templates-modal-loading' : '' ) }
                position="top"
                size="lg"
                title={ __( 'Templates' ) }
                onRequestClose={ () => {
                    onRequestClose();
                } }
                icon={ getIcon( 'plugin-templates', true ) }
            >
                { this.state.loading ? (
                    <div className="ghostkit-plugin-templates-modal-loading-spinner"><Spinner /></div>
                ) : '' }
                <TabPanel
                    className="ghostkit-control-tabs ghostkit-component-modal-tab-panel"
                    tabs={ [
                        {
                            name: 'blocks',
                            title: (
                                <Tooltip text={ __( 'Simple blocks to construct your page.' ) }>
                                    <span>
                                        { __( 'Blocks' ) }
                                    </span>
                                </Tooltip>
                            ),
                            className: 'ghostkit-control-tabs-tab',
                        },
                        {
                            name: 'pages',
                            title: (
                                <Tooltip text={ __( 'Pre-designed ready to use pages.' ) }>
                                    <span>
                                        { __( 'Pages' ) }
                                    </span>
                                </Tooltip>
                            ),
                            className: 'ghostkit-control-tabs-tab',
                        },
                    ] }
                >
                    {
                        ( tabData ) => {
                            const tabType = tabData.name;
                            const currentTemplates = this.getTemplates( tabType );

                            if ( 'pages' === tabType ) {
                                return __( 'Coming Soon...' );
                            }

                            return (
                                <Fragment>
                                    { currentTemplates === false ? (
                                        <div className="ghostkit-plugin-templates-spinner"><Spinner /></div>
                                    ) : '' }
                                    { currentTemplates && ! currentTemplates.length ? (
                                        <div>{ __( 'No templates found.' ) }</div>
                                    ) : '' }
                                    { currentTemplates && currentTemplates.length ? (
                                        <Fragment>
                                            { this.printCategorySelect( tabType ) }
                                            { this.state.error }
                                            <Masonry
                                                className="ghostkit-plugin-templates-list"
                                                elementType="ul"
                                                disableImagesLoaded={ false }
                                                updateOnEachImageLoad={ true }
                                            >
                                                { currentTemplates.map( ( template ) => {
                                                    const withThumb = !! template.thumbnail;

                                                    return (
                                                        <li
                                                            className={ classnames( 'ghostkit-plugin-templates-list-item', withThumb ? '' : 'ghostkit-plugin-templates-list-item-no-thumb' ) }
                                                            key={ template.id }
                                                        >
                                                            <button
                                                                onClick={ () => {
                                                                    this.setState( {
                                                                        loading: true,
                                                                    } );
                                                                    getTemplateData( template.id, ( data ) => {
                                                                        if ( data && data.success && data.response && data.response.content ) {
                                                                            insertTemplate( data.response.content, this.props.replaceBlockId, ( error ) => {
                                                                                if ( error ) {
                                                                                    this.setState( { error } );
                                                                                } else {
                                                                                    onRequestClose();
                                                                                }
                                                                            } );
                                                                        }
                                                                        this.setState( {
                                                                            loading: false,
                                                                        } );
                                                                    } );
                                                                } }
                                                            >
                                                                { withThumb ? (
                                                                    <img
                                                                        src={ template.thumbnail }
                                                                        alt={ template.title }
                                                                    />
                                                                ) : (
                                                                    template.title
                                                                ) }
                                                            </button>
                                                        </li>
                                                    );
                                                } ) }
                                            </Masonry>
                                        </Fragment>
                                    ) : '' }
                                </Fragment>
                            );
                        }
                    }
                </TabPanel>
            </Modal>
        );
    }
}

function checkMissingBlocksRecursive( blocks, result = {} ) {
    blocks.forEach( ( item ) => {
        if ( 'core/missing' === item.name ) {
            result[ item.attributes.originalName ] = true;
        }
        if ( item.innerBlocks ) {
            result = checkMissingBlocksRecursive( item.innerBlocks, result );
        }
    } );

    return result;
}

function checkMissingBlocks( data ) {
    const result = [];
    const missingBlocks = checkMissingBlocksRecursive( data );
    const missingBlocksInfo = applyFilters( 'ghostkit.templates.missingBlocksInfo', {
        'nk/awb': {
            info: __( '<strong>Advanced Backgrounds</strong> plugin is required to use background image and video blocks.' ),
            pluginUrl: 'https://wordpress.org/plugins/advanced-backgrounds/',
        },
        'wp:nk/visual-portfolio': {
            info: __( '<strong>Visual Portfolio</strong> plugin is required to show portfolio layouts.' ),
            pluginUrl: 'https://wordpress.org/plugins/visual-portfolio/',
        },
    } );

    if ( Object.keys( missingBlocks ).length ) {
        Object.keys( missingBlocks ).forEach( ( blockName ) => {
            result.push(
                <div
                    className="ghostkit-alert ghostkit-templates-missing-block-alert"
                    key={ `missing-block-${ blockName }` }
                >
                    <RawHTML>{ sprintf( __( '%s block is missing.' ), `<strong>${ blockName }</strong>` ) }</RawHTML>
                    { missingBlocksInfo[ blockName ] && missingBlocksInfo[ blockName ].info ? (
                        <div className="ghostkit-templates-missing-block-additional">
                            <RawHTML>{ missingBlocksInfo[ blockName ].info }</RawHTML>
                            { missingBlocksInfo[ blockName ].pluginUrl ? (
                                <a
                                    className="components-button is-button is-default is-small"
                                    href={ missingBlocksInfo[ blockName ].pluginUrl }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    { __( 'Install Plugin' ) }
                                </a>
                            ) : '' }
                        </div>
                    ) : '' }
                </div>
            );
        } );
    } else {
        return false;
    }

    return result;
}

const TemplatesModalWithSelect = compose( [
    withDispatch( ( dispatch ) => {
        const {
            insertBlocks,
            replaceBlocks,
        } = dispatch( 'core/editor' );

        return {
            insertTemplate( content, replaceBlockId, cb ) {
                const parsedBlocks = parse( content );

                if ( parsedBlocks.length ) {
                    const missingBlocksData = checkMissingBlocks( parsedBlocks );

                    if ( missingBlocksData ) {
                        cb( missingBlocksData );
                    } else {
                        if ( replaceBlockId ) {
                            replaceBlocks( replaceBlockId, parsedBlocks );
                        } else {
                            insertBlocks( parsedBlocks );
                        }
                        cb( false );
                    }
                }
            },
        };
    } ),
    withSelect( ( select ) => {
        const templates = select( 'ghostkit/plugins/templates' ).getTemplates();

        return {
            templates,
            getTemplateData( id, cb ) {
                apiFetch( {
                    path: `/ghostkit/v1/get_template_data/?id=${ id }`,
                    method: 'GET',
                } ).then( ( data ) => {
                    cb( data );
                } );
            },
        };
    } ),
] )( TemplatesModal );

export { TemplatesModalWithSelect as TemplatesModal };

export class TemplatesPlugin extends Component {
    constructor() {
        super( ...arguments );

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
                    { __( 'Templates' ) }
                </PluginMoreMenuItem>
                { isModalOpen ? (
                    <TemplatesModalWithSelect
                        onRequestClose={ () => this.setState( { isModalOpen: false } ) }
                    />
                ) : '' }
            </Fragment>
        );
    }
}

registerPlugin( 'ghostkit-templates', {
    icon: null,
    render: TemplatesPlugin,
} );
