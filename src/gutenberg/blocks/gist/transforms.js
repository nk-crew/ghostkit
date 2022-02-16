/**
 * WordPress dependencies
 */
const { createBlock } = wp.blocks;

export default {
  from: [
    {
      type: 'raw',
      priority: 1,
      isMatch: (node) => {
        const match =
          'P' === node.nodeName && /^https:\/\/gist.github.com?.+\/(.+)/g.exec(node.textContent);

        if (match && 'undefined' !== typeof match[1]) {
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
