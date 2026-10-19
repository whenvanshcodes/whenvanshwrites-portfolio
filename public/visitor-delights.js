'use strict';
(()=>{
const bookUrl='https://www.amazon.in/Mannat-Ka-Dhaga-Adhoori-Mohabbat-ebook/dp/B0GCHWSR8L';
const links='<button data-delight="tour">Give me 60 seconds ↗</button><button data-delight="postcard">My visitor postcard ↗</button><button data-delight="passport">Village passport ✳</button>';
for(const parent of[document.querySelector('.world-caption'),document.querySelector('.pro-actions')]){const nav=document.createElement('nav');nav.className='delight-links';nav.setAttribute('aria-label','Explore and remember the portfolio');nav.innerHTML=links;parent?.appendChild(nav);}
document.addEventListener('click',e=>{const action=e.target.closest('[data-delight]')?.dataset.delight;if(action==='tour')startTour();if(action==='postcard')postcard();if(action==='passport')passport();});
let tour=null,tourTick=0;const stops=[{title:'A product built around real operations.',label:'01 / SIGNAL TO SATURDAY',body:'A CRM for offline gaming parlours, built end to end with React, Python and MongoDB. Used by 6–20 venues to connect bookings, customers and analytics.',proof:'Observed improvements: slot utilization and bookings. Evidence includes CRM records, before-and-after data and owner feedback.',id:'signal',x:850,y:600},{title:'Make the repetitive work smaller.',label:'02 / STARTUP SYSTEMS',body:'I found repetitive manual steps, designed workflows, built structured trackers and dashboards, and helped put working systems into use.',proof:'Anonymized work across operations and billing. Faster processes, fewer missed items and clearer decisions; no invented metrics.',id:'operations',x:460,y:280},{title:'There is a storyteller here, too.',label:'03 / MANNAT KA DHAGA',body:'Alongside products and systems, I write fiction. My published book is another part of how I turn an idea into something people can experience.',proof:'Mannat Ka Dhaga · @whenvanshwrites',id:'book',x:480,y:675}];
function stopTour(){const wasTour=!!tour;clearInterval(tourTick);tourTick=0;tour=null;if(wasTour&&window.innerWidth>700&&!driving){view.x=0;view.y=0;view.zoom=1.05;resize();}}
function focusStop(s){if(portfolioMode!=='fun'||reducedMotion||paused)return;view.zoom=1.35;const scale=view.fit*view.zoom;view.x=(850-s.x)*scale;view.y=(600-s.y)*scale;renderView();}
function startTour(){if(driving)leaveCar();stopTour();tour={index:0,left:20,paused:false};renderTour();tourTick=setInterval(()=>{if(!tour||document.hidden||tour.paused||!dialog.open)return;if(--tour.left<=0){if(tour.index<2){tour.index++;tour.left=20;renderTour();}else{stopTour();tourEnd();return;}}const timer=document.getElementById('tour-clock');if(timer)timer.textContent=tour.left+'s at this stop';},1000);}
function renderTour(){const s=stops[tour.index];visited.add(['best','founder','book'][tour.index]);updateDiscovery();focusStop(s);showDialog('A MINUTE IN VANSH’S WORLD',`<section class="modal-body tour-stop"><p class="eyebrow">${s.label}</p><div class="tour-dots" aria-label="Stop ${tour.index+1} of 3">${stops.map((_,i)=>'<span class="'+(i===tour.index?'active':'')+'"></span>').join('')}</div><h2 id="modal-title">${s.title}</h2><p class="modal-intro">${s.body}</p><p class="tour-proof">${s.proof}</p><p id="tour-clock" role="timer">${tour.left}s at this stop</p><div class="tool-row"><button id="tour-pause" class="back-room">${tour.paused?'Resume':'Pause'} tour</button><button id="tour-next" class="modal-link">${tour.index===2?'Finish the tour':'Next stop'} ↗</button><button id="tour-deeper" class="back-room">${s.id==='book'?'Visit the book nook':'Read the full case study'}</button></div><button id="tour-exit" class="back-room">Explore at my own pace</button></section>`);document.getElementById('tour-pause').onclick=e=>{tour.paused=!tour.paused;e.target.textContent=tour.paused?'Resume tour':'Pause tour';};document.getElementById('tour-next').onclick=()=>{if(tour.index<2){tour.index++;tour.left=20;renderTour();}else{stopTour();tourEnd();}};document.getElementById('tour-deeper').onclick=()=>{stopTour();s.id==='book'?openRoom('book'):openProject(s.id);};document.getElementById('tour-exit').onclick=()=>{stopTour();dialog.close();};}
function tourEnd(){showDialog('THREE STOPS. ONE CURIOUS OPERATOR.',`<section class="modal-body"><h2 id="modal-title">Data. Business. Execution.<br/>And a little storytelling.</h2><p class="modal-intro">That is the thread through my work. Where shall we go next?</p><div class="tool-row"><button class="modal-link" id="tour-contact">Talk to Vansh ↗</button><button class="back-room" data-delight="postcard">Take a postcard</button><button class="back-room" id="tour-work">Explore all work ↗</button></div></section>`);document.getElementById('tour-contact').onclick=()=>openContact();document.getElementById('tour-work').onclick=()=>openBestWork();}
dialog.addEventListener('close',stopTour);
// Pause the tour if another destination replaces its content.
const priorDialog=showDialog;showDialog=function(label,...args){if(tour&&label!=='A MINUTE IN VANSH’S WORLD')stopTour();priorDialog(label,...args);};
function passport(){showDialog('YOUR VILLAGE PASSPORT',`<section class="modal-body"><p class="eyebrow">${visited.size} / 11 PLACES · SAVED ON THIS DEVICE</p><h2 id="modal-title">Every door has a story.</h2><div class="visit-stamps">${designStops.map(([id,name])=>`<button data-stamp="${id}" class="${visited.has(id)?'stamped':''}"><b>${visited.has(id)?'✳':'○'}</b><span>${escapeHtml(name)}</span><small>${visited.has(id)?'VISITED':'OPEN THIS PLACE'}</small></button>`).join('')}</div><p>${visited.size>=3?'Botanical postcard unlocked. Thanks for wandering.':'Visit three places to unlock a botanical postcard design.'} Every project is open from the start.</p><button class="modal-link" data-delight="postcard">Make my postcard ↗</button></section>`);content.querySelectorAll('[data-stamp]').forEach(b=>b.onclick=()=>openRoom(b.dataset.stamp));}

const shareIdentity={name:'Vansh Bhati',handle:'@whenvanshwrites',url:'https://whenvanshcodes.is-a.dev/',label:'whenvanshcodes.is-a.dev'};
function shareFooter(c,width,y){
  c.save();
  c.fillStyle='#eef4fb';
  if(c.roundRect){
    c.beginPath();c.roundRect(40,y,width-80,90,12);c.fill();
    c.strokeStyle='#cbdcf0';c.lineWidth=1;c.stroke();
  }else{
    c.fillRect(40,y,width-80,90);
  }
  c.fillStyle='#102237';c.font='600 22px "Space Grotesk", sans-serif';
  c.fillText(shareIdentity.name,60,y+36);
  const nameWidth=c.measureText(shareIdentity.name).width;
  c.fillStyle='#64748b';c.font='400 18px "DM Mono", monospace';
  c.fillText(' · '+shareIdentity.handle,60+nameWidth,y+36);
  c.fillStyle='#1d4ed8';c.font='500 19px "DM Mono", monospace';
  c.fillText(shareIdentity.label,60,y+68);
  c.restore();
}
// Preserve paragraph breaks, poetry line breaks and wrap long words without splitting Hindi conjuncts or losing characters.
function writingLines(c,text,width){
  const result=[];
  for(const paragraph of String(text||'').replace(/\r\n?/g,'\n').split('\n')){
    if(!paragraph.trim()){result.push('');continue;}
    let line='';
    for(const word of paragraph.trim().split(/\s+/)){
      if(!word)continue;
      if(line&&c.measureText(line+' '+word).width<=width){line+=' '+word;continue;}
      if(line){result.push(line);line='';}
      if(c.measureText(word).width<=width){line=word;continue;}
      const chars=typeof Intl!=='undefined'&&Intl.Segmenter?Array.from(new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(word),s=>s.segment):Array.from(word);
      for(const char of chars){
        if(line&&c.measureText(line+char).width>width){result.push(line);line='';}
        line+=char;
      }
    }
    if(line)result.push(line);
  }
  return result;
}
function getWritingTypography(count){
  if(count<=14) return {size:30,lineHeight:52,font:"30px 'DM Sans', 'Space Grotesk', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"};
  if(count<=26) return {size:25,lineHeight:42,font:"25px 'DM Sans', 'Space Grotesk', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"};
  if(count<=38) return {size:22,lineHeight:36,font:"22px 'DM Sans', 'Space Grotesk', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"};
  return {size:19,lineHeight:30,font:"19px 'DM Sans', 'Space Grotesk', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"};
}
async function makeWritingCard(entry){
  await document.fonts?.ready;
  const canvas=document.createElement('canvas');canvas.width=1080;
  const c=canvas.getContext('2d');
  c.font="25px 'DM Sans', 'Space Grotesk', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif";
  const prelimLines=writingLines(c,entry.excerpt,900);
  const typo=getWritingTypography(prelimLines.length);
  c.font=typo.font;
  const body=writingLines(c,entry.excerpt,900);
  c.font="600 36px 'Space Grotesk', 'DM Sans', sans-serif";
  const title=writingLines(c,entry.title,entry.page?740:900);
  const titleHeight=title.length*44,bodyY=230+titleHeight;
  const bodyHeight=body.length*typo.lineHeight;
  canvas.height=Math.max(1080,bodyY+bodyHeight+200);
  c.fillStyle='#f4f7fb';c.fillRect(0,0,canvas.width,canvas.height);
  c.strokeStyle='#b9cce6';c.lineWidth=2;
  c.strokeRect(40,40,1000,canvas.height-80);
  c.fillStyle='#1d4ed8';c.fillRect(90,90,48,4);
  c.font="600 18px 'DM Mono', monospace";c.fillText('WHENVANSHWRITES / FROM THE WRITING HUT',90,140);
  if(entry.page){
    c.fillStyle='#64748b';c.font="500 16px 'DM Mono', monospace";c.textAlign='right';
    c.fillText('CARD '+entry.page.current+' OF '+entry.page.total,990,140);
    c.textAlign='left';
  }
  c.fillStyle='#102237';c.font="600 36px 'Space Grotesk', 'DM Sans', sans-serif";
  title.forEach((line,i)=>c.fillText(line,90,195+i*44));
  c.strokeStyle='#e2e8f0';c.lineWidth=1.5;c.beginPath();c.moveTo(90,bodyY-30);c.lineTo(990,bodyY-30);c.stroke();
  c.fillStyle='#1e293b';c.font=typo.font;
  body.forEach((line,i)=>c.fillText(line,90,bodyY+i*typo.lineHeight));
  shareFooter(c,1080,canvas.height-150);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw Error('Writing card export failed');
  return blob;
}

let cardBlob=null,cardUrl=null;function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function shareImage(blob,name,text,status){try{const file=new File([blob],name,{type:'image/png'});if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'A little world by Vansh',text});else{download(blob,name);status.textContent='Image downloaded. Share it wherever you like.';}}catch(e){if(e.name!=='AbortError')status.textContent='Sharing is unavailable. Use Download instead.';}}
function lines(ctx,text,x,y,width,lineHeight,maxLines=5){const words=text.split(/\s+/);let line='',count=0;for(const word of words){if(ctx.measureText(line+word).width>width&&line){ctx.fillText(line.trim(),x,y);y+=lineHeight;count++;line='';if(count>=maxLines-1){line=word+' '+words.slice(words.indexOf(word)+1).join(' ');break;}}line+=word+' ';}if(line){while(ctx.measureText(line).width>width&&line.length>3)line=line.slice(0,-4)+'…';ctx.fillText(line.trim(),x,y);}return y+lineHeight;}
async function makePostcard(name,botanical,includeLap){await document.fonts?.ready;const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1080;const c=canvas.getContext('2d');c.fillStyle=botanical?'#e1ebfa':'#f4f7fb';c.fillRect(0,0,1200,1080);c.fillStyle='#102237';c.font='20px monospace';c.fillText('A LITTLE WORLD. A REAL VISIT.',60,65);c.font='500 50px Space Grotesk, sans-serif';lines(c,(name||'A curious visitor')+' visited Vansh’s world.',60,132,1080,58,2);const svg=document.querySelector('#world-art svg').cloneNode(true);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}),url=URL.createObjectURL(blob);try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});c.drawImage(img,120,240,960,610);}finally{URL.revokeObjectURL(url);}let paint='#ca805e';try{const p=JSON.parse(localStorage.getItem('vansh-garage')||'{}');if(/^#[0-9a-f]{6}$/i.test(p.paint))paint=p.paint;}catch{}c.fillStyle=paint;c.beginPath();c.roundRect(1040,80,60,110,17);c.fill();c.fillStyle='#d4e1d2';c.fillRect(1050,103,40,25);c.fillStyle='#102237';c.font='24px Space Grotesk, sans-serif';c.fillText(visited.size+' places explored · '+discoveryBadges.size+' little discoveries',60,880);if(includeLap&&rallyBest?.time)c.fillText('My saved race: '+rallyBest.time.toFixed(2)+'s',60,920);shareFooter(c,1200,960);return new Promise(resolve=>canvas.toBlob(resolve,'image/png'));}
function postcard(){showDialog('A SOUVENIR FROM THE VILLAGE',`<section class="modal-body"><p class="eyebrow">PERSONALISED ON YOUR DEVICE · NOTHING POSTED</p><h2 id="modal-title">You were here.</h2><form id="postcard-form" class="delight-form"><label>Name or nickname<input name="visitor" maxlength="30" placeholder="A curious visitor" autocomplete="given-name"></label><label>Postcard design<select name="design"><option value="paper">Warm paper</option><option value="botanical" ${visited.size>=3?'':'disabled'}>Botanical · visit 3 places</option></select></label>${rallyBest?.time?'<label class="check-row"><input name="lap" type="checkbox"> Include my saved race time</label>':''}<button class="modal-link" type="submit">Create my postcard ↗</button></form><p id="postcard-status" role="status"></p><img id="postcard-preview" alt="Your personalised postcard from Vansh’s village" hidden><div id="postcard-actions" class="tool-row" hidden><button id="postcard-download" class="modal-link">Download PNG ↓</button><button id="postcard-share" class="back-room">Share by choice ↗</button></div></section>`);const form=document.getElementById('postcard-form');form.onsubmit=async e=>{e.preventDefault();const status=document.getElementById('postcard-status'),button=form.querySelector('button');button.disabled=true;status.textContent='Drawing your little memory…';try{const blob=await makePostcard(form.elements.visitor.value.trim(),form.elements.design.value==='botanical',form.elements.lap?.checked);if(!blob)throw Error();cardBlob=blob;if(cardUrl)URL.revokeObjectURL(cardUrl);cardUrl=URL.createObjectURL(blob);const image=document.getElementById('postcard-preview');if(!image)return;image.src=cardUrl;image.hidden=false;document.getElementById('postcard-actions').hidden=false;status.textContent='Ready. Download it or share it when you choose.';}catch{status.textContent='The postcard couldn’t be created. Please try again.';}finally{button.disabled=false;}};document.getElementById('postcard-download').onclick=()=>download(cardBlob,'my-visit-to-vanshs-world.png');document.getElementById('postcard-share').onclick=()=>shareImage(cardBlob,'my-visit-to-vanshs-world.png','A little visit to Vansh’s world. '+shareIdentity.url,document.getElementById('postcard-status'));}
// A deliberately small, isolated product simulation. It never changes the real CRM.
function demo(){let bookings=VisitorDemo.seed();const slots=VisitorDemo.slots;showDialog('SIGNAL TO SATURDAY / INTERACTIVE CONCEPT DEMO',`<section class="modal-body"><p class="eyebrow">SAMPLE DATA · PORTFOLIO SIMULATION · NOT THE LIVE CRM UI</p><h2 id="modal-title">From a booking to a better decision.</h2><p class="modal-intro">Book an open slot, create a customer record, and watch utilization respond. This simplified demonstration illustrates the workflow; real product screenshots stay in the case study.</p><div id="demo-metrics" class="demo-metrics" aria-live="polite"></div><form id="demo-booking" class="delight-form"><label>Customer nickname<input name="customer" required maxlength="30" placeholder="Try your nickname" autocomplete="off"></label><label>One-hour slot<select name="slot"></select></label><button class="modal-link" type="submit">Add customer & book slot ↗</button></form><p id="demo-status" role="status"></p><h3>Customer & booking records</h3><div class="demo-table-wrap"><table class="demo-table"><thead><tr><th>Customer</th><th>Slot</th><th>Visits</th></tr></thead><tbody id="demo-rows"></tbody></table></div><p id="demo-insight" class="tour-proof"></p><div class="tool-row"><button id="demo-reset" class="back-room">Reset sample data ↻</button><button id="demo-case" class="modal-link">Read the real case study ↗</button></div></section>`);const form=document.getElementById('demo-booking');function render(){const occupied=new Set(bookings.map(b=>b.slot)),stats=VisitorDemo.metrics(bookings),count=stats.booked;document.getElementById('demo-metrics').innerHTML=`<div><strong>${count}/6</strong><span>BOOKED SLOTS</span></div><div><strong>${stats.utilization}%</strong><span>SLOT UTILIZATION</span></div><div><strong>${stats.customers}</strong><span>CUSTOMERS</span></div>`;form.elements.slot.innerHTML=slots.filter(s=>!occupied.has(s)).map(s=>`<option>${s}</option>`).join('');form.querySelector('button').disabled=count===6;document.getElementById('demo-rows').innerHTML=bookings.map(b=>`<tr><td>${escapeHtml(b.name)}</td><td>${b.slot}</td><td>${b.visits}</td></tr>`).join('');document.getElementById('demo-insight').textContent=count===6?'All sample slots are booked. A useful next question: is there demand for an additional session?':`${6-count} sample slots remain open. A useful next action: offer these times to interested customers. These are illustrative decisions, not measured product outcomes.`;}form.onsubmit=e=>{e.preventDefault();const name=form.elements.customer.value.trim(),slot=form.elements.slot.value;if(!name||bookings.some(b=>b.slot===slot)||!slots.includes(slot))return;const updated=VisitorDemo.book(bookings,name,slot);if(!updated)return;bookings=updated;render();document.getElementById('demo-status').textContent='Booking added. Customer history and utilization updated.';form.elements.customer.value='';};document.getElementById('demo-reset').onclick=()=>demo();document.getElementById('demo-case').onclick=()=>openProject('signal');render();}
const previousProject=openProject;openProject=function(id,...args){previousProject(id,...args);if(id==='signal'){const button=document.createElement('button');button.className='modal-link demo-entry';button.textContent='Try the booking & analytics demo ↗';button.onclick=demo;content.querySelector('.modal-intro')?.after(button);}};
const previousBest=openBestWork;openBestWork=function(...args){previousBest(...args);const button=document.createElement('button');button.className='back-room';button.textContent='Try Signal to Saturday · interactive demo ↗';button.onclick=demo;content.querySelector('.modal-intro')?.after(button);};
const previousResult=showRaceResult;showRaceResult=function(...args){previousResult(...args);const section=document.createElement('section');section.className='finish-story';section.innerHTML='<h3>You’ve seen how I build a world.<br/>See how I build products.</h3><button class="modal-link" id="finish-signal">Explore Signal to Saturday ↗</button><button class="back-room" data-delight="postcard">Take a race postcard ↗</button>';content.querySelector('.race-result')?.appendChild(section);document.getElementById('finish-signal')?.addEventListener('click',()=>openProject('signal'));};
// Published author excerpts only; empty shelves never invent a quotation.
async function typewriter(){showDialog('WHENVANSHWRITES / THE TYPEWRITER',`<section class="modal-body"><p class="eyebrow">WORDS BY VANSH</p><h2 id="modal-title">A line to carry with you.</h2><div id="typewriter-body" role="status">Opening the writing drawer…</div></section>`);try{const response=await fetch('/api/writings');if(!response.ok)throw Error();const data=await response.json();const entries=data.writings.filter(w=>typeof w.excerpt==='string'&&w.excerpt.trim());const target=document.getElementById('typewriter-body');if(!target)return;if(!entries.length){target.innerHTML='<p>Vansh’s quote drawer is waiting for its first published excerpt. For now, discover his book or visit @whenvanshwrites.</p><a class="modal-link" href="'+bookUrl+'" target="_blank" rel="noopener noreferrer">Discover the book ↗</a>';return;}let index=0;function reveal(){const entry=entries[index%entries.length];target.innerHTML=`<blockquote class="author-quote">${escapeHtml(entry.excerpt)}</blockquote><p>— whenvanshwrites · ${escapeHtml(entry.title)}</p><div class="tool-row"><button id="quote-next" class="back-room">Another line ↻</button><button id="quote-save" class="modal-link">Download writing PNG ↓</button><button id="quote-share" class="back-room">Share writing card ↗</button></div><p id="quote-status" role="status"></p>`;document.getElementById('quote-next').onclick=()=>{index++;reveal();};async function exportWriting(share){
  const save=document.getElementById('quote-save'),shareButton=document.getElementById('quote-share'),status=document.getElementById('quote-status'),next=document.getElementById('quote-next');
  save.disabled=shareButton.disabled=next.disabled=true;
  status.textContent='Preparing your writing card…';
  try{
    const blob=await makeWritingCard(entry);
    if(share)await shareImage(blob,'whenvanshwrites-writing.png',shareIdentity.name+' · '+shareIdentity.handle+' — '+shareIdentity.url,status);
    else{download(blob,'whenvanshwrites-writing.png');status.textContent='Writing card downloaded, with author credit and portfolio link.';}
  }catch{status.textContent='The writing card could not be created. Please try again.';}
  finally{save.disabled=shareButton.disabled=next.disabled=false;}
}
document.getElementById('quote-save').onclick=()=>exportWriting(false);
document.getElementById('quote-share').onclick=()=>exportWriting(true);}reveal();}catch{const target=document.getElementById('typewriter-body');if(target)target.textContent='The writing drawer couldn’t load. Try again from the hut.';}}
const previousRoom=openRoom;openRoom=function(id,...args){previousRoom(id,...args);if(id==='writing'){const button=document.createElement('button');button.className='typewriter-button';button.textContent='⌨ Tap the typewriter · a line to keep';button.onclick=typewriter;content.querySelector('.modal-body')?.prepend(button);}};

async function sharePublishedWriting(entry){
  if(!entry?.published||!String(entry.body||'').trim())return;
  showDialog('WHENVANSHWRITES / SHARE A WRITING',`<section class="modal-body"><p class="eyebrow">WORDS BY VANSH BHATI · TAKE A COPY WITH YOU</p><h2 id="modal-title">${escapeHtml(entry.title)}</h2><p class="form-note">Your image includes the writing, author credit and portfolio link. Longer pieces become numbered cards.</p><p id="writing-image-status" role="status">Preparing your writing…</p><img id="writing-image-preview" alt="Shareable writing card by Vansh Bhati" style="display:block;width:100%;height:auto;border-radius:12px" hidden><div class="tool-row" id="writing-image-nav"><button class="back-room" id="writing-image-prev" disabled>← Previous card</button><span id="writing-image-page" aria-live="polite"></span><button class="back-room" id="writing-image-next" disabled>Next card →</button></div><div class="tool-row"><button class="modal-link" id="writing-image-share" disabled>Share this image ↗</button><button class="back-room" id="writing-image-download" disabled>Download PNG ↓</button><button class="back-room" id="writing-image-back">← Back to writing</button></div></section>`);
  const status=document.getElementById('writing-image-status'),preview=document.getElementById('writing-image-preview'),prev=document.getElementById('writing-image-prev'),next=document.getElementById('writing-image-next'),share=document.getElementById('writing-image-share'),save=document.getElementById('writing-image-download'),page=document.getElementById('writing-image-page'),nav=document.getElementById('writing-image-nav');
  let url=null,index=0,blob=null,busy=false;
  function release(){if(url){URL.revokeObjectURL(url);url=null;}}
  dialog.addEventListener('close',release,{once:true});
  document.getElementById('writing-image-back').onclick=()=>{release();readWriting(entry.id);};
  try{
    await document.fonts?.ready;
    const measure=document.createElement('canvas').getContext('2d');
    measure.font="25px 'DM Sans', 'Space Grotesk', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif";
    const all=writingLines(measure,entry.body,900),pages=[];
    if(all.length<=40){
      pages.push(entry.body);
    }else{
      for(let i=0;i<all.length;i+=36){
        const chunk=all.slice(i,i+36).join('\n').replace(/^\n+|\n+$/g,'');
        if(chunk)pages.push(chunk);
      }
    }
    if(!pages.length)pages.push(entry.body);
    if(nav)nav.hidden=(pages.length<=1);
    const filename=()=> 'whenvanshwrites-'+(String(entry.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'writing')+(pages.length>1?'-card-'+(index+1):'')+'.png';
    async function render(){
      if(busy||!status.isConnected)return;busy=true;prev.disabled=next.disabled=share.disabled=save.disabled=true;
      status.textContent='Preparing card '+(index+1)+'…';
      try{
        const result=await makeWritingCard({
          title:entry.title,
          page:pages.length>1?{current:index+1,total:pages.length}:null,
          excerpt:pages[index]
        });
        if(!status.isConnected){release();return;}
        blob=result;release();url=URL.createObjectURL(blob);preview.src=url;preview.hidden=false;
        page.textContent=pages.length>1?'Card '+(index+1)+' of '+pages.length:'Card 1 of 1';
        status.textContent='Ready to share. Your words and credit stay together.';
        share.disabled=save.disabled=false;
      }catch{status.textContent='Could not create this card. Return to the writing and try again.';}
      finally{busy=false;prev.disabled=index===0;next.disabled=index===pages.length-1;}
    }
    prev.onclick=()=>{if(!busy&&index>0){index--;render();}};
    next.onclick=()=>{if(!busy&&index<pages.length-1){index++;render();}};
    save.onclick=()=>{if(blob){download(blob,filename());status.textContent='PNG downloaded with author credit and portfolio link.';}};
    share.onclick=async()=>{if(!blob||busy)return;busy=true;share.disabled=save.disabled=prev.disabled=next.disabled=true;try{await shareImage(blob,filename(),entry.title+(pages.length>1?' (Card '+(index+1)+'/'+pages.length+')':'')+' — '+shareIdentity.name+' · '+shareIdentity.handle+' '+shareIdentity.url,status);}finally{busy=false;share.disabled=save.disabled=false;prev.disabled=index===0;next.disabled=index===pages.length-1;}};
    await render();
  }catch{status.textContent='Could not prepare this writing. Please return and try again.';}
}
const originalReadWriting=readWriting;
readWriting=function(id){
  originalReadWriting(id);
  const entry=writingData.find(w=>w.id===id);
  if(!entry?.published||!String(entry.body||'').trim())return;
  const prose=content.querySelector('.writing-prose');if(!prose)return;
  const actions=document.createElement('div');actions.className='tool-row';
  const button=document.createElement('button');button.className='modal-link';button.textContent='Share this writing as an image ↗';
  button.onclick=()=>sharePublishedWriting(entry);actions.appendChild(button);prose.after(actions);
};

// Pixel naps at home, then takes a brief walk along the courtyard when invited.
const pixel=document.getElementById('pixel-sprite'),cat=document.getElementById('cat');let catUntil=0,catFrame=0,lastHint=-20000,hintIndex=0;const pixelHints=['Looking for the person behind this? Try the Founder’s Desk.','A minute to spare? The 60-second tour is a good first walk.','The writing hut has a typewriter. Some words are worth keeping.'];let follow={x:690,y:600};viewport.addEventListener('pointermove',e=>{if(performance.now()>catUntil)return;const r=world.getBoundingClientRect(),scale=view.fit*view.zoom;follow={x:Math.max(620,Math.min(730,(e.clientX-r.left)/scale)),y:Math.max(585,Math.min(650,(e.clientY-r.top)/scale))};});cat.addEventListener('click',()=>{if(performance.now()-lastHint<20000)return;lastHint=performance.now();toast('Pixel: '+pixelHints[hintIndex++%pixelHints.length]);follow={x:635,y:635};if(reducedMotion||paused)return;catUntil=performance.now()+6500;cancelAnimationFrame(catFrame);const start=performance.now();function stroll(now){if(now>catUntil||document.hidden||paused){pixel.setAttribute('transform','translate(690 600) scale(1.6)');cat.style.transform='';return;}const amount=Math.sin((now-start)/6500*Math.PI),dx=(follow.x-690)*amount,dy=(follow.y-600)*amount;pixel.setAttribute('transform',`translate(${690+dx} ${600+dy}) scale(1.6)`);cat.style.transform=`translate(${dx}px,${dy}px)`;catFrame=requestAnimationFrame(stroll);}catFrame=requestAnimationFrame(stroll);});
const nap=document.createElementNS('http://www.w3.org/2000/svg','text');nap.setAttribute('x','17');nap.setAttribute('y','-20');nap.setAttribute('class','pixel-nap');nap.textContent='z';pixel.appendChild(nap);
const cafe=document.createElement('button');cafe.className='cafe-discovery';cafe.setAttribute('aria-label','Listen to a conversation at the idea café');cafe.textContent='☕';document.getElementById('world').appendChild(cafe);let cafeIndex=0;const chats=['“What makes a useful product?” “A problem worth solving—and the patience to understand it.”','“Data or storytelling?” “Both. One helps you see; the other helps people understand.”','“Where should I start?” “Best Work Village. Then take the scenic route.”'];cafe.onclick=()=>{toast(chats[cafeIndex++%chats.length]);};
// Existing map postbox opens the contact form; add a keyboard-friendly visible caption.
document.getElementById('map-contact').title='The postbox · send Vansh a message';
document.querySelectorAll('#plot-writing,#plot-book,#plot-creator').forEach((el,i)=>el.classList.add('window-life-'+i));
const welcome=document.getElementById('welcome-title');if(welcome)welcome.innerHTML='Some people have a portfolio.<br/><em>I built a little world.</em>';
let arrivalFrame=0;function arrival(){if(reducedMotion||paused||portfolioMode!=='fun')return;const overlay=document.createElement('aside');overlay.className='arrival-note';overlay.innerHTML='<span>Welcome to Best Work Village.</span><button>Skip arrival ↗</button>';document.querySelector('.world-main').appendChild(overlay);const before={x:view.x,y:view.y,zoom:view.zoom},start=performance.now();function end(){cancelAnimationFrame(arrivalFrame);overlay.remove();}overlay.querySelector('button').onclick=end;function animate(now){if(driving||dialog.open||portfolioMode!=='fun'){end();return;}const t=Math.min(1,(now-start)/2200),ease=1-(1-t)**3;view.x=before.x*(1-ease);view.y=before.y*(1-ease);view.zoom=before.zoom+((window.innerWidth>700?1.05:1.22)-before.zoom)*ease;renderView();if(t<1)arrivalFrame=requestAnimationFrame(animate);else end();}arrivalFrame=requestAnimationFrame(animate);for(const event of['pointerdown','wheel','keydown'])viewport.addEventListener(event,end,{once:true});}
document.querySelector('[data-enter-mode="fun"]')?.addEventListener('click',()=>setTimeout(arrival,60));
})();
