/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon( 'block-changelog', true ),
	ghostkit: {
		previewUrl: 'https://ghostkit.io/blocks/changelog/',
	},
	example: {
		attributes: {
			version: '1.0.0',
			date: '19 August 2077',
		},
		innerBlocks: [
			{
				name: 'core/list',
				attributes: {
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
							<span className="ghostkit-badge" style={ { backgroundColor: '#63656b' } }>
								{ __( 'Changed', 'ghostkit' ) }
							</span>
							{ __( 'Something', 'ghostkit' ) }
						</li>,
					],
				},
			},
		],
	},
	edit,
	save,
};
