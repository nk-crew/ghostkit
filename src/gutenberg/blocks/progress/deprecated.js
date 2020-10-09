/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import save from './save';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { merge } = window.lodash;

const {
    RichText,
} = wp.blockEditor;

const {
    applyFilters,
} = wp.hooks;

export default [
    // v2.10.2
    {
        ...metadata,
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '--gkt-progress__height': attributes.height ? `${ attributes.height }px` : false,
                    '--gkt-progress__border-radius': attributes.borderRadius ? `${ attributes.borderRadius }px` : false,
                    '--gkt-progress__background-color': attributes.backgroundColor,
                    '--gkt-progress--bar__width': attributes.percent ? `${ attributes.percent }%` : false,
                    '--gkt-progress--bar__background-color': attributes.color,
                };

                if ( attributes.hoverColor ) {
                    styles[ '&:hover' ] = {
                        '--gkt-progress--bar__background-color': attributes.hoverColor,
                    };
                }
                if ( attributes.hoverBackgroundColor ) {
                    styles[ '&:hover' ] = merge( styles[ '&:hover' ] || {}, {
                        '--gkt-progress__background-color': attributes.hoverBackgroundColor,
                    } );
                }

                return styles;
            },
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        attributes: {
            caption: {
                type: 'string',
                source: 'html',
                selector: '.ghostkit-progress-caption',
                default: 'Progress Caption',
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
            animateInViewport: {
                type: 'boolean',
                default: false,
            },
            showCount: {
                type: 'boolean',
                default: false,
            },
            countPrefix: {
                type: 'string',
                default: '',
            },
            countSuffix: {
                type: 'string',
                default: '%',
            },
            color: {
                type: 'string',
                default: '#0366d6',
            },
            backgroundColor: {
                type: 'string',
                default: '#f3f4f5',
            },
            hoverColor: {
                type: 'string',
            },
            hoverBackgroundColor: {
                type: 'string',
            },
        },
        save,
    },

    // v2.3.0
    {
        // fixed importing demo content
        // aria attributes not imported for some reason
        // so we need to fix it manually
        // https://wordpress.org/support/topic/bug-after-import-backward-compatibility/
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '.ghostkit-progress-wrap': {
                        height: attributes.height,
                        borderRadius: attributes.borderRadius,
                        backgroundColor: attributes.backgroundColor,
                        '.ghostkit-progress-bar': {
                            width: `${ attributes.percent }%`,
                            backgroundColor: attributes.color,
                        },
                    },
                };

                if ( attributes.hoverColor ) {
                    styles[ '&:hover' ] = {
                        '.ghostkit-progress-wrap': {
                            '.ghostkit-progress-bar': {
                                backgroundColor: attributes.hoverColor,
                            },
                        },
                    };
                }
                if ( attributes.hoverBackgroundColor ) {
                    styles[ '&:hover' ] = merge( styles[ '&:hover' ] || {}, {
                        '.ghostkit-progress-wrap': {
                            backgroundColor: attributes.hoverBackgroundColor,
                        },
                    } );
                }

                return styles;
            },
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
            caption: {
                type: 'string',
                source: 'html',
                selector: '.ghostkit-progress-caption',
                default: 'Progress Caption',
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
            animateInViewport: {
                type: 'boolean',
                default: false,
            },
            showCount: {
                type: 'boolean',
                default: false,
            },
            countPrefix: {
                type: 'string',
                default: '',
            },
            countSuffix: {
                type: 'string',
                default: '%',
            },
            color: {
                type: 'string',
                default: '#0366d6',
            },
            backgroundColor: {
                type: 'string',
                default: '#f3f4f5',
            },
            hoverColor: {
                type: 'string',
            },
            hoverBackgroundColor: {
                type: 'string',
            },
        },
        save( props ) {
            const {
                caption,
                height,
                percent,
                striped,
                showCount,
                countPrefix,
                countSuffix,
                animateInViewport,
            } = props.attributes;

            let className = 'ghostkit-progress';

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/progress',
                },
                ...props,
            } );

            return (
                <div className={ className }>
                    { ! RichText.isEmpty( caption ) ? (
                        <div className="ghostkit-progress-caption">
                            <RichText.Content value={ caption } />
                        </div>
                    ) : '' }
                    { showCount ? (
                        <div className="ghostkit-progress-bar-count" style={ { width: `${ percent }%` } }>
                            <div>
                                <span>{ countPrefix }</span>
                                <span>{ percent }</span>
                                <span>{ countSuffix }</span>
                            </div>
                        </div>
                    ) : '' }
                    <div className={ classnames( 'ghostkit-progress-wrap', striped ? 'ghostkit-progress-bar-striped' : '' ) }>
                        { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
                        <div
                            className={ classnames( 'ghostkit-progress-bar', animateInViewport ? 'ghostkit-count-up' : '' ) }
                            role="progressbar"
                            style={ { width: `${ percent }%`, height: `${ height }px` } }
                        />
                    </div>
                </div>
            );
        },
    },
];
