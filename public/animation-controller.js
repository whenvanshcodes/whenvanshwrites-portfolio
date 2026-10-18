'use strict';
(function(){
const map=document.querySelector('.world-main'),svg=document.querySelector('.landscape'),pro=document.getElementById('professional');let visible=true;
function syncAmbient(){const asleep=paused||document.hidden||document.body.classList.contains('professional-mode')||!visible;if(document.body.classList.contains('ambient-sleep')!==asleep)document.body.classList.toggle('ambient-sleep',asleep);if(asleep)svg?.pauseAnimations?.();else svg?.unpauseAnimations?.();}
if('IntersectionObserver'in window&&map)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncAmbient();},{threshold:.05}).observe(map);
new MutationObserver(syncAmbient).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',syncAmbient);
const oldUpdateMotion=updateMotion;updateMotion=function(...args){oldUpdateMotion(...args);syncAmbient();};
if(!reducedMotion&&!paused&&'IntersectionObserver'in window){const reveal=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target);}},{root:pro,threshold:.06});pro.querySelectorAll('.pro-section,.pro-contact').forEach((section,i)=>{section.classList.add('reveal-ready');section.style.setProperty('--reveal-delay',(i%2)*50+'ms');reveal.observe(section);});}
syncAmbient();
})();
