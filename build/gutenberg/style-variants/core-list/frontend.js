(()=>{var t=window.GHOSTKIT.events;t.on(document,"init.blocks.gkt",(function(){document.querySelectorAll(".is-style-styled:not(.is-style-styled-ready)").forEach((function(e){var s=parseInt(e.getAttribute("start"),10),r=null!==e.getAttribute("reversed"),n=e.children.length;e.classList.add("is-style-styled-ready"),r?e.style.counterReset="li ".concat((s||n)+1):s&&(e.style.counterReset="li ".concat(s-1)),t.trigger(e,"prepare.numberedList.gkt")}))}))})();