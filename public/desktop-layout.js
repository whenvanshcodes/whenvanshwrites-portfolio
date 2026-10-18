'use strict';
// Fit the full illustration on desktop; keep the closer mobile driving camera.
const priorDesktopResize=resize;
resize=function(){if(window.innerWidth<=700){priorDesktopResize();return;}const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;view.fit=Math.min(w/1850,h/1320);renderView();};
const priorDesktopLeaveCar=leaveCar;
leaveCar=function(...args){priorDesktopLeaveCar(...args);if(window.innerWidth>700){view.x=0;view.y=0;view.zoom=1.05;resize();}};
window.addEventListener('resize',()=>resize());requestAnimationFrame(()=>resize());
