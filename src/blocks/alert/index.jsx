// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';
import deprecatedArray from './deprecated.jsx';

// Internal Dependencies.
import elementIcon from '../_icons/alert.svg';

const { GHOSTKIT } = window;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
    RangeControl,
    PanelColor,
    TextControl,
    ToggleControl,
} = wp.components;

const {
    InspectorControls,
    ColorPalette,
    InnerBlocks,
} = wp.editor;

class AlertBlock extends Component {
    ghostkitStyles( attributes ) {
        return {
            borderLeftColor: attributes.color,
            '.ghostkit-alert-icon': {
                fontSize: attributes.iconSize,
                color: attributes.color,
            },
        };
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
            hideButton,
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'alert' );

        className = classnames( 'ghostkit-alert', className );

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        { Object.keys( availableVariants ).length > 1 ? (
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        ) : '' }
                        <TextControl
                            label={ __( 'Icon' ) }
                            value={ icon }
                            help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Icon Size' ) }
                            value={ iconSize }
                            onChange={ ( value ) => setAttributes( { iconSize: value } ) }
                            min={ 20 }
                            max={ 100 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <PanelColor title={ __( 'Color' ) } colorValue={ color } >
                            <ColorPalette
                                value={ color }
                                onChange={ ( value ) => setAttributes( { color: value } ) }
                            />
                        </PanelColor>
                        <ToggleControl
                            label={ __( 'Dismiss button' ) }
                            checked={ !! hideButton }
                            onChange={ ( val ) => setAttributes( { hideButton: val } ) }
                        />
                    </PanelBody>
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
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'common',
    keywords: [
        __( 'alert' ),
        __( 'notification' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        align: [ 'wide', 'full' ],
        className: false,
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
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
            variant,
        } = attributes;

        className = classnames( 'ghostkit-alert', className );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-alert-variant-${ variant }` );
        }

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

    deprecated: deprecatedArray,
};
