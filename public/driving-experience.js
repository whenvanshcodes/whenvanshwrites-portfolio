'use strict';
// Preserve the visitor's place in the portfolio while the road gets the screen.
let drivingReturn=null;
const viewportDrivingResize=resize;
resize=function(){
 viewportDrivingResize();
 if(driving&&view.fit>0){
  // A consistent world scale keeps the car readable on wide and short screens.
  view.zoom=(innerWidth<=700?.68:.78)/view.fit;
  focusCar();
 }
};
const viewportBeginDriving=beginDriving;
beginDriving=function(...args){
 if(!driving){drivingReturn={scroll:window.scrollY,x:view.x,y:view.y,zoom:view.zoom,trigger:document.activeElement};}
 document.documentElement.classList.add('driving-session');
 viewportBeginDriving(...args);
 viewport.focus({preventScroll:true});
};
const viewportLeaveCar=leaveCar;
leaveCar=function(...args){
 const returning=drivingReturn;
 viewportLeaveCar(...args);
 document.documentElement.classList.remove('driving-session');
 if(returning){
  drivingReturn=null;
  view.x=returning.x;view.y=returning.y;view.zoom=returning.zoom;resize();
  const trigger=returning.trigger;
  if(trigger?.isConnected&&trigger.getClientRects().length)trigger.focus({preventScroll:true});
  else document.getElementById('start-driving').focus({preventScroll:true});
  window.scrollTo({top:returning.scroll,behavior:'instant'});
 }
};
window.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&driving&&!dialog.open&&!/INPUT|SELECT|TEXTAREA/.test(event.target?.tagName)){
  event.preventDefault();leaveCar();
 }
});
const driveInvitation=document.getElementById('start-driving');
driveInvitation.textContent='Drive the village ↗';
driveInvitation.setAttribute('aria-label','Enter full-screen village driving');
document.getElementById('stop-driving').textContent='← Portfolio';
document.getElementById('stop-driving').setAttribute('aria-label','Leave driving and return to the portfolio');
document.getElementById('viewport').setAttribute('aria-description','Explore the village. While driving, use W or Arrow Up to accelerate, A and D or Left and Right to steer. Escape returns to the portfolio.');
