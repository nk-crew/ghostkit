(()=>{var t=window,e=t.Motion.animate,n=t.GHOSTKIT.events;n.on(document,"click",".ghostkit-alert-hide-button",(function(t){t.preventDefault();var i=t.delegateTarget.parentNode;n.trigger(i,"close.alert.gkt"),e(i,{opacity:0},{duration:.5}).finished.then((function(){i.style.height="".concat(i.offsetHeight,"px"),i.style.paddingTop="0px",i.style.paddingBottom="0px",e(i,{height:0,marginTop:0,marginBottom:0},{duration:.5}).finished.then((function(){n.trigger(i,"closed.alert.gkt")}))}))}))})();