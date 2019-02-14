// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../_utils/get-icon';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

const {
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
            version,
            date,
        } = attributes;

        className = classnames( 'ghostkit-changelog', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
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
                                    <li key="list-item-1">
                                        <span className="ghostkit-badge" style="background-color: #4ab866;">{ __( 'Added' ) }</span>
                                        { __( 'Something' ) }
                                    </li>,
                                    <li key="list-item-2">
                                        <span className="ghostkit-badge" style="background-color: #0366d6;">{ __( 'Fixed' ) }</span>
                                        { __( 'Something' ) }
                                    </li>,
                                    <li key="list-item-3">
                                        <span className="ghostkit-badge" style="background-color: #0366d6;">{ __( 'Improved' ) }</span>
                                        { __( 'Something' ) }
                                    </li>,
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
    icon: getIcon( 'block-changelog' ),
    category: 'ghostkit',
    keywords: [
        __( 'changelog' ),
        __( 'log' ),
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
            version,
            date,
        } = props.attributes;

        let className = 'ghostkit-changelog';

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
