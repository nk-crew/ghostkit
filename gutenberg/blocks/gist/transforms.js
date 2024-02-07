import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'raw',
			priority: 1,
			isMatch: (node) => {
				const match =
					node.nodeName === 'P' &&
					/^https:\/\/gist.github.com?.+\/(.+)/g.exec(
						node.textContent
					);

				if (match && typeof match[1] !== 'undefined') {
					return true;
				}

				return false;
			},
			transform: (node) =>
				createBlock('ghostkit/gist', {
					url: node.textContent.trim(),
				}),
		},
	],
};
