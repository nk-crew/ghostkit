// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/alert.svg';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    RangeControl,
    PanelColor,
    TextControl,
    ToggleControl,
} = wp.components;
const {
    InspectorControls,
    ColorPalette,
    InnerBlocks,
} = wp.blocks;

class AlertBlock extends Component {
    generateStyles( newAttributes ) {
        let { attributes } = this.props;
        const { setAttributes } = this.props;

        attributes = Object.assign( attributes, newAttributes );

        if ( attributes.ghostkitClassname ) {
            newAttributes.ghostkitStyles = {};
            newAttributes.ghostkitStyles[ `.${ attributes.ghostkitClassname }` ] = {
                borderLeftColor: attributes.color,
                '.ghostkit-alert-icon': {
                    fontSize: attributes.iconSize,
                    color: attributes.iconColor,
                },
            };
        }

        setAttributes( newAttributes );
    }

    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            color,
            icon,
            iconSize,
            iconColor,
            hideButton,
        } = attributes;

        // add custom classname.
        if ( ghostkitClassname ) {
            className += classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <PanelColor title={ __( 'Color' ) } colorValue={ color } >
                        <ColorPalette
                            value={ color }
                            onChange={ ( value ) => {
                                this.generateStyles.call( this, { color: value } );
                            } }
                        />
                    </PanelColor>
                    <TextControl
                        label={ __( 'Icon' ) }
                        value={ icon }
                        help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                        onChange={ ( value ) => setAttributes( { icon: value } ) }
                    />
                    <RangeControl
                        label={ __( 'Icon Size' ) }
                        value={ iconSize }
                        onChange={ ( value ) => {
                            this.generateStyles.call( this, { iconSize: value } );
                        } }
                        min={ 20 }
                        max={ 100 }
                        beforeIcon="editor-textcolor"
                        afterIcon="editor-textcolor"
                    />
                    <PanelColor title={ __( 'Icon Color' ) } colorValue={ iconColor } >
                        <ColorPalette
                            value={ iconColor }
                            onChange={ ( value ) => {
                                this.generateStyles.call( this, { iconColor: value } );
                            } }
                        />
                    </PanelColor>
                    <ToggleControl
                        label={ __( 'Hide Button' ) }
                        checked={ !! hideButton }
                        onChange={ ( val ) => setAttributes( { hideButton: val } ) }
                    />
                </InspectorControls>
                <div className={ className }>
                    { icon && (
                        <div className="ghostkit-alert-icon" dangerouslySetInnerHTML={ { __html: `<span class="${ icon }"></span>` } } />
                    ) }
                    <div className="ghostkit-alert-content">
                        { /* TODO: Add default blocks when this will be possible https://github.com/WordPress/gutenberg/issues/5448 */ }
                        <InnerBlocks />
                    </div>
                    { hideButton && (
                        <div className="ghostkit-alert-hide-button">
                            <span className="fas fa-times" />
                        </div>
                    ) }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/alert';

export const settings = {
    title: __( 'Alert' ),
    description: __( 'Alert.' ),
    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'common',
    keywords: [
        __( 'alert' ),
        __( 'notification' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
    },
    attributes: {
        color: {
            type: 'string',
            default: '#d94f4f',
        },
        icon: {
            type: 'string',
            default: 'fas fa-exclamation-triangle',
        },
        iconSize: {
            type: 'number',
            default: 30,
        },
        iconColor: {
            type: 'string',
            default: '#d94f4f',
        },
        hideButton: {
            type: 'boolean',
            default: false,
        },
    },

    edit: AlertBlock,

    save: function( { attributes, className = '' } ) {
        const {
            icon,
            hideButton,
        } = attributes;

        return (
            <div className={ className }>
                { icon && (
                    <div className="ghostkit-alert-icon">
                        <span className={ icon } />
                    </div>
                ) }
                <div className="ghostkit-alert-content">
                    <InnerBlocks.Content />
                </div>
                { hideButton && (
                    <div className="ghostkit-alert-hide-button">
                        <span className="fas fa-times" />
                    </div>
                ) }
            </div>
        );
    },
};
