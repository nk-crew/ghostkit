/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import deepAssign from 'deep-assign';

/**
 * WordPress dependencies
 */
const {
    RichText,
} = wp.editor;

const {
    applyFilters,
} = wp.hooks;

export default [
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
                            width: attributes.percent + '%',
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
                    styles[ '&:hover' ] = deepAssign( styles[ '&:hover' ] || {}, {
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
        save: function( props ) {
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
                        <div className={ classnames( 'ghostkit-progress-bar', animateInViewport ? 'ghostkit-count-up' : '' ) } role="progressbar" style={ { width: `${ percent }%`, height: `${ height }px` } } />
                    </div>
                </div>
            );
        },
    }, {
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '.ghostkit-progress-wrap': {
                        height: attributes.height,
                        borderRadius: attributes.borderRadius,
                        backgroundColor: attributes.backgroundColor,
                        '.ghostkit-progress-bar': {
                            width: attributes.percent + '%',
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
                    styles[ '&:hover' ] = deepAssign( styles[ '&:hover' ] || {}, {
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
                type: 'array',
                source: 'children',
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
        save: function( props ) {
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
                        <RichText.Content
                            tagName="small"
                            className="ghostkit-progress-caption"
                            value={ caption }
                        />
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
                        <div className={ classnames( 'ghostkit-progress-bar', animateInViewport ? 'ghostkit-count-up' : '' ) } role="progressbar" style={ { width: `${ percent }%`, height: `${ height }px` } } aria-valuenow={ percent } aria-valuemin="0" aria-valuemax="100" />
                    </div>
                </div>
            );
        },
    }, {
        ghostkit: {
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
            },
        },
        supports: {
            html: false,
            align: [ 'wide', 'full' ],
        },
        attributes: {
            caption: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-progress-caption',
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
                default: '#016c91',
            },
            backgroundColor: {
                type: 'string',
                default: '#f3f4f5',
            },
        },
        save: function( props ) {
            const {
                caption,
                height,
                percent,
                striped,
            } = props.attributes;

            let {
                className,
            } = props;

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/progress',
                },
                ...props,
            } );

            return (
                <div className={ className }>
                    { ! RichText.isEmpty( caption ) ? (
                        <RichText.Content
                            tagName="small"
                            className="ghostkit-progress-caption"
                            value={ caption }
                        />
                    ) : '' }
                    <div className={ classnames( 'ghostkit-progress-wrap', striped ? 'ghostkit-progress-bar-striped' : '' ) }>
                        <div className="ghostkit-progress-bar" role="progressbar" style={ { width: `${ percent }%`, height: `${ height }px` } } aria-valuenow={ percent } aria-valuemin="0" aria-valuemax="100" />
                    </div>
                </div>
            );
        },
    }, {
        ghostkit: {
            customStylesCallback( attributes ) {
                return {
                    '.ghostkit-progress-wrap': {
                        height: attributes.height,
                        borderRadius: attributes.borderRadius,
                        backgroundColor: attributes.backgroundColor,
                        '.ghostkit-progress-bar': {
                            width: attributes.percent + '%',
                            backgroundColor: attributes.color,
                        },
                    },
                };
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
            align: [ 'wide', 'full' ],
            className: false,
        },
        attributes: {
            caption: {
                type: 'array',
                source: 'children',
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
                default: '#016c91',
            },
            backgroundColor: {
                type: 'string',
                default: '#f3f4f5',
            },
        },
        save: function( props ) {
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

            let {
                className,
            } = props;

            className = classnames( 'ghostkit-progress', className );

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/progress',
                },
                ...props,
            } );

            return (
                <div className={ className }>
                    { ! RichText.isEmpty( caption ) ? (
                        <RichText.Content
                            tagName="small"
                            className="ghostkit-progress-caption"
                            value={ caption }
                        />
                    ) : '' }
                    { showCount ? (
                        <div className="ghostkit-progress-bar-count" style={ { width: `${ percent }%` } }>
                            <div>{ countPrefix }{ percent }{ countSuffix }</div>
                        </div>
                    ) : '' }
                    <div className={ classnames( 'ghostkit-progress-wrap', striped ? 'ghostkit-progress-bar-striped' : '' ) }>
                        <div className={ classnames( 'ghostkit-progress-bar', animateInViewport ? 'ghostkit-count-up' : '' ) } role="progressbar" style={ { width: `${ percent }%`, height: `${ height }px` } } aria-valuenow={ percent } aria-valuemin="0" aria-valuemax="100" />
                    </div>
                </div>
            );
        },
    },
];
