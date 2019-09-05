/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Component, Fragment, RawHTML } = wp.element;

const {
    PanelBody,
    Placeholder,
    SelectControl,
    Spinner,
    Disabled,
} = wp.components;

const {
    applyFilters,
} = wp.hooks;

const {
    withSelect,
} = wp.data;

const {
    InspectorControls,
    RichText,
} = wp.editor;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import getAllHeadings from './get-all-headings';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        let {
            className,
        } = this.props;

        const {
            setAttributes,
            attributes,
            headings,
            tocHTML,
            isSelected,
        } = this.props;

        const {
            title,
            allowedHeaders,
            listStyle,
        } = attributes;

        className = classnames(
            'ghostkit-toc',
            className
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <SelectControl
                            label={ __( 'Allowed Headers' ) }
                            value={ allowedHeaders }
                            options={ [
                                {
                                    value: 1,
                                    label: __( 'Heading 1' ),
                                }, {
                                    value: 2,
                                    label: __( 'Heading 2' ),
                                }, {
                                    value: 3,
                                    label: __( 'Heading 3' ),
                                }, {
                                    value: 4,
                                    label: __( 'Heading 4' ),
                                }, {
                                    value: 5,
                                    label: __( 'Heading 5' ),
                                }, {
                                    value: 6,
                                    label: __( 'Heading 6' ),
                                },
                            ] }
                            onChange={ ( val ) => {
                                setAttributes( {
                                    allowedHeaders: val.map( ( level ) => {
                                        return parseInt( level );
                                    } ),
                                } );
                            } }
                            multiple
                        />
                        <SelectControl
                            label={ __( 'List Style' ) }
                            value={ listStyle }
                            options={ [
                                {
                                    value: 'ol',
                                    label: __( 'Numbered List' ),
                                }, {
                                    value: 'ul',
                                    label: __( 'Dotted List' ),
                                }, {
                                    value: 'ol-styled',
                                    label: __( 'Numbered List Styled' ),
                                }, {
                                    value: 'ul-styled',
                                    label: __( 'Dotted List Styled' ),
                                },
                            ] }
                            onChange={ ( val ) => setAttributes( { listStyle: val } ) }
                        />
                    </PanelBody>
                </InspectorControls>
                { ! headings || ! headings.length ? (
                    <Placeholder
                        icon={ getIcon( 'block-table-of-contents' ) }
                        label={ __( 'Table of Contents' ) }
                        instructions={ __( 'No headings found.' ) }
                        className={ className }
                    />
                ) : '' }
                { headings && headings.length ? (
                    <div className={ className }>
                        { ( ! RichText.isEmpty( title ) || isSelected ) ? (
                            <RichText
                                tagName="h5"
                                className="ghostkit-toc-title"
                                placeholder={ __( 'Write title…' ) }
                                format="string"
                                value={ title }
                                onChange={ val => setAttributes( { title: val } ) }
                            />
                        ) : '' }
                        { ! tocHTML ? (
                            <div className="ghostkit-toc-spinner"><Spinner /></div>
                        ) : (
                            <Disabled>
                                <div className={ 'ghostkit-toc-list block-library-list' }>
                                    <RawHTML>
                                        { tocHTML }
                                    </RawHTML>
                                </div>
                            </Disabled>
                        ) }
                    </div>
                ) : '' }
            </Fragment>
        );
    }
}

export default withSelect( ( select, props ) => {
    const {
        getBlocks,
    } = select( 'core/editor' );

    const {
        allowedHeaders,
        listStyle,
    } = props.attributes;

    const blocks = getBlocks();
    const headings = getAllHeadings( blocks, allowedHeaders );

    return {
        headings,
        tocHTML: select( 'ghostkit/blocks/table-of-contents' ).getTOC( {
            headings: headings,
            allowedHeaders,
            listStyle,
        } ),
    };
} )( BlockEdit );
