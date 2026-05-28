import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@300;400;500&display=swap');

  :root {
    --rose: #F2C4CE;
    --peach: #FFDAB9;
    --saffron: #F4C072;
    --cream: #FDF6EC;
    --coral: #E8967A;
    --sand: #D4B896;
    --maroon: #6B2D3E;
    --gold: #C9A84C;
    --terra: #C26A4A;
    --dark: #2C1810;
    --mid: #6B4C3B;
    --muted: #A08070;
    --warm: #FEFAF5;
    --font-serif: 'Playfair Display', Georgia, serif;
    --font-body: 'EB Garamond', Georgia, serif;
    --font-mono: 'DM Mono', 'Courier New', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--warm); color: var(--dark); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 3px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0% { background-position:-300% center; } 100% { background-position:300% center; } }
  @keyframes float    { 0%,100% { transform:translateY(0) rotate(0); } 33% { transform:translateY(-12px) rotate(3deg); } 66% { transform:translateY(-6px) rotate(-2deg); } }
  @keyframes floatB   { 0%,100% { transform:translateY(0) rotate(0); } 50% { transform:translateY(-18px) rotate(5deg); } }
  @keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:0; } }
  @keyframes termLine { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
  @keyframes barGrow  { from { height:0; } to { height:var(--bh); } }
  @keyframes pulseGlow { 0%,100% { box-shadow:0 0 0 0 rgba(201,168,76,0.4); } 50% { box-shadow:0 0 0 10px rgba(201,168,76,0); } }
  @keyframes gradShift { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes scanline { 0% { transform:translateY(-100%); } 100% { transform:translateY(100vh); } }

  .pf   { font-family: var(--font-serif); }
  .mono { font-family: var(--font-mono); }
  .eb   { font-family: var(--font-body); }

  .gold-text {
    background: linear-gradient(90deg, var(--gold), var(--terra), var(--saffron), var(--maroon), var(--gold));
    background-size: 300% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: shimmer 5s linear infinite;
  }

  .reveal { opacity:0; transform:translateY(36px); transition:opacity 0.7s ease, transform 0.7s ease; }
  .revealed { opacity:1; transform:translateY(0); }

  nav {
    position:fixed; top:0; left:0; right:0; z-index:300;
    backdrop-filter:blur(16px) saturate(1.4);
    background:rgba(254,250,245,0.92);
    border-bottom:1px solid rgba(201,168,76,0.2);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 48px; height:62px;
  }
  .nav-logo { font-family:var(--font-serif); font-size:20px; color:var(--maroon); font-style:italic; letter-spacing:0.3px; }
  .nav-links { display:flex; gap:28px; }
  .nav-btn {
    background:none; border:none; border-bottom:1.5px solid transparent;
    padding-bottom:2px; cursor:pointer;
    font-family:var(--font-mono); font-size:11.5px; color:var(--muted);
    transition:color 0.2s, border-color 0.2s; letter-spacing:0.4px; text-transform:uppercase;
  }
  .nav-btn.active, .nav-btn:hover { color:var(--maroon); border-bottom-color:var(--gold); }

  section { padding:100px 48px; }

  .section-tag { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
  .tag-dot { width:6px; height:6px; background:var(--gold); border-radius:50%; }
  .tag-text { font-family:var(--font-mono); font-size:10px; color:var(--gold); letter-spacing:3px; text-transform:uppercase; }

  h2.sec-title { font-family:var(--font-serif); font-size:clamp(32px,5vw,50px); color:var(--dark); line-height:1.12; margin-bottom:6px; }

  .skill-tile {
    border:1.5px solid rgba(201,168,76,0.22); border-radius:14px; padding:20px; cursor:pointer;
    transition:transform 0.35s ease, box-shadow 0.35s ease, background 0.3s ease, min-height 0.3s ease;
    background:rgba(253,246,236,0.8); min-height:92px;
  }
  .skill-tile:hover { transform:translateY(-5px) scale(1.02); box-shadow:0 12px 32px rgba(0,0,0,0.11); }

  .proj-card {
    border-radius:16px; padding:28px; cursor:pointer;
    transition:transform 0.3s, box-shadow 0.3s;
    border:1.5px solid rgba(201,168,76,0.22);
    position:relative; overflow:hidden;
  }
  .proj-card:hover { transform:translateY(-5px); box-shadow:0 18px 48px rgba(0,0,0,0.14); }
  .proj-card::after {
    content:'↗'; position:absolute; bottom:24px; right:24px;
    font-size:18px; color:var(--maroon); opacity:0;
    transition:opacity 0.25s, transform 0.25s;
    transform:translateY(4px);
  }
  .proj-card:hover::after { opacity:0.7; transform:translateY(0); }

  .btn-primary {
    background:var(--maroon); color:var(--cream); border:none;
    padding:13px 30px; border-radius:8px; cursor:pointer;
    font-family:var(--font-mono); font-size:13px; letter-spacing:0.4px;
    transition:transform 0.2s, box-shadow 0.2s;
    box-shadow:0 4px 16px rgba(107,45,62,0.28);
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(107,45,62,0.42); }
  .btn-ghost {
    background:transparent; color:var(--maroon); border:1.5px solid rgba(107,45,62,0.35);
    padding:13px 30px; border-radius:8px; cursor:pointer;
    font-family:var(--font-mono); font-size:13px;
    transition:background 0.2s, border-color 0.2s;
  }
  .btn-ghost:hover { background:rgba(107,45,62,0.06); border-color:var(--maroon); }

  .matrix-cell {
    border-radius:12px; text-align:center; padding:22px 14px;
    cursor:pointer; transition:transform 0.25s, box-shadow 0.25s; position:relative;
  }
  .matrix-cell:hover { transform:scale(1.08); z-index:5; }

  .contact-link {
    display:flex; justify-content:space-between; align-items:center;
    background:rgba(253,246,236,0.85); border:1px solid rgba(201,168,76,0.2);
    border-radius:10px; padding:16px 24px; text-decoration:none;
    transition:transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .contact-link:hover { transform:translateX(5px); border-color:rgba(201,168,76,0.5); box-shadow:0 4px 16px rgba(201,168,76,0.12); }

  .terminal-wrap { background:#18080d; border-radius:14px; overflow:hidden; box-shadow:0 28px 72px rgba(0,0,0,0.6); }
  .term-bar { background:#260f15; padding:10px 16px; display:flex; align-items:center; gap:7px; }
  .term-dot { width:11px; height:11px; border-radius:50%; }
  .term-body { padding:24px; min-height:240px; font-family:var(--font-mono); font-size:12px; line-height:2; }

  .modal-bg {
    position:fixed; inset:0; background:rgba(20,6,10,0.7); backdrop-filter:blur(10px);
    z-index:600; display:flex; align-items:center; justify-content:center;
    padding:20px; animation:fadeIn 0.2s ease;
  }
  .modal-box {
    background:var(--cream); border-radius:20px; padding:38px; max-width:580px; width:100%;
    border:1.5px solid rgba(201,168,76,0.3); box-shadow:0 24px 72px rgba(0,0,0,0.2);
    animation:fadeUp 0.3s ease; max-height:90vh; overflow-y:auto;
  }

  .gh-cell { width:11px; height:11px; border-radius:2px; transition:transform 0.15s; }
  .gh-cell:hover { transform:scale(1.6); }

  footer {
    border-top:1px solid rgba(201,168,76,0.18); padding:26px 48px;
    display:flex; justify-content:space-between; align-items:center;
    background:rgba(253,246,236,0.6);
  }

  .stat-pill {
    background:rgba(253,246,236,0.85); border:1px solid rgba(201,168,76,0.2);
    border-radius:12px; padding:18px 22px; text-align:center;
    transition:transform 0.2s, border-color 0.2s;
  }
  .stat-pill:hover { transform:translateY(-3px); border-color:rgba(201,168,76,0.45); }
`;

/* ── SVG Decorative Components ── */
function JaaliOverlay() {
  return (
    <div style={{
      position:"absolute", inset:0, pointerEvents:"none", zIndex:0, opacity:0.055,
      backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A84C' stroke-width='0.6'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z'/%3E%3Ccircle cx='20' cy='20' r='5'/%3E%3Ccircle cx='2' cy='2' r='2'/%3E%3Ccircle cx='38' cy='2' r='2'/%3E%3Ccircle cx='2' cy='38' r='2'/%3E%3Ccircle cx='38' cy='38' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
    }} />
  );
}

function ArchFrame({ style={}, opacity=0.1 }) {
  return (
    <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", pointerEvents:"none", ...style }}>
      <svg width="420" height="200" viewBox="0 0 420 200" fill="none" opacity={opacity}>
        <path d="M210 6 Q320 6 320 110 L320 200 L100 200 L100 110 Q100 6 210 6" stroke="#C9A84C" strokeWidth="1.6" fill="none"/>
        <path d="M210 24 Q298 24 298 110 L298 200 L122 200 L122 110 Q122 24 210 24" stroke="#C9A84C" strokeWidth="0.8" fill="none"/>
        <path d="M210 44 Q276 44 276 110 L276 200 L144 200 L144 110 Q144 44 210 44" stroke="#C9A84C" strokeWidth="0.45" fill="none"/>
        <line x1="100" y1="110" x2="320" y2="110" stroke="#C9A84C" strokeWidth="0.5"/>
        <circle cx="210" cy="6" r="4" fill="#C9A84C" opacity="0.5"/>
      </svg>
    </div>
  );
}

function FlowerMotif({ size=28, color="#C9A84C", style={} }) {
  const petals = [0,45,90,135,180,225,270,315];
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ display:"block", ...style }}>
      <circle cx="14" cy="14" r="3.5" fill={color}/>
      {petals.map(a => (
        <ellipse key={a} cx="14" cy="14" rx="2" ry="5.5" fill={color} opacity="0.5"
          transform={`rotate(${a} 14 14) translate(0 -5.5)`}/>
      ))}
    </svg>
  );
}

/* ── Particle Canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x:-999, y:-999 });
  const particles = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const colors = ["#F2C4CE","#F4C072","#FFDAB9","#E8967A","#C9A84C","#D4B896","#E8B4B8"];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const N = 60;
    particles.current = Array.from({ length:N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4,
      r: Math.random()*3+1.5, color:colors[Math.floor(Math.random()*colors.length)],
      alpha:Math.random()*0.45+0.15,
    }));
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.current.forEach(p => {
        const dx=mouse.current.x-p.x, dy=mouse.current.y-p.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<130) { const f=(130-dist)/130; p.vx-=(dx/dist)*f*0.8; p.vy-=(dy/dist)*f*0.8; }
        p.vx*=0.97; p.vy*=0.97; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0) p.x=canvas.width; if(p.x>canvas.width) p.x=0;
        if(p.y<0) p.y=canvas.height; if(p.y>canvas.height) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color+Math.round(p.alpha*255).toString(16).padStart(2,"0");
        ctx.fill();
      });
      rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    const onMove = e => { const r=canvas.getBoundingClientRect(); mouse.current={x:e.clientX-r.left,y:e.clientY-r.top}; };
    canvas.parentElement.addEventListener("mousemove",onMove);
    window.addEventListener("resize",resize);
    return () => { cancelAnimationFrame(rafRef.current); canvas.parentElement?.removeEventListener("mousemove",onMove); window.removeEventListener("resize",resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none" }}/>;
}

/* ── Skills ── */
const SKILLS = [
  { name:"Machine Learning",  icon:"⚙",  tools:["XGBoost","LightGBM","Scikit-learn","Optuna"],      accent:"#6B2D3E", bg:"#F2C4CE",             viz:"pipe" },
  { name:"Deep Learning",     icon:"◎",  tools:["PyTorch","HuggingFace","RoBERTa","Transformers"],  accent:"#C26A4A", bg:"#FFDAB9",             viz:"neural" },
  { name:"Agentic AI",        icon:"◈",  tools:["LangGraph","LangChain","Ollama","LangSmith"],       accent:"#3D1420", bg:"rgba(242,196,206,0.7)",viz:"agent" },
  { name:"Data Analysis",     icon:"▣",  tools:["Pandas","NumPy","SQL","Polars"],                    accent:"#6B4C3B", bg:"#F4C072",             viz:"bar" },
  { name:"NLP",               icon:"◇",  tools:["spaCy","Transformers","NLTK","Text Analytics"],     accent:"#6B2D3E", bg:"#E8967A",             viz:"tok" },
  { name:"XAI & Eval",        icon:"◬",  tools:["SHAP","LIME","MLflow","Evidently"],                 accent:"#C26A4A", bg:"rgba(232,150,122,0.3)",viz:"metrics" },
  { name:"Cloud & Deploy",    icon:"◐",  tools:["Azure AI","Streamlit","FastAPI","GitHub Actions"],  accent:"#2C1810", bg:"rgba(201,168,76,0.28)",viz:"code" },
  { name:"Data Viz",          icon:"▤",  tools:["Plotly","Seaborn","Matplotlib","React"],            accent:"#6B2D3E", bg:"rgba(212,184,150,0.45)",viz:"bars2" },
];

function SkillViz({ type, accent }) {
  if (type==="pipe") {
    return (
      <div style={{ display:"flex",alignItems:"center",gap:3,margin:"10px 0" }}>
        {["Data","Clean","Train","Eval","Deploy"].map((s,i)=>(
          <div key={s} style={{ display:"flex",alignItems:"center",gap:3 }}>
            <div style={{ background:accent,color:"#FEFAF5",fontSize:8,padding:"2px 5px",borderRadius:3,fontFamily:"var(--font-mono)",animation:`fadeUp 0.3s ease ${i*0.08}s both` }}>{s}</div>
            {i<4&&<div style={{ width:6,height:1,background:"#C9A84C" }}/>}
          </div>
        ))}
      </div>
    );
  }
  if (type==="neural") {
    return (
      <div style={{ display:"flex",alignItems:"center",gap:8,margin:"10px 0" }}>
        {[3,5,5,4,2].map((n,li)=>(
          <div key={li} style={{ display:"flex",flexDirection:"column",gap:3 }}>
            {Array.from({length:n}).map((_,ni)=>(
              <div key={ni} style={{ width:7,height:7,borderRadius:"50%",background:li===1||li===2||li===3?accent:"#C9A84C",opacity:0.75 }}/>
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (type==="agent") {
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:3,margin:"10px 0" }}>
        {["Fetcher → Analyzer → Reporter","↓  LangGraph orchestration","↓  LangSmith traces"].map((l,i)=>(
          <div key={i} style={{ fontFamily:"var(--font-mono)",fontSize:8,color:accent,opacity:1-i*0.2 }}>{l}</div>
        ))}
      </div>
    );
  }
  if (type==="bar"||type==="bars2") {
    return (
      <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:32,margin:"10px 0" }}>
        {[0.55,0.82,0.4,0.91,0.63,0.75,0.5].map((v,i)=>(
          <div key={i} style={{ width:12,height:v*28,borderRadius:"3px 3px 0 0",background:`linear-gradient(180deg,${accent},#C9A84C)`,animation:`barGrow 0.4s ease ${i*0.06}s both`,"--bh":`${v*28}px` }}/>
        ))}
      </div>
    );
  }
  if (type==="tok") {
    return (
      <div style={{ display:"flex",flexWrap:"wrap",gap:3,margin:"10px 0" }}>
        {["[CLS]","implicit","bias","detect","[SEP]"].map((t,i)=>(
          <span key={t} style={{ fontSize:9,background:"rgba(107,45,62,0.12)",color:accent,border:`1px solid rgba(107,45,62,0.22)`,borderRadius:3,padding:"1px 5px",fontFamily:"var(--font-mono)",animation:`fadeUp 0.25s ease ${i*0.07}s both` }}>{t}</span>
        ))}
      </div>
    );
  }
  if (type==="metrics") {
    return (
      <div style={{ display:"flex",flexWrap:"wrap",gap:4,margin:"10px 0" }}>
        {[["AUC","0.847"],["F1","0.783"],["SHAP","✓"],["PR","0.79"]].map(([k,v])=>(
          <div key={k} style={{ background:"rgba(107,45,62,0.1)",color:accent,borderRadius:4,padding:"2px 6px",fontFamily:"var(--font-mono)",fontSize:9,lineHeight:1.4 }}>
            <div>{k}</div><div style={{ fontWeight:500 }}>{v}</div>
          </div>
        ))}
      </div>
    );
  }
  if (type==="code") {
    return (
      <div style={{ fontFamily:"var(--font-mono)",fontSize:9,color:accent,lineHeight:1.7,margin:"10px 0" }}>
        <div>$ streamlit run app.py</div>
        <div style={{ color:"#C9A84C" }}>✓  Deployed on Streamlit Cloud</div>
        <div style={{ color:"#81C784" }}>✓  Azure AI connected</div>
      </div>
    );
  }
  return null;
}

function SkillTile({ sk }) {
  const [hov,setHov] = useState(false);
  return (
    <div className="skill-tile" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?sk.bg:"rgba(253,246,236,0.8)",borderColor:hov?sk.accent:"rgba(201,168,76,0.22)",minHeight:hov?170:92,boxShadow:hov?`0 10px 28px ${sk.accent}22`:"none" }}>
      <div style={{ fontSize:20,marginBottom:6 }}>{sk.icon}</div>
      <div style={{ fontFamily:"var(--font-serif)",fontSize:13,fontWeight:600,color:sk.accent,lineHeight:1.25 }}>{sk.name}</div>
      {hov&&(
        <div style={{ animation:"fadeUp 0.2s ease" }}>
          <SkillViz type={sk.viz} accent={sk.accent}/>
          <div style={{ display:"flex",flexWrap:"wrap",gap:3 }}>
            {sk.tools.map(t=>(
              <span key={t} style={{ fontSize:9,background:"rgba(0,0,0,0.07)",color:sk.accent,padding:"1px 5px",borderRadius:3,fontFamily:"var(--font-mono)" }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Projects ── */
const PROJECTS = [
  {
    id:1, num:"01",
    title:"Enterprise Brain",
    subtitle:"Multi-Agent RAG Knowledge System",
    desc:"Zero-cost enterprise knowledge base — PDFs, Slack, email ingested. Hybrid BM25+dense retrieval, hallucination detection, RBAC, eval dashboard. Runs on Ollama locally.",
    longDesc:"A production-ready multi-agent knowledge retrieval system built entirely on free, local tooling. The architecture uses LangGraph for orchestration, ChromaDB for vector storage, BM25Okapi for sparse retrieval, and Reciprocal Rank Fusion to merge both. BAAI/bge-reranker-base re-ranks the top candidates. Hallucination detection combines LLM NLI checking with Jaccard token overlap. Full RBAC with bcrypt + JWT across 4 roles (admin/manager/analyst/viewer). TinyDB-backed sliding window memory per session. Eval dashboard with per-query metrics and Plotly visualisation.",
    tech:["LangGraph","ChromaDB","BM25 + RRF","BAAI/bge","Ollama (Llama3)","Streamlit","JWT/RBAC"],
    cat:"Agentic AI × RAG", badge:"Production-Style",
    bg:"linear-gradient(135deg, #F2C4CE 0%, #FFDAB9 100%)",
    github:"https://github.com/garimadiyawar/enterprise_brain",
  },
  {
    id:2, num:"02",
    title:"Pharma AE Monitor",
    subtitle:"3-Agent Drug Safety Signal Detection",
    desc:"Input a drug name, get a pharmacovigilance-grade report. Three LangGraph agents fetch FDA FAERS data, cluster reactions by organ system, and flag RED/YELLOW/GREEN signals.",
    longDesc:"A 3-agent LangGraph pipeline doing real pharmacovigilance work. Agent 1 hits the OpenFDA FAERS API and handles missing data with conditional routing. Agent 2 clusters adverse reactions by organ system using rule-based logic + LLM signal identification. Agent 3 writes a structured narrative report with RED/YELLOW/GREEN safety signal ratings — the kind of analysis IQVIA teams do at scale. Powered by Claude 3.5 Haiku, fully traced in LangSmith. Try it with ibuprofen, warfarin, or sildenafil.",
    tech:["LangGraph","Claude 3.5 Haiku","OpenFDA FAERS API","LangSmith","Streamlit","Python 3.11"],
    cat:"Healthcare AI × Agents", badge:"Live Data",
    bg:"linear-gradient(135deg, #FFDAB9 0%, rgba(244,192,114,0.6) 100%)",
    github:"https://github.com/garimadiyawar/Pharma-ae-monitor",
  },
  {
    id:3, num:"03",
    title:"BeNice",
    subtitle:"Implicit Bigotry Multi-Label Classifier",
    desc:"RoBERTa fine-tuned to catch what content moderation misses — plausibly deniable bias, emotionally framed prejudice, meme-speak. Multi-label: misogyny, racism, casteism, cyberbullying.",
    longDesc:"Research-grade multi-label NLP classifier targeting the hard cases in content moderation: not slurs or explicit threats, but normalised, emotionally framed, culturally coded prejudice. Fine-tuned RoBERTa-base with BCEWithLogitsLoss and positive class weighting to handle severe label imbalance. Minimal contrast pairs sharpen decision boundaries between similar but differently biased sentences. Per-label threshold tuning improves recall on minority classes. Structured error analysis focuses on sarcasm, reclaimed language, and cross-label confusion between cyberbullying and misogyny.",
    tech:["PyTorch","HuggingFace Transformers","RoBERTa-base","BCEWithLogitsLoss","scikit-learn","Contrast Pairs"],
    cat:"NLP Research × Social Good", badge:"Research",
    bg:"linear-gradient(135deg, rgba(232,150,122,0.5) 0%, #F2C4CE 100%)",
    github:"https://github.com/garimadiyawar/BeNice",
  },
  {
    id:4, num:"04",
    title:"Credit Risk — Thin-File Borrowers",
    subtitle:"Explainable ML + Fairness Audit",
    desc:"B.Tech CSE dissertation. XGBoost/LightGBM on Home Credit data (300k+ rows) with SHAP, LIME, Optuna tuning, thin-file cohort analysis, and a full demographic fairness audit.",
    longDesc:"Full ML pipeline on the Home Credit Default Risk dataset (7 files, 300k+ rows). Separate evaluation track for thin-file borrowers — people with minimal credit history who traditional scoring systems ignore. LR, RF, XGBoost, and LightGBM trained with stratified splits and Optuna TPE hyperparameter search. Explainability via SHAP (global feature importance, local prediction explanations, interaction values) and LIME. Fairness evaluation covers demographic parity, equalised odds, and bootstrap CI. XGBoost AUC ~0.78–0.80 on full dataset, ~0.74–0.78 on thin-file cohort. All random seeds fixed at 42.",
    tech:["XGBoost","LightGBM","SHAP","LIME","Optuna TPE","Fairness Eval","Home Credit Dataset"],
    cat:"FinTech × Explainable AI", badge:"Dissertation",
    bg:"linear-gradient(135deg, rgba(201,168,76,0.3) 0%, #F4C072 100%)",
    github:"https://github.com/garimadiyawar/Explainable-credit-risk-modelling-for-thin-file-borrowers",
  },
  {
    id:5, num:"05",
    title:"Demand Forecasting",
    subtitle:"LightGBM + ROI Simulation on M5",
    desc:"SKU-level retail forecasting on 30,000 SKUs. 17% MAE improvement over seasonal naive. 28-day inventory simulation shows ₹35,000+ annual savings at pilot scale. FastAPI + Streamlit.",
    longDesc:"End-to-end demand forecasting system on the M5 Forecasting dataset. Global LightGBM model trained across all SKUs using lag features (1, 7, 14, 28 days), rolling means, calendar effects, SNAP flags, and price data. Categorical features (SKU, store, category) use LightGBM's native support. Time-based train/validation split prevents leakage. ~17% MAE improvement over seasonal naive baseline on a noisy, intermittent-demand dataset. Scenario simulation freezes the trained model and runs 28-day inventory replenishment under realistic assumptions — demonstrating how forecast accuracy translates to actual cost savings.",
    tech:["LightGBM","Pandas","M5 Dataset","FastAPI","Streamlit","ROI Simulation"],
    cat:"Retail × Applied ML", badge:"End-to-End",
    bg:"linear-gradient(135deg, #D4B896 0%, rgba(244,192,114,0.5) 100%)",
    github:"https://github.com/garimadiyawar/demand-forecasting",
  },
  {
    id:6, num:"06",
    title:"Knowledge Mining & Compliance",
    subtitle:"Azure AI Document Intelligence — Live",
    desc:"Deployed Streamlit app scanning legal/financial/technical documents with Azure Text Analytics, Translator API, and Cognitive Search. Flags compliance risks in real time.",
    longDesc:"A fully deployed compliance risk detection system using Azure's AI services stack. Azure Text Analytics handles NLP (entity recognition, key phrase extraction, sentiment). Azure Translator enables multilingual document processing. Azure Cognitive Search provides full-text indexing and intelligent retrieval. The system scans uploaded documents and outputs structured risk flags with severity levels. Built with a GitHub Actions CI/CD workflow and deployed on Streamlit Cloud.",
    tech:["Azure Text Analytics","Azure Cognitive Search","Translator Text API","Streamlit","GitHub Actions","Python"],
    cat:"Cloud AI × Compliance", badge:"Deployed ↗",
    bg:"linear-gradient(135deg, rgba(242,196,206,0.4) 0%, rgba(201,168,76,0.2) 100%)",
    github:"https://github.com/garimadiyawar/Knowledge-Mining-and-Compliance-Risk-Detection-System",
    live:"https://compliance-risk-detection-system.streamlit.app/",
  },
  {
    id:7, num:"07",
    title:"Hum-to-Music AI",
    subtitle:"Audio ML + React Native Mobile App",
    desc:"Record a hum, get a full musical arrangement back. Pitch detection → melody → chords → multi-instrument arrangement → WAV. FastAPI + PyTorch backend, React Native Expo app.",
    longDesc:"Full-stack audio ML pipeline: record a hummed melody on your phone, receive a fully arranged WAV composition. Backend pipeline: audio upload → pitch detection (Librosa) → melody extraction → AI chord generation (PyTorch) → multi-instrument arrangement (PrettyMIDI) → WAV render (Pydub). Served via FastAPI, outputs accessible via static file endpoint. React Native Expo frontend handles audio recording, API communication, and real-time playback. The architecture supports genre conditioning and soundfont improvement as future extensions.",
    tech:["PyTorch","Librosa","PrettyMIDI","FastAPI","React Native","Expo","Pydub"],
    cat:"Audio ML × Mobile", badge:"Full-Stack",
    bg:"linear-gradient(135deg, rgba(232,150,122,0.3) 0%, #FFDAB9 100%)",
    github:"https://github.com/garimadiyawar/hum-to-music-ai",
  },
  {
    id:8, num:"08",
    title:"Gen Z Survival Index",
    subtitle:"Experimental Data Research — WIP",
    desc:"Which cities can Gen Z actually survive in? Cost of living, AI job postings, youth unemployment, remote work stats, GDP — combined into a composite city liveability index.",
    longDesc:"An experimental data research project asking a genuinely interesting question: which cities are most livable for Gen Z, factoring in not just affordability but AI job availability, remote work culture, youth unemployment rates, and quality of life indicators. Multiple datasets combined: cost of living indices, GDP per capita, youth unemployment statistics, AI job posting counts, and remote work availability. Built with Pandas, SQL, and Jupyter notebooks. React dashboard prototype in progress for interactive city exploration.",
    tech:["Pandas","SQL","Jupyter","React","Data Collection","Composite Indexing"],
    cat:"Data Research × Social", badge:"WIP",
    bg:"linear-gradient(135deg, rgba(212,184,150,0.4) 0%, rgba(244,192,114,0.3) 100%)",
    github:"https://github.com/garimadiyawar/genz_survival_index",
  },
];

function ProjectCard({ proj, onClick }) {
  return (
    <div className="proj-card" style={{ background:proj.bg }} onClick={onClick}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
        <span style={{ fontFamily:"var(--font-mono)",fontSize:10,color:"#6B4C3B",letterSpacing:0.4 }}>{proj.cat}</span>
        <span style={{ fontSize:10,background:"rgba(107,45,62,0.15)",color:"#6B2D3E",padding:"2px 9px",borderRadius:10,fontFamily:"var(--font-mono)" }}>{proj.badge}</span>
      </div>
      <div style={{ fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(107,45,62,0.5)",letterSpacing:2,marginBottom:6 }}>{proj.num}</div>
      <h3 style={{ fontFamily:"var(--font-serif)",fontSize:20,color:"#2C1810",marginBottom:4,lineHeight:1.2 }}>{proj.title}</h3>
      <div style={{ fontFamily:"var(--font-body)",fontSize:13,color:"#A08070",fontStyle:"italic",marginBottom:12 }}>{proj.subtitle}</div>
      <p style={{ fontSize:15,color:"#6B4C3B",lineHeight:1.7,marginBottom:20 }}>{proj.desc}</p>
      <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
        {proj.tech.slice(0,4).map(t=>(
          <span key={t} style={{ fontSize:10,background:"rgba(0,0,0,0.07)",color:"#3D1420",padding:"2px 8px",borderRadius:10,fontFamily:"var(--font-mono)" }}>{t}</span>
        ))}
        {proj.tech.length>4&&<span style={{ fontSize:10,color:"#A08070",fontFamily:"var(--font-mono)",padding:"2px 4px" }}>+{proj.tech.length-4} more</span>}
      </div>
    </div>
  );
}

function ProjectModal({ proj, onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:18 }}>
          <span style={{ fontFamily:"var(--font-mono)",fontSize:10,color:"#C9A84C",letterSpacing:1.5 }}>{proj.cat.toUpperCase()}</span>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#A08070",lineHeight:1,padding:0 }}>×</button>
        </div>
        <div style={{ fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(107,45,62,0.4)",letterSpacing:2,marginBottom:6 }}>{proj.num}</div>
        <h2 style={{ fontFamily:"var(--font-serif)",fontSize:26,color:"#2C1810",marginBottom:4,lineHeight:1.2 }}>{proj.title}</h2>
        <div style={{ fontFamily:"var(--font-body)",fontSize:15,color:"#A08070",fontStyle:"italic",marginBottom:16 }}>{proj.subtitle}</div>
        <p style={{ color:"#6B4C3B",lineHeight:1.85,fontSize:16,marginBottom:22 }}>{proj.longDesc}</p>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:28 }}>
          {proj.tech.map(t=>(
            <span key={t} style={{ background:"rgba(107,45,62,0.1)",color:"#6B2D3E",border:"1px solid rgba(107,45,62,0.2)",padding:"4px 12px",borderRadius:20,fontSize:12,fontFamily:"var(--font-mono)" }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
          {proj.github&&(
            <a href={proj.github} target="_blank" rel="noreferrer">
              <button className="btn-primary">View on GitHub →</button>
            </a>
          )}
          {proj.live&&(
            <a href={proj.live} target="_blank" rel="noreferrer">
              <button className="btn-ghost">Live Demo ↗</button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Confusion Matrix ── */
const CM_DATA = { tp:85, fp:12, fn:8, tn:95 };
const CM_CELLS = [
  { k:"tp", label:"TP", val:85, name:"True Positives",  bg:"#E8F5E9", bdr:"#4CAF50", blurb:"Correctly predicted Default → actual Default. The model caught the risk. These are the wins." },
  { k:"fp", label:"FP", val:12, name:"False Positives", bg:"#FFF3E0", bdr:"#FF9800", blurb:"Model said Default → actually No Default. Type I error. Unnecessary loan rejections — real harm to real people." },
  { k:"fn", label:"FN", val:8,  name:"False Negatives", bg:"#FFEBEE", bdr:"#F44336", blurb:"Model missed a real Default. Type II error — the costliest mistake in credit risk. Someone defaults who shouldn't have been approved." },
  { k:"tn", label:"TN", val:95, name:"True Negatives",  bg:"#E3F2FD", bdr:"#2196F3", blurb:"Correctly predicted No Default → actual No Default. Clean, confident predictions." },
];
function computeMetrics({ tp,fp,fn,tn }) {
  const total=tp+fp+fn+tn;
  return { precision:tp/(tp+fp), recall:tp/(tp+fn), specificity:tn/(tn+fp), "f1 score":(2*tp)/(2*tp+fp+fn), accuracy:(tp+tn)/total };
}

function ConfusionMatrix() {
  const [hov,setHov] = useState(null);
  const metrics = computeMetrics(CM_DATA);
  const hovCell = CM_CELLS.find(c=>c.k===hov);

  return (
    <div style={{ display:"flex",gap:40,flexWrap:"wrap",alignItems:"flex-start" }}>
      <div>
        <div style={{ fontFamily:"var(--font-mono)",fontSize:9,color:"#A08070",textAlign:"center",marginBottom:10,letterSpacing:0.5 }}>← PREDICTED →</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:280 }}>
          {CM_CELLS.map(cell=>(
            <div key={cell.k} className="matrix-cell"
              onMouseEnter={()=>setHov(cell.k)} onMouseLeave={()=>setHov(null)}
              style={{ background:hov===cell.k?cell.bg:"rgba(253,246,236,0.9)",border:`2px solid ${hov===cell.k?cell.bdr:"rgba(201,168,76,0.2)"}`,boxShadow:hov===cell.k?`0 8px 24px ${cell.bdr}44`:"none" }}>
              <div style={{ fontSize:32,fontWeight:700,fontFamily:"var(--font-mono)",color:hov===cell.k?cell.bdr:"#2C1810" }}>{cell.val}</div>
              <div style={{ fontSize:11,color:"#A08070",fontFamily:"var(--font-mono)",marginTop:2 }}>{cell.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:"var(--font-mono)",fontSize:9,color:"#A08070",textAlign:"center",marginTop:10,letterSpacing:0.5 }}>↕ ACTUAL ↕</div>
      </div>
      <div style={{ flex:1,minWidth:220 }}>
        {hovCell?(
          <div style={{ animation:"fadeUp 0.2s ease" }}>
            <div style={{ fontFamily:"var(--font-serif)",fontSize:18,color:"#2C1810",marginBottom:8 }}>{hovCell.name}</div>
            <div style={{ fontFamily:"var(--font-body)",fontSize:15,color:"#6B4C3B",marginBottom:20,lineHeight:1.7 }}>{hovCell.blurb}</div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {Object.entries(metrics).map(([k,v])=>(
                <div key={k} style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:11,color:"#6B4C3B",minWidth:84 }}>{k}</span>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:80,height:5,background:"rgba(212,184,150,0.4)",borderRadius:3,overflow:"hidden" }}>
                      <div style={{ width:`${v*100}%`,height:"100%",background:"#C9A84C",borderRadius:3,transition:"width 0.5s ease" }}/>
                    </div>
                    <span style={{ fontFamily:"var(--font-mono)",fontSize:11,color:"#6B2D3E",minWidth:38 }}>{v.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ):(
          <div style={{ color:"#A08070",fontFamily:"var(--font-body)",fontSize:16,fontStyle:"italic",lineHeight:1.8,paddingTop:8 }}>
            From the credit risk dissertation — 200 test predictions on thin-file borrowers.
            Hover each quadrant to see what the model got right, and what it missed.{" "}
            <span style={{ color:"#6B2D3E" }}>False negatives carry the heaviest real-world cost.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── GitHub Activity ── */
function GitHubActivity() {
  const [imgOk, setImgOk] = useState(true);
  return imgOk ? (
    <img
      src="https://ghchart.rshah.org/C9A84C/garimadiyawar"
      alt="GitHub contribution chart"
      style={{ width:"100%", height:"auto", display:"block", borderRadius:4 }}
      onError={()=>setImgOk(false)}
    />
  ) : (
    <div style={{ fontFamily:"var(--font-mono)",fontSize:13,color:"#A08070",padding:"20px 0" }}>
      Chart unavailable — view at{" "}
      <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer" style={{ color:"#C9A84C" }}>github.com/garimadiyawar ↗</a>
    </div>
  );
}

/* ── Terminal Easter Egg ── */
const TERM_LINES = [
  { t:"cmd",  s:"$ python train.py --model xgboost --dataset home_credit --epochs 100" },
  { t:"info", s:"Loading: application_train.csv + 6 auxiliary files — 307,511 samples" },
  { t:"info", s:"Thin-file cohort identified — 41,208 borrowers flagged" },
  { t:"info", s:"SMOTE oversampling: class imbalance corrected (1:1 ratio)" },
  { t:"info", s:"Optuna TPE hyperparameter search — 50 trials..." },
  { t:"prog", s:"Epoch  10/100  ▓░░░░░░░░░  loss: 0.4821  auc: 0.731" },
  { t:"prog", s:"Epoch  25/100  ▓▓▓░░░░░░░  loss: 0.3142  auc: 0.793" },
  { t:"prog", s:"Epoch  50/100  ▓▓▓▓▓░░░░░  loss: 0.2287  auc: 0.821" },
  { t:"prog", s:"Epoch  75/100  ▓▓▓▓▓▓▓░░░  loss: 0.1934  auc: 0.840" },
  { t:"prog", s:"Epoch 100/100  ▓▓▓▓▓▓▓▓▓▓  loss: 0.1721  auc: 0.847" },
  { t:"ok",   s:"✓  AUC-ROC: 0.847  |  F1: 0.783  |  Accuracy: 0.891" },
  { t:"ok",   s:"✓  Thin-file AUC: 0.762  (gap: 0.085 — fairness flag raised)" },
  { t:"ok",   s:"✓  SHAP values computed → shap_output/" },
  { t:"ok",   s:"✓  Demographic parity gap: 0.17 — within acceptable threshold" },
  { t:"ok",   s:"✓  Model saved → checkpoints/xgb_credit_v3.pkl 🎉" },
];
const TERM_COLORS = { cmd:"#F4C072", info:"rgba(242,196,206,0.85)", prog:"#D4B896", ok:"#81C784" };

function Terminal({ onClose }) {
  const [lines,setLines] = useState([]);
  useEffect(()=>{
    let i=0;
    const id=setInterval(()=>{ if(i<TERM_LINES.length){ setLines(p=>[...p,TERM_LINES[i]]); i++; } else clearInterval(id); },200);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div style={{ maxWidth:640,width:"100%" }} onClick={e=>e.stopPropagation()}>
        <div className="terminal-wrap">
          <div className="term-bar">
            <div className="term-dot" style={{ background:"#F44336" }}/>
            <div className="term-dot" style={{ background:"#FF9800" }}/>
            <div className="term-dot" style={{ background:"#4CAF50" }}/>
            <span style={{ marginLeft:12,fontFamily:"var(--font-mono)",fontSize:11,color:"#A08070" }}>train.py — garima@ml-lab</span>
          </div>
          <div className="term-body">
            {lines.map((l,i)=>(
              <div key={i} style={{ color:TERM_COLORS[l.t],animation:"termLine 0.15s ease both" }}>{l.s}</div>
            ))}
            <div style={{ display:"inline-block",width:8,height:14,background:"#F4C072",animation:"blink 1s step-end infinite",verticalAlign:"middle",marginTop:4 }}/>
          </div>
        </div>
        <div style={{ textAlign:"center",marginTop:12,fontFamily:"var(--font-mono)",fontSize:10,color:"rgba(201,168,76,0.7)",letterSpacing:0.5 }}>
          ✦ you found the easter egg — click anywhere to close ✦
        </div>
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function Portfolio() {
  const [activeProj,setActiveProj] = useState(null);
  const [showTerm,setShowTerm] = useState(false);
  const [activeSec,setActiveSec] = useState("home");
  const [keyBuf,setKeyBuf] = useState("");
  const [ghRepos,setGhRepos] = useState(null);

  useEffect(()=>{
    fetch("https://api.github.com/users/garimadiyawar")
      .then(r=>r.ok?r.json():Promise.reject())
      .then(d=>setGhRepos(d.public_repos))
      .catch(()=>{});
  },[]);

  useEffect(()=>{ const tag=document.createElement("style"); tag.textContent=CSS; document.head.appendChild(tag); return()=>document.head.removeChild(tag); },[]);

  useEffect(()=>{
    const ob=new IntersectionObserver(entries=>entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add("revealed"); }),{ threshold:0.08 });
    const t=setTimeout(()=>document.querySelectorAll(".reveal").forEach(el=>ob.observe(el)),100);
    return()=>{ clearTimeout(t); ob.disconnect(); };
  },[]);

  useEffect(()=>{
    const secs=["home","about","skills","projects","demo","github","contact"];
    const h=()=>{ for(const id of secs){ const el=document.getElementById(id); if(el){ const r=el.getBoundingClientRect(); if(r.top<=80&&r.bottom>80){ setActiveSec(id); break; } } } };
    window.addEventListener("scroll",h);
    return()=>window.removeEventListener("scroll",h);
  },[]);

  useEffect(()=>{
    const h=e=>{ const buf=(keyBuf+e.key).slice(-14); setKeyBuf(buf); if(buf.toLowerCase().includes("train model")){ setShowTerm(true); setKeyBuf(""); } };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[keyBuf]);

  const go=id=>document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  const NAV=[["home","Home"],["about","About"],["skills","Skills"],["projects","Work"],["demo","ML Lab"],["github","Activity"],["contact","Contact"]];

  return (
    <div style={{ background:"#FEFAF5",minHeight:"100vh" }}>

      {/* NAV */}
      <nav>
        <div className="nav-logo">Garima Diyawar</div>
        <div className="nav-links">
          {NAV.map(([id,lb])=>(
            <button key={id} className={`nav-btn${activeSec===id?" active":""}`} onClick={()=>go(id)}>{lb}</button>
          ))}
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="home" style={{
        minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        position:"relative",overflow:"hidden",paddingTop:60,
        background:"linear-gradient(135deg,#FDF6EC 0%,rgba(255,218,185,0.6) 30%,rgba(242,196,206,0.55) 65%,#FDF6EC 100%)"
      }}>
        <ParticleCanvas/>
        <JaaliOverlay/>
        <ArchFrame style={{ top:60 }} opacity={0.12}/>

        <div style={{ position:"absolute",top:110,left:70,animation:"float 4.5s ease-in-out infinite",zIndex:1 }}>
          <FlowerMotif size={52} color="#C26A4A" style={{ opacity:0.38 }}/>
        </div>
        <div style={{ position:"absolute",top:130,right:80,animation:"floatB 5.5s ease-in-out 1s infinite",zIndex:1 }}>
          <FlowerMotif size={38} color="#C9A84C" style={{ opacity:0.3 }}/>
        </div>
        <div style={{ position:"absolute",bottom:160,left:100,animation:"float 3.8s ease-in-out 0.5s infinite",zIndex:1 }}>
          <FlowerMotif size={24} color="#6B2D3E" style={{ opacity:0.22 }}/>
        </div>
        <div style={{ position:"absolute",bottom:180,right:110,animation:"floatB 4.8s ease-in-out 2s infinite",zIndex:1 }}>
          <FlowerMotif size={18} color="#E8967A" style={{ opacity:0.2 }}/>
        </div>

        <div style={{ textAlign:"center",position:"relative",zIndex:2,padding:"0 24px",maxWidth:740 }}>
          <div className="mono" style={{ fontSize:10,color:"#C9A84C",letterSpacing:4,marginBottom:22,textTransform:"uppercase",animation:"fadeUp 0.6s ease 0.1s both" }}>
            B.Tech CSE · AI/ML Engineer · Data Research · 2025
          </div>

          <h1 className="pf" style={{ fontSize:"clamp(58px,10vw,108px)",color:"#2C1810",lineHeight:1.07,marginBottom:20,animation:"fadeUp 0.7s ease 0.2s both" }}>
            Garima<br/>
            <em className="gold-text">Diyawar</em>
          </h1>

          <div style={{ display:"flex",alignItems:"center",gap:14,margin:"0 auto 22px",maxWidth:300,animation:"fadeUp 0.7s ease 0.3s both" }}>
            <div style={{ flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.45))" }}/>
            <FlowerMotif size={16} color="#C9A84C" style={{ opacity:0.75 }}/>
            <div style={{ flex:1,height:1,background:"linear-gradient(90deg,rgba(201,168,76,0.45),transparent)" }}/>
          </div>

          <p className="pf" style={{ fontSize:"clamp(16px,2.2vw,21px)",color:"#6B4C3B",lineHeight:1.8,fontStyle:"italic",maxWidth:580,margin:"0 auto 44px",animation:"fadeUp 0.7s ease 0.4s both" }}>
            AI/ML engineer building systems that learn, reason, and explain themselves —
            from multi-agent RAG pipelines to explainable credit models and drug safety detectors.
          </p>

          <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",animation:"fadeUp 0.7s ease 0.5s both" }}>
            <button className="btn-primary" onClick={()=>go("projects")}>View Work</button>
            <button className="btn-ghost" onClick={()=>go("contact")}>Get in Touch</button>
            <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer">
              <button className="btn-ghost" style={{ borderColor:"rgba(201,168,76,0.4)",color:"#A08070" }}>GitHub ↗</button>
            </a>
          </div>

          <div className="mono" style={{ marginTop:52,fontSize:10,color:"rgba(201,168,76,0.6)",letterSpacing:1.5,animation:"fadeUp 0.7s ease 0.8s both" }}>
            ✦ type "train model" anywhere for a surprise ✦
          </div>
        </div>

        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:120,background:"linear-gradient(transparent,#FEFAF5)",pointerEvents:"none" }}/>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" style={{ padding:"100px 48px" }}>
        <div style={{ maxWidth:980,margin:"0 auto" }}>
          <div className="reveal">
            <div className="section-tag"><div className="tag-dot"/><span className="tag-text">About</span></div>
            <h2 className="sec-title pf">The mind behind<br/><em>the models</em></h2>
          </div>

          <div className="reveal" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,marginTop:44,alignItems:"start" }}>
            <div>
              {[
                "I'm Garima — a B.Tech CSE graduate with a deep obsession with making sense of messy data and building ML systems that actually explain themselves.",
                "My work spans the width of applied AI: multi-agent RAG pipelines with hybrid retrieval and hallucination detection, NLP classifiers for implicit bias in online text, explainable credit risk models for thin-file borrowers, drug safety signal detection from real FDA data, and audio ML that turns a hum into a full musical arrangement.",
                "I believe a model you can't explain is a model you can't trust — so explainability and fairness aren't afterthoughts in my work, they're the point.",
              ].map((para,i)=>(
                <p key={i} style={{ fontFamily:"var(--font-body)",fontSize:i===0?18:16,color:i===0?"#4A2E22":"#6B4C3B",lineHeight:1.85,marginBottom:18 }}>{para}</p>
              ))}
            </div>

            <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
              {[
                { l:"Education",  v:"B.Tech — Computer Science & Engineering" },
                { l:"Focus",      v:"Agentic AI · Explainable ML · NLP · Audio ML" },
                { l:"Stack",      v:"Python · LangGraph · PyTorch · SHAP · Azure AI · Streamlit" },
                { l:"Projects",   v:"8 end-to-end systems built and shipped" },
                { l:"Looking for",v:"AI/ML roles, research collabs, interesting problems" },
                { l:"Aesthetic",  v:"Jaali windows · strong filter coffee · late-night notebooks" },
              ].map(({ l,v })=>(
                <div key={l} style={{ background:"rgba(253,246,236,0.85)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,padding:"13px 18px",display:"flex",gap:16,alignItems:"flex-start" }}>
                  <span className="mono" style={{ fontSize:9,color:"#C9A84C",letterSpacing:1,minWidth:80,paddingTop:3,flexShrink:0 }}>{l.toUpperCase()}</span>
                  <span style={{ fontFamily:"var(--font-body)",fontSize:15,color:"#4A2E22",lineHeight:1.5 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="reveal" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginTop:44 }}>
            {[
              { n:"8", l:"Projects shipped" },
              { n:ghRepos!=null?String(ghRepos):"…", l:"Public repos" },
              { n:"0.847", l:"Best AUC (credit risk)" },
              { n:"17%", l:"MAE improvement (M5)" },
            ].map(({ n,l })=>(
              <div key={l} className="stat-pill">
                <div style={{ fontFamily:"var(--font-mono)",fontSize:26,color:"#6B2D3E",fontWeight:500,lineHeight:1 }}>{n}</div>
                <div style={{ fontFamily:"var(--font-body)",fontSize:13,color:"#A08070",marginTop:6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills" style={{ padding:"80px 48px",background:"linear-gradient(180deg,#FEFAF5 0%,rgba(242,196,206,0.1) 100%)",position:"relative",overflow:"hidden" }}>
        <JaaliOverlay/>
        <div style={{ maxWidth:1060,margin:"0 auto",position:"relative",zIndex:1 }}>
          <div className="reveal" style={{ textAlign:"center",marginBottom:52 }}>
            <div className="section-tag" style={{ justifyContent:"center" }}>
              <FlowerMotif size={12} color="#C9A84C" style={{ opacity:0.7 }}/>
              <span className="tag-text">Skills & Tools</span>
              <FlowerMotif size={12} color="#C9A84C" style={{ opacity:0.7 }}/>
            </div>
            <h2 className="sec-title pf" style={{ textAlign:"center" }}>The Toolkit</h2>
            <p style={{ fontFamily:"var(--font-body)",color:"#A08070",fontSize:15,fontStyle:"italic",marginTop:8 }}>Hover any tile to explore the domain</p>
          </div>
          <div className="reveal" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
            {SKILLS.map(sk=><SkillTile key={sk.name} sk={sk}/>)}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" style={{ padding:"80px 48px" }}>
        <div style={{ maxWidth:1060,margin:"0 auto" }}>
          <div className="reveal" style={{ marginBottom:48 }}>
            <div className="section-tag"><div className="tag-dot"/><span className="tag-text">Work & Experiments</span></div>
            <h2 className="sec-title pf">Projects &<br/><em>Research</em></h2>
            <p style={{ fontFamily:"var(--font-body)",color:"#A08070",fontSize:15,fontStyle:"italic",marginTop:8 }}>
              Click any card to go deep
            </p>
          </div>
          <div className="reveal" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18 }}>
            {PROJECTS.map(p=><ProjectCard key={p.id} proj={p} onClick={()=>setActiveProj(p)}/>)}
          </div>
        </div>
      </section>

      {/* ══ ML LAB / CONFUSION MATRIX ══ */}
      <section id="demo" style={{ padding:"80px 48px",background:"linear-gradient(180deg,rgba(244,192,114,0.06) 0%,rgba(242,196,206,0.1) 100%)" }}>
        <div style={{ maxWidth:920,margin:"0 auto" }}>
          <div className="reveal" style={{ marginBottom:44 }}>
            <div className="section-tag"><div className="tag-dot"/><span className="tag-text">Dissertation Results</span></div>
            <h2 className="sec-title pf">Confusion Matrix<br/><em>Explorer</em></h2>
            <p style={{ fontFamily:"var(--font-body)",color:"#6B4C3B",fontSize:16,lineHeight:1.7,maxWidth:520,marginTop:10 }}>
              From the credit risk dissertation — 200 test predictions on thin-file borrowers. Hover each quadrant to understand what the numbers actually mean.
            </p>
          </div>

          <div className="reveal" style={{ background:"#FDF6EC",border:"1.5px solid rgba(201,168,76,0.22)",borderRadius:18,padding:"40px 40px 32px",position:"relative",overflow:"hidden" }}>
            <JaaliOverlay/>
            <div style={{ position:"relative",zIndex:1 }}><ConfusionMatrix/></div>
          </div>

          <div className="reveal" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:22 }}>
            {[
              { q:"What makes a good model?", a:"High precision and recall together. In credit risk, false negatives — missed defaults — carry the heaviest real-world cost." },
              { q:"Why not just use accuracy?", a:"Accuracy misleads on imbalanced classes. A model predicting 'safe' always can hit 90% accuracy while missing every default." },
              { q:"Where does SHAP come in?", a:"Beyond metrics — SHAP explains why each prediction was made, making the model legible to loan officers, regulators, and borrowers." },
            ].map(({ q,a })=>(
              <div key={q} style={{ background:"rgba(253,246,236,0.75)",border:"1px solid rgba(201,168,76,0.18)",borderRadius:10,padding:18 }}>
                <div style={{ fontFamily:"var(--font-serif)",fontSize:13,color:"#6B2D3E",marginBottom:8,lineHeight:1.4 }}>{q}</div>
                <div style={{ fontFamily:"var(--font-body)",fontSize:13,color:"#6B4C3B",lineHeight:1.7 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GITHUB ACTIVITY ══ */}
      <section id="github" style={{ padding:"80px 48px" }}>
        <div style={{ maxWidth:860,margin:"0 auto" }}>
          <div className="reveal" style={{ marginBottom:36 }}>
            <div className="section-tag"><div className="tag-dot"/><span className="tag-text">GitHub Activity</span></div>
            <h2 className="sec-title pf">Commit by<br/><em>commit</em></h2>
          </div>
          <div className="reveal" style={{ background:"#FDF6EC",border:"1.5px solid rgba(201,168,76,0.2)",borderRadius:16,padding:32,position:"relative",overflow:"hidden" }}>
            <JaaliOverlay/>
            <div style={{ position:"relative",zIndex:1 }}>
              <GitHubActivity/>
              <div style={{ marginTop:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
                <div>
                  <div style={{ fontFamily:"var(--font-serif)",fontSize:17,color:"#2C1810",marginBottom:4 }}>Consistently building</div>
                  <div style={{ fontFamily:"var(--font-body)",fontSize:14,color:"#A08070" }}>
                    Live from GitHub · <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer" style={{ color:"#C9A84C",textDecoration:"none" }}>github.com/garimadiyawar ↗</a>
                  </div>
                </div>
                {[[ghRepos!=null?String(ghRepos):"…","Public repos"],["8","Projects"],["∞","Experiments"]].map(([n,l])=>(
                  <div key={l} style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"var(--font-mono)",fontSize:24,color:"#6B2D3E",fontWeight:500 }}>{n}</div>
                    <div style={{ fontFamily:"var(--font-body)",fontSize:12,color:"#A08070" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{ padding:"80px 48px 130px",position:"relative",overflow:"hidden" }}>
        <ArchFrame style={{ top:0 }} opacity={0.08}/>
        <JaaliOverlay/>
        <div style={{ maxWidth:600,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <div className="reveal">
            <div className="section-tag" style={{ justifyContent:"center" }}>
              <FlowerMotif size={12} color="#C9A84C" style={{ opacity:0.7 }}/>
              <span className="tag-text">Get in Touch</span>
              <FlowerMotif size={12} color="#C9A84C" style={{ opacity:0.7 }}/>
            </div>
            <h2 className="sec-title pf">Let's talk about<br/><em>data & models</em></h2>
            <p style={{ fontFamily:"var(--font-body)",color:"#6B4C3B",fontSize:17,lineHeight:1.8,margin:"16px auto 42px",maxWidth:500 }}>
              Open to AI/ML roles, research collaborations, or just a good conversation about
              agentic systems, explainable AI, or why thin-file borrowers deserve better models.
            </p>
          </div>

          <div className="reveal" style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {[
              { l:"Email",    v:"garimadiyawar@gmail.com",   h:"mailto:garimadiyawar@gmail.com" },
              { l:"GitHub",   v:"github.com/garimadiyawar", h:"https://github.com/garimadiyawar" },
              { l:"LinkedIn", v:"linkedin.com/in/garima-diyawar", h:"https://www.linkedin.com/in/garima-diyawar" },
              { l:"Live App", v:"compliance-risk-detection-system.streamlit.app", h:"https://compliance-risk-detection-system.streamlit.app/" },
            ].map(({ l,v,h })=>(
              <a key={l} href={h} target={h.startsWith("http")?"_blank":undefined} rel="noreferrer" className="contact-link">
                <span className="mono" style={{ fontSize:10,color:"#C9A84C",letterSpacing:1 }}>{l.toUpperCase()}</span>
                <span style={{ fontFamily:"var(--font-body)",fontSize:15,color:"#6B2D3E" }}>{v}</span>
              </a>
            ))}
          </div>

          <div className="reveal" style={{ marginTop:52 }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:12,background:"rgba(253,246,236,0.8)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,padding:"12px 24px" }}>
              <FlowerMotif size={14} color="#C26A4A" style={{ opacity:0.7 }}/>
              <span style={{ fontFamily:"var(--font-body)",fontSize:14,color:"#6B4C3B",fontStyle:"italic" }}>
                Open to AI/ML roles & research collaborations · 2025
              </span>
              <FlowerMotif size={14} color="#C26A4A" style={{ opacity:0.7 }}/>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="pf" style={{ fontSize:17,color:"#6B2D3E",fontStyle:"italic" }}>Garima Diyawar</div>
        <div className="mono" style={{ fontSize:10,color:"#A08070",letterSpacing:0.5 }}>
          data · models · curiosity · B.Tech CSE · 2025
        </div>
        <div className="mono" style={{ fontSize:10,color:"rgba(201,168,76,0.65)",cursor:"pointer",letterSpacing:0.5 }} onClick={()=>setShowTerm(true)}>
          type "train model" 🥚
        </div>
      </footer>

      {activeProj&&<ProjectModal proj={activeProj} onClose={()=>setActiveProj(null)}/>}
      {showTerm&&<Terminal onClose={()=>setShowTerm(false)}/>}
    </div>
  );
}
