/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit( props ) {
	const { attributes, setAttributes } = props;
	let { className = '' } = props;

	const { version, date } = attributes;

	className = classnames( 'ghostkit-changelog', className );

	className = applyFilters( 'ghostkit.editor.className', className, props );

	const blockProps = useBlockProps( { className } );
	const innerBlockProps = useInnerBlocksProps(
		{
			className: 'ghostkit-changelog-inner',
		},
		{
			templateLock: false,
			template: [
				[
					'core/list',
					{
						className: 'is-style-none',
						values: [
							<li key="list-item-1">
								<span className="ghostkit-badge" style={ { backgroundColor: '#4ab866' } }>
									{ __( 'Added', 'ghostkit' ) }
								</span>
								{ __( 'Something', 'ghostkit' ) }
							</li>,
							<li key="list-item-2">
								<span className="ghostkit-badge" style={ { backgroundColor: '#0366d6' } }>
									{ __( 'Fixed', 'ghostkit' ) }
								</span>
								{ __( 'Something', 'ghostkit' ) }
							</li>,
							<li key="list-item-3">
								<span className="ghostkit-badge" style={ { backgroundColor: '#0366d6' } }>
									{ __( 'Improved', 'ghostkit' ) }
								</span>
								{ __( 'Something', 'ghostkit' ) }
							</li>,
						],
					},
				],
			],
		}
	);

	return (
		<div { ...blockProps }>
			<div className="ghostkit-changelog-version">
				<RichText
					inlineToolbar
					tagName="span"
					placeholder={ __( '1.0.0', 'ghostkit' ) }
					value={ version }
					onChange={ ( value ) => setAttributes( { version: value } ) }
				/>
			</div>
			<div className="ghostkit-changelog-date">
				<RichText
					inlineToolbar
					tagName="h2"
					placeholder={ __( '18 September 2019', 'ghostkit' ) }
					value={ date }
					onChange={ ( value ) => setAttributes( { date: value } ) }
					style={ { margin: 0 } }
				/>
			</div>
			<div className="ghostkit-changelog-more">
				<div { ...innerBlockProps } />
			</div>
		</div>
	);
}
