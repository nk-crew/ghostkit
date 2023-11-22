(()=>{"use strict";function t(o){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(o)}var o={};function n(i){if(o[i])return o[i];var e={};if(Array.isArray(i)&&(e=[]),"object"===t(i))return Object.keys(i).forEach((function(t){e[n(t)]=n(i[t])})),e;if("string"==typeof(e=i))try{e=(e=decodeURIComponent(e)).replace(/_u002d__u002d_/gm,"--")}catch(t){console.warn(t)}return o[i]=e,e}function i(t,o){(null==o||o>t.length)&&(o=t.length);for(var n=0,i=new Array(o);n<o;n++)i[n]=t[n];return i}var e=window,r=e.location,c=e.GHOSTKIT,a=e.Motion.animate,d=e.requestAnimationFrame,s=c.events,l=r.hash;function g(t){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],e=t.closest(".ghostkit-accordion"),r=t.closest(".ghostkit-accordion-item"),c=r.classList.contains("ghostkit-accordion-item-active"),l=!n&&e.classList.contains("ghostkit-accordion-collapse-one");null!=r&&r.gktAccordion||(r.gktAccordion={animation:null}),r.gktAccordion.animation&&r.gktAccordion.animation.stop(),d((function(){var t,n;c?(s.trigger(e,"hide.accordion.gkt",{relatedTarget:r}),function(t,o,n){var i=t.querySelector(".ghostkit-accordion-item-content"),e=getComputedStyle(i),r=e.paddingTop,c=e.paddingBottom,d=e.height;i.style.display="block",i.style.overflow="hidden";var s=a(i,{height:[d,"0px"],paddingTop:[r,"0px"],paddingBottom:[c,"0px"]},{duration:o/1e3,easing:"ease-out"});s.finished.then((function(){i.style.display="",i.style.overflow="",i.style.height="",i.style.paddingTop="",i.style.paddingBottom="",t.gktAccordion.animation=null,n()})),t.gktAccordion.animation=s,t.classList.remove("ghostkit-accordion-item-active")}(r,o,(function(){s.trigger(e,"hidden.accordion.gkt",{relatedTarget:r})}))):(s.trigger(e,"show.accordion.gkt",{relatedTarget:r}),function(t,o,n){var i=t.querySelector(".ghostkit-accordion-item-content");t.classList.add("ghostkit-accordion-item-active");var e=getComputedStyle(i),r=e.height,c=e.paddingTop,d=e.paddingBottom;i.style.display="block",i.style.overflow="hidden";var s=a(i,{height:["0px",r],paddingTop:["0px",c],paddingBottom:["0px",d]},{duration:o/1e3,easing:"ease-out"});s.finished.then((function(){i.style.display="",i.style.overflow="",i.style.height="",i.style.paddingTop="",i.style.paddingBottom="",t.gktAccordion.animation=null,n()})),t.gktAccordion.animation=s}(r,o,(function(){s.trigger(e,"shown.accordion.gkt",{relatedTarget:r})}))),l&&!c&&(t=r,(n=t.parentNode.children,function(t){if(Array.isArray(t))return i(t)}(n)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(n)||function(t,o){if(t){if("string"==typeof t)return i(t,o);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(t,o):void 0}}(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).filter((function(o){return o!==t}))).forEach((function(t){t.classList.contains("ghostkit-accordion-item-active")&&g(t,o,!0)}))}))}s.on(document,"init.blocks.gkt",(function(){document.querySelectorAll(".ghostkit-accordion:not(.ghostkit-accordion-ready)").forEach((function(t){if(t.classList.add("ghostkit-accordion-ready"),s.trigger(t,"prepare.accordion.gkt"),l){var o=n(l),i=t.querySelector(':scope > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > [href="'.concat(o,'"]'));i&&g(i,0)}s.trigger(t,"prepared.accordion.gkt")}))})),s.on(document,"click",".ghostkit-accordion-item .ghostkit-accordion-item-heading",(function(t){t.preventDefault(),g(t.delegateTarget,300)})),s.on(window,"hashchange",(function(){if(window.location.hash!==l&&(l=window.location.hash)){var t=n(l);document.querySelectorAll('.ghostkit-accordion-ready > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > [href="'.concat(t,'"]')).forEach((function(t){g(t,300)}))}}))})();