import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('typography', () => {
	test.beforeAll(async ({ requestUtils }) => {
		await requestUtils.activatePlugin('ghost-kit');
	});

	test.afterAll(async ({ requestUtils }) => {
		await Promise.all([
			requestUtils.deleteAllPosts(),
			requestUtils.deleteAllPages(),
		]);
	});

	async function setFontSetting(label, font, page) {
		const wrapper = await page.locator('.ghostkit-typography', {
			hasText: label,
		});

		const fontInput = wrapper
			.locator('.ghostkit-typography-font-selector input')
			.first();

		await fontInput.click();

		await fontInput.fill(font);

		await fontInput.press('Enter');

		await new Promise((resolve) => {
			setTimeout(
				() =>
					resolve(
						'Just wait 1 second for the selected font to be saved in the database after selection'
					),
				1000
			);
		});

		return wrapper;
	}

	test('added typography settings for body', async ({ page, admin }) => {
		await admin.visitAdminPage(
			'admin.php?page=ghostkit&sub_page=typography'
		);

		const font = 'Inter';

		const wrapper = await setFontSetting('Body', font, page);

		await expect(
			wrapper.locator('.ghostkit-typography-font-selector', {
				hasText: font,
			})
		).toBeVisible();
	});

	test('added typography settings for buttons', async ({ page, admin }) => {
		await admin.visitAdminPage(
			'admin.php?page=ghostkit&sub_page=typography'
		);

		const font = 'Raleway';

		const wrapper = await setFontSetting('Buttons', font, page);

		await expect(
			wrapper.locator('.ghostkit-typography-font-selector', {
				hasText: font,
			})
		).toBeVisible();
	});

	test('added typography settings for headings', async ({ page, admin }) => {
		await admin.visitAdminPage(
			'admin.php?page=ghostkit&sub_page=typography'
		);

		const font = 'Jost';

		const wrapper = await setFontSetting('Headings', font, page);

		await expect(
			wrapper.locator('.ghostkit-typography-font-selector', {
				hasText: font,
			})
		).toBeVisible();
	});

	test('Check fonts available on backend and frontend', async ({
		page,
		admin,
		editor,
	}) => {
		// Backend.
		await admin.createNewPost({
			title: 'Test Typography',
			postType: 'page',
			showWelcomeGuide: false,
		});

		const googleFontsApi = page.locator('#ghostkit-fonts-google-css');

		await expect(googleFontsApi).toHaveAttribute('href');

		const googleFontsApiLink = await googleFontsApi.getAttribute('href');

		const verIndex = googleFontsApiLink.indexOf('&ver=');
		const verAttribute = googleFontsApiLink.substring(verIndex + 5);

		const googleFontsLinkPredefined =
			'https://fonts.googleapis.com/css?family=Inter%3A400%2C700%7CRaleway%3A400%2C400i%2C700%2C700i%7CJost%3A400%2C400i%2C700%2C700i&display=swap&ver=' +
			verAttribute;

		// Added blocks in the page editor.
		await editor.insertBlock({
			name: 'core/paragraph',
			attributes: { content: 'Just a Paragraph' },
		});

		await editor.insertBlock({
			name: 'ghostkit/button',
		});

		await editor.insertBlock({
			name: 'core/heading',
			attributes: { content: 'Just a Title' },
		});

		// Checking links to Google fonts
		await expect(
			page.locator('#ghostkit-fonts-google-css')
		).toHaveAttribute('href', googleFontsLinkPredefined);

		// Getting added blocks to page editor.
		const paragraphBlock = editor.canvas.getByRole('document', {
			name: 'Paragraph',
		});

		const buttonBlock = editor.canvas.getByRole('document', {
			name: 'Buttons',
		});

		const titleBlock = editor.canvas.getByRole('document', {
			name: 'Heading',
		});

		// Check visible blocks on editor.
		await expect(paragraphBlock).toBeVisible();

		await expect(buttonBlock).toBeVisible();

		await expect(titleBlock).toBeVisible();

		// Checking whether the configured font matches the paragraph block.
		await expect(paragraphBlock).toHaveCSS(
			'font-family',
			'Inter, sans-serif'
		);

		// Checking whether the configured font matches the button block.
		await expect(buttonBlock.locator('.ghostkit-button')).toHaveCSS(
			'font-family',
			'Raleway, sans-serif'
		);

		// Checking whether the configured font matches the title block.
		await expect(titleBlock).toHaveCSS('font-family', 'Jost, sans-serif');

		// Publish Post.
		await editor.publishPost();

		// Go to published post.
		await page
			.locator('.components-button', {
				hasText: 'View Page',
			})
			.first()
			.click();

		// Frontend.
		// Checking links to Google fonts
		await expect(
			page.locator('#ghostkit-fonts-google-css')
		).toHaveAttribute('href', googleFontsLinkPredefined);

		const paragraph = page.locator('.wp-block-post-content > p');

		const button = page.locator(
			'.wp-block-post-content .ghostkit-button-text'
		);

		const title = page.locator('#just-a-title');

		// Check visible blocks on editor.
		await expect(paragraph).toBeVisible();

		await expect(button).toBeVisible();

		await expect(title).toBeVisible();

		// Checking whether the configured font matches the blocks.
		await expect(paragraph).toHaveCSS('font-family', 'Inter, sans-serif');

		await expect(button).toHaveCSS('font-family', 'Raleway, sans-serif');

		await expect(title).toHaveCSS('font-family', 'Jost, sans-serif');
	});
});
