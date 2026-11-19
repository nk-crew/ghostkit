import path from 'node:path';
import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import verifyLibrary from '../utils/swiper-library.cjs';

test('private Swiper preserves short loops, state and external styles', async ({
	page,
}) => {
	const result = await verifyLibrary(
		page,
		path.resolve(__dirname, '../../..'),
		'GhostKitSwiper',
		'ghostkit-swiper'
	);
	expect(result).toEqual({
		matrix: 10,
		modelPaths: 85,
		motion: 'pass',
		externalStyles: 'unchanged',
		logicalBullets: 'pass',
		inputState: 'pass',
		destruction: 'pass',
		replacement: 'pass',
	});
});
