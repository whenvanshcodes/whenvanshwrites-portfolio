const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
// Exercise the session boundary without a renderer: entry, resize, race restart,
// closing a project, and exit must not lose the visitor's portfolio position.
const nodes=new Map();
function node(){return {textContent:'',setAttribute(){},getClientRects(){return [1]},isConnected:true,focus(opts){this.focusOptions=opts}}}
const classes=new Set(),listeners={};
const context={innerWidth:390,driving:false,view:{x:17,y:29,zoom:1.05,fit:.33},dialog:{open:false},viewport:node(),focusCar(){this.cameraUpdates=(this.cameraUpdates||0)+1},resize(){},beginDriving(){context.driving=true;context.window.scrollTo({top:0});context.resize()},leaveCar(){context.driving=false;context.view.zoom=1.05;context.resize()},document:{activeElement:node(),documentElement:{classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}},getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)}},window:{scrollY:820,scrollTo({top}){this.scrollY=top},addEventListener(type,fn){listeners[type]=fn}}};
vm.createContext(context);vm.runInContext(readFileSync('public/driving-experience.js','utf8'),context);
context.beginDriving();assert(context.driving);assert(classes.has('driving-session'));assert.equal(context.window.scrollY,0);assert(Math.abs(context.view.fit*context.view.zoom-.68)<1e-9);
context.view.fit=.19;context.resize();assert(Math.abs(context.view.fit*context.view.zoom-.68)<1e-9);
context.beginDriving(); // restarting a race must not overwrite the return location
context.dialog.open=true;listeners.keydown({key:'Escape',target:{tagName:'BUTTON'}});assert(context.driving);
context.dialog.open=false;let prevented=false;listeners.keydown({key:'Escape',target:{tagName:'BUTTON'},preventDefault(){prevented=true}});
assert(prevented);assert(!context.driving);assert(!classes.has('driving-session'));assert.equal(context.window.scrollY,820);assert.equal(context.view.x,17);assert.equal(context.view.y,29);assert.equal(context.view.zoom,1.05);assert.equal(context.document.activeElement.focusOptions.preventScroll,true);
context.innerWidth=1440;context.beginDriving();assert(Math.abs(context.view.fit*context.view.zoom-.78)<1e-9);context.leaveCar();
console.log('PASS driving entry, stable camera scale, race restart, modal Escape, portfolio scroll/camera restoration and desktop scale');
