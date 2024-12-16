import classnames from 'classnames/dedupe';

import { InspectorControls } from '@wordpress/block-editor';
import {
	ExternalLink,
	PanelBody,
	Placeholder,
	SelectControl,
	Spinner,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

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
		consumerKey,
		consumerSecret,
		accessToken,
		accessTokenSecret,

		userName,
		count,

		showReplies,
		showRetweets,
		showFeedAvatar,
		feedAvatarSize,
		showFeedName,
		showFeedDate,
		feedTextMode,
		feedTextConvertLinks,
		showFeedActions,

		showProfile,
		showProfileAvatar,
		profileAvatarSize,
		showProfileName,
		showProfileStats,
		showProfileDescription,
		showProfileWebsite,
		showProfileLocation,
	} = attributes;

	const { twitterFeed, twitterProfile } = useSelect((select) => {
		const APIDataReady =
			consumerKey &&
			consumerSecret &&
			accessToken &&
			accessTokenSecret &&
			userName;

		if (!APIDataReady) {
			return false;
		}

		const apiKeys = {
			consumer_key: consumerKey,
			consumer_secret: consumerSecret,
			access_token: accessToken,
			access_token_secret: accessTokenSecret,
			screen_name: userName,
		};

		return {
			twitterFeed: select('ghostkit/blocks/twitter').getTwitterFeed({
				count,
				exclude_replies: showReplies ? 'false' : 'true',
				include_rts: showRetweets ? 'true' : 'false',
				tweet_mode_extended: feedTextMode === 'full' ? 'true' : 'false',
				...apiKeys,
			}),
			twitterProfile: select('ghostkit/blocks/twitter').getTwitterProfile(
				apiKeys
			),
		};
	})(BlockEdit);

	className = classnames('ghostkit-twitter', className);

	className = applyFilters('ghostkit.editor.className', className, props);

	const APIDataReady =
		consumerKey &&
		consumerSecret &&
		accessToken &&
		accessTokenSecret &&
		userName;

	return (
		<>
			<InspectorControls>
				{APIDataReady ? (
					<>
						<PanelBody>
							<TextControl
								placeholder={__('Username', 'ghostkit')}
								value={userName}
								onChange={(value) =>
									setAttributes({ userName: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</PanelBody>
						<PanelBody title={__('Feed', 'ghostkit')}>
							<RangeControl
								label={__('Tweets Number', 'ghostkit')}
								value={count}
								onChange={(value) =>
									setAttributes({ count: value })
								}
								min={1}
								max={20}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Show Replies', 'ghostkit')}
								checked={!!showReplies}
								onChange={(value) =>
									setAttributes({ showReplies: value })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Show Retweets', 'ghostkit')}
								checked={!!showRetweets}
								onChange={(value) =>
									setAttributes({ showRetweets: value })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Show Avatar', 'ghostkit')}
								checked={!!showFeedAvatar}
								onChange={(value) =>
									setAttributes({ showFeedAvatar: value })
								}
								__nextHasNoMarginBottom
							/>
							{showFeedAvatar ? (
								<RangeControl
									label={__('Avatar Size', 'ghostkit')}
									value={feedAvatarSize}
									onChange={(value) =>
										setAttributes({ feedAvatarSize: value })
									}
									min={10}
									max={100}
									allowCustomMin
									allowCustomMax
									__next40pxDefaultSize
									__nextHasNoMarginBottom
								/>
							) : null}
							<ToggleControl
								label={__('Show Name', 'ghostkit')}
								checked={!!showFeedName}
								onChange={(value) =>
									setAttributes({ showFeedName: value })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Show Date', 'ghostkit')}
								checked={!!showFeedDate}
								onChange={(value) =>
									setAttributes({ showFeedDate: value })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Show Actions', 'ghostkit')}
								checked={!!showFeedActions}
								onChange={(value) =>
									setAttributes({ showFeedActions: value })
								}
								__nextHasNoMarginBottom
							/>
							<SelectControl
								label={__('Text Mode', 'ghostkit')}
								value={feedTextMode}
								options={[
									{
										value: '',
										label: __('Short', 'ghostkit'),
									},
									{
										value: 'full',
										label: __('Full', 'ghostkit'),
									},
								]}
								onChange={(value) =>
									setAttributes({ feedTextMode: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<SelectControl
								label={__('Convert Text Links', 'ghostkit')}
								value={feedTextConvertLinks}
								options={[
									{
										value: 'links_media',
										label: __('Links + Media', 'ghostkit'),
									},
									{
										value: 'links',
										label: __('Links', 'ghostkit'),
									},
									{
										value: 'no',
										label: __('No Convert', 'ghostkit'),
									},
								]}
								onChange={(value) =>
									setAttributes({
										feedTextConvertLinks: value,
									})
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</PanelBody>
						<PanelBody title={__('Profile', 'ghostkit')}>
							<ToggleControl
								label={__('Show Profile', 'ghostkit')}
								checked={!!showProfile}
								onChange={(value) =>
									setAttributes({ showProfile: value })
								}
								__nextHasNoMarginBottom
							/>
							{showProfile ? (
								<>
									<ToggleControl
										label={__('Show Avatar', 'ghostkit')}
										checked={!!showProfileAvatar}
										onChange={(value) =>
											setAttributes({
												showProfileAvatar: value,
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
										onChange={(value) =>
											setAttributes({
												showProfileName: value,
											})
										}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Show Stats', 'ghostkit')}
										checked={!!showProfileStats}
										onChange={(value) =>
											setAttributes({
												showProfileStats: value,
											})
										}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__(
											'Show Description',
											'ghostkit'
										)}
										checked={!!showProfileDescription}
										onChange={(value) =>
											setAttributes({
												showProfileDescription: value,
											})
										}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Show Website', 'ghostkit')}
										checked={!!showProfileWebsite}
										onChange={(value) =>
											setAttributes({
												showProfileWebsite: value,
											})
										}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Show Location', 'ghostkit')}
										checked={!!showProfileLocation}
										onChange={(value) =>
											setAttributes({
												showProfileLocation: value,
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
					initialOpen={!APIDataReady}
				>
					<TextControl
						placeholder={__('Consumer Key', 'ghostkit')}
						value={consumerKey}
						onChange={(value) =>
							setAttributes({ consumerKey: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						placeholder={__('Consumer Secret', 'ghostkit')}
						value={consumerSecret}
						onChange={(value) =>
							setAttributes({ consumerSecret: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						placeholder={__('Access Token', 'ghostkit')}
						value={accessToken}
						onChange={(value) =>
							setAttributes({ accessToken: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						placeholder={__('Access Token Secret', 'ghostkit')}
						value={accessTokenSecret}
						onChange={(value) =>
							setAttributes({ accessTokenSecret: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<p>
						<em>
							{__(
								'A valid API data is required to use Twitter feed. How to get it',
								'ghostkit'
							)}{' '}
							<ExternalLink href="http://www.gabfirethemes.com/create-twitter-api-key/">
								http://www.gabfirethemes.com/create-twitter-api-key/
							</ExternalLink>
						</em>
					</p>
				</PanelBody>
			</InspectorControls>
			<div className={className}>
				{APIDataReady && showProfile && twitterProfile ? (
					<div className="ghostkit-twitter-profile">
						{showProfileAvatar &&
						twitterProfile.profile_images_https ? (
							<div className="ghostkit-twitter-profile-avatar">
								<ExternalLink
									href={`https://twitter.com/${twitterProfile.screen_name}/`}
								>
									<img
										src={
											twitterProfile.profile_images_https
												.original
										}
										alt={twitterProfile.fullName}
										width={profileAvatarSize}
										height={profileAvatarSize}
									/>
								</ExternalLink>
							</div>
						) : null}
						<div className="ghostkit-twitter-profile-side">
							{showProfileName && twitterProfile.name ? (
								<div className="ghostkit-twitter-profile-name">
									<h2 className="ghostkit-twitter-profile-fullname">
										<ExternalLink
											href={`https://twitter.com/${twitterProfile.screen_name}/`}
										>
											{twitterProfile.name}
										</ExternalLink>
										{twitterProfile.verified ? (
											<span className="ghostkit-twitter-profile-verified">
												{__(
													'Verified account',
													'ghostkit'
												)}
											</span>
										) : null}
									</h2>
									<h3 className="ghostkit-twitter-profile-username">
										<ExternalLink
											href={`https://twitter.com/${twitterProfile.screen_name}/`}
										>
											@{twitterProfile.screen_name}
										</ExternalLink>
									</h3>
								</div>
							) : null}
							{showProfileStats ? (
								<div className="ghostkit-twitter-profile-stats">
									<div>
										<strong>
											{
												twitterProfile.statuses_count_short
											}
										</strong>{' '}
										<span>{__('Tweets', 'ghostkit')}</span>
									</div>
									<div>
										<strong>
											{twitterProfile.friends_count_short}
										</strong>{' '}
										<span>
											{__('Following', 'ghostkit')}
										</span>
									</div>
									<div>
										<strong>
											{
												twitterProfile.followers_count_short
											}
										</strong>{' '}
										<span>
											{__('Followers', 'ghostkit')}
										</span>
									</div>
								</div>
							) : null}
							{showProfileDescription &&
							twitterProfile.description_entitled ? (
								<div
									className="ghostkit-twitter-profile-description"
									dangerouslySetInnerHTML={{
										__html: twitterProfile.description_entitled,
									}}
								/>
							) : null}
							{showProfileWebsite &&
							twitterProfile.url_entitled ? (
								<div
									className="ghostkit-twitter-profile-website"
									dangerouslySetInnerHTML={{
										__html: `<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.348 7.40994L14.378 5.37894C14.9421 4.82384 15.7027 4.51411 16.4941 4.51724C17.2855 4.52037 18.0436 4.8361 18.6033 5.39565C19.163 5.9552 19.4789 6.71324 19.4822 7.50465C19.4855 8.29606 19.176 9.05672 18.621 9.62094L15.621 12.6209C15.3171 12.9248 14.9514 13.1598 14.5488 13.3101C14.1462 13.4604 13.7159 13.5224 13.2873 13.492C12.8586 13.4616 12.4414 13.3394 12.064 13.1337C11.6867 12.928 11.3579 12.6437 11.1 12.2999C10.9804 12.1408 10.8025 12.0357 10.6054 12.0077C10.4083 11.9798 10.2081 12.0313 10.049 12.1509C9.8899 12.2705 9.7848 12.4484 9.75686 12.6455C9.72892 12.8426 9.78041 13.0428 9.90003 13.2019C10.2869 13.7176 10.7801 14.1442 11.3462 14.4527C11.9123 14.7612 12.5381 14.9445 13.1812 14.9901C13.8243 15.0357 14.4697 14.9426 15.0737 14.7171C15.6777 14.4915 16.2262 14.1388 16.682 13.6829L19.682 10.6829C20.1082 10.2669 20.4475 9.77059 20.6804 9.22251C20.9133 8.67443 21.0351 8.08558 21.0387 7.49008C21.0423 6.89459 20.9277 6.30429 20.7016 5.75342C20.4754 5.20254 20.1421 4.70204 19.721 4.28092C19.3 3.8598 18.7995 3.52644 18.2487 3.30016C17.6978 3.07388 17.1076 2.95919 16.5121 2.96273C15.9166 2.96626 15.3277 3.08796 14.7796 3.32077C14.2315 3.55357 13.735 3.89285 13.319 4.31894L11.289 6.34894C11.1523 6.49033 11.0766 6.67975 11.0782 6.8764C11.0799 7.07305 11.1586 7.26119 11.2976 7.40032C11.4366 7.53944 11.6247 7.6184 11.8213 7.6202C12.018 7.62201 12.2075 7.5465 12.349 7.40994H12.348ZM5.37803 14.3789L8.37803 11.3789C8.68201 11.0747 9.04784 10.8395 9.45072 10.689C9.8536 10.5386 10.2841 10.4766 10.713 10.5071C11.142 10.5377 11.5593 10.6601 11.9369 10.866C12.3144 11.072 12.6432 11.3567 12.901 11.7009C13.0206 11.86 13.1985 11.9651 13.3956 11.9931C13.5927 12.021 13.7929 11.9695 13.952 11.8499C14.1111 11.7303 14.2162 11.5524 14.2442 11.3553C14.2721 11.1582 14.2206 10.958 14.101 10.7989C13.7141 10.2832 13.2209 9.85667 12.6548 9.54816C12.0887 9.23965 11.4629 9.05638 10.8198 9.01077C10.1767 8.96516 9.5313 9.05827 8.92731 9.28379C8.32332 9.50932 7.77485 9.862 7.31903 10.3179L4.31803 13.3179C3.47411 14.1618 3 15.3064 3 16.4999C3 17.6934 3.47411 18.838 4.31803 19.6819C5.16195 20.5258 6.30655 20.9999 7.50003 20.9999C8.69351 20.9999 9.83811 20.5258 10.682 19.6819L12.712 17.6519C12.8487 17.5105 12.9244 17.3211 12.9228 17.1245C12.9211 16.9278 12.8424 16.7397 12.7034 16.6005C12.5644 16.4614 12.3763 16.3824 12.1796 16.3806C11.983 16.3788 11.7935 16.4543 11.652 16.5909L9.62203 18.6209C9.34432 18.9032 9.01346 19.1278 8.64854 19.2816C8.28361 19.4354 7.89184 19.5155 7.49582 19.5172C7.09981 19.5188 6.70738 19.442 6.34118 19.2913C5.97498 19.1405 5.64225 18.9187 5.36219 18.6387C5.08212 18.3588 4.86027 18.0261 4.70942 17.6599C4.55857 17.2937 4.48171 16.9013 4.48328 16.5053C4.48484 16.1093 4.5648 15.7175 4.71854 15.3525C4.87228 14.9876 5.09676 14.6567 5.37903 14.3789H5.37803Z" fill="currentColor"/></svg> ${twitterProfile.url_entitled}`,
									}}
								/>
							) : null}
							{showProfileLocation && twitterProfile.location ? (
								<div
									className="ghostkit-twitter-profile-location"
									dangerouslySetInnerHTML={{
										__html: `<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2806 20.6368C5.98328 13.2316 5 12.4715 5 9.75C5 6.02207 8.13399 3 12 3C15.866 3 19 6.02207 19 9.75C19 12.4715 18.0167 13.2316 12.7194 20.6368C12.3718 21.1211 11.6282 21.121 11.2806 20.6368ZM12 12.5625C13.6108 12.5625 14.9167 11.3033 14.9167 9.75C14.9167 8.19669 13.6108 6.9375 12 6.9375C10.3892 6.9375 9.08333 8.19669 9.08333 9.75C9.08333 11.3033 10.3892 12.5625 12 12.5625Z" fill="currentColor"/></svg> ${twitterProfile.location}`,
									}}
								/>
							) : null}
						</div>
					</div>
				) : null}
				{APIDataReady && twitterFeed ? (
					<div className="ghostkit-twitter-items">
						{twitterFeed.map((item, i) => {
							const oldItem = item;
							let isRetweet = false;

							if (item.retweeted_status) {
								item = item.retweeted_status;
								isRetweet = true;
							}

							const itemName = `twitter-item-${i}`;

							return (
								<div
									className="ghostkit-twitter-item"
									key={itemName}
								>
									{showFeedAvatar ? (
										<div className="ghostkit-twitter-item-avatar">
											{isRetweet && <br />}
											<ExternalLink
												href={`https://twitter.com/${item.user.screen_name}/`}
											>
												<img
													src={
														item.user
															.profile_images_https
															.bigger
													}
													alt={item.user.screen_name}
													width={feedAvatarSize}
													height={feedAvatarSize}
												/>
											</ExternalLink>
										</div>
									) : null}
									<div className="ghostkit-twitter-item-content">
										{isRetweet ? (
											<div className="ghostkit-twitter-item-retweeted">
												<span
													className="ghostkit-twitter-item-retweeted-icon"
													dangerouslySetInnerHTML={{
														__html: '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16L19 19L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 6L15.6667 6C16.5507 6 17.3986 6.30436 18.0237 6.84614C18.6488 7.38791 19 8.12271 19 8.88889L19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 9L5 6L8 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L8.33333 19C7.44928 19 6.60143 18.6956 5.97631 18.1539C5.35119 17.6121 5 16.8773 5 16.1111L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
													}}
												/>
												<ExternalLink
													href={`https://twitter.com/${oldItem.user.screen_name}/`}
												>
													<strong>
														{oldItem.user.name}
													</strong>
												</ExternalLink>
												{__('Retweeted', 'ghostkit')}
											</div>
										) : null}
										{showFeedName || showFeedDate ? (
											<div className="ghostkit-twitter-item-meta">
												{showFeedName ? (
													<div className="ghostkit-twitter-item-meta-name">
														<ExternalLink
															href={`https://twitter.com/${item.user.screen_name}/`}
														>
															<strong>
																{item.user.name}
															</strong>{' '}
															{item.user
																.verified ? (
																<span className="ghostkit-twitter-item-meta-name-verified">
																	{__(
																		'Verified account',
																		'ghostkit'
																	)}
																</span>
															) : null}{' '}
															<span>
																@
																{
																	item.user
																		.screen_name
																}
															</span>
														</ExternalLink>
													</div>
												) : null}
												{showFeedDate ? (
													<div className="ghostkit-twitter-item-meta-date">
														<ExternalLink
															href={`https://twitter.com/${item.user.screen_name}/status/${item.id_str}`}
														>
															{
																item.date_formatted
															}
														</ExternalLink>
													</div>
												) : null}
											</div>
										) : null}
										{feedTextConvertLinks ===
										'links_media' ? (
											<div
												className="ghostkit-twitter-item-text"
												dangerouslySetInnerHTML={{
													__html: item.text_entitled,
												}}
											/>
										) : null}
										{feedTextConvertLinks === 'links' ? (
											<div
												className="ghostkit-twitter-item-text"
												dangerouslySetInnerHTML={{
													__html: item.text_entitled_no_media,
												}}
											/>
										) : null}
										{feedTextConvertLinks !==
											'links_media' &&
										feedTextConvertLinks !== 'links' ? (
											<div
												className="ghostkit-twitter-item-text"
												dangerouslySetInnerHTML={{
													__html: item.text,
												}}
											/>
										) : null}
										{showFeedActions ? (
											<div className="ghostkit-twitter-item-actions">
												<div className="ghostkit-twitter-item-actions-retweet">
													{/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
													<a
														href={`https://twitter.com/${item.user.screen_name}/status/${item.id_str}`}
														target="_blank"
														rel="noopener noreferrer"
														dangerouslySetInnerHTML={{
															__html: `<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16L19 19L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 6L15.6667 6C16.5507 6 17.3986 6.30436 18.0237 6.84614C18.6488 7.38791 19 8.12271 19 8.88889L19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 9L5 6L8 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L8.33333 19C7.44928 19 6.60143 18.6956 5.97631 18.1539C5.35119 17.6121 5 16.8773 5 16.1111L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>${
																item.retweet_count_short
																	? `<span>${item.retweet_count_short}</span>`
																	: ''
															}`,
														}}
													/>
												</div>
												<div className="ghostkit-twitter-item-actions-like">
													<ExternalLink
														href={`https://twitter.com/${item.user.screen_name}/status/${item.id_str}`}
													>
														<svg
															className="ghostkit-svg-icon"
															width="24"
															height="24"
															viewBox="0 0 24 24"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M7.25 5C5.41421 5 3.5 6.66421 3.5 9C3.5 11.7695 5.57359 14.3251 7.86118 16.2727C8.98201 17.2269 10.1066 17.9947 10.9527 18.5245C11.375 18.7889 11.726 18.9928 11.9699 19.1298C11.9801 19.1356 11.9901 19.1412 12 19.1467C12.0098 19.1412 12.0199 19.1356 12.0301 19.1298C12.274 18.9928 12.625 18.7889 13.0473 18.5245C13.8934 17.9947 15.018 17.2269 16.1388 16.2727C18.4264 14.3251 20.5 11.7695 20.5 9C20.5 6.66421 18.5858 5 16.75 5C14.8879 5 13.3816 6.22683 12.7115 8.23717C12.6094 8.54343 12.3228 8.75 12 8.75C11.6772 8.75 11.3906 8.54343 11.2885 8.23717C10.6184 6.22683 9.11212 5 7.25 5ZM12 20C11.6574 20.6672 11.6572 20.6671 11.6569 20.6669L11.6479 20.6623L11.6251 20.6504C11.6057 20.6402 11.5777 20.6254 11.5418 20.6062C11.4699 20.5676 11.3662 20.5112 11.2352 20.4376C10.9732 20.2904 10.6016 20.0744 10.1567 19.7958C9.26844 19.2397 8.08049 18.4294 6.88882 17.4148C4.5514 15.4249 2 12.4805 2 9C2 5.83579 4.58579 3.5 7.25 3.5C9.30732 3.5 10.9728 4.57857 12 6.23441C13.0272 4.57857 14.6927 3.5 16.75 3.5C19.4142 3.5 22 5.83579 22 9C22 12.4805 19.4486 15.4249 17.1112 17.4148C15.9195 18.4294 14.7316 19.2397 13.8433 19.7958C13.3984 20.0744 13.0268 20.2904 12.7648 20.4376C12.6338 20.5112 12.5301 20.5676 12.4582 20.6062C12.4223 20.6254 12.3943 20.6402 12.3749 20.6504L12.3521 20.6623L12.3431 20.6669C12.3428 20.6671 12.3426 20.6672 12 20ZM12 20L12.3426 20.6672C12.1276 20.7776 11.8724 20.7776 11.6574 20.6672L12 20Z"
																fill="currentColor"
															/>
														</svg>
														{item.favorite_count_short ? (
															<span>
																{
																	item.favorite_count_short
																}
															</span>
														) : null}
													</ExternalLink>
												</div>
											</div>
										) : null}
									</div>
								</div>
							);
						})}
					</div>
				) : null}
				{APIDataReady && !twitterFeed ? (
					<div className="ghostkit-twitter-spinner">
						<Spinner />
					</div>
				) : null}
				{!APIDataReady ? (
					<Placeholder
						icon={getIcon('block-twitter')}
						label={__('Twitter', 'ghostkit')}
						instructions={__(
							'A valid API data is required to use Twitter feed. You can fill it in the block settings in Inspector.',
							'ghostkit'
						)}
						className={className}
					/>
				) : null}
			</div>
		</>
	);
}
