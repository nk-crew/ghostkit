import { useDispatch, useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

// One row of the picker grid.
export const RECENT_ICONS_LIMIT = 6;

const SCOPE = 'ghostkit';
const NAME = 'recentIcons';

/**
 * Recently picked icons of the current user, newest first.
 * Core persists `core/preferences` in the user's `persisted_preferences` meta.
 *
 * @return {Object} `{ recent, addRecent }`, recent is a list of `<pack>:<fallback or keys>` ids.
 */
export function useRecentIcons() {
	const recent = useSelect(
		(select) => select(preferencesStore).get(SCOPE, NAME),
		[]
	);
	const { set } = useDispatch(preferencesStore);

	const list = Array.isArray(recent) ? recent : [];

	function addRecent(id) {
		set(
			SCOPE,
			NAME,
			[id, ...list.filter((item) => item !== id)].slice(
				0,
				RECENT_ICONS_LIMIT
			)
		);
	}

	return { recent: list, addRecent };
}
