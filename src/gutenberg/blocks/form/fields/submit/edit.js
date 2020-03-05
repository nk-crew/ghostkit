/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { throttle } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
const {
    __,
} = wp.i18n;

const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const {
    InnerBlocks,
} = wp.blockEditor;

const {
    compose,
} = wp.compose;

const {
    withSelect,
    withDispatch,
} = wp.data;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor() {
        super( ...arguments );

        this.maybeChangeButtonTagName = throttle( 200, this.maybeChangeButtonTagName.bind( this ) );
    }

    componentDidMount() {
        this.maybeChangeButtonTagName();
    }

    componentDidUpdate() {
        this.maybeChangeButtonTagName();
    }

    maybeChangeButtonTagName() {
        this.props.changeButtonTagName();
    }

    render() {
        let { className = '' } = this.props;

        className = classnames(
            'ghostkit-form-submit-button',
            className,
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <div className={ className }>
                <InnerBlocks
                    template={ [ [ 'ghostkit/button-single', {
                        text: __( 'Submit', '@@text_domain' ),
                        tagName: 'button',
                        focusOutlineWeight: 2,
                    } ] ] }
                    allowedBlocks={ [ 'ghostkit/button-single' ] }
                    templateLock="all"
                />
            </div>
        );
    }
}

/**
 * Parse all button blocks.
 *
 * @param {Object} submitData submit block data.
 *
 * @return {Array} - fields list.
 */
function getAllButtonBlocks( submitData ) {
    let result = [];

    if ( submitData.innerBlocks && submitData.innerBlocks.length ) {
        submitData.innerBlocks.forEach( ( block ) => {
            // field data.
            if ( block.name && 'ghostkit/button-single' === block.name ) {
                result.push( block );
            }

            // inner blocks.
            if ( block.innerBlocks && block.innerBlocks.length ) {
                result = [
                    ...result,
                    ...getAllButtonBlocks( block ),
                ];
            }
        } );
    }

    return result;
}

export default compose( [
    withSelect( ( select, ownProps ) => {
        const {
            getBlock,
        } = select( 'core/block-editor' );

        return {
            allButtonBlocks: getAllButtonBlocks( getBlock( ownProps.clientId ) ),
        };
    } ),
    withDispatch( ( dispatch, ownProps ) => {
        const {
            updateBlockAttributes,
        } = dispatch( 'core/block-editor' );

        return {
            changeButtonTagName() {
                const {
                    allButtonBlocks = [],
                } = ownProps;

                // Generate slugs for new fields.
                allButtonBlocks.forEach( ( data ) => {
                    if ( ! data.attributes.tagName || 'button' !== data.attributes.tagName ) {
                        updateBlockAttributes( data.clientId, {
                            tagName: 'button',
                        } );
                    }
                } );
            },
        };
    } ),
] )( BlockEdit );
