// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    RichText,
} = wp.editor;

export default [
    {
        supports: {
            html: false,
            align: [ 'wide', 'full' ],
            ghostkitStyles: true,
            ghostkitSpacings: true,
            ghostkitDisplay: true,
            ghostkitSR: true,
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
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
        save: function( { attributes, className = '' } ) {
            const {
                caption,
                height,
                percent,
                striped,
                variant,
            } = attributes;

            // variant classname.
            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-progress-variant-${ variant }` );
            }

            return (
                <div className={ className }>
                    { caption && caption.length ? (
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
        supports: {
            html: false,
            align: [ 'wide', 'full' ],
            className: false,
            ghostkitStyles: true,
            ghostkitStylesCallback( attributes ) {
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
            ghostkitSpacings: true,
            ghostkitDisplay: true,
            ghostkitSR: true,
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
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
        save: function( { attributes, className = '' } ) {
            const {
                caption,
                height,
                percent,
                striped,
                showCount,
                countPrefix,
                countSuffix,
                animateInViewport,
                variant,
            } = attributes;

            className = classnames( 'ghostkit-progress', className );

            // variant classname.
            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-progress-variant-${ variant }` );
            }

            return (
                <div className={ className }>
                    { caption && caption.length ? (
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
