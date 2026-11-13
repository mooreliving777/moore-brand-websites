/* Moore Network motion, accessible progressive enhancement. */
(function(){
"use strict";
if(typeof window==="undefined"||typeof document==="undefined")return;
const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)");
if(reduce&&reduce.matches)return;
document.body.classList.add("motion-active");
if("IntersectionObserver" in window){
 const targets=document.querySelectorAll("main > section:not(.hero):not(.network-intro),.service-card,.journal-card,.directory-card,.funnel-steps li");
 const observer=new IntersectionObserver((entries,obs)=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add("motion-visible");obs.unobserve(e.target)}}},{rootMargin:"0px 0px -6% 0px",threshold:.08});
 let i=0;
 for(const el of targets){
  if(el.getBoundingClientRect().top<window.innerHeight*.85)continue;
  el.style.setProperty("--motion-delay",((i++%3)*70)+"ms");
  el.classList.add("motion-reveal");observer.observe(el);
 }
}
const bar=document.createElement("div");bar.className="motion-scroll-progress";bar.setAttribute("aria-hidden","true");document.body.appendChild(bar);
let pending=false;function update(){pending=false;const max=document.documentElement.scrollHeight-window.innerHeight;bar.style.transform="scaleX("+(max>0?Math.min(1,Math.max(0,window.scrollY/max)):0).toFixed(4)+")"}
function scroll(){if(!pending){pending=true;window.requestAnimationFrame(update)}}
window.addEventListener("scroll",scroll,{passive:true});window.addEventListener("resize",scroll,{passive:true});scroll();
if(reduce&&reduce.addEventListener)reduce.addEventListener("change",e=>{if(!e.matches)return;document.body.classList.remove("motion-active");document.querySelectorAll(".motion-reveal").forEach(el=>{el.classList.add("motion-visible");el.classList.remove("motion-reveal")});bar.remove();window.removeEventListener("scroll",scroll);window.removeEventListener("resize",scroll)},{once:true});
})();
