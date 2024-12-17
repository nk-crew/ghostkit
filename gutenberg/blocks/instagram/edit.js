import classnames from 'classnames/dedupe';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ExternalLink,
	PanelBody,
	Placeholder,
	Spinner,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import GapSettings from '../../components/gap-settings';
import RangeControl from '../../components/range-control';
import getIcon from '../../utils/get-icon';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { setAttributes, attributes } = props;
	let { className } = props;

	const {
		accessToken,
		count,
		columns,
		gap,
		gapCustom,
		showProfileAvatar,
		profileAvatarSize,
		showProfileName,
		showProfileStats,
		showProfileBio,
		showProfileWebsite,
	} = attributes;

	const { instagramFeed, instagramProfile } = useSelect((select) => {
		if (!accessToken) {
			return false;
		}

		return {
			instagramFeed: select('ghostkit/blocks/instagram').getInstagramFeed(
				{
					access_token: accessToken,
					count,
				}
			),
			instagramProfile: select(
				'ghostkit/blocks/instagram'
			).getInstagramProfile({
				access_token: accessToken,
			}),
		};
	});

	const showProfile =
		attributes.showProfile &&
		(showProfileName ||
			showProfileAvatar ||
			showProfileBio ||
			showProfileWebsite ||
			showProfileStats);

	className = classnames(
		'ghostkit-instagram',
		gap && `ghostkit-instagram-gap-${gap}`,
		columns && `ghostkit-instagram-columns-${columns}`,
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });

	return (
		<>
			<InspectorControls>
				{accessToken ? (
					<>
						<PanelBody>
							<RangeControl
								label={__('Photos Number', 'ghostkit')}
								value={count}
								onChange={(value) =>
									setAttributes({ count: value })
								}
								min={1}
								max={20}
								allowCustomMax
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<RangeControl
								label={__('Columns', 'ghostkit')}
								value={columns}
								onChange={(value) =>
									setAttributes({ columns: value })
								}
								min={1}
								max={8}
								allowCustomMax
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</PanelBody>
						<PanelBody>
							<GapSettings
								gap={gap}
								gapCustom={gapCustom}
								onChange={(data) => {
									setAttributes(data);
								}}
							/>
						</PanelBody>
						<PanelBody title={__('Profile Info', 'ghostkit')}>
							<ToggleControl
								label={__('Show Profile Info', 'ghostkit')}
								checked={!!attributes.showProfile}
								onChange={(val) =>
									setAttributes({ showProfile: val })
								}
								__nextHasNoMarginBottom
							/>
							{attributes.showProfile ? (
								<>
									<ToggleControl
										label={__('Show Avatar', 'ghostkit')}
										checked={!!showProfileAvatar}
										onChange={(val) =>
											setAttributes({
												showProfileAvatar: val,
											})
										}
										__nextHasNoMarginBottom
									/>
									{showProfileAvatar ? (
										<RangeControl
											label={__(
												'Avatar Size',
												'ghostkit'
											)}
											value={profileAvatarSize}
											onChange={(value) =>
												setAttributes({
													profileAvatarSize: value,
												})
											}
											min={30}
											max={150}
											allowCustomMin
											allowCustomMax
											__next40pxDefaultSize
											__nextHasNoMarginBottom
										/>
									) : null}
									<ToggleControl
										label={__('Show Name', 'ghostkit')}
										checked={!!showProfileName}
										onChange={(val) =>
											setAttributes({
												showProfileName: val,
											})
										}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Show Stats', 'ghostkit')}
										checked={!!showProfileStats}
										onChange={(val) =>
											setAttributes({
												showProfileStats: val,
											})
										}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Show BIO', 'ghostkit')}
										checked={!!showProfileBio}
										onChange={(val) =>
											setAttributes({
												showProfileBio: val,
											})
										}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Show Website', 'ghostkit')}
										checked={!!showProfileWebsite}
										onChange={(val) =>
											setAttributes({
												showProfileWebsite: val,
											})
										}
										__nextHasNoMarginBottom
									/>
								</>
							) : null}
						</PanelBody>
					</>
				) : null}

				<PanelBody
					title={__('API Data', 'ghostkit')}
					initialOpen={!accessToken}
				>
					<TextControl
						placeholder={__('Access Token', 'ghostkit')}
						value={accessToken}
						onChange={(value) =>
							setAttributes({ accessToken: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<p>
						<em>
							{__(
								'A valid Access Token is required to use Instagram feed. How to get token',
								'ghostkit'
							)}{' '}
							<ExternalLink href="http://instagram.pixelunion.net/">
								http://instagram.pixelunion.net/
							</ExternalLink>
						</em>
					</p>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{accessToken &&
				showProfile &&
				instagramProfile &&
				instagramProfile.data ? (
					<div className="ghostkit-instagram-profile">
						{showProfileAvatar &&
						instagramProfile.data.profile_picture ? (
							<div className="ghostkit-instagram-profile-avatar">
								<img
									src={instagramProfile.data.profile_picture}
									alt={instagramProfile.data.full_name}
									width={profileAvatarSize}
									height={profileAvatarSize}
								/>
							</div>
						) : null}
						<div className="ghostkit-instagram-profile-side">
							{showProfileName &&
							instagramProfile.data.username ? (
								<div className="ghostkit-instagram-profile-name">
									{instagramProfile.data.username}
								</div>
							) : null}
							{showProfileStats &&
							instagramProfile.data.counts ? (
								<div className="ghostkit-instagram-profile-stats">
									<div>
										<strong>
											{instagramProfile.data.counts.media}
										</strong>{' '}
										<span>{__('Posts', 'ghostkit')}</span>
									</div>
									<div>
										<strong>
											{
												instagramProfile.data.counts
													.followed_by
											}
										</strong>{' '}
										<span>
											{__('Followers', 'ghostkit')}
										</span>
									</div>
									<div>
										<strong>
											{
												instagramProfile.data.counts
													.follows
											}
										</strong>{' '}
										<span>
											{__('Following', 'ghostkit')}
										</span>
									</div>
								</div>
							) : null}
							{showProfileBio && instagramProfile.data.bio ? (
								<div className="ghostkit-instagram-profile-bio">
									<h2>{instagramProfile.data.full_name}</h2>
									<div>{instagramProfile.data.bio}</div>
								</div>
							) : null}
							{showProfileWebsite &&
							instagramProfile.data.website ? (
								<div className="ghostkit-instagram-profile-website">
									<a href={instagramProfile.data.website}>
										{instagramProfile.data.website}
									</a>
								</div>
							) : null}
						</div>
					</div>
				) : null}
				{accessToken && instagramFeed && instagramFeed.data ? (
					<div className="ghostkit-instagram-items">
						{instagramFeed.data.map((item, i) => {
							const itemName = `instagram-item-${i}`;

							return (
								<div
									className="ghostkit-instagram-item"
									key={itemName}
								>
									<span>
										<img
											src={
												item.images.standard_resolution
													.url
											}
											width={
												item.images.standard_resolution
													.width
											}
											height={
												item.images.standard_resolution
													.height
											}
											alt={item.caption || ''}
										/>
									</span>
								</div>
							);
						})}
					</div>
				) : null}
				{accessToken && (!instagramFeed || !instagramFeed.data) ? (
					<div className="ghostkit-instagram-spinner">
						<Spinner />
					</div>
				) : null}
				{!accessToken ? (
					<Placeholder
						icon={getIcon('block-instagram')}
						label={__('Instagram', 'ghostkit')}
						instructions={__(
							'A valid Access Token is required to use Instagram feed. You can fill it in the block settings in Inspector.',
							'ghostkit'
						)}
						className={className}
					/>
				) : null}
			</div>
		</>
	);
}
