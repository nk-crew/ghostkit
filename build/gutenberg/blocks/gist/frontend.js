(()=>{var t=window,e=t.GHOSTKIT.events,i=t.gistSimple;e.on(document,"init.blocks.gkt",(function(){void 0!==i&&document.querySelectorAll(".ghostkit-gist:not(.ghostkit-gist-ready)").forEach((function(t){t.classList.add("ghostkit-gist-ready");var o=/^https:\/\/gist.github.com?.+\/(.+)/g.exec(t.getAttribute("data-url"));if(o&&void 0!==o[1]){var r={id:o[1],file:t.getAttribute("data-file"),caption:t.getAttribute("data-caption"),showFooter:"true"===t.getAttribute("data-show-footer"),showLineNumbers:"true"===t.getAttribute("data-show-line-numbers")};e.trigger(t,"prepare.gist.gkt",{options:r}),i(t,r),e.trigger(t,"prepared.gist.gkt",{options:r})}}))}))})();