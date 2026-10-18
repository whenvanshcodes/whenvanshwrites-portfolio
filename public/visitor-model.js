'use strict';
(function(root){
const slots=['16:00','17:00','18:00','19:00','20:00','21:00'];
const seed=()=>[{name:'Sample guest A',slot:'16:00',visits:2},{name:'Sample guest B',slot:'17:00',visits:1},{name:'Sample guest C',slot:'18:00',visits:3}];
function book(rows,name,slot){name=typeof name==='string'?name.trim().slice(0,30):'';if(!name||!slots.includes(slot)||rows.some(b=>b.slot===slot))return null;const previous=rows.filter(b=>b.name.toLowerCase()===name.toLowerCase());return[...rows,{name,slot,visits:previous.length?Math.max(...previous.map(b=>b.visits))+1:1}];}
function metrics(rows){const count=new Set(rows.map(b=>b.slot)).size;return{booked:count,utilization:Math.round(count/slots.length*100),customers:new Set(rows.map(b=>b.name.toLowerCase())).size};}
root.VisitorDemo={slots,seed,book,metrics};
})(globalThis);
