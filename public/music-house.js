'use strict';
/* Music House: only the portfolio owner can configure the two YouTube songs. */
let musicHouseSongs=[];
let musicHouseActive=-1;
let musicHouseFrame=null;
let musicHousePaused=false;
let musicHouseLoadPromise=null;
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
  musicHouseSyncPlayer();
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
function musicHousePlayerMarkup(compact=false){
  if(musicHouseSongs.length!==2)return '';
  const i=musicHouseActive>=0?musicHouseActive:0,song=musicHouseSongs[i];
  const playerState=musicHouseActive<0?'READY WHEN YOU ARE':musicHousePaused?'PAUSED':'NOW PLAYING';
  const controls=compact?'':`<div class="wvl-player-controls"><button type="button" data-music-previous aria-label="Play previous song">⏮</button><button type="button" class="wvl-player-main" data-music-player-toggle aria-label="${musicHouseActive>=0&&!musicHousePaused?'Pause music':'Play music'}">${musicHouseActive>=0&&!musicHousePaused?'Ⅱ':'▶'}</button><button type="button" data-music-next aria-label="Play next song">⏭</button></div>`;
  return `<section class="wvl-player-card${compact?' wvl-player-compact':''}" aria-label="WhenVanshListens inspired music player"><div class="wvl-player-topline"><span>WHENVANSHLISTENS</span><span id="music-player-status">${playerState}</span></div><div class="wvl-player-mainrow"><div class="wvl-player-art"><img id="music-player-art" src="https://img.youtube.com/vi/${encodeURIComponent(song.videoId)}/hqdefault.jpg" alt="" loading="lazy"></div><div class="wvl-player-track"><strong id="music-player-title">${escapeHtml(song.title)}</strong><span>Music Village · Two song picks</span></div></div><div class="wvl-player-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>${controls}<div class="wvl-player-credit">Player inspired by my project <a href="https://github.com/whenvanshcodes/WVL" target="_blank" rel="noopener noreferrer">WhenVanshListens (WVL) ↗</a></div></section>`;
}
function musicHouseSyncPlayer(){
  if(musicHouseSongs.length!==2)return;
  const i=musicHouseActive>=0?musicHouseActive:0,song=musicHouseSongs[i];
  const title=document.getElementById('music-player-title'),art=document.getElementById('music-player-art'),play=document.querySelector('[data-music-player-toggle]'),card=document.querySelector('.wvl-player-card'),status=document.getElementById('music-player-status');
  if(card)card.classList.toggle('is-playing',musicHouseActive>=0&&!musicHousePaused);
  if(status)status.textContent=musicHouseActive<0?'READY WHEN YOU ARE':musicHousePaused?'PAUSED':'NOW PLAYING';
  if(title)title.textContent=song.title;
  if(art)art.src='https://img.youtube.com/vi/'+encodeURIComponent(song.videoId)+'/hqdefault.jpg';
  if(play){const playing=musicHouseActive>=0&&!musicHousePaused;play.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',playing?'Pause music':'Play music');play.setAttribute('aria-pressed',String(playing));}
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
  musicHouseSyncPlayer();
  musicHouseUpdateToggle();
}
function musicHouseToggle(){
  if(musicHouseActive<0){if(musicHouseSongs.length===2){musicHousePlay(0);return;}openMusicHouse(document.getElementById('music-toggle'));return;}
  musicHousePaused=!musicHousePaused;
  const command=musicHousePaused?'pauseVideo':'playVideo';
  musicHouseFrame?.contentWindow?.postMessage(JSON.stringify({event:'command',func:command,args:[]}), 'https://www.youtube-nocookie.com');
  musicHouseSyncPlayer();
  musicHouseUpdateToggle();
}
function musicHouseFetch(){
  if(musicHouseLoadPromise)return musicHouseLoadPromise;
  musicHouseLoadPromise=(async()=>{
    try{
      const r=await api('/api/portfolio');
      musicHouseSongs=Array.isArray(r.content?.['music:house']?.songs)?r.content['music:house'].songs.slice(0,2):[];
    }catch{musicHouseSongs=[];}
    const button=document.getElementById('music-toggle');if(button)button.disabled=false;
  })();
  return musicHouseLoadPromise;
}
function musicHouseDraw(trigger){
  dialog.classList.remove('music-prompt-dialog');
  const songHtml=musicHouseSongs.length===2?musicHouseSongs.map((song,i)=>`<article class="music-song-card"><strong><span>0${i+1}</span>${escapeHtml(song.title)}</strong><button class="music-song-action" type="button" data-music-song="${i}" aria-pressed="false">Play ▶</button></article>`).join(''):'<p>The owner has not set the two songs yet.</p>';
  const admin=typeof ownerMode!=='undefined'&&ownerMode?'<button class="back-room" id="music-house-admin">Change my two songs</button>':'';
  showDialog('MUSIC VILLAGE / TWO FAVORITES',`<section class="modal-body music-house-content"><p class="eyebrow">WHENVANSHLISTENS · THE VILLAGE</p><h2 id="modal-title">Music Village</h2><p class="modal-intro">Two songs selected by Vansh. Pick either one to listen.</p>${musicHousePlayerMarkup()}<div class="music-song-list">${songHtml}</div><button type="button" class="back-room" id="music-house-off">Turn music off ■</button> ${admin}<p class="form-note">YouTube playback needs an internet connection. Some videos may not allow embedding.</p></section>`,trigger);
  const toggle=document.getElementById('music-toggle');if(toggle)toggle.disabled=false;
  musicHousePlaceToggle(true);
  musicHouseSyncSongButtons();
  musicHouseSyncPlayer();
  content.querySelectorAll('[data-music-song]').forEach(b=>b.addEventListener('click',()=>musicHousePlay(Number(b.dataset.musicSong))));
  content.querySelector('[data-music-player-toggle]')?.addEventListener('click',musicHouseToggle);
  content.querySelector('[data-music-previous]')?.addEventListener('click',()=>musicHousePlay((Math.max(0,musicHouseActive>=0?musicHouseActive:0)+1)%2));
  content.querySelector('[data-music-next]')?.addEventListener('click',()=>musicHousePlay((Math.max(0,musicHouseActive>=0?musicHouseActive:0)+1)%2));
  document.getElementById('music-house-off').addEventListener('click',musicHouseStop);
  document.getElementById('music-house-admin')?.addEventListener('click',musicHouseEdit);
}
function musicHouseEdit(){
  if(typeof ownerMode==='undefined'||!ownerMode)return;
  musicHouseStop();
  dialog.classList.remove('music-prompt-dialog');
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
function musicHouseMaybePrompt(){
  if(musicHouseSongs.length!==2)return;
  try{if(sessionStorage.getItem('music-village-prompt-seen')==='1')return;sessionStorage.setItem('music-village-prompt-seen','1');}catch{}
  const first=musicHouseSongs[0];
  dialog.classList.add('music-prompt-dialog');
  showDialog('A LITTLE MUSIC FOR THE ROAD',`<section class="modal-body music-house-content music-prompt-content"><p class="eyebrow">THE FUN SIDE · MUSIC VILLAGE</p><h2 id="modal-title">Play some music?</h2><p class="modal-intro">Want one of Vansh’s two picks playing while you explore?</p>${musicHousePlayerMarkup(true)}<div class="music-prompt-actions"><button type="button" class="modal-link" id="music-prompt-play">Play ${escapeHtml(first.title)} ▶</button><button type="button" class="back-room" id="music-prompt-skip">Not now</button></div></section>`);
  document.getElementById('music-prompt-play').addEventListener('click',()=>{dialog.close();musicHousePlay(0);});
  document.getElementById('music-prompt-skip').addEventListener('click',()=>dialog.close());
}
document.querySelectorAll('[data-music-house], #music-house-svg').forEach(button=>{
  button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openMusicHouse(button);}});
  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    openMusicHouse(button);
  });
});
dialog.addEventListener('close',()=>{dialog.classList.remove('music-prompt-dialog');musicHousePlaceToggle(false);});
const musicHouseButton=document.getElementById('music-toggle');if(musicHouseButton){musicHouseButton.disabled=true;musicHouseButton.addEventListener('click',musicHouseToggle);}
window.addEventListener('lab:park',musicHouseStop);
new MutationObserver(()=>{if(document.body.classList.contains('professional-mode')&&musicHouseActive>=0)musicHouseStop();}).observe(document.body,{attributes:true,attributeFilter:['class']});
musicHouseUpdateToggle();
void musicHouseFetch().then(musicHouseMaybePrompt);
