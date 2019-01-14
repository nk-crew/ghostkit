// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/block-changelog.svg';

const { GHOSTKIT } = window;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    RichText,
} = wp.editor;

class ChangelogBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            version,
            date,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'changelog' );

        className = classnames( 'ghostkit-changelog', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-changelog-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    { Object.keys( availableVariants ).length > 1 ? (
                        <PanelBody>
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        </PanelBody>
                    ) : '' }
                    <PanelBody>
                        <p>{ __( 'Supported highlighting badges, just put these texts in the start of items list: [Added], [Fixed], [Improved], [Updated], [New], [Removed], [Changed]' ) }</p>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <div className="ghostkit-changelog-version">
                        <RichText
                            tagName="span"
                            placeholder={ __( '1.0.0' ) }
                            value={ version }
                            onChange={ value => setAttributes( { version: value } ) }
                        />
                    </div>
                    <div className="ghostkit-changelog-date">
                        <RichText
                            tagName="h2"
                            placeholder={ __( '18 September 2018' ) }
                            value={ date }
                            onChange={ value => setAttributes( { date: value } ) }
                        />
                    </div>
                    <div className="ghostkit-changelog-more">
                        <InnerBlocks
                            allowedBlocks={ [ 'core/list', 'core/paragraph', 'ghostkit/alert' ] }
                            template={ [ [ 'core/list', {
                                values: [
                                    <li key="list-item-1">{ __( '[Added] Something' ) }</li>,
                                    <li key="list-item-2">{ __( '[Fixed] Something' ) }</li>,
                                    <li key="list-item-3">{ __( '[Improved] Something' ) }</li>,
                                ],
                            } ] ] }
                            templateLock={ false }
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/changelog';

export const settings = {
    title: __( 'Changelog' ),
    description: __( 'Show the changes log of your product.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'changelog' ),
        __( 'log' ),
        __( 'ghostkit' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/changelog/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        version: {
            type: 'string',
            default: '',
        },
        date: {
            type: 'string',
            default: '',
        },
    },

    edit: ChangelogBlock,

    save: function( props ) {
        const {
            variant,
            version,
            date,
        } = props.attributes;

        let className = 'ghostkit-changelog';

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-changelog-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className }>
                { ! RichText.isEmpty( version ) ? (
                    <RichText.Content
                        tagName="span"
                        className="ghostkit-changelog-version"
                        value={ version }
                    />
                ) : '' }
                { ! RichText.isEmpty( date ) ? (
                    <RichText.Content
                        tagName="h2"
                        className="ghostkit-changelog-date"
                        value={ date }
                    />
                ) : '' }
                <div className="ghostkit-changelog-more">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
};
