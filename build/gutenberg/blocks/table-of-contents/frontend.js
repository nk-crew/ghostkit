(()=>{"use strict";function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}var e={};function o(n){if(e[n])return e[n];var r={};if(Array.isArray(n)&&(r=[]),"object"===t(n))return Object.keys(n).forEach((function(t){r[o(t)]=o(n[t])})),r;if("string"==typeof(r=n))try{r=(r=decodeURIComponent(r)).replace(/_u002d__u002d_/gm,"--")}catch(t){console.warn(t)}return e[n]=r,r}var n=document.documentElement,r=window.GHOSTKIT.events;"scrollBehavior"in n.style&&"smooth"===getComputedStyle(n)["scroll-behavior"]||r.on(document,"click",".ghostkit-toc a",(function(t){t.preventDefault();var e=t.delegateTarget;if(e&&e.hash){var r=document.getElementById(o(e.hash).substring(1));if(r){var i=r.getBoundingClientRect().top,c=parseFloat(getComputedStyle(n)["scroll-padding-top"]);if(c)i-=c;else{var l=document.getElementById("wpadminbar");l&&"fixed"===getComputedStyle(l).position&&(i-=l.getBoundingClientRect().height)}i=Math.max(0,i),window.scrollTo({top:i,behavior:"smooth"})}}}))})();