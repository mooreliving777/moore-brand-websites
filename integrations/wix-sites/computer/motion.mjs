/* Portable motion: no storage, user data, network requests, analytics or libraries. */
(()=>{"use strict";
if(typeof window==="undefined"||typeof document==="undefined")return;
const root=document.querySelector("[data-moore-motion]");
if(!root||!window.matchMedia)return;
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
if(reduced.matches)return;
root.classList.add("mm-ready");
let observer=null;
if("IntersectionObserver" in window){
 observer=new IntersectionObserver((entries,watcher)=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add("mm-visible");watcher.unobserve(e.target)}}},{rootMargin:"0px 0px -7% 0px",threshold:.07});
 let number=0;
 for(const el of root.querySelectorAll('[data-mm="reveal"]')){
  if(el.closest("[hidden]")||el.getBoundingClientRect().top<innerHeight*.85)continue;
  el.style.setProperty("--mm-delay",(number++%3)*70+"ms");
  el.classList.add("mm-pending");observer.observe(el);
 }
}
let progress=null,queued=false;
function draw(){queued=false;if(!progress)return;const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform="scaleX("+(total>0?Math.min(1,Math.max(0,scrollY/total)):0).toFixed(4)+")"}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(draw)}
if(root.hasAttribute("data-mm-progress")){
 progress=document.createElement("div");progress.className="mm-scroll-progress";progress.setAttribute("aria-hidden","true");root.appendChild(progress);
 addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule,{passive:true});schedule();
}
function stop(){root.classList.remove("mm-ready");if(observer)observer.disconnect();for(const el of root.querySelectorAll(".mm-pending")){el.classList.remove("mm-pending");el.classList.add("mm-visible")}if(progress)progress.remove();removeEventListener("scroll",schedule);removeEventListener("resize",schedule)}
if(reduced.addEventListener)reduced.addEventListener("change",event=>{if(event.matches)stop()});
})();
