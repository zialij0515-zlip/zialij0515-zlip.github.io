/* ============================================================
   全站共享：配置 + 数据 + 导航注入
   改内容优先改这里，四个页面自动同步
   ============================================================ */

/* ---- 联系方式（改这里，关于页卡片自动同步） ---- */
const SITE = {
  name: "赵梁君",
  nameEN: "Zia",
  phone: "18980750810",
  email: "13668320997@163.com",
  github: "https://github.com/zialij0515-zlip",
  githubLabel: "github.com/zialij0515-zlip",
  /* 简历入口：目前是 markdown 版的网页预览，后续拿到 PDF 只需把这一行改成
     resume: "assets/resume.pdf" 即可，关于页按钮不用动。 */
  resume: "resume.html",
  resumeLabel: "查看完整简历 ↗",
  /* 导航样式（改一个词全站生效）：
       side = 左侧竖排，只显示四个页面按钮，不显示名字（当前）
       top  = 顶部横条，含名字
       none = 完全不显示
     首页本身不调用 mountNav，始终没有导航。 */
  navStyle: "side"
};
const PENDING = v => String(v).includes("待填");

/* ---- 四个作品（顺序由用户指定） ---- */
const PROJECTS = [
  {
    id: "p1", no: "01",
    name: "TikTok 跨境运营课程答疑助手",
    short: "C 端 RAG 应用",
    tagline: "把 567 条真实学员问答，变成 24h 在线的答疑助手",
    desc: "面向 TikTok 跨境运营培训学员，用 Dify 工作流 + RAG 搭出自动答疑助手。真正的难点不是让模型回答，而是让它在该拒答时拒答、在答不上来时把问题沉淀下来。",
    bullets: [
      "意图分流：课程咨询 / 知识问答 / 闲聊 / 敏感词四条路径",
      "RAG 返回来源片段，检索依据可见",
      "未命中自动进待补充清单，形成数据飞轮",
      "敏感词合规拒答，绝不编造"
    ],
    metrics: [
      {n:"100%",l:"意图识别准确率"},
      {n:"85%",l:"知识命中率"},
      {n:"0%",l:"转人工率"}
    ],
    tech: ["Dify","RAG","rerank","意图分类","数据飞轮","Prompt 工程"],
    grad: "linear-gradient(135deg,#D9C7AE,#A9885F)",
    video: "videos/A_demo.mp4",
    demoNote: "",
    docs: [
      {t:"PRD 文档", f:"project-a-prd.md"},
      {t:"指标表与 20 条用例", f:"project-a-metrics.md"},
      {t:"兜底 Prompt 设计", f:"project-a-prompt.md"},
      {t:"批量测试操作清单", f:"project-a-test-runbook.md"},
      {t:"20 条测试问答（原始表格）", f:"project-a-20tests.xlsx"}
    ]
  },
  {
    id: "p2", no: "02",
    name: "WrenAI×基金养老数据治理",
    short: "B端语义层治理+SQL可视化",
    tagline: "让不懂 SQL 的业务同事用大白话问数，且口径永远一致",
    desc: "B 端 GenBI 项目。核心结论是：自然语言问数的瓶颈不在生成 SQL，而在把业务口径治理成唯一事实来源。实测把 SQL 正确率从 20% 拉到 90%。",
    bullets: [
      "PostgreSQL 合成数据底座：5 表约 12 万行",
      "WrenAI 语义层 + SQL pairs 黄金示例锁死口径",
      "6 大核心指标口径治理：AUM / 渗透率 / 定投留存 / 收益率 / 申赎 / 画像",
      "发现 Save as View 只是 UI 收藏，视图必须建模进 MDL 才生效"
    ],
    metrics: [
      {n:"20%→90%",l:"治理前后 SQL 正确率"},
      {n:"8.73亿",l:"养老 AUM 基线"},
      {n:"",l:"核心指标口径治理"}
    ],
    tech: ["WrenAI","Text2SQL","语义层 MDL","PostgreSQL","百炼 Qwen"],
    grad: "linear-gradient(135deg,#BFC9B8,#7E9483)",
    video: "videos/B_demo.mp4",
    demoNote: "",
    docs: [
      {t:"PRD 文档", f:"project-b-prd.md"},
      {t:"方案设计", f:"project-b-design.md"},
      {t:"语义层 MDL 与指标口径", f:"project-b-semantic-layer.md"},
      {t:"20 题测试清单", f:"project-b-test-questions.md"}
    ]
  },
  {
    id: "p3", no: "03",
    name: "AI智能测试平台",
    short: "AI + 测试工作流",
    tagline: "把需求文档变成可评审、可回滚、可覆盖检查的测试用例",
    desc: "直接绑定我 5 年测试背景的作品。通用 AI 生成用例不可控、不敢进流程，所以加了人工确认节点与确定性覆盖检查，把生成结果拉回工程可控范围。",
    bullets: [
      "RAG 检索需求文档与历史用例，LangGraph 编排生成流程",
      "人工确认节点 + 确定性覆盖检查，不漏核心路径",
      "测试用例集版本管理 / 回滚 / AI 修改",
      "技术选型：DeepSeek(LLM) + 阿里百炼(Embedding) + SQLite"
    ],
    metrics: [
      {n:"312",l:"pytest 用例全部通过"},
      {n:"1",l:"人工确认闭环"},
      {n:"100%",l:"覆盖检查确定性"}
    ],
    tech: ["RAG","LangGraph","LLM","Python","SQLite","覆盖检查"],
    grad: "linear-gradient(135deg,#D8BFA6,#AE7D5B)",
    video: "videos/C_demo.mp4",
    demoNote: "",
    docs: [
      {t:"GitHub 推送复盘", f:"project-c-github.md"},
      {t:"GitHub 推送指南", f:"project-c-github-guide.md"}
    ],
    github: "https://github.com/zialij0515-zlip/AI-Test-Case-Generator"
  },
  {
    id: "p4", no: "04",
    name: "轻减日记小程序",
    short: "Vibe Coding微信小程序",
    tagline: "一个人从 0 做完的减脂打卡工具：产品、设计、代码全包",
    desc: "独立完成的小程序，覆盖首页 / 记录 /数据/ 个人四大模块。把产品判断落到细节里：按打卡类型隔离数据、餐食自动算热量、用温暖微文案降低卡路里焦虑。",
    bullets: [
      "微信云开发：云函数 + 云数据库 + 云存储",
      "5 个集合按打卡类型隔离：早/午/晚餐、运动、放纵餐互不串数据",
      "97 项食物库 + 长词优先匹配，文本描述自动解析热量",
      "BMI / 体脂率分析，BMR 采用 Mifflin-St Jeor 公式"
    ],
    metrics: [
      {n:"97",l:"食物库条目"},
      {n:"5",l:"数据集合隔离"},
      {n:"3",l:"核心页面模块"}
    ],
    tech: ["微信小程序","云开发","JavaScript","WXML","热量解析"],
    grad: "linear-gradient(135deg,#E0CFB4,#BE9A72)",
    video: "videos/D_demo.mp4",
    demoNote: "",
    /* 小程序体验入口：只有本作品带 qr 字段，作品页才显示白卡 + 「扫码体验」标签。
       以后换码只需替换 assets/miniapp-qr.jpg 这一个同名文件。 */
    qr: { src:"assets/miniapp-qr.jpg", label:"扫码体验" },
    docs: [
      {t:"轻减日记PRD需求说明", f:"轻减日记PRD需求说明.md"},
      {t:"需求测试用例", f:"需求测试用例.md"},
      {t:"指标体系与埋点设计", f:"指标体系与埋点设计.md"},
      {t:"Case-study", f:"Case-study.md"}
    ]
  }
];

