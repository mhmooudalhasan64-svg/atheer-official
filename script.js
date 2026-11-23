const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".main-nav");
const header=document.querySelector(".site-header");
const progress=document.querySelector(".scroll-progress");
const year=document.getElementById("year");
if(year) year.textContent=String(new Date().getFullYear());

if(menuButton&&nav){
  const closeMenu=()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","فتح القائمة")};
  menuButton.addEventListener("click",()=>{
    const isOpen=nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(isOpen));
    menuButton.setAttribute("aria-label",isOpen?"إغلاق القائمة":"فتح القائمة");
  });
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});
}

const updateScrollUI=()=>{
  const scrollable=document.documentElement.scrollHeight-window.innerHeight;
  const ratio=scrollable>0?window.scrollY/scrollable:0;
  if(progress)progress.style.width=(ratio*100)+"%";
  if(header)header.classList.toggle("scrolled",window.scrollY>30);
};
window.addEventListener("scroll",updateScrollUI,{passive:true});
updateScrollUI();

const revealTargets=document.querySelectorAll(".section-heading,.about-title,.about-copy,.about-principle,.vision-intro,.direction-card,.domains-heading,.domain-row,.products-heading,.product-feature,.future-note,.method-heading,.method-steps article,.journey-content");
revealTargets.forEach((element,index)=>{
  element.classList.add("reveal");
  element.style.transitionDelay=(index%4)*75+"ms";
});
if("IntersectionObserver" in window){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}
    });
  },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
  revealTargets.forEach(element=>revealObserver.observe(element));
}else{
  revealTargets.forEach(element=>element.classList.add("is-visible"));
}

const sections=[...document.querySelectorAll("main section[id]")];
const navLinks=[...document.querySelectorAll(".main-nav a")];
if("IntersectionObserver" in window&&sections.length&&navLinks.length){
  const activeObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));
      }
    });
  },{rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(section=>activeObserver.observe(section));
}
