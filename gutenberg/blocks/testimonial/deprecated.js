import classnames from 'classnames/dedupe';

import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { Component } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import IconPicker from '../../components/icon-picker';
import metadata from './block.json';

const { name } = metadata;

export default [
	// v2.23.2
	{
		...metadata,
		attributes: {
			icon: {
				type: 'string',
				default:
					'%3Csvg%20class%3D%22ghostkit-svg-icon%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M13.5954%2010.708C15.7931%205.55696%2021.1071%205%2021.1071%205L21.3565%205.16714C18.945%206.72641%2019.0559%208.98169%2019.0559%208.98169C19.0559%208.98169%2022.1211%209.70495%2022.7979%2012.2673C23.5186%2014.996%2022.2158%2017.2944%2020.4141%2018.3373C18.1801%2019.6305%2015.4248%2018.9499%2014.0389%2017.0008C12.6134%2014.996%2012.8469%2012.4623%2013.5954%2010.708Z%22%20fill%3D%22currentColor%22%2F%3E%3Cpath%20d%3D%22M1.59537%2010.708C3.79305%205.55696%209.10709%205%209.10709%205L9.35651%205.16714C6.945%206.72641%207.05592%208.98169%207.05592%208.98169C7.05592%208.98169%2010.1211%209.70495%2010.7979%2012.2673C11.5186%2014.996%2010.2158%2017.2944%208.41413%2018.3373C6.18005%2019.6305%203.42475%2018.9499%202.03887%2017.0008C0.61344%2014.996%200.846929%2012.4623%201.59537%2010.708Z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E',
			},
			photoId: {
				type: 'number',
			},
			photoUrl: {
				attribute: 'src',
				selector: '.ghostkit-testimonial-photo img',
				source: 'attribute',
				type: 'string',
			},
			photoAlt: {
				attribute: 'alt',
				selector: '.ghostkit-testimonial-photo img',
				source: 'attribute',
				type: 'string',
				default: '',
			},
			photoWidth: {
				type: 'number',
			},
			photoHeight: {
				type: 'number',
			},
			photoSizeSlug: {
				type: 'string',
			},
			name: {
				type: 'string',
				source: 'html',
				selector: '.ghostkit-testimonial-name',
				default: '<strong>Katrina Craft</strong>',
			},
			source: {
				type: 'string',
				source: 'html',
				selector: '.ghostkit-testimonial-source',
				default: 'Designer',
			},
			stars: {
				type: 'number',
			},
			starsIcon: {
				type: 'string',
				default:
					'%3Csvg%20class%3D%22ghostkit-svg-icon%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M12.6724%202.66808C12.5461%202.41207%2012.2853%202.25%2011.9998%202.25C11.7144%202.25%2011.4536%202.41207%2011.3273%202.66808L8.56287%208.26941L2.38143%209.16762C2.09892%209.20868%201.86421%209.40656%201.77599%209.67807C1.68777%209.94958%201.76134%2010.2476%201.96577%2010.4469L6.4387%2014.8069L5.38279%2020.9634C5.33453%2021.2448%205.45019%2021.5291%205.68115%2021.6969C5.91211%2021.8647%206.21831%2021.8869%206.471%2021.754L11.9998%2018.8473L17.5287%2021.754C17.7814%2021.8869%2018.0876%2021.8647%2018.3185%2021.6969C18.5495%2021.5291%2018.6652%2021.2448%2018.6169%2020.9634L17.561%2014.8069L22.0339%2010.4469C22.2383%2010.2476%2022.3119%209.94958%2022.2237%209.67807C22.1355%209.40656%2021.9008%209.20868%2021.6183%209.16762L15.4368%208.26941L12.6724%202.66808Z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E',
			},
			url: {
				type: 'string',
			},
			target: {
				type: 'string',
			},
			rel: {
				type: 'string',
			},
		},
		save: class BlockSave extends Component {
			render() {
				const { attributes } = this.props;

				const {
					photoId,
					photoUrl,
					photoAlt,
					photoWidth,
					photoHeight,

					icon,
					source,
					stars,
					starsIcon,
					url,
					target,
					rel,
				} = attributes;

				let className = classnames(
					'ghostkit-testimonial',
					url && 'ghostkit-testimonial-with-link'
				);

				className = applyFilters(
					'ghostkit.blocks.className',
					className,
					{
						name,
						...this.props,
					}
				);

				return (
					<div className={className}>
						{url ? (
							<a
								className="ghostkit-testimonial-link"
								href={url}
								target={target || false}
								rel={rel || false}
							>
								<span />
							</a>
						) : null}
						{icon ? (
							<IconPicker.Render
								name={icon}
								tag="div"
								className="ghostkit-testimonial-icon"
							/>
						) : null}
						<div className="ghostkit-testimonial-content">
							<InnerBlocks.Content />
						</div>
						{photoUrl ? (
							<div className="ghostkit-testimonial-photo">
								<img
									src={photoUrl}
									alt={photoAlt}
									className={
										photoId ? `wp-image-${photoId}` : null
									}
									width={photoWidth}
									height={photoHeight}
								/>
							</div>
						) : null}
						{!RichText.isEmpty(attributes.name) ||
						!RichText.isEmpty(source) ? (
							<div className="ghostkit-testimonial-meta">
								{!RichText.isEmpty(attributes.name) ? (
									<div className="ghostkit-testimonial-name">
										<RichText.Content
											value={attributes.name}
										/>
									</div>
								) : null}
								{!RichText.isEmpty(source) ? (
									<div className="ghostkit-testimonial-source">
										<RichText.Content value={source} />
									</div>
								) : null}
							</div>
						) : null}
						{typeof stars === 'number' && starsIcon ? (
							<div className="ghostkit-testimonial-stars">
								<div className="ghostkit-testimonial-stars-wrap">
									<div
										className="ghostkit-testimonial-stars-front"
										style={{
											width: `${(100 * stars) / 5}%`,
										}}
									>
										<IconPicker.Render name={starsIcon} />
										<IconPicker.Render name={starsIcon} />
										<IconPicker.Render name={starsIcon} />
										<IconPicker.Render name={starsIcon} />
										<IconPicker.Render name={starsIcon} />
									</div>
									<div className="ghostkit-testimonial-stars-back">
										<IconPicker.Render name={starsIcon} />
										<IconPicker.Render name={starsIcon} />
										<IconPicker.Render name={starsIcon} />
										<IconPicker.Render name={starsIcon} />
										<IconPicker.Render name={starsIcon} />
									</div>
								</div>
							</div>
						) : null}
					</div>
				);
			}
		},
	},
];
