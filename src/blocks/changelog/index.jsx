// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/changelog.svg';

const { GHOSTKIT } = window;

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
                        <p>{ __( 'Supported highlighting badges, just put these texts in the start of items list: [Added], [Fixed], [Improved], [New], [Removed], [Changed]' ) }</p>
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
                            // TODO: Add template when this PR will be merged https://github.com/WordPress/gutenberg/pull/9674
                            //
                            // template={ [ [ 'core/list', {
                            // values: [
                            //     <li key="list-item-1">[Added] Something</li>,
                            //     <li key="list-item-2">[Fixed] Something</li>,
                            //     <li key="list-item-3">[Improved] Something</li>,
                            // ],
                            // } ] ] }
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
    description: __( 'Block for adding changelog for you products.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'changelog' ),
        __( 'log' ),
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

    save: function( { attributes, className = '' } ) {
        const {
            variant,
            version,
            date,
        } = attributes;

        className = classnames( 'ghostkit-changelog', className );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-changelog-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                { version && version.length > 0 ? (
                    <RichText.Content
                        tagName="span"
                        className="ghostkit-changelog-version"
                        value={ version }
                    />
                ) : '' }
                { date && date.length > 0 ? (
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
