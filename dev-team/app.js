const input=document.getElementById("taskInput");
const saveButton=document.getElementById("saveTask");
const taskCount=document.getElementById("taskCount");
const charCount=document.getElementById("charCount");
const formMessage=document.getElementById("formMessage");
const draftList=document.getElementById("draftList");
const menuToggle=document.getElementById("menuToggle");
const sidebar=document.getElementById("sidebar");
const apiStatus=document.getElementById("apiStatus");
const apiDetails=document.getElementById("apiDetails");
const drafts=[];

const toArabicNumber=value=>String(value).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[Number(d)]);
input?.addEventListener("input",()=>{charCount.textContent=toArabicNumber(input.value.length)+" / ١٢٠٠"});
saveButton?.addEventListener("click",()=>{
  const value=input.value.trim();
  if(!value){formMessage.textContent="اكتب وصف المهمة أولاً.";input.focus();return}
  if(value.length<8){formMessage.textContent="أضف تفاصيل أكثر حتى تكون المسودة مفهومة.";input.focus();return}
  drafts.unshift({text:value,created:new Date()});
  taskCount.textContent=toArabicNumber(drafts.length);
  input.value="";
  charCount.textContent="٠ / ١٢٠٠";
  formMessage.textContent="حُفظت المسودة في ذاكرة هذه الصفحة فقط؛ لم تُحفظ في قاعدة بيانات.";
  renderDrafts();
});
function renderDrafts(){
  if(!draftList)return;
  if(!drafts.length){draftList.className="empty-state";draftList.innerHTML="<span>＋</span><b>لا توجد مسودات بعد</b><small>أضف أول مهمة من الحقل أعلاه.</small>";return}
  draftList.className="draft-list";
  draftList.replaceChildren();
  drafts.forEach((draft,index)=>{
    const article=document.createElement("article");
    article.className="draft-item";
    const paragraph=document.createElement("p");
    paragraph.textContent=draft.text;
    const meta=document.createElement("div");
    meta.className="draft-meta";
    meta.textContent="مسودة محلية #"+toArabicNumber(drafts.length-index)+" · "+draft.created.toLocaleTimeString("ar",{hour:"2-digit",minute:"2-digit"});
    article.append(paragraph,meta);
    draftList.append(article);
  });
}
async function checkApiHealth(){
  if(!apiStatus||!apiDetails)return;
  try{
    const response=await fetch("/api/health",{headers:{Accept:"application/json"},cache:"no-store"});
    if(!response.ok)throw new Error("health_check_failed");
    const data=await response.json();
    apiStatus.textContent="الخادم يعمل";
    apiDetails.textContent=data.taskStorage==="not_configured"
      ?"فحص الخادم ناجح. تخزين المهام الدائم وربط ChatGPT وGemini لم يُفعّل بعد."
      :"تم الاتصال بالخادم.";
  }catch{
    apiStatus.textContent="تعذّر الاتصال";
    apiDetails.textContent="لم نتمكن من فحص الخادم. افتح اللوحة عبر نشر Vercel، وليس بفتح الملف محلياً.";
  }
}
checkApiHealth();
menuToggle?.addEventListener("click",()=>{
  const opened=sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(opened));
  menuToggle.setAttribute("aria-label",opened?"إغلاق القائمة":"فتح القائمة");
});
sidebar?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{sidebar.classList.remove("open");menuToggle?.setAttribute("aria-expanded","false")}));
