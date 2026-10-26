'use strict';
/* Music House: only the portfolio owner can configure the two YouTube songs. */
let musicHouseSongs=[];
let musicHouseActive=-1;
let musicHouseFrame=null;
let musicHousePaused=false;
function musicHouseUpdateToggle(){
  const button=document.getElementById('music-toggle');
  if(!button)return;
  if(musicHouseActive<0){button.textContent='♫';button.setAttribute('aria-label','Play music');button.setAttribute('title','Play music');button.setAttribute('aria-pressed','false');return;}
  button.textContent=musicHousePaused?'▶':'Ⅱ';
  button.setAttribute('aria-label',musicHousePaused?'Resume music':'Pause music');
  button.setAttribute('title',musicHousePaused?'Resume music':'Pause music');
  button.setAttribute('aria-pressed',String(musicHousePaused));
}
function musicHousePlaceToggle(inDialog){
  const button=document.getElementById('music-toggle');
  if(!button)return;
  button.classList.toggle('music-toggle-in-dialog',inDialog);
  if(inDialog){dialog.appendChild(button);return;}
  const actions=document.querySelector('.top-actions'),theme=document.getElementById('theme');
  if(actions&&theme)actions.insertBefore(button,theme);
}
function musicHouseStop(){
  musicHouseActive=-1;
  musicHousePaused=false;
  if(musicHouseFrame){musicHouseFrame.remove();musicHouseFrame=null;}
  document.querySelectorAll('[data-music-song]').forEach(b=>{b.textContent='Play ▶';b.setAttribute('aria-pressed','false');});
  musicHouseUpdateToggle();
}
function musicHousePlayerHost(){
  let host=document.getElementById('music-house-player');
  if(!host){host=document.createElement('div');host.id='music-house-player';host.className='music-player-host';host.setAttribute('aria-hidden','true');document.body.appendChild(host);}
  return host;
}
function musicHouseSyncSongButtons(){
  document.querySelectorAll('[data-music-song]').forEach(b=>{const i=Number(b.dataset.musicSong),playing=i===musicHouseActive;b.textContent=playing?'Stop ■':'Play ▶';b.setAttribute('aria-pressed',String(playing));});
}
function musicHousePlay(i){
  if(!musicHouseSongs[i])return;
  if(musicHouseActive===i){musicHouseStop();return;}
  musicHouseStop();
  musicHouseActive=i;
  musicHousePaused=false;
  const host=musicHousePlayerHost();
  const iframe=document.createElement('iframe');
  iframe.title='YouTube music: '+musicHouseSongs[i].title;
  iframe.width='200';iframe.height='200';iframe.loading='eager';
  iframe.allow='autoplay; encrypted-media; picture-in-picture';
  iframe.referrerPolicy='strict-origin-when-cross-origin';
  iframe.src='https://www.youtube-nocookie.com/embed/'+musicHouseSongs[i].videoId+'?autoplay=1&controls=0&playsinline=1&rel=0&enablejsapi=1&origin='+encodeURIComponent(location.origin);
  iframe.style.border='0';iframe.tabIndex=-1;
  host.appendChild(iframe);musicHouseFrame=iframe;
  musicHouseSyncSongButtons();
  musicHouseUpdateToggle();
}
async function musicHouseToggle(){
  if(musicHouseActive<0){await musicHouseFetch();if(musicHouseSongs.length===2){musicHousePlay(0);return;}openMusicHouse(document.getElementById('music-toggle'));return;}
  musicHousePaused=!musicHousePaused;
  const command=musicHousePaused?'pauseVideo':'playVideo';
  musicHouseFrame?.contentWindow?.postMessage(JSON.stringify({event:'command',func:command,args:[]}), 'https://www.youtube-nocookie.com');
  musicHouseUpdateToggle();
}
async function musicHouseFetch(){
  try{
    const r=await api('/api/portfolio');
    musicHouseSongs=Array.isArray(r.content?.['music:house']?.songs)?r.content['music:house'].songs.slice(0,2):[];
  }catch{musicHouseSongs=[];}
}
function musicHouseDraw(trigger){
  const songHtml=musicHouseSongs.length===2?musicHouseSongs.map((song,i)=>`<article style="padding:14px;border:1px solid #78869a55;border-radius:14px;margin:12px 0"><strong>0${i+1} · ${escapeHtml(song.title)}</strong><div style="margin-top:10px"><button class="modal-link" type="button" data-music-song="${i}" aria-pressed="false">Play ▶</button></div></article>`).join(''):'<p>The owner has not set the two songs yet.</p>';
  const admin=typeof ownerMode!=='undefined'&&ownerMode?'<button class="back-room" id="music-house-admin">Change my two songs</button>':'';
  showDialog('MUSIC VILLAGE / TWO FAVORITES',`<section class="modal-body"><p class="eyebrow">WHENVANSHLISTENS · THE VILLAGE</p><h2 id="modal-title">Music Village</h2><p class="modal-intro">Click the music button up top to listen in the background, or pick a favorite here. Music never starts automatically.</p>${songHtml}<button type="button" class="back-room" id="music-house-off">Turn music off ■</button> ${admin}<p class="form-note">YouTube playback requires an internet connection; some videos may not allow embedding.</p></section>`,trigger);
  const toggle=document.getElementById('music-toggle');if(toggle)toggle.disabled=false;
  musicHousePlaceToggle(true);
  musicHouseSyncSongButtons();
  content.querySelectorAll('[data-music-song]').forEach(b=>b.addEventListener('click',()=>musicHousePlay(Number(b.dataset.musicSong))));
  document.getElementById('music-house-off').addEventListener('click',musicHouseStop);
  document.getElementById('music-house-admin')?.addEventListener('click',musicHouseEdit);
}
function musicHouseEdit(){
  if(typeof ownerMode==='undefined'||!ownerMode)return;
  musicHouseStop();
  showDialog('OWNER STUDIO / MUSIC VILLAGE',`<section class="modal-body"><h2 id="modal-title">Choose exactly two songs</h2><p class="modal-intro">Only you can change these tracks. Visitors can only play, switch or stop them.</p><form id="music-house-edit">${[0,1].map(i=>`<fieldset style="border:1px solid #78869a55;border-radius:12px;padding:14px;margin-bottom:14px"><legend>Song ${i+1}</legend><label class="field"><span>Song title</span><input name="title${i}" required maxlength="120" value="${escapeHtml(musicHouseSongs[i]?.title||'')}"></label><label class="field"><span>YouTube video URL</span><input name="url${i}" required maxlength="300" value="${escapeHtml(musicHouseSongs[i]?.url||'')}" placeholder="https://www.youtube.com/watch?v=..."></label></fieldset>`).join('')}<p role="alert" id="music-house-error"></p><button class="modal-link" type="submit">Save two songs</button></form></section>`);
  const toggle=document.getElementById('music-toggle');if(toggle)toggle.disabled=true;
  document.getElementById('music-house-edit').addEventListener('submit',async e=>{
    e.preventDefault();const form=e.currentTarget,btn=form.querySelector('button[type=submit]');btn.disabled=true;
    const songs=[0,1].map(i=>({title:form.elements['title'+i].value,url:form.elements['url'+i].value}));
    try{
      const result=await api('/api/portfolio',apiJson('PUT',{key:'music:house',value:{songs}}));
      musicHouseSongs=result.value.songs;musicHouseDraw();toast('Your two songs are saved.');
    }catch(err){document.getElementById('music-house-error').textContent=err.message;btn.disabled=false;}
  });
}
async function openMusicHouse(trigger){await musicHouseFetch();musicHouseDraw(trigger);}
document.querySelectorAll('[data-music-house], #music-house-svg').forEach(button=>{
  button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openMusicHouse(button);}});
  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    openMusicHouse(button);
  });
});
dialog.addEventListener('close',()=>{musicHousePlaceToggle(false);});
document.getElementById('music-toggle')?.addEventListener('click',musicHouseToggle);
new MutationObserver(()=>{if(document.body.classList.contains('professional-mode')&&musicHouseActive>=0)musicHouseStop();}).observe(document.body,{attributes:true,attributeFilter:['class']});
musicHouseUpdateToggle();
