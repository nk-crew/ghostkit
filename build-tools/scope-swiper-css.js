const selectorParser = require('postcss-selector-parser');

module.exports = (scopeClass) => ({
	postcssPlugin: 'scope-swiper',
	Once(root) {
		const scope = `.${scopeClass}`;
		const guard = selectorParser().astSync(
			`:not(:where(${scope} .swiper:not(${scope}), ${scope} .swiper:not(${scope}) *, ${scope} .swiper-container:not(${scope}), ${scope} .swiper-container:not(${scope}) *))`
		).first.first;
		root.walkRules((rule) => {
			if (
				rule.parent.type === 'atrule' &&
				/keyframes$/.test(rule.parent.name)
			)
				return;
			const selectors = [];
			selectorParser((parsed) => {
				parsed.each((selector) => {
					if (
						selector.toString().trim() === ':root' ||
						selector.toString().trim() === ':host'
					) {
						selectors.push(scope);
						return;
					}
					for (const descendant of [false, true]) {
						const scoped = selector.clone();
						if (descendant)
							scoped.prepend(
								selectorParser.combinator({ value: ' ' })
							);
						scoped.prepend(
							selectorParser()
								.astSync(`:where(.${scopeClass})`)
								.first.first.clone()
						);
						const pseudo = scoped.nodes.find(
							(node) =>
								node.type === 'pseudo' &&
								(node.value.startsWith('::') ||
									[':before', ':after'].includes(node.value))
						);
						if (pseudo) scoped.insertBefore(pseudo, guard.clone());
						else scoped.append(guard.clone());
						selectors.push(scoped.toString());
					}
				});
			}).processSync(rule.selector);
			rule.selectors = selectors;
		});
		root.walkAtRules(/keyframes$/, (rule) => {
			const oldName = rule.params;
			const newName = `${scopeClass}-${oldName}`;
			rule.params = newName;
			root.walkDecls(/^animation(?:-name)?$/, (decl) => {
				decl.value = decl.value.split(oldName).join(newName);
			});
		});
	},
});
