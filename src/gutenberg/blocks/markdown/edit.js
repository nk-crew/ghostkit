/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import MDRender from './render';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Component, createRef } = wp.element;

const { Toolbar, ToolbarItem, ToolbarButton } = wp.components;

const { BlockControls, PlainText } = wp.blockEditor;

const { compose } = wp.compose;

const { withSelect, withDispatch } = wp.data;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor( props ) {
        super( props );

        this.ref = createRef();

        this.state = {
            activeTab: 'editor',
        };
    }

    componentDidUpdate( prevProps ) {
        if ( prevProps.isSelected && ! this.props.isSelected && 'preview' === this.state.activeTab ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState( { activeTab: 'editor' } );
        }
        if ( ! prevProps.isSelected && this.props.isSelected && 'editor' === this.state.activeTab && this.input ) {
            this.input.focus();
        }
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            removeBlock,
        } = this.props;

        let {
            className,
        } = this.props;

        const {
            content,
        } = attributes;

        const {
            activeTab,
        } = this.state;

        className = classnames( 'ghostkit-markdown', className );

        if ( ! isSelected && ( ! content || '' === content.trim() ) ) {
            return (
                <p>
                    { __( 'Write your _Markdown_ **here**...', '@@text_domain' ) }
                </p>
            );
        }

        return (
            <div>
                <BlockControls>
                    <Toolbar>
                        { /* eslint-disable-next-line react/button-has-type */ }
                        <button
                            className={ classnames( 'components-button components-tab-button', 'editor' === activeTab ? 'is-pressed' : '' ) }
                            onClick={ () => this.setState( { activeTab: 'editor' } ) }
                        >
                            <span>{ __( 'Markdown', '@@text_domain' ) }</span>
                        </button>
                        { /* eslint-disable-next-line react/button-has-type */ }
                        <button
                            className={ classnames( 'components-button components-tab-button', 'preview' === activeTab ? 'is-pressed' : '' ) }
                            onClick={ () => this.setState( { activeTab: 'preview' } ) }
                        >
                            <span>{ __( 'Preview', '@@text_domain' ) }</span>
                        </button>
                    </Toolbar>
                </BlockControls>

                { 'preview' === activeTab || ! isSelected ? (
                    <MDRender className={ className } content={ content } />
                ) : (
                    <PlainText
                        className={ className }
                        onChange={ ( val ) => {
                            setAttributes( { content: val } );
                        } }
                        onKeyDown={ ( e ) => {
                            // Remove the block if content is empty and we're pressing the Backspace key
                            if ( 8 === e.keyCode && '' === content ) {
                                removeBlock();
                                e.preventDefault();
                            }
                        } }
                        aria-label={ __( 'Markdown', '@@text_domain' ) }
                        innerRef={ ( ref ) => {
                            this.ref = ref;
                        } }
                        value={ content }
                    />
                ) }
            </div>
        );
    }
}

export default compose( [
    withSelect( ( select ) => ( {
        currentBlockId: select( 'core/block-editor' ).getSelectedBlockClientId(),
    } ) ),
    withDispatch( ( dispatch, { currentBlockId } ) => ( {
        removeBlock: () => dispatch( 'core/block-editor' ).removeBlocks( currentBlockId ),
    } ) ),
] )( BlockEdit );
