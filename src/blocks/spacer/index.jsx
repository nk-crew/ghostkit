// External Dependencies.
import ResizableBox from 're-resizable';
import shorthash from 'shorthash';

// Import CSS
import './editor.scss';

// Internal Dependencies.
import { getCustomStylesAttr } from '../_utils.jsx';
import elementIcon from '../_icons/spacer.svg';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    RangeControl,
} = wp.components;
const {
    InspectorControls,
} = wp.blocks;

/**
 * Get progress styles based on attributes.
 *
 * @param {object} attributes - element atts.
 * @return {object} styles object.
 */
function getStyles( attributes ) {
    const {
        id,
        height,
    } = attributes;

    const ID = `ghostkit-spacer-${ id }`;

    const style = {};
    style[ `.${ ID }` ] = {
        height: `${ height }px`,
    };

    return style;
}

class SpacerBlock extends Component {
    constructor( { attributes } ) {
        super( ...arguments );

        // generate unique ID.
        if ( ! attributes.id ) {
            this.props.setAttributes( { id: shorthash.unique( this.props.id ) } );
        }
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            toggleSelection,
        } = this.props;

        let {
            className,
        } = this.props;

        const {
            id,
            height,
        } = attributes;

        // classes.
        const ID = `ghostkit-spacer-${ id }`;

        className += ` ${ className || '' } ${ ID } ghostkit-spacer`;

        const inspectorControls = isSelected && (
            <InspectorControls key="inspector">
                <RangeControl
                    label={ __( 'Height' ) }
                    value={ height || '' }
                    onChange={ value => setAttributes( { height: value } ) }
                    min={ 30 }
                    max={ 300 }
                />
            </InspectorControls>
        );

        return [
            inspectorControls,
            <ResizableBox
                key="resizable"
                className={ className }
                size={ {
                    width: '100%',
                    height,
                } }
                minWidth="100%"
                maxWidth="100%"
                minHeight="100%"
                handleClasses={ {
                    bottom: 'ghostkit-spacer__resize-handler',
                } }
                enable={ { top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false } }
                onResizeStart={ () => {
                    toggleSelection( false );
                } }
                onResizeStop={ ( event, direction, elt, delta ) => {
                    setAttributes( {
                        height: parseInt( height + delta.height, 10 ),
                    } );
                    toggleSelection( true );
                } }
                { ...getCustomStylesAttr( getStyles( attributes ) ) }
            />,
        ];
    }
}

export const name = 'ghostkit/spacer';

export const settings = {
    title: __( 'Spacer' ),
    description: __( 'Add space between other blocks.' ),
    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'layout',
    keywords: [
        __( 'hr' ),
        __( 'separator' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
    },
    attributes: {
        id: {
            type: 'string',
            default: false,
        },
        height: {
            type: 'number',
            default: 50,
        },
    },

    edit: SpacerBlock,

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     *
     * @return {?WPBlock} - block.
     */
    save( { attributes, className } ) {
        const {
            id,
        } = attributes;

        // classes.
        const ID = `ghostkit-spacer-${ id }`;

        className = `${ className || '' } ${ ID }`;

        return (
            <hr className={ className } { ...getCustomStylesAttr( getStyles( attributes ) ) } />
        );
    },
};
