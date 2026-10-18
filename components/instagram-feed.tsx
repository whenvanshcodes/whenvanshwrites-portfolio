'use client';
import {useId,useState} from 'react';
/** Instagram owns the embedded content. The portfolio never scrapes posts. */
export default function InstagramFeed(){
 const heading=useId(),[show,setShow]=useState(false);
 return <section className="instagram-feed" aria-labelledby={heading}>
  <div className="instagram-copy"><p className="instagram-kicker">THE CREATIVE SIDE</p><h2 id={heading}>Beyond the work.</h2><p>Writing, stories and everyday observations.<br/><a href="https://www.instagram.com/whenvanshwrites/" target="_blank" rel="noopener noreferrer">@whenvanshwrites ↗</a></p></div>
  <div className="instagram-content"><div className="instagram-actions"><button type="button" aria-expanded={show} onClick={()=>setShow(value=>!value)}>{show?'Hide Instagram ↑':'Show Instagram ↓'}</button><a href="https://www.instagram.com/whenvanshwrites/" target="_blank" rel="noopener noreferrer">Open profile ↗</a></div>
   {show?<><div className="instagram-frame"><iframe title="whenvanshwrites on Instagram" src="https://www.instagram.com/whenvanshwrites/embed/" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture"/></div><p className="instagram-note">If Instagram doesn’t display here, open the profile above.</p></>:<p className="instagram-note">Load the profile preview from Instagram, or visit the full feed.</p>}
  </div>
 </section>;
}
