/**
 * External dependencies
 */
import Masonry from 'react-masonry-component';
import classnames from 'classnames/dedupe';
import LazyLoad from 'react-lazyload';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import Modal from '../../components/modal';

/**
 * WordPress dependencies
 */
const {
    Fragment,
    RawHTML,
} = wp.element;

const { __, sprintf } = wp.i18n;
const { Component } = wp.element;
const { apiFetch } = wp;

const { compose } = wp.compose;

const { PluginMoreMenuItem } = wp.editPost;

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
    ExternalLink,
} = wp.components;

const {
    GHOSTKIT,
} = window;

class TemplatesModal extends Component {
    constructor( props ) {
        super( props );

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

    getTemplates( type, categorySelected = null ) {
        const {
            templates = false,
        } = this.props;

        if ( ! templates ) {
            return templates;
        }

        const result = [];

        categorySelected = null === categorySelected ? this.getSelectedCategory( type ) : '';

        templates.forEach( ( template ) => {
            let allow = ! type;

            // type check.
            if ( ! allow && template.types ) {
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
                label: __( '-- Select Category --', '@@text_domain' ),
            } );
            return (
                <SelectControl
                    value={ this.getSelectedCategory( type ) }
                    options={ selectData }
                    onChange={ ( value ) => {
                        this.setState( ( prevState ) => ( {
                            activeCategory: {
                                ...prevState.activeCategory,
                                ...{
                                    [ type ]: value,
                                },
                            },
                        } ) );
                    } }
                />
            );
        }

        return '';
    }

    render() {
        const {
            insertTemplate,
            getTemplateData,
            onRequestClose,
        } = this.props;

        const allTemplates = this.getTemplates();
        const themeTemplates = this.getTemplates( 'theme' );

        const showLoadingSpinner = this.state.loading || ! allTemplates || ! allTemplates.length;

        return (
            <Modal
                className={ classnames( 'ghostkit-plugin-templates-modal ghostkit-plugin-templates-modal-hide-header', showLoadingSpinner ? 'ghostkit-plugin-templates-modal-loading' : '' ) }
                position="top"
                size="lg"
                onRequestClose={ () => {
                    onRequestClose();
                } }
                shouldCloseOnClickOutside={ false }
                icon={ getIcon( 'plugin-templates' ) }
            >
                <div className="components-modal__header">
                    <div className="components-modal__header-heading-container">
                        <span className="components-modal__icon-container" aria-hidden="true">
                            { getIcon( 'plugin-templates' ) }
                        </span>
                        <h1 id="components-modal-header-1" className="components-modal__header-heading">{ __( 'Templates', '@@text_domain' ) }</h1>
                    </div>
                    { showLoadingSpinner ? (
                        <div className="ghostkit-plugin-templates-modal-loading-spinner"><Spinner /></div>
                    ) : '' }
                    <button
                        type="button"
                        aria-label="Close dialog"
                        className="components-button components-icon-button"
                        onClick={ () => {
                            onRequestClose();
                        } }
                    >
                        <svg aria-hidden="true" role="img" focusable="false" className="dashicon dashicons-no-alt" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M14.95 6.46L11.41 10l3.54 3.54-1.41 1.41L10 11.42l-3.53 3.53-1.42-1.42L8.58 10 5.05 6.47l1.42-1.42L10 8.58l3.54-3.53z" /></svg>
                    </button>
                </div>

                { allTemplates && allTemplates.length ? (
                    <TabPanel
                        className="ghostkit-control-tabs ghostkit-component-modal-tab-panel"
                        tabs={ [
                            ...( themeTemplates && themeTemplates.length ? [
                                {
                                    name: 'theme',
                                    title: (
                                        <Tooltip text={ __( 'Templates from the theme.', '@@text_domain' ) }>
                                            <span>
                                                { GHOSTKIT.themeName || __( 'Theme', '@@text_domain' ) }
                                            </span>
                                        </Tooltip>
                                    ),
                                    className: 'ghostkit-control-tabs-tab',
                                },
                            ] : [] ),
                            {
                                name: 'blocks',
                                title: (
                                    <Tooltip text={ __( 'Simple blocks to construct your page.', '@@text_domain' ) }>
                                        <span>
                                            { __( 'Blocks', '@@text_domain' ) }
                                        </span>
                                    </Tooltip>
                                ),
                                className: 'ghostkit-control-tabs-tab',
                            },
                            {
                                name: 'pages',
                                title: (
                                    <Tooltip text={ __( 'Pre-designed ready to use pages.', '@@text_domain' ) }>
                                        <span>
                                            { __( 'Pages', '@@text_domain' ) }
                                        </span>
                                    </Tooltip>
                                ),
                                className: 'ghostkit-control-tabs-tab',
                            },
                            {
                                name: 'local',
                                title: (
                                    <Tooltip text={ __( 'My Templates.', '@@text_domain' ) }>
                                        <span>
                                            { __( 'My Templates', '@@text_domain' ) }
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
                                const selectedCategory = this.getSelectedCategory( tabType );

                                if ( 'pages' === tabType ) {
                                    return __( 'Coming Soon...', '@@text_domain' );
                                }

                                return (
                                    <Fragment>
                                        { false === currentTemplates ? (
                                            <div className="ghostkit-plugin-templates-spinner"><Spinner /></div>
                                        ) : '' }
                                        { currentTemplates && ! currentTemplates.length ? (
                                            <div>
                                                { 'local' === tabType ? (
                                                    <Fragment>
                                                        <p style={ {
                                                            marginTop: 0,
                                                        } }
                                                        >
                                                            { __( 'No templates found.', '@@text_domain' ) }
                                                        </p>
                                                        <ExternalLink className="components-button is-button is-primary" href={ GHOSTKIT.adminTemplatesUrl }>{ __( 'Add Template', '@@text_domain' ) }</ExternalLink>
                                                    </Fragment>
                                                ) : (
                                                    __( 'No templates found.', '@@text_domain' )
                                                ) }
                                            </div>
                                        ) : '' }
                                        { currentTemplates && currentTemplates.length ? (
                                            <Fragment key={ `${ tabType }-${ selectedCategory }` }>
                                                <div className="ghostkit-plugin-templates-categories-row">
                                                    <div className="ghostkit-plugin-templates-categories-select">
                                                        { this.printCategorySelect( tabType ) }
                                                    </div>
                                                    <div className="ghostkit-plugin-templates-count">
                                                        <RawHTML>{ sprintf( __( 'Templates: %s', '@@text_domain' ), `<strong>${ currentTemplates.length }</strong>` ) }</RawHTML>
                                                    </div>
                                                </div>
                                                { this.state.error }
                                                <Masonry
                                                    className="ghostkit-plugin-templates-list"
                                                    elementType="ul"
                                                    disableImagesLoaded={ false }
                                                    updateOnEachImageLoad
                                                    options={ {
                                                        transitionDuration: 0,
                                                    } }
                                                >
                                                    { currentTemplates.map( ( template ) => {
                                                        const withThumb = !! template.thumbnail;
                                                        let thumbAspectRatio = false;

                                                        if ( template.thumbnail_height && template.thumbnail_width ) {
                                                            thumbAspectRatio = template.thumbnail_height / template.thumbnail_width;
                                                        }

                                                        return (
                                                            <li
                                                                className={ classnames( 'ghostkit-plugin-templates-list-item', withThumb ? '' : 'ghostkit-plugin-templates-list-item-no-thumb' ) }
                                                                key={ template.id }
                                                            >
                                                                { /* eslint-disable-next-line react/button-has-type */ }
                                                                <button
                                                                    onClick={ () => {
                                                                        this.setState( {
                                                                            loading: true,
                                                                        } );
                                                                        getTemplateData( {
                                                                            id: template.id,
                                                                            type: tabType,
                                                                        }, ( data ) => {
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
                                                                        <div className="ghostkit-plugin-templates-list-item-image">
                                                                            { thumbAspectRatio ? (
                                                                                <div
                                                                                    className="ghostkit-plugin-templates-list-item-image-sizer"
                                                                                    style={ { paddingTop: `${ 100 * thumbAspectRatio }%` } }
                                                                                />
                                                                            ) : '' }
                                                                            <LazyLoad overflow offset={ 100 }>
                                                                                <img
                                                                                    src={ template.thumbnail }
                                                                                    alt={ template.title }
                                                                                />
                                                                            </LazyLoad>
                                                                        </div>
                                                                    ) : '' }
                                                                    <div className="ghostkit-plugin-templates-list-item-title">{ template.title }</div>
                                                                </button>
                                                            </li>
                                                        );
                                                    } ) }
                                                </Masonry>
                                                { 'local' === tabType ? (
                                                    <Fragment>
                                                        <ExternalLink className="components-button is-button is-primary" href={ GHOSTKIT.adminTemplatesUrl }>{ __( 'Add Template', '@@text_domain' ) }</ExternalLink>
                                                    </Fragment>
                                                ) : '' }
                                            </Fragment>
                                        ) : '' }
                                    </Fragment>
                                );
                            }
                        }
                    </TabPanel>
                ) : '' }
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
            info: __( '<strong>Advanced Backgrounds</strong> plugin is required to use background image and video blocks.', '@@text_domain' ),
            pluginUrl: 'https://wordpress.org/plugins/advanced-backgrounds/',
        },
        'nk/visual-portfolio': {
            info: __( '<strong>Visual Portfolio</strong> plugin is required to show portfolio layouts.', '@@text_domain' ),
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
                    <RawHTML>{ sprintf( __( '%s block is missing.', '@@text_domain' ), `<strong>${ blockName }</strong>` ) }</RawHTML>
                    { missingBlocksInfo[ blockName ] && missingBlocksInfo[ blockName ].info ? (
                        <div className="ghostkit-templates-missing-block-additional">
                            <RawHTML>{ missingBlocksInfo[ blockName ].info }</RawHTML>
                            { missingBlocksInfo[ blockName ].pluginUrl ? (
                                <ExternalLink
                                    className="components-button is-button is-default is-small"
                                    href={ missingBlocksInfo[ blockName ].pluginUrl }
                                >
                                    { __( 'Install Plugin', '@@text_domain' ) }
                                </ExternalLink>
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
        } = dispatch( 'core/block-editor' );

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
            getTemplateData( data, cb ) {
                let { type } = data;
                if ( 'local' !== type && 'theme' !== type ) {
                    type = 'remote';
                }

                apiFetch( {
                    path: `/ghostkit/v1/get_template_data/?id=${ data.id }&type=${ type }`,
                    method: 'GET',
                } ).then( ( result ) => {
                    cb( result );
                } );
            },
        };
    } ),
] )( TemplatesModal );

export { TemplatesModalWithSelect as TemplatesModal };

export const name = 'ghostkit-templates';

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
                    { __( 'Templates', '@@text_domain' ) }
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
