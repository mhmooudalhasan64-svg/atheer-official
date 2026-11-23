document.documentElement.classList.add("js");
const menuButton=document.querySelector(".menu-button");
const nav=document.querySelector(".navigation");
const header=document.querySelector(".header");
const progress=document.querySelector(".reading-line");
const year=document.getElementById("year");
const backTop=document.querySelector(".back-top");
const hero=document.querySelector(".hero");
const heroArt=document.querySelector(".hero-art");

if(year) year.textContent=String(new Date().getFullYear());

if(menuButton&&nav){
  const closeMenu=()=>{
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","فتح القائمة");
  };
  menuButton.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(open));
    menuButton.setAttribute("aria-label",open?"إغلاق القائمة":"فتح القائمة");
  });
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});
  document.addEventListener("click",event=>{
    if(nav.classList.contains("open")&&!nav.contains(event.target)&&!menuButton.contains(event.target))closeMenu();
  });
}

const updateChrome=()=>{
  const total=document.documentElement.scrollHeight-window.innerHeight;
  const ratio=total>0?window.scrollY/total:0;
  if(progress)progress.style.width=(ratio*100)+"%";
  if(header)header.classList.toggle("is-fixed",window.scrollY>32);
  if(backTop)backTop.classList.toggle("visible",window.scrollY>650);
};
window.addEventListener("scroll",updateChrome,{passive:true});
window.addEventListener("resize",updateChrome);
updateChrome();
if(backTop)backTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));

if(hero&&heroArt&&window.matchMedia("(hover:hover) and (pointer:fine)").matches&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  hero.addEventListener("pointermove",event=>{
    const rect=hero.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    heroArt.style.setProperty("--pointer-x",(x*13).toFixed(1)+"px");
    heroArt.style.setProperty("--pointer-y",(y*13).toFixed(1)+"px");
  },{passive:true});
  hero.addEventListener("pointerleave",()=>{
    heroArt.style.setProperty("--pointer-x","0px");
    heroArt.style.setProperty("--pointer-y","0px");
  },{passive:true});
}

const revealItems=[...document.querySelectorAll(".reveal")];
if("IntersectionObserver" in window){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:"0px 0px -28px 0px"});
  revealItems.forEach((item,index)=>{
    item.style.transitionDelay=(index%3)*65+"ms";
    revealObserver.observe(item);
  });
}else{
  revealItems.forEach(item=>item.classList.add("visible"));
}

const sections=[...document.querySelectorAll("main section[id]")];
const links=[...document.querySelectorAll(".navigation a")];
if("IntersectionObserver" in window&&sections.length&&links.length){
  const activeObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));
      }
    });
  },{rootMargin:"-36% 0px -56% 0px"});
  sections.forEach(section=>activeObserver.observe(section));
}