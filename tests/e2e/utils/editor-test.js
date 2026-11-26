import { test as base } from '@wordpress/e2e-test-utils-playwright';

export { expect } from '@wordpress/e2e-test-utils-playwright';

export const test = base.extend({
	admin: async ({ admin, editor }, use) => {
		const createNewPost = admin.createNewPost.bind(admin);

		admin.createNewPost = async (options) => {
			await createNewPost(options);

			// Remove this wait once Pro's createNewPost waits for the editor canvas.
			await editor.canvas
				.locator('body > *')
				.first()
				.waitFor({ state: 'attached' });
		};

		await use(admin);
	},
});
