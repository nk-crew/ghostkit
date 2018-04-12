// External Dependencies.
import ResizableBox from 're-resizable';
import shorthash from 'shorthash';

// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import { getCustomStylesAttr } from '../_utils.jsx';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    RangeControl,
    PanelColor,
    ToggleControl,
} = wp.components;
const {
    InspectorControls,
    ColorPalette,
    RichText,
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
        percent,
        borderRadius,
        color,
        backgroundColor,
    } = attributes;

    const ID = `ghostkit-progress-${ id }`;

    const style = {};
    style[ `.${ ID }` ] = {
        height: `${ height }px`,
        borderRadius: `${ borderRadius }px`,
        backgroundColor: backgroundColor,
        '.ghostkit-progress-bar': {
            width: `${ percent }%`,
            backgroundColor: color,
        },
    };

    return style;
}

class ProgressBlock extends Component {
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

        let { className } = this.props;

        const {
            id,
            caption,
            height,
            percent,
            borderRadius,
            striped,
            color,
            backgroundColor,
        } = attributes;

        // classes.
        const ID = `ghostkit-progress-${ id }`;

        className += ` ${ className || '' } ${ ID } ghostkit-progress${ striped ? ' ghostkit-progress-bar-striped' : '' }`;

        const classNameInner = 'ghostkit-progress-bar';

        return [
            isSelected &&
            <InspectorControls key="inspector">
                <RangeControl
                    label={ __( 'Height' ) }
                    value={ height || '' }
                    onChange={ value => setAttributes( { height: value } ) }
                    min={ 5 }
                    max={ 20 }
                />
                <RangeControl
                    label={ __( 'Percent' ) }
                    value={ percent || '' }
                    onChange={ value => setAttributes( { percent: value } ) }
                    min={ 0 }
                    max={ 100 }
                />
                <RangeControl
                    label={ __( 'Corner Radius' ) }
                    value={ borderRadius }
                    min="0"
                    max="10"
                    onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
                />
                <ToggleControl
                    label={ __( 'Striped' ) }
                    checked={ !! striped }
                    onChange={ ( val ) => setAttributes( { striped: val } ) }
                />
                <PanelColor title={ __( 'Color' ) } colorValue={ color } >
                    <ColorPalette
                        value={ color }
                        onChange={ ( colorValue ) => setAttributes( { color: colorValue } ) }
                    />
                </PanelColor>
                <PanelColor title={ __( 'Background Color' ) } colorValue={ backgroundColor } >
                    <ColorPalette
                        value={ backgroundColor }
                        onChange={ ( colorValue ) => setAttributes( { backgroundColor: colorValue } ) }
                    />
                </PanelColor>
            </InspectorControls>,
            ( caption && caption.length > 0 ) || isSelected ? (
                <RichText
                    tagName="small"
                    placeholder={ __( 'Write caption…' ) }
                    value={ caption }
                    onChange={ newCaption => setAttributes( { caption: newCaption } ) }
                    key="caption"
                />
            ) : null,
            <ResizableBox
                key="progress"
                className={ className }
                size={ {
                    width: '100%',
                    height,
                } }
                minWidth="0%"
                maxWidth="100%"
                minHeight="5"
                maxHeight="20"
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
            >
                <ResizableBox
                    key="resizable"
                    className={ classNameInner }
                    size={ {
                        width: `${ percent }%`,
                    } }
                    minWidth="0%"
                    maxWidth="100%"
                    minHeight="100%"
                    maxHeight="100%"
                    enable={ { top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false } }
                    onResizeStart={ () => {
                        toggleSelection( false );
                    } }
                    onResizeStop={ ( event, direction, elt, delta ) => {
                        setAttributes( {
                            percent: Math.min( 100, Math.max( 0, parseInt( 100 * jQuery( elt ).width() / jQuery( elt ).parent().width(), 10 ) ) ),
                        } );
                        toggleSelection( true );
                    } }
                />
            </ResizableBox>,
        ];
    }
}

export const name = 'ghostkit/progress';

export const settings = {
    title: __( 'Progress' ),
    description: __( 'Progress bar.' ),
    icon: 'arrow-right-alt',
    category: 'common',
    keywords: [
        __( 'progress' ),
        __( 'bar' ),
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
        caption: {
            type: 'caption',
        },
        height: {
            type: 'number',
            default: 15,
        },
        percent: {
            type: 'number',
            default: 75,
        },
        borderRadius: {
            type: 'number',
            default: 2,
        },
        striped: {
            type: 'boolean',
            default: true,
        },
        color: {
            type: 'string',
            default: '#008dbe',
        },
        backgroundColor: {
            type: 'string',
            default: '#e2e4e7',
        },
    },

    edit: ProgressBlock,

    save: function( { attributes, className } ) {
        const {
            id,
            caption,
            height,
            percent,
            striped,
        } = attributes;

        // classes.
        const ID = `ghostkit-progress-${ id }`;

        className = `${ className || '' } ${ ID } ghostkit-progress${ striped ? ' ghostkit-progress-bar-striped' : '' }`;

        const classNameInner = 'ghostkit-progress-bar';

        return (
            <div>
                {
                    caption && caption.length && (
                        <small className="ghostkit-progress-caption" key="caption">{ caption }</small>
                    )
                }
                <div className={ className } { ...getCustomStylesAttr( getStyles( attributes ) ) } key="progress">
                    <div className={ classNameInner } role="progressbar" style={ { width: `${ percent }%`, height: `${ height }px` } } aria-valuenow={ percent } aria-valuemin="0" aria-valuemax="100" />
                </div>
            </div>
        );
    },
};
