'use strict';
/* Music House: only the portfolio owner can configure the two YouTube songs. */
let musicHouseSongs=[];
let musicHouseActive=-1;
let musicHouseFrame=null;
function musicHouseStop(){
  musicHouseActive=-1;
  if(musicHouseFrame){musicHouseFrame.remove();musicHouseFrame=null;}
  document.querySelectorAll('[data-music-song]').forEach(b=>{b.textContent='Play ▶';b.setAttribute('aria-pressed','false');});
}
function musicHousePlay(i){
  if(!musicHouseSongs[i])return;
  if(musicHouseActive===i){musicHouseStop();return;}
  musicHouseStop();
  musicHouseActive=i;
  const host=document.getElementById('music-house-player');
  if(!host)return;
  const iframe=document.createElement('iframe');
  iframe.title='YouTube music: '+musicHouseSongs[i].title;
  iframe.width='100%';iframe.height='220';iframe.loading='eager';
  iframe.allow='autoplay; encrypted-media; picture-in-picture';
  iframe.referrerPolicy='strict-origin-when-cross-origin';
  iframe.src='https://www.youtube-nocookie.com/embed/'+musicHouseSongs[i].videoId+'?autoplay=1&playsinline=1&rel=0';
  iframe.style.border='0';iframe.style.borderRadius='14px';
  host.appendChild(iframe);musicHouseFrame=iframe;
  document.querySelectorAll('[data-music-song]').forEach((b,j)=>{b.textContent=j===i?'Stop ■':'Play ▶';b.setAttribute('aria-pressed',String(j===i));});
}
async function musicHouseFetch(){
  try{
    const r=await api('/api/portfolio');
    musicHouseSongs=Array.isArray(r.content?.['music:house']?.songs)?r.content['music:house'].songs.slice(0,2):[];
  }catch{musicHouseSongs=[];}
}
function musicHouseDraw(trigger){
  musicHouseStop();
  const songHtml=musicHouseSongs.length===2?musicHouseSongs.map((song,i)=>`<article style="padding:14px;border:1px solid #78869a55;border-radius:14px;margin:12px 0"><strong>0${i+1} · ${escapeHtml(song.title)}</strong><div style="margin-top:10px"><button class="modal-link" type="button" data-music-song="${i}" aria-pressed="false">Play ▶</button></div></article>`).join(''):'<p>The owner has not set the two songs yet.</p>';
  const admin=typeof ownerMode!=='undefined'&&ownerMode?'<button class="back-room" id="music-house-admin">Change my two songs</button>':'';
  showDialog('MUSIC HOUSE / TWO FAVORITES',`<section class="modal-body"><p class="eyebrow">WHENVANSHLISTENS · THE VILLAGE</p><h2 id="modal-title">Music House</h2><p class="modal-intro">Two songs selected by Vansh. Pick either one to listen. Music never starts automatically.</p>${songHtml}<div id="music-house-player" style="max-width:560px"></div><button type="button" class="back-room" id="music-house-off">Turn music off ■</button> ${admin}<p class="form-note">YouTube playback requires an internet connection; some videos may not allow embedding.</p></section>`,trigger);
  content.querySelectorAll('[data-music-song]').forEach(b=>b.addEventListener('click',()=>musicHousePlay(Number(b.dataset.musicSong))));
  document.getElementById('music-house-off').addEventListener('click',musicHouseStop);
  document.getElementById('music-house-admin')?.addEventListener('click',musicHouseEdit);
}
function musicHouseEdit(){
  if(typeof ownerMode==='undefined'||!ownerMode)return;
  musicHouseStop();
  showDialog('OWNER STUDIO / MUSIC HOUSE',`<section class="modal-body"><h2 id="modal-title">Choose exactly two songs</h2><p class="modal-intro">Only you can change these tracks. Visitors can only play, switch or stop them.</p><form id="music-house-edit">${[0,1].map(i=>`<fieldset style="border:1px solid #78869a55;border-radius:12px;padding:14px;margin-bottom:14px"><legend>Song ${i+1}</legend><label class="field"><span>Song title</span><input name="title${i}" required maxlength="120" value="${escapeHtml(musicHouseSongs[i]?.title||'')}"></label><label class="field"><span>YouTube video URL</span><input name="url${i}" required maxlength="300" value="${escapeHtml(musicHouseSongs[i]?.url||'')}" placeholder="https://www.youtube.com/watch?v=..."></label></fieldset>`).join('')}<p role="alert" id="music-house-error"></p><button class="modal-link" type="submit">Save two songs</button></form></section>`);
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
dialog.addEventListener('close',musicHouseStop);