/* ---- 页面定义 ---- */
const PAGES = [
  {key:"home",     label:"首页",     side:"首页", url:"index.html"},
  {key:"works",    label:"项目作品", side:"作品", url:"works.html"},
  {key:"timeline", label:"经历",     side:"经历", url:"timeline.html"},
  {key:"about",    label:"关于我",   side:"关于", url:"about.html"}
];

/* ---- 注入导航：side 左侧竖排 / top 顶部横条 / none 不显示 ---- */
function mountNav(current){
  const el = document.getElementById("nav");
  if(!el) return;
  const style = SITE.navStyle || "side";
  if(style === "none"){ el.remove(); return; }
  el.className = "nav " + style;
  const links = PAGES.map(p =>
    `<a href="${p.url}" class="${p.key===current?"on":""}" title="${p.label}">${style==="side" ? (p.side||p.label) : p.label}</a>`
  ).join("");
  el.innerHTML = style === "top"
    ? `<div class="brand"><span class="mark">Z</span><span>${SITE.nameEN} · ${SITE.name}</span></div><div class="links">${links}</div>`
    : `<div class="links">${links}</div>`;
}

/* ---- 注入联系方式（只替换占位标记） ---- */
function mountContacts(){
  document.querySelectorAll("[data-contact]").forEach(el=>{
    const k = el.dataset.contact;
    let v = SITE[k];
    if(k === "github") v = SITE.githubLabel;
    if(k === "resume") v = SITE.resumeLabel;
    el.textContent = v;
    if(k === "email" && !PENDING(v)) el.href = "mailto:" + v;
    if(k === "phone" && !PENDING(v)) el.href = "tel:" + v.replace(/\s/g,"");
    if(k === "github") el.href = SITE.github;
    if(k === "resume"){ el.href = SITE.resume; el.target = "_blank"; el.rel = "noopener"; }
    if(PENDING(v)) el.classList.add("is-pending");
  });
}

/* ---- 滚动渐显 ---- */
function mountReveal(){
  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  },{threshold:.1});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
}

/* ---- 占位图 HTML ---- */
function phHTML(p, cls){
  return `<div class="ph ${cls||""}" style="--ph-bg:${p.grad}">
    ${p.demoNote?`<span class="ph-tag">${p.demoNote}</span>`:""}
    <span class="ph-no">Project ${p.no}</span>
    <div class="ph-label"><div class="ph-name">${p.name}</div><div class="ph-sub">${p.short}</div></div>
  </div>`;
}

document.addEventListener("DOMContentLoaded",()=>{ mountContacts(); mountReveal(); });
