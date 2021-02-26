/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { debounce } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import Info from '../components/info';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;

const { merge } = window.lodash;

const { apiFetch } = wp;

const { __, sprintf } = wp.i18n;

const {
    ToggleControl,
    Tooltip,
} = wp.components;

const { GHOSTKIT } = window;

// register core Gutenberg blocks.
if ( wp.blockLibrary && wp.blockLibrary.registerCoreBlocks ) {
    wp.blockLibrary.registerCoreBlocks();
}

export default class Blocks extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            activeCategory: false,
            disabledBlocks: GHOSTKIT.disabledBlocks || {},
        };

        this.updateDisabledBlocks = this.updateDisabledBlocks.bind( this );
        this.updateDisabledBlocksDebounce = debounce( 1000, this.updateDisabledBlocksDebounce.bind( this ) );
        this.getBlocksCategories = this.getBlocksCategories.bind( this );
        this.getBlocksFromCategory = this.getBlocksFromCategory.bind( this );
        this.getDisabledBlock = this.getDisabledBlock.bind( this );
        this.setDisabledBlock = this.setDisabledBlock.bind( this );
        this.setDisabledAllBlocks = this.setDisabledAllBlocks.bind( this );
        this.getDisabledCount = this.getDisabledCount.bind( this );
    }

    componentDidMount() {
        const categories = this.getBlocksCategories();

        this.setState( {
            activeCategory: categories[ 0 ].slug,
        } );
    }

    getDisabledBlock( data ) {
        let result = false;

        if ( 'undefined' !== typeof this.state.disabledBlocks[ data.name ] ) {
            result = this.state.disabledBlocks[ data.name ];
        }

        return result;
    }

    setDisabledAllBlocks( disabled ) {
        const {
            activeCategory,
        } = this.state;

        const disabledBlocks = {};

        const blocks = this.getBlocksFromCategory( activeCategory );
        Object.keys( blocks ).forEach( ( name ) => {
            const block = blocks[ name ];
            disabledBlocks[ block.name ] = ! disabled;
        } );

        this.updateDisabledBlocks( disabledBlocks );
    }

    setDisabledBlock( data ) {
        this.updateDisabledBlocks( {
            [ data.name ]: ! this.getDisabledBlock( data ),
        } );
    }

    getDisabledCount( blocks ) {
        let result = 0;

        Object.keys( blocks ).forEach( ( name ) => {
            if ( this.getDisabledBlock( blocks[ name ] ) ) {
                result += 1;
            }
        } );

        return result;
    }

    // eslint-disable-next-line class-methods-use-this
    getBlocksCategories() {
        const categories = wp.blocks.getCategories();
        const result = [];

        categories.forEach( ( cat ) => {
            const blocks = this.getBlocksFromCategory( cat.slug );

            if ( Object.keys( blocks ).length ) {
                result.push( cat );
            }
        } );

        return result;
    }

    // eslint-disable-next-line class-methods-use-this
    getBlocksFromCategory( category ) {
        const result = {};

        if ( category ) {
            const blocks = wp.blocks.getBlockTypes();
            blocks.forEach( ( block ) => {
                if (
                    // blocks from needed category only
                    block.category === category

                    // prevent adding blocks with parent option (fe Grid Column).
                    && ! ( block.parent && block.parent.length )

                    // prevent showing blocks with disabled inserter.
                    && ! (
                        ( block.supports && 'undefined' !== typeof block.supports.inserter && ! block.supports.inserter )
                    )
                ) {
                    let icon = block.icon.src ? block.icon.src : block.icon;

                    // Prepare icon.
                    if ( 'function' === typeof icon ) {
                        icon = wp.element.renderToString( icon() );
                    } else if ( 'object' === typeof icon ) {
                        icon = wp.element.renderToString( icon );
                    } else if ( 'string' === typeof icon ) {
                        icon = wp.element.createElement( wp.components.Dashicon, { icon } );
                        icon = wp.element.renderToString( icon );
                    }

                    result[ block.name ] = {
                        ...block,
                        ...{ icon },
                    };
                }
            } );
        }

        return result;
    }

    updateDisabledBlocksDebounce() {
        apiFetch( {
            path: '/ghostkit/v1/update_disabled_blocks',
            method: 'POST',
            data: {
                blocks: this.state.disabledBlocks,
            },
        } )
            .then( ( result ) => {
                if ( ! result.success || ! result.response ) {
                    // eslint-disable-next-line no-console
                    console.log( result );
                }
            } );
    }

    updateDisabledBlocks( newBlocks ) {
        this.setState( ( prevState ) => ( {
            disabledBlocks: merge( {}, prevState.disabledBlocks, newBlocks ),
        } ), () => {
            this.updateDisabledBlocksDebounce();
        } );
    }

    render() {
        const {
            activeCategory,
            disabledBlocks,
        } = this.state;

        const blocks = this.getBlocksFromCategory( activeCategory );
        const categories = this.getBlocksCategories();
        const resultTabs = [];
        const resultBlocks = [];

        let count = 0;
        const disabledCount = this.getDisabledCount( blocks );

        // category content.
        Object.keys( blocks ).forEach( ( name ) => {
            const block = blocks[ name ];

            count += 1;

            resultBlocks.push(
                <li
                    className={
                        classnames(
                            'ghostkit-settings-blocks-item',
                            disabledBlocks[ block.name ] ? 'ghostkit-settings-blocks-item-disabled' : ''
                        )
                    }
                    key={ block.name }
                >
                    <h3>
                        <span
                            className="ghostkit-settings-blocks-item-icon"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={ { __html: block.icon } }
                        />
                        { block.title }
                    </h3>
                    { block.description ? (
                        <div className="ghostkit-settings-blocks-item-description">
                            { block.description }
                        </div>
                    ) : '' }
                    { block.ghostkit && block.ghostkit.previewUrl ? (
                        <div className="ghostkit-settings-blocks-item-preview-url">
                            <a href={ block.ghostkit.previewUrl }>{ __( 'Preview', '@@text_domain' ) }</a>
                        </div>
                    ) : '' }
                    <Tooltip text={ this.getDisabledBlock( block ) ? __( 'Enable Block', '@@text_domain' ) : __( 'Disable Block', '@@text_domain' ) }>
                        <div className="ghostkit-settings-blocks-item-check">
                            <ToggleControl
                                checked={ ! this.getDisabledBlock( block ) }
                                onChange={ () => {
                                    this.setDisabledBlock( block );
                                } }
                            />
                        </div>
                    </Tooltip>
                </li>,
            );
        } );

        // categories tabs.
        categories.forEach( ( cat ) => {
            const disabledCurrentCount = this.getDisabledCount( this.getBlocksFromCategory( cat.slug ) );
            let categoryButton = (
                /* eslint-disable-next-line react/button-has-type */
                <button
                    className={
                        classnames(
                            'ghostkit-settings-blocks-categories-button',
                            activeCategory === cat.slug ? 'ghostkit-settings-blocks-categories-button-active' : ''
                        )
                    }
                    onClick={ () => {
                        this.setState( {
                            activeCategory: cat.slug,
                        } );
                    } }
                >
                    { cat.title }
                    { disabledCurrentCount ? (
                        <span className="ghostkit-settings-blocks-categories-button-indicator" />
                    ) : '' }
                </button>
            );

            if ( disabledCurrentCount ) {
                categoryButton = (
                    <Tooltip text={ sprintf( __( 'Disabled Blocks: %s', '@@text_domain' ), disabledCurrentCount ) } key="tab-disabled-blocks">
                        { categoryButton }
                    </Tooltip>
                );
            }

            resultTabs.push( (
                <li key={ `tab-${ cat.slug }` }>
                    { categoryButton }
                </li>
            ) );
        } );

        if ( ! count ) {
            resultBlocks.push(
                <Info key="no-blocks">{ __( 'No blocks in selected category.', '@@text_domain' ) }</Info>
            );
        }

        return (
            <Fragment>
                <div className="ghostkit-settings-content-wrapper ghostkit-settings-blocks">
                    <div className="ghostkit-settings-blocks-left">
                        <ul className="ghostkit-settings-blocks-categories">
                            { resultTabs }
                        </ul>
                    </div>
                    <div className="ghostkit-settings-blocks-right">
                        { count ? (
                            <div className="ghostkit-settings-blocks-items-head">
                                <span className="ghostkit-settings-blocks-items-head-count">
                                    { sprintf( __( 'Blocks: %s', '@@text_domain' ), count ) }
                                </span>
                                <Tooltip text={ disabledCount !== count ? __( 'Disable All Blocks', '@@text_domain' ) : __( 'Enable All Blocks', '@@text_domain' ) }>
                                    <div
                                        className={
                                            classnames(
                                                'ghostkit-settings-blocks-all-check',
                                                0 !== disabledCount && disabledCount !== count ? 'ghostkit-settings-blocks-check-gray' : ''
                                            )
                                        }
                                    >
                                        <ToggleControl
                                            checked={ disabledCount !== count }
                                            onChange={ () => {
                                                this.setDisabledAllBlocks( ! ( disabledCount !== count ) );
                                            } }
                                        />
                                    </div>
                                </Tooltip>
                            </div>
                        ) : null }
                        <ul className="ghostkit-settings-blocks-items">
                            { resultBlocks }
                        </ul>
                    </div>
                </div>
            </Fragment>
        );
    }
}
