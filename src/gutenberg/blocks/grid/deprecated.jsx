/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const {
    InnerBlocks,
} = wp.editor;

export default [
    {
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
            className: false,
            align: [ 'wide', 'full' ],
        },
        attributes: {
            columns: {
                type: 'number',
                default: 2,
            },
            gap: {
                type: 'string',
                default: 'md',
            },
            verticalAlign: {
                type: 'string',
            },
            horizontalAlign: {
                type: 'string',
            },
        },
        isEligible( attributes, innerBlocks ) {
            return attributes.columns === 0 && innerBlocks.length;
        },
        migrate( attributes, innerBlocks ) {
            attributes.columns = innerBlocks.length;

            return [
                attributes,
                innerBlocks,
            ];
        },
        save: function( props ) {
            const {
                verticalAlign,
                horizontalAlign,
                gap,
            } = props.attributes;

            let {
                className,
            } = props;

            className = classnames(
                className,
                'ghostkit-grid',
                `ghostkit-grid-gap-${ gap }`,
                verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
                horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
            );

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/grid',
                },
                ...props,
            } );

            return (
                <div className={ className }>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
];
