(()=>{var t=window.GHOSTKIT.events,e=!1,o=!1,i="",a=!1,n=0,r=0;function c(){if(e&&o){var a,c=o.getBoundingClientRect();a="vertical"===i?Math.max(0,Math.min(1,(r-c.top)/c.height)):Math.max(0,Math.min(1,(n-c.left)/c.width));var s=Math.round(1e4*a)/100;e.style.setProperty("--gkt-image-compare__position","".concat(s,"%")),t.trigger(e,"move.imageCompare.gkt",{originalEvent:{clientX:n,clientY:r}})}}function s(t){e=t,o=t.querySelector(".ghostkit-image-compare-images"),i=t.classList.contains("ghostkit-image-compare-vertical")?"vertical":"horizontal"}function g(){c(),e.style.removeProperty("--gkt-image-compare__transition-duration"),e=!1,o=!1,a=!1}t.on(document,"mousedown touchstart",".ghostkit-image-compare:not(.ghostkit-image-compare-trigger-hover)",(function(t){t.targetTouches&&!t.target.classList.contains("ghostkit-image-compare-images-divider")||(t.targetTouches||t.preventDefault(),s(t.delegateTarget))})),t.on(document,"mouseover touchstart",".ghostkit-image-compare-trigger-hover",(function(t){e||t.targetTouches&&!t.target.classList.contains("ghostkit-image-compare-images-divider")||(t.targetTouches||t.preventDefault(),s(t.delegateTarget))})),t.on(document,"mouseout touchend",".ghostkit-image-compare-trigger-hover",(function(t){e&&(t.targetTouches||(n=t.clientX,r=t.clientY),g())})),t.on(document,"mouseup touchend",(function(t){e&&(t.targetTouches||(n=t.clientX,r=t.clientY),g())})),t.on(document,"mousemove touchmove",(function(t){var o,i;e&&(t.targetTouches||t.preventDefault(),n=(null===(o=t.targetTouches)||void 0===o?void 0:o[0].clientX)||t.clientX,r=(null===(i=t.targetTouches)||void 0===i?void 0:i[0].clientY)||t.clientY,a||(e.style.setProperty("--gkt-image-compare__transition-duration","0s"),a=!0),c())})),window.addEventListener("touchstart",(function(t){e&&t.target.classList.contains("ghostkit-image-compare-images-divider")&&t.preventDefault()}),{passive:!1})})();