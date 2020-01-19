/**
 * Import CSS
 */
import './blocks.scss';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
const { merge } = window.lodash;

const { apiFetch } = wp;

const { __, sprintf } = wp.i18n;

const {
    ToggleControl,
    Tooltip,
} = wp.components;

/**
 * Internal dependencies
 */
import Info from '../components/info.jsx';

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
        let activeCategory = categories[ 0 ].slug;

        categories.forEach( ( cat ) => {
            if ( 'ghostkit' === cat.slug ) {
                activeCategory = 'ghostkit';
            }
        } );

        this.setState( {
            activeCategory: activeCategory,
        } );
    }

    updateDisabledBlocks( newBlocks ) {
        const allBlocks = merge( {}, this.state.disabledBlocks, newBlocks );

        this.setState( {
            disabledBlocks: allBlocks,
        }, () => {
            this.updateDisabledBlocksDebounce();
        } );
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
                    // eslint-disable-next-line
                    console.log( result );
                }
            } );
    }

    getBlocksCategories() {
        const categories = wp.blocks.getCategories();

        // Move Ghost Kit category to the fist place
        categories.sort( function( x, y ) {
            if ( x.slug === 'ghostkit' ) {
                return -1;
            } else if ( y.slug === 'ghostkit' ) {
                return 1;
            }
            return 0;
        } );

        return categories;
    }

    getBlocksFromCategory( category ) {
        const result = {};

        if ( category ) {
            const blocks = wp.blocks.getBlockTypes();
            blocks.forEach( ( block ) => {
                if (
                    // blocks from needed category only
                    block.category === category &&

                    // prevent adding blocks with parent option (fe Grid Column).
                    ! ( block.parent && block.parent.length ) &&

                    // prevent showing blocks with disabled inserter.
                    ! (
                        ( block.supports && typeof block.supports.inserter !== 'undefined' && ! block.supports.inserter )
                    )
                ) {
                    let icon = block.icon.src ? block.icon.src : block.icon;

                    // Prepare icon.
                    if ( typeof icon === 'function' ) {
                        icon = wp.element.renderToString( icon() );
                    } else if ( typeof icon === 'object' ) {
                        icon = wp.element.renderToString( icon );
                    } else if ( typeof icon === 'string' ) {
                        icon = wp.element.createElement( wp.components.Dashicon, { icon: icon } );
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

    getDisabledBlock( data ) {
        let result = false;

        if ( typeof this.state.disabledBlocks[ data.name ] !== 'undefined' ) {
            result = this.state.disabledBlocks[ data.name ];
        }

        return result;
    }

    setDisabledBlock( data ) {
        this.updateDisabledBlocks( {
            [ data.name ]: ! this.getDisabledBlock( data ),
        } );
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

    getDisabledCount( blocks ) {
        let result = 0;

        Object.keys( blocks ).forEach( ( name ) => {
            if ( this.getDisabledBlock( blocks[ name ] ) ) {
                result += 1;
            }
        } );

        return result;
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
            const categoryContent = (
                <li key={ `tab-${ cat.slug }` }>
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
                </li>
            );

            if ( disabledCurrentCount ) {
                resultTabs.push(
                    <Tooltip text={ sprintf( __( 'Disabled Blocks: %s', '@@text_domain' ), disabledCurrentCount ) } key="tab-disabled-blocks">
                        { categoryContent }
                    </Tooltip>
                );
            } else {
                resultTabs.push( categoryContent );
            }
        } );

        if ( ! count ) {
            resultBlocks.push(
                <Info key="no-blocks">{ __( 'No blocks in selected category.', '@@text_domain' ) }</Info>
            );
        }

        return (
            <Fragment>
                <div className="ghostkit-settings-blocks">
                    <div className="ghostkit-settings-blocks-left" />
                    <div className="ghostkit-settings-blocks-right">
                        <div
                            className={
                                classnames(
                                    'ghostkit-settings-blocks-items-head',
                                    ! count ? 'ghostkit-settings-blocks-items-head-hidden' : ''
                                )
                            }
                        >
                            <span className="ghostkit-settings-blocks-items-head-count">
                                { sprintf( __( 'Blocks: %s', '@@text_domain' ), count ) }
                            </span>
                            <Tooltip text={ disabledCount !== count ? __( 'Disable All Blocks', '@@text_domain' ) : __( 'Enable All Blocks', '@@text_domain' ) }>
                                <div
                                    className={
                                        classnames(
                                            'ghostkit-settings-blocks-all-check',
                                            disabledCount !== 0 && disabledCount !== count ? 'ghostkit-settings-blocks-check-gray' : ''
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
                    </div>
                </div>
                <div className="ghostkit-settings-blocks">
                    <div className="ghostkit-settings-blocks-left">
                        <ul className="ghostkit-settings-blocks-categories">
                            { resultTabs }
                        </ul>
                    </div>
                    <div className="ghostkit-settings-blocks-right">
                        <ul className="ghostkit-settings-blocks-items">
                            { resultBlocks }
                        </ul>
                    </div>
                </div>
            </Fragment>
        );
    }
}

Blocks.propTypes = {
    data: PropTypes.object,
};
