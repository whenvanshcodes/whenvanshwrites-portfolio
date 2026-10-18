'use strict';
(function(root){
const START={x:565,y:455,angle:-.65};
const CURVES=[[[565,455],[635,390],[697,402],[773,443]],[[773,443],[864,470],[902,442],[955,438]],[[955,438],[1156,448],[1210,490],[1315,535]],[[1315,535],[1390,430],[1615,454],[1570,625]],[[1570,625],[1535,740],[1475,754],[1383,779]],[[1383,779],[1267,864],[1190,888],[1089,885]],[[1089,885],[964,883],[973,1005],[937,1077]],[[937,1077],[893,1159],[687,1156],[625,1053]],[[625,1053],[570,957],[538,900],[431,871]],[[431,871],[286,829],[222,710],[256,604]],[[256,604],[294,487],[441,424],[565,455]]];
const RIVER=[[[800,63],[670,174],[933,250],[824,358]],[[824,358],[716,499],[835,614],[835,614]],[[835,614],[726,768],[832,899],[832,899]]];
const destinations=[{id:'founder',name:'Founder’s desk',x:560,y:462},{id:'data',name:'Data greenhouse',x:1008,y:452},{id:'photo',name:'Camera cabin',x:1490,y:840},{id:'creator',name:'Creator studio',x:1120,y:868},{id:'game',name:'Rally garage',x:945,y:1054},{id:'book',name:'Book nook',x:432,y:864},{id:'writing',name:'whenvanshwrites',x:290,y:941},{id:'observatory',name:'Idea observatory',x:1325,y:404},{id:'workshop',name:'Skills workshop',x:660,y:363},{id:'best',name:'Best Work Village',x:955,y:438},{id:'resume',name:'Resume station',x:540,y:1000}];
const gates=[{name:'Greenhouse',x:1004,y:447},{name:'Camera cabin',x:1555,y:625},{name:'Creator studio',x:1139,y:881},{name:'Rally garage',x:915,y:1101},{name:'Book nook',x:313,y:802},{name:'Finish line',x:565,y:455}];
const cones=[{x:831,y:448},{x:1246,y:500},{x:1535,y:715},{x:1010,y:925},{x:718,y:1122},{x:264,y:660},{x:430,y:454}];
const stars=[{x:688,y:429},{x:1130,y:469},{x:1500,y:485},{x:1310,y:828},{x:1041,y:896},{x:929,y:1085},{x:652,y:1081},{x:532,y:919},{x:278,y:750},{x:341,y:493}];
const solids=[{x:250,y:1005,r:60},{x:1330,y:260,r:60},{x:650,y:265,r:60},{x:850,y:600,r:102},{x:1220,y:1050,r:60},{x:400,y:1090,r:60},{x:460,y:280,r:63},{x:1040,y:275,r:63},{x:480,y:690,r:38},{x:1090,y:650,r:63},{x:1450,y:960,r:63},{x:790,y:965,r:63},{x:480,y:675,r:63}];
function cubic(p,t){const a=(1-t)**3,b=3*(1-t)**2*t,c=3*(1-t)*t*t,d=t*t*t;return{x:p[0][0]*a+p[1][0]*b+p[2][0]*c+p[3][0]*d,y:p[0][1]*a+p[1][1]*b+p[2][1]*c+p[3][1]*d};}
const sample=curves=>curves.flatMap(p=>Array.from({length:27},(_,i)=>cubic(p,i/26)));
const GARDEN=[...CURVES.slice(0,5),[[1383,779],[1240,818],[1135,835],[1000,819]],[[1000,819],[800,795],[600,820],[431,871]],...CURVES.slice(9)];
const road=sample(CURVES),garden=sample(GARDEN),river=sample(RIVER);
function route(options={}){const short=options.course==='garden',reverse=options.reverse===true;let points=sample(short?GARDEN:CURVES);if(reverse)points=points.slice().reverse();const start={...START,angle:START.angle+(reverse?Math.PI:0)};let checkpoints=short?[gates[0],gates[1],{name:'Garden bridge',x:790,y:814},gates[4]]:gates.slice(0,-1);if(reverse)checkpoints=checkpoints.slice().reverse();return{points,start,gates:[...checkpoints,{name:'Finish line',x:start.x,y:start.y}],course:short?'garden':'village',reverse};}
function progress(s){const points=s.route?.points||road;let best=Infinity,index=0;points.forEach((p,i)=>{const d=(p.x-s.car.x)**2+(p.y-s.car.y)**2;if(d<best){best=d;index=i;}});return(s.lap-1)+index/(points.length-1);}
function pilot(s,pace=170){const points=s.route?.points||road;let nearest=0,best=Infinity;points.forEach((p,i)=>{const d=Math.hypot(p.x-s.car.x,p.y-s.car.y);if(d<best){best=d;nearest=i;}});const target=points[(nearest+8)%points.length],angle=Math.atan2(target.y-s.car.y,target.x-s.car.x),turn=Math.atan2(Math.sin(angle-s.car.angle),Math.cos(angle-s.car.angle));return{gas:s.car.speed<(Math.abs(turn)>.65?105:pace),brake:s.car.speed>pace+15,left:turn<-.07,right:turn>.07};}
function distanceTo(points,x,y){let best=Infinity;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy,t=l?Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/l)):0;const ex=x-a.x-t*dx,ey=y-a.y-t*dy;best=Math.min(best,ex*ex+ey*ey);}return Math.sqrt(best);}
function roadDistance(x,y){return Math.min(distanceTo(road,x,y),distanceTo(garden,x,y));}
function solidAt(x,y){if(x<130||x>1650||y<120||y>1170)return true;if(solids.some(b=>Math.hypot(x-b.x,y-b.y)<b.r+12))return true;return roadDistance(x,y)>60&&distanceTo(river,x,y)<37;}
function create(){return{car:{...START,speed:0,steer:0},mode:'explore',phase:'idle',countdown:3,elapsed:0,penalty:0,nextGate:0,totalStars:0,stars:new Set(),boost:100,hitCooldown:0,offroad:false,events:[],finishedTime:null,raceLimit:75,raceType:"timeTrial",lap:1,totalLaps:1,lapStartedAt:0,lapTimes:[],bestLap:null,coneBodies:cones.map((p,i)=>({...p,id:i,vx:0,vy:0,angle:0,spin:0,tipped:false,cooldown:0}))};}
function resetCar(s){s.car={...START,speed:0,steer:0};s.boost=100;s.hitCooldown=0;}
function recover(s){const g=s.mode==='race'&&s.nextGate>0?(s.route?.gates||gates)[s.nextGate-1]:(s.route?.start||START);const idx=road.reduce((best,p,i)=>Math.hypot(p.x-g.x,p.y-g.y)<Math.hypot(road[best].x-g.x,road[best].y-g.y)?i:best,0);const a=road[idx],b=road[(idx+(s.route?.reverse?-2:2)+road.length)%road.length];s.car={x:a.x,y:a.y,angle:Math.atan2(b.y-a.y,b.x-a.x),speed:0,steer:0};s.hitCooldown=1;s.boost=Math.max(s.boost,30);}
function startRace(s,options={}){Object.assign(s,create());s.raceLimit=[60,75,100].includes(options.limit)?options.limit:75;s.raceType=options.mode==='circuit'?'circuit':'timeTrial';s.totalLaps=s.raceType==='circuit'&&[1,3,5].includes(options.laps)?options.laps:1;s.route=route(options);s.car={...s.route.start,speed:0,steer:0};s.mode='race';s.phase='countdown';}
function nearestDestination(s){const d=destinations.map(d=>({...d,distance:Math.hypot(d.x-s.car.x,d.y-s.car.y)})).sort((a,b)=>a.distance-b.distance)[0];return d.distance<145?d:null;}
function step(s,dt,input={}){
 dt=Math.max(0,Math.min(.05,dt));s.events=[];
 if(s.phase==='finished')return s.events;
 if(s.phase==='countdown'){s.countdown-=dt;if(s.countdown<=0){s.phase='racing';s.events.push({type:'go'});}return s.events;}
 const c=s.car,previousX=c.x,previousY=c.y;s.hitCooldown=Math.max(0,s.hitCooldown-dt);s.offroad=roadDistance(c.x,c.y)>60;
 const boosting=!!input.boost&&s.boost>0&&input.gas;
 let maxSpeed=boosting?315:225;
 // Opposite pedal brakes first; holding it then engages reverse / forward.
 if(input.gas)c.speed+=(c.speed<0?310:175)*dt;
 if(input.reverse)c.speed-=(c.speed>0?310:125)*dt;
 if(!input.gas&&!input.reverse)c.speed*=Math.exp(-1.15*dt);
 if(input.brake)c.speed*=Math.exp(-7.5*dt);
 c.speed=Math.max(-80,Math.min(maxSpeed,c.speed));if(Math.abs(c.speed)<.5)c.speed=0;
 s.boost=Math.max(0,Math.min(100,s.boost+(boosting?-38:18)*dt));
 const steering=(input.right?1:0)-(input.left?1:0);
 c.steer=(c.steer||0)+(steering-(c.steer||0))*(1-Math.exp(-9*dt));
 const drifting=!!input.drift&&Math.abs(c.speed)>65&&Math.abs(c.steer)>.15;c.drifting=drifting;const grip=drifting?1.25:1;
 c.angle+=c.steer*(2.25-Math.min(1,Math.abs(c.speed)/330)*.65)*dt*Math.min(1,Math.abs(c.speed)/38)*(c.speed<0?-1:1)*grip;
 const velocityAngle=c.velocityAngle??c.angle;const delta=Math.atan2(Math.sin(c.angle-velocityAngle),Math.cos(c.angle-velocityAngle));c.velocityAngle=velocityAngle+delta*(1-Math.exp(-(drifting?2.1:input.brake?4:s.offroad?6:13)*dt));
 const nx=c.x+Math.cos(c.velocityAngle)*c.speed*dt,ny=c.y+Math.sin(c.velocityAngle)*c.speed*dt;
 if(solidAt(nx,ny)){if(!solidAt(nx,c.y))c.x=nx;else if(!solidAt(c.x,ny))c.y=ny;c.speed*=Math.exp(-1.5*dt);if(!s.hitCooldown){s.events.push({type:'bump'});s.hitCooldown=.8;}}
 else{c.x=nx;c.y=ny;}
 // Lightweight props receive the impact; the vehicle keeps its forward momentum.
 for(const cone of s.coneBodies){cone.cooldown=Math.max(0,cone.cooldown-dt);const coneX=cone.x+cone.vx*dt,coneY=cone.y+cone.vy*dt;if(solidAt(coneX,coneY)){cone.vx*=-.35;cone.vy*=-.35;cone.spin*=.7;}else{cone.x=coneX;cone.y=coneY;}cone.angle+=cone.spin*dt;const damping=Math.exp(-2.8*dt);cone.vx*=damping;cone.vy*=damping;cone.spin*=Math.exp(-2.3*dt);if(Math.hypot(c.x-cone.x,c.y-cone.y)<27&&!cone.cooldown&&Math.abs(c.speed)>8){const direction=c.velocityAngle+(c.speed<0?Math.PI:0),impact=Math.min(290,Math.abs(c.speed)*1.25+30);cone.vx+=Math.cos(direction)*impact;cone.vy+=Math.sin(direction)*impact;cone.spin+=(cone.id%2?1:-1)*(4+impact/35);cone.tipped=true;cone.cooldown=.35;c.speed*=.985;s.events.push({type:'cone',index:cone.id});}}
 if(s.phase==='racing'){
  s.elapsed+=dt;
  stars.forEach((p,i)=>{if(!s.stars.has(i)&&Math.hypot(c.x-p.x,c.y-p.y)<35){s.stars.add(i);s.totalStars++;s.boost=Math.min(100,s.boost+12);s.events.push({type:'star',index:i});}});
  const checkpoints=s.route?.gates||gates,start=s.route?.start||START,g=checkpoints[s.nextGate],forwardX=Math.cos(start.angle),forwardY=Math.sin(start.angle),before=(previousX-start.x)*forwardX+(previousY-start.y)*forwardY,after=(c.x-start.x)*forwardX+(c.y-start.y)*forwardY,lateral=Math.abs((c.x-start.x)*-forwardY+(c.y-start.y)*forwardX);
  const reached=g&&(s.nextGate===checkpoints.length-1?before<0&&after>=0&&lateral<70:Math.hypot(c.x-g.x,c.y-g.y)<80);
  if(reached){s.events.push({type:'gate',index:s.nextGate});s.nextGate++;if(s.nextGate===checkpoints.length){const lapTime=s.elapsed-s.lapStartedAt;s.lapTimes.push(lapTime);s.bestLap=Math.min(...s.lapTimes);s.events.push({type:'lap',lap:s.lap,time:lapTime});if(s.lap<s.totalLaps){s.lap++;s.lapStartedAt=s.elapsed;s.nextGate=0;s.stars.clear();s.boost=Math.min(100,s.boost+30);}else{s.phase='finished';s.finishedTime=s.elapsed;s.events.push({type:'finish',won:true});}}}
  if(s.raceType==='timeTrial'&&s.phase!=='finished'&&s.elapsed>=s.raceLimit){s.phase='finished';s.finishedTime=s.raceLimit;s.events.push({type:'finish',won:false});}

 }
 return s.events;
}
root.LabRally={create,step,startRace,resetCar,recover,nearestDestination,roadDistance,solidAt,destinations,gates,cones,stars,START,CURVES,GARDEN,route,progress,pilot};
})(globalThis);
