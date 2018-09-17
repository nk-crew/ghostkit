// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    InnerBlocks,
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
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
            number: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-counter-box-number',
                default: '77',
            },
            numberPosition: {
                type: 'string',
                default: 'top',
            },
            numberSize: {
                type: 'number',
                default: 50,
            },
            numberColor: {
                type: 'string',
                default: '#016c91',
            },
        },
        save: function( { attributes, className = '' } ) {
            const {
                number,
                numberPosition,
                variant,
            } = attributes;

            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-counter-box-variant-${ variant }` );
            }

            return (
                <div className={ className }>
                    <RichText.Content
                        tagName="div"
                        className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }` }
                        value={ number }
                    />
                    <div className="ghostkit-counter-box-content">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
];
