import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('typography', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
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

		// Just wait 1 second for the selected font to be saved in the database after selection.
		await page.waitForTimeout(1000);

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

		const font = 'Source Serif 4';

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
			'https://fonts.googleapis.com/css?family=Inter%3A400%2C400i%2C700%2C700i%7CRaleway%3A400%2C400i%2C700%2C700i%7CSource+Serif+4%3A400%2C400i%2C700%2C700i&display=swap&ver=' +
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
			attributes: { content: 'Just a Title', anchor: 'just-a-title' },
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
		await expect(titleBlock).toHaveCSS(
			'font-family',
			'"Source Serif 4", sans-serif'
		);

		// Publish Post.
		await editor.publishPost();

		// Go to published post.
		const viewPageButton = page
			.locator('.components-button', {
				hasText: 'View Page',
			})
			.first();

		const viewPageHref = await viewPageButton.getAttribute('href');

		let frontendPage = page;

		if (viewPageHref) {
			await page.goto(viewPageHref);
			await page.waitForLoadState('domcontentloaded');
		} else {
			const popupPromise = page
				.waitForEvent('popup', { timeout: 3000 })
				.catch(() => null);

			await viewPageButton.click();

			const popupPage = await popupPromise;

			if (popupPage) {
				frontendPage = popupPage;
				await frontendPage.waitForLoadState('domcontentloaded');
			} else {
				await page.waitForLoadState('domcontentloaded');
			}
		}

		// Frontend.
		// Checking links to Google fonts
		await expect(
			frontendPage.locator('#ghostkit-fonts-google-css')
		).toHaveAttribute('href', googleFontsLinkPredefined);

		const paragraph = frontendPage.locator('.wp-block-post-content > p');

		const button = frontendPage.locator(
			'.wp-block-post-content .ghostkit-button-text'
		);

		const title = frontendPage.locator('#just-a-title');

		// Check visible blocks on editor.
		await expect(paragraph).toBeVisible();

		await expect(button).toBeVisible();

		await expect(title).toBeVisible();

		// Checking whether the configured font matches the blocks.
		await expect(paragraph).toHaveCSS('font-family', 'Inter, sans-serif');

		await expect(button).toHaveCSS('font-family', 'Raleway, sans-serif');

		// We have to check font with the "serif" in name and "4",
		// because it may not load as expected if we forget to add quotes in font-family.
		await expect(title).toHaveCSS(
			'font-family',
			'"Source Serif 4", sans-serif'
		);
	});
});
