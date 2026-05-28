import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400;500&family=Noto+Serif+Devanagari:wght@400;700&display=swap');

  :root {
    --bg:        #F2EDE0;
    --bg-card:   #EAE4D4;
    --ink:       #111009;
    --mid:       #3D3525;
    --muted:     #7A6E5A;
    --rule:      rgba(17,16,9,0.14);
    --rule-dk:   rgba(17,16,9,0.35);
    --red:       #8B1A1A;
    --serif:     'Playfair Display', Georgia, serif;
    --body:      'EB Garamond', Georgia, serif;
    --mono:      'DM Mono', 'Courier New', monospace;
    --deva:      'Noto Serif Devanagari', serif;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { font-family:var(--body); background:var(--bg); color:var(--ink); overflow-x:hidden; font-size:17px; }

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:var(--bg-card); }
  ::-webkit-scrollbar-thumb { background:var(--ink); border-radius:0; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes barGrow  { from { height:0; } to { height:var(--bh); } }
  @keyframes pulse    { 0%,100% { opacity:0.5; } 50% { opacity:1; } }

  .reveal   { opacity:0; transform:translateY(18px); transition:opacity 0.55s ease, transform 0.55s ease; }
  .revealed { opacity:1; transform:translateY(0); }

  /* ── Nav ── */
  nav {
    position:fixed; top:0; left:0; right:0; z-index:300;
    background:var(--bg);
    border-top:3px solid var(--ink);
    border-bottom:1px solid var(--rule-dk);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 48px; height:56px;
  }
  .nav-logo { font-family:var(--serif); font-size:15px; font-weight:700; font-style:italic; color:var(--ink); }
  .nav-links { display:flex; gap:28px; }
  .nav-btn {
    background:none; border:none; border-bottom:1px solid transparent;
    padding-bottom:2px; cursor:pointer;
    font-family:var(--mono); font-size:9px; color:var(--muted);
    letter-spacing:1.5px; text-transform:uppercase;
    transition:color 0.15s, border-color 0.15s;
  }
  .nav-btn.active,.nav-btn:hover { color:var(--ink); border-bottom-color:var(--ink); }

  section { padding:88px 48px; }

  /* ── Section header ── */
  .dispatch-tag { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
  .dispatch-tag::before { content:''; width:20px; height:1px; background:var(--red); flex-shrink:0; }
  .dispatch-tag::after  { content:''; flex:1; height:1px; background:var(--rule-dk); }
  .dispatch-tag span { font-family:var(--mono); font-size:8.5px; color:var(--muted); letter-spacing:4px; text-transform:uppercase; white-space:nowrap; }

  h2.sec-title { font-family:var(--serif); font-size:clamp(26px,4vw,42px); color:var(--ink); line-height:1.1; margin-bottom:6px; font-weight:700; }

  /* ── Drop cap ── */
  .drop-cap::first-letter {
    font-family:var(--serif); font-size:4.2em; font-weight:900; color:var(--red);
    float:left; line-height:0.78; margin-right:7px; margin-top:8px;
  }

  /* ── Skill tile ── */
  .skill-tile {
    border:1px solid var(--rule-dk); padding:18px; cursor:pointer;
    background:var(--bg); min-height:86px;
    transition:background 0.22s, box-shadow 0.22s, min-height 0.28s, border-color 0.22s;
  }
  .skill-tile:hover { background:var(--bg-card); box-shadow:2px 2px 0 var(--ink); border-color:var(--ink); }

  /* ── Project card ── */
  .proj-card {
    padding:26px; cursor:pointer;
    border:1px solid var(--rule-dk); background:var(--bg);
    position:relative; overflow:hidden;
    transition:box-shadow 0.22s, border-color 0.22s;
  }
  .proj-card:hover { border-color:var(--ink); box-shadow:3px 3px 0 var(--ink); }
  .proj-card::after { content:'↗'; position:absolute; bottom:18px; right:18px; font-size:13px; font-family:var(--mono); color:var(--muted); opacity:0; transition:opacity 0.18s, transform 0.18s; transform:translateY(4px); }
  .proj-card:hover::after { opacity:1; transform:translateY(0); }

  /* ── Buttons ── */
  .btn-primary {
    background:var(--ink); color:var(--bg); border:1px solid var(--ink);
    padding:10px 24px; cursor:pointer;
    font-family:var(--mono); font-size:10px; letter-spacing:1px; text-transform:uppercase;
    transition:background 0.15s, color 0.15s;
  }
  .btn-primary:hover { background:transparent; color:var(--ink); }
  .btn-ghost {
    background:transparent; color:var(--mid); border:1px solid var(--rule-dk);
    padding:10px 24px; cursor:pointer;
    font-family:var(--mono); font-size:10px; letter-spacing:1px; text-transform:uppercase;
    transition:border-color 0.15s, color 0.15s;
  }
  .btn-ghost:hover { border-color:var(--ink); color:var(--ink); }

  /* ── Matrix cell ── */
  .matrix-cell { text-align:center; padding:20px 12px; cursor:pointer; border:1px solid var(--rule-dk); transition:background 0.18s, border-color 0.18s, box-shadow 0.18s; }
  .matrix-cell:hover { box-shadow:2px 2px 0 var(--ink); }

  /* ── Contact link ── */
  .contact-link {
    display:flex; justify-content:space-between; align-items:center;
    background:var(--bg); border:1px solid var(--rule-dk);
    padding:13px 18px; text-decoration:none;
    transition:border-color 0.15s, box-shadow 0.15s;
  }
  .contact-link:hover { border-color:var(--ink); box-shadow:2px 2px 0 var(--ink); }

  /* ── Modal ── */
  .modal-bg {
    position:fixed; inset:0; background:rgba(17,16,9,0.7); backdrop-filter:blur(4px);
    z-index:600; display:flex; align-items:center; justify-content:center;
    padding:20px; animation:fadeIn 0.15s ease;
  }
  .modal-box {
    background:var(--bg); border:1px solid var(--ink);
    box-shadow:5px 5px 0 var(--ink);
    padding:36px; max-width:580px; width:100%;
    animation:fadeUp 0.2s ease; max-height:90vh; overflow-y:auto;
  }

  /* ── Stat pill ── */
  .stat-pill { border:1px solid var(--rule-dk); padding:16px 18px; text-align:center; transition:box-shadow 0.18s, border-color 0.18s; background:var(--bg); }
  .stat-pill:hover { border-color:var(--ink); box-shadow:2px 2px 0 var(--ink); }

  footer {
    border-top:3px solid var(--ink);
    padding:20px 48px;
    display:flex; justify-content:space-between; align-items:center;
    background:var(--bg);
  }
`;

/* ── Glitch Name: EN ↔ गरिमा दियावर ── */
function GlitchName() {
  const GLITCH = '!@#%░▒▓<>?/|{}~*&XQZW';
  const [display, setDisplay] = useState({ mode:'en', g:['',''] });
  const timer = useRef(null);

  const rg = () => [
    Array.from({length:6}, ()=>GLITCH[Math.floor(Math.random()*GLITCH.length)]).join(''),
    Array.from({length:7}, ()=>GLITCH[Math.floor(Math.random()*GLITCH.length)]).join(''),
  ];

  const glitchTo = (target) => {
    if (timer.current) clearInterval(timer.current);
    let tick = 0;
    timer.current = setInterval(() => {
      tick++;
      if (tick <= 8) {
        setDisplay(tick % 2 === 1 ? { mode:'glitch', g:rg() } : { mode:target, g:['',''] });
      } else {
        setDisplay({ mode:target, g:['',''] });
        clearInterval(timer.current); timer.current = null;
      }
    }, 50);
  };

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const { mode, g } = display;
  const line = { display:'block', lineHeight:0.92 };

  return (
    <div onMouseEnter={()=>glitchTo('hi')} onMouseLeave={()=>glitchTo('en')} style={{ cursor:'default', userSelect:'none' }}>
      {mode==='en' && <>
        <span style={{ ...line, color:'var(--ink)' }}>GARIMA</span>
        <span style={{ ...line, color:'var(--red)' }}>DIYAWAR</span>
      </>}
      {mode==='hi' && <>
        <span style={{ ...line, fontFamily:'var(--deva)', color:'var(--ink)', fontSize:'0.68em', lineHeight:1.15 }}>गरिमा</span>
        <span style={{ ...line, fontFamily:'var(--deva)', color:'var(--red)', fontSize:'0.68em', lineHeight:1.15 }}>दियावार</span>
      </>}
      {mode==='glitch' && <>
        <span style={{ ...line, fontFamily:'var(--mono)', color:'var(--red)', fontSize:'0.42em', letterSpacing:'5px' }}>{g[0]}</span>
        <span style={{ ...line, fontFamily:'var(--mono)', color:'var(--red)', fontSize:'0.42em', letterSpacing:'5px' }}>{g[1]}</span>
      </>}
    </div>
  );
}

/* ── Skills ── */
const SKILLS = [
  { name:'Machine Learning', icon:'⚙', tools:['XGBoost','LightGBM','Scikit-learn','Optuna'],     accent:'var(--ink)', bg:'var(--bg-card)', viz:'pipe'    },
  { name:'Deep Learning',    icon:'◎', tools:['PyTorch','HuggingFace','RoBERTa','Transformers'], accent:'var(--red)', bg:'var(--bg-card)', viz:'neural'  },
  { name:'Agentic AI',       icon:'◈', tools:['LangGraph','LangChain','Ollama','LangSmith'],      accent:'var(--ink)', bg:'var(--bg-card)', viz:'agent'   },
  { name:'Data Analysis',    icon:'▣', tools:['Pandas','NumPy','SQL','Polars'],                   accent:'var(--mid)', bg:'var(--bg-card)', viz:'bar'     },
  { name:'NLP',              icon:'◇', tools:['spaCy','Transformers','NLTK','Text Analytics'],    accent:'var(--red)', bg:'var(--bg-card)', viz:'tok'     },
  { name:'XAI & Eval',       icon:'◬', tools:['SHAP','LIME','MLflow','Evidently'],                accent:'var(--ink)', bg:'var(--bg-card)', viz:'metrics' },
  { name:'Cloud & Deploy',   icon:'◐', tools:['Azure AI','Streamlit','FastAPI','GitHub Actions'], accent:'var(--mid)', bg:'var(--bg-card)', viz:'code'    },
  { name:'Data Viz',         icon:'▤', tools:['Plotly','Seaborn','Matplotlib','React'],           accent:'var(--ink)', bg:'var(--bg-card)', viz:'bars2'   },
];

function SkillViz({ type, accent }) {
  const a = accent === 'var(--red)' ? '#8B1A1A' : accent === 'var(--mid)' ? '#3D3525' : '#111009';
  if (type==='pipe') return (
    <div style={{ display:'flex',alignItems:'center',gap:3,margin:'10px 0' }}>
      {['Data','Clean','Train','Eval','Deploy'].map((s,i)=>(
        <div key={s} style={{ display:'flex',alignItems:'center',gap:3 }}>
          <div style={{ background:a,color:'var(--bg)',fontSize:7.5,padding:'2px 4px',fontFamily:'var(--mono)',animation:`fadeUp 0.22s ease ${i*0.07}s both` }}>{s}</div>
          {i<4&&<div style={{ width:5,height:1,background:'var(--rule-dk)' }}/>}
        </div>
      ))}
    </div>
  );
  if (type==='neural') return (
    <div style={{ display:'flex',alignItems:'center',gap:7,margin:'10px 0' }}>
      {[3,5,5,4,2].map((n,li)=>(
        <div key={li} style={{ display:'flex',flexDirection:'column',gap:3 }}>
          {Array.from({length:n}).map((_,ni)=>(
            <div key={ni} style={{ width:6,height:6,borderRadius:'50%',background:(li===1||li===2||li===3)?a:'var(--rule-dk)' }}/>
          ))}
        </div>
      ))}
    </div>
  );
  if (type==='agent') return (
    <div style={{ display:'flex',flexDirection:'column',gap:3,margin:'10px 0' }}>
      {['Fetcher → Analyzer → Reporter','↓  LangGraph orchestration','↓  LangSmith traces'].map((l,i)=>(
        <div key={i} style={{ fontFamily:'var(--mono)',fontSize:7.5,color:a,opacity:1-i*0.22 }}>{l}</div>
      ))}
    </div>
  );
  if (type==='bar'||type==='bars2') return (
    <div style={{ display:'flex',alignItems:'flex-end',gap:3,height:28,margin:'10px 0' }}>
      {[0.55,0.82,0.4,0.91,0.63,0.75,0.5].map((v,i)=>(
        <div key={i} style={{ width:9,height:v*24,background:a,animation:`barGrow 0.32s ease ${i*0.06}s both`,'--bh':`${v*24}px` }}/>
      ))}
    </div>
  );
  if (type==='tok') return (
    <div style={{ display:'flex',flexWrap:'wrap',gap:3,margin:'10px 0' }}>
      {['[CLS]','implicit','bias','detect','[SEP]'].map((t,i)=>(
        <span key={t} style={{ fontSize:8,border:`1px solid ${a}`,color:a,padding:'1px 4px',fontFamily:'var(--mono)',animation:`fadeUp 0.2s ease ${i*0.07}s both` }}>{t}</span>
      ))}
    </div>
  );
  if (type==='metrics') return (
    <div style={{ display:'flex',flexWrap:'wrap',gap:3,margin:'10px 0' }}>
      {[['AUC','0.847'],['F1','0.783'],['SHAP','✓'],['PR','0.79']].map(([k,v])=>(
        <div key={k} style={{ border:`1px solid ${a}`,color:a,padding:'2px 5px',fontFamily:'var(--mono)',fontSize:8,lineHeight:1.4 }}>
          <div style={{ opacity:0.6 }}>{k}</div><div style={{ fontWeight:500 }}>{v}</div>
        </div>
      ))}
    </div>
  );
  if (type==='code') return (
    <div style={{ fontFamily:'var(--mono)',fontSize:8,color:a,lineHeight:1.9,margin:'10px 0' }}>
      <div>$ streamlit run app.py</div>
      <div>✓  Deployed on Streamlit Cloud</div>
      <div style={{ color:'var(--muted)' }}>✓  Azure AI connected</div>
    </div>
  );
  return null;
}

function SkillTile({ sk }) {
  const [hov,setHov] = useState(false);
  return (
    <div className="skill-tile" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ minHeight:hov?162:86 }}>
      <div style={{ fontSize:15,marginBottom:6,opacity:0.5 }}>{sk.icon}</div>
      <div style={{ fontFamily:'var(--mono)',fontSize:10,fontWeight:500,color:sk.accent,letterSpacing:0.5,textTransform:'uppercase' }}>{sk.name}</div>
      {hov&&<div style={{ animation:'fadeUp 0.16s ease' }}>
        <SkillViz type={sk.viz} accent={sk.accent}/>
        <div style={{ display:'flex',flexWrap:'wrap',gap:3 }}>
          {sk.tools.map(t=><span key={t} style={{ fontSize:8,border:'1px solid var(--rule-dk)',color:'var(--muted)',padding:'1px 5px',fontFamily:'var(--mono)' }}>{t}</span>)}
        </div>
      </div>}
    </div>
  );
}

/* ── Projects ── */
const PROJECTS = [
  {
    id:1, num:'01', title:'Enterprise Brain', subtitle:'Multi-Agent RAG Knowledge System',
    badge:'PRODUCTION', cat:'Agentic AI × RAG', live_badge:false,
    desc:'Zero-cost knowledge base that actually knows things — and can cite its sources. PDFs, Slack, email ingested. Hybrid retrieval, hallucination detection, full RBAC. No cloud bill.',
    longDesc:'A production-ready multi-agent knowledge retrieval system built entirely on free, local tooling. LangGraph for orchestration, ChromaDB for vector storage, BM25Okapi for sparse retrieval, and Reciprocal Rank Fusion to merge both. BAAI/bge-reranker-base re-ranks top candidates. Hallucination detection combines LLM NLI checking with Jaccard token overlap. Full RBAC with bcrypt + JWT across 4 roles. TinyDB-backed sliding window memory per session. Eval dashboard with per-query metrics.',
    tech:['LangGraph','ChromaDB','BM25 + RRF','BAAI/bge','Ollama (Llama3)','Streamlit','JWT/RBAC'],
    github:'https://github.com/garimadiyawar/enterprise_brain',
  },
  {
    id:2, num:'02', title:'Pharma AE Monitor', subtitle:'3-Agent Drug Safety Signal Detection',
    badge:'LIVE', cat:'Healthcare AI × Agents', live_badge:true,
    desc:'Type a drug name. Three agents later, you have a pharmacovigilance-grade report — organ clusters, RED/YELLOW/GREEN safety flags, structured narrative. The analysis IQVIA charges a lot for, rebuilt on a weekend.',
    longDesc:'A 3-agent LangGraph pipeline doing real pharmacovigilance work. Agent 1 hits the OpenFDA FAERS API with conditional routing for missing data. Agent 2 clusters adverse reactions by organ system using rule-based logic + LLM signal identification. Agent 3 writes a structured narrative report with tiered safety signal ratings. Powered by Claude 3.5 Haiku, fully traced in LangSmith. Try ibuprofen, warfarin, or sildenafil.',
    tech:['LangGraph','Claude 3.5 Haiku','OpenFDA FAERS','LangSmith','Streamlit','Python 3.11'],
    github:'https://github.com/garimadiyawar/Pharma-ae-monitor',
  },
  {
    id:3, num:'03', title:'BeNice', subtitle:'Implicit Bigotry Multi-Label Classifier',
    badge:'INVESTIGATION', cat:'NLP Research × Social Good', live_badge:false,
    desc:'Catches the hate that hides behind "just asking questions." Fine-tuned RoBERTa to flag misogyny, racism, casteism, and cyberbullying — including the coded, plausibly deniable kind.',
    longDesc:'Research-grade multi-label NLP classifier targeting the hard cases in content moderation: not slurs or explicit threats, but normalised, emotionally framed, culturally coded prejudice. Fine-tuned RoBERTa-base with BCEWithLogitsLoss and positive class weighting. Minimal contrast pairs sharpen decision boundaries. Per-label threshold tuning improves recall on minority classes. Structured error analysis covers sarcasm, reclaimed language, and cross-label confusion.',
    tech:['PyTorch','HuggingFace Transformers','RoBERTa-base','BCEWithLogitsLoss','scikit-learn','Contrast Pairs'],
    github:'https://github.com/garimadiyawar/BeNice',
  },
  {
    id:4, num:'04', title:'Credit Risk — Thin-File Borrowers', subtitle:'Explainable ML + Fairness Audit',
    badge:'THESIS', cat:'FinTech × Explainable AI', live_badge:false,
    desc:"The banks' models fail thin-file borrowers by ignoring them. This one doesn't. XGBoost + SHAP + LIME + full fairness audit on 300k+ real Home Credit loan applications.",
    longDesc:"Full ML pipeline on the Home Credit Default Risk dataset (7 files, 300k+ rows). Separate evaluation track for thin-file borrowers. LR, RF, XGBoost, and LightGBM trained with stratified splits and Optuna TPE hyperparameter search. Explainability via SHAP (global, local, interaction values) and LIME. Fairness evaluation: demographic parity, equalised odds, bootstrap CI. XGBoost AUC ~0.78–0.80 on full dataset.",
    tech:['XGBoost','LightGBM','SHAP','LIME','Optuna TPE','Fairness Eval','Home Credit Dataset'],
    github:'https://github.com/garimadiyawar/Explainable-credit-risk-modelling-for-thin-file-borrowers',
  },
  {
    id:5, num:'05', title:'Demand Forecasting', subtitle:'LightGBM + ROI Simulation on M5',
    badge:'FULL REPORT', cat:'Retail × Applied ML', live_badge:false,
    desc:'17% MAE improvement over seasonal naive. ₹35,000 in projected annual savings at pilot scale. The model was right. The simulation showed it.',
    longDesc:'End-to-end demand forecasting on the M5 Forecasting dataset. Global LightGBM trained across 30,000 SKUs using lag features (1, 7, 14, 28 days), rolling means, calendar effects, SNAP flags, and price data. Time-based split prevents leakage. ~17% MAE improvement over seasonal naive on noisy, intermittent-demand data. 28-day inventory simulation demonstrates how forecast accuracy translates to real cost reduction.',
    tech:['LightGBM','Pandas','M5 Dataset','FastAPI','Streamlit','ROI Simulation'],
    github:'https://github.com/garimadiyawar/demand-forecasting',
  },
  {
    id:6, num:'06', title:'Knowledge Mining & Compliance', subtitle:'Azure AI Document Intelligence',
    badge:'DEPLOYED', cat:'Cloud AI × Compliance', live_badge:true,
    desc:'Azure AI stack scanning legal and financial documents for compliance risks in real time. Upload a doc, get a risk flag. No reading required.',
    longDesc:'A fully deployed compliance risk detection system using Azure AI services. Azure Text Analytics handles NLP (entity recognition, key phrase extraction, sentiment). Azure Translator enables multilingual document processing. Azure Cognitive Search provides full-text indexing and retrieval. Outputs structured risk flags with severity levels. Built with GitHub Actions CI/CD.',
    tech:['Azure Text Analytics','Azure Cognitive Search','Translator API','Streamlit','GitHub Actions','Python'],
    github:'https://github.com/garimadiyawar/Knowledge-Mining-and-Compliance-Risk-Detection-System',
    live:'https://compliance-risk-detection-system.streamlit.app/',
  },
  {
    id:7, num:'07', title:'Hum-to-Music AI', subtitle:'Audio ML + React Native Mobile App',
    badge:'FULL BUILD', cat:'Audio ML × Mobile', live_badge:false,
    desc:'Hum something. Get an orchestra back. Pitch detection → melody → chord generation → multi-instrument arrangement → WAV. Takes about as long as your coffee.',
    longDesc:'Full-stack audio ML pipeline: record a hummed melody on your phone, receive a fully arranged WAV. Backend: audio upload → pitch detection (Librosa) → melody extraction → chord generation (PyTorch) → multi-instrument arrangement (PrettyMIDI) → WAV render (Pydub). Served via FastAPI. React Native Expo frontend handles recording, API calls, and real-time playback.',
    tech:['PyTorch','Librosa','PrettyMIDI','FastAPI','React Native','Expo','Pydub'],
    github:'https://github.com/garimadiyawar/hum-to-music-ai',
  },
  {
    id:8, num:'08', title:'Gen Z Economy', subtitle:'Multi-Dimensional Economic Analysis',
    badge:'DEPLOYED', cat:'Data Research × Economics', live_badge:true,
    desc:"Turns out 'just work harder' doesn't track with the data. Cost of living, employment gaps, education debt, housing affordability, generational mobility — all sourced, all interactive.",
    longDesc:"A multi-dimensional analysis of Gen Z's economic position combining cost of living indices, youth employment data, education debt loads, housing affordability ratios, and generational wealth mobility metrics. Built with Pandas and SQL for data wrangling, deployed as an interactive dashboard. Covers multiple countries and cities, surfacing the structural gaps that make Gen Z's financial reality fundamentally different — backed by real datasets.",
    tech:['Pandas','SQL','Plotly','Streamlit','Data Analysis','Composite Indexing'],
    github:'https://github.com/garimadiyawar/genz-economy',
    live:'https://genzeconomy.vercel.app',
  },
];

function ProjectCard({ proj, onClick }) {
  return (
    <div className="proj-card" onClick={onClick}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
        <span style={{ fontFamily:'var(--mono)',fontSize:8.5,color:'var(--muted)',letterSpacing:0.5 }}>{proj.cat}</span>
        <span style={{
          fontFamily:'var(--mono)', fontSize:7.5, letterSpacing:1.5, padding:'2px 6px',
          background: proj.live_badge ? 'var(--red)' : 'transparent',
          color: proj.live_badge ? 'var(--bg)' : 'var(--mid)',
          border: proj.live_badge ? 'none' : '1px solid var(--rule-dk)',
        }}>{proj.badge}</span>
      </div>
      <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:2.5,marginBottom:7,opacity:0.6 }}>{proj.num}</div>
      <h3 style={{ fontFamily:'var(--serif)',fontSize:19,fontWeight:700,color:'var(--ink)',marginBottom:3,lineHeight:1.2 }}>{proj.title}</h3>
      <div style={{ fontFamily:'var(--body)',fontSize:13,color:'var(--muted)',marginBottom:13,fontStyle:'italic' }}>{proj.subtitle}</div>
      <p style={{ fontFamily:'var(--body)',fontSize:15,color:'var(--mid)',lineHeight:1.75,marginBottom:20 }}>{proj.desc}</p>
      <div style={{ display:'flex',flexWrap:'wrap',gap:4 }}>
        {proj.tech.slice(0,4).map(t=><span key={t} style={{ fontSize:9,border:'1px solid var(--rule-dk)',color:'var(--muted)',padding:'1px 6px',fontFamily:'var(--mono)' }}>{t}</span>)}
        {proj.tech.length>4&&<span style={{ fontSize:9,color:'var(--muted)',fontFamily:'var(--mono)',padding:'1px 4px' }}>+{proj.tech.length-4}</span>}
      </div>
    </div>
  );
}

function ProjectModal({ proj, onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16 }}>
          <span style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:2 }}>{proj.cat.toUpperCase()}</span>
          <button onClick={onClose} style={{ background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--muted)',lineHeight:1,padding:0 }}>×</button>
        </div>
        <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:2.5,marginBottom:6,opacity:0.6 }}>{proj.num}</div>
        <h2 style={{ fontFamily:'var(--serif)',fontSize:22,fontWeight:700,color:'var(--ink)',marginBottom:3,lineHeight:1.2 }}>{proj.title}</h2>
        <div style={{ fontFamily:'var(--body)',fontSize:13,color:'var(--muted)',marginBottom:16,fontStyle:'italic' }}>{proj.subtitle}</div>
        <p style={{ fontFamily:'var(--body)',color:'var(--mid)',lineHeight:1.9,fontSize:15,marginBottom:22 }}>{proj.longDesc}</p>
        <div style={{ display:'flex',flexWrap:'wrap',gap:5,marginBottom:24 }}>
          {proj.tech.map(t=><span key={t} style={{ border:'1px solid var(--rule-dk)',color:'var(--muted)',padding:'2px 8px',fontSize:10,fontFamily:'var(--mono)' }}>{t}</span>)}
        </div>
        <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
          {proj.github&&<a href={proj.github} target="_blank" rel="noreferrer"><button className="btn-primary">View on GitHub →</button></a>}
          {proj.live&&<a href={proj.live} target="_blank" rel="noreferrer"><button className="btn-ghost">Live Demo ↗</button></a>}
        </div>
      </div>
    </div>
  );
}

/* ── Confusion Matrix ── */
const CM_DATA = { tp:85, fp:12, fn:8, tn:95 };
const CM_CELLS = [
  { k:'tp', label:'TP', val:85, name:'True Positives',  bg:'rgba(76,175,80,0.1)',  bdr:'#2E7D32', blurb:'Correctly predicted Default → actual Default. The model caught the risk.' },
  { k:'fp', label:'FP', val:12, name:'False Positives', bg:'rgba(230,120,0,0.1)',  bdr:'#E65100', blurb:'Model said Default → actually No Default. Unnecessary rejections — real harm to real people.' },
  { k:'fn', label:'FN', val:8,  name:'False Negatives', bg:'rgba(139,26,26,0.1)',  bdr:'#8B1A1A', blurb:'Missed a real Default. The costliest mistake in credit risk.' },
  { k:'tn', label:'TN', val:95, name:'True Negatives',  bg:'rgba(21,101,192,0.1)', bdr:'#1565C0', blurb:'Correctly predicted No Default → actual No Default. Clean, confident predictions.' },
];
function computeMetrics({ tp,fp,fn,tn }) {
  const t=tp+fp+fn+tn;
  return { precision:tp/(tp+fp), recall:tp/(tp+fn), specificity:tn/(tn+fp), 'f1 score':(2*tp)/(2*tp+fp+fn), accuracy:(tp+tn)/t };
}

function ConfusionMatrix() {
  const [hov,setHov] = useState(null);
  const metrics = computeMetrics(CM_DATA);
  const hovCell = CM_CELLS.find(c=>c.k===hov);
  return (
    <div style={{ display:'flex',gap:40,flexWrap:'wrap',alignItems:'flex-start' }}>
      <div>
        <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',textAlign:'center',marginBottom:10,letterSpacing:1 }}>← PREDICTED →</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,maxWidth:260 }}>
          {CM_CELLS.map(cell=>(
            <div key={cell.k} className="matrix-cell" onMouseEnter={()=>setHov(cell.k)} onMouseLeave={()=>setHov(null)}
              style={{ background:hov===cell.k?cell.bg:'var(--bg)',borderColor:hov===cell.k?cell.bdr:'var(--rule-dk)',boxShadow:hov===cell.k?`2px 2px 0 ${cell.bdr}`:'none' }}>
              <div style={{ fontSize:28,fontWeight:700,fontFamily:'var(--serif)',color:hov===cell.k?cell.bdr:'var(--ink)' }}>{cell.val}</div>
              <div style={{ fontSize:9,color:'var(--muted)',fontFamily:'var(--mono)',marginTop:2 }}>{cell.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',textAlign:'center',marginTop:10,letterSpacing:1 }}>↕ ACTUAL ↕</div>
      </div>
      <div style={{ flex:1,minWidth:220 }}>
        {hovCell?(
          <div style={{ animation:'fadeUp 0.16s ease' }}>
            <div style={{ fontFamily:'var(--serif)',fontSize:16,color:'var(--ink)',marginBottom:8,fontWeight:700 }}>{hovCell.name}</div>
            <div style={{ fontFamily:'var(--body)',fontSize:15,color:'var(--mid)',marginBottom:20,lineHeight:1.8 }}>{hovCell.blurb}</div>
            <div style={{ display:'flex',flexDirection:'column',gap:9 }}>
              {Object.entries(metrics).map(([k,v])=>(
                <div key={k} style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <span style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--muted)',minWidth:84 }}>{k}</span>
                  <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                    <div style={{ width:80,height:1,background:'var(--rule-dk)',overflow:'hidden',position:'relative' }}>
                      <div style={{ width:`${v*100}%`,height:'100%',background:'var(--ink)',transition:'width 0.35s ease' }}/>
                    </div>
                    <span style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--ink)',minWidth:38 }}>{v.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ):(
          <div style={{ fontFamily:'var(--body)',color:'var(--muted)',fontSize:15,lineHeight:1.9,fontStyle:'italic' }}>
            200 test predictions. 180 correct. The 20 that weren't cost someone their loan approval — or approved someone who defaulted.{' '}
            <span style={{ color:'var(--red)',fontStyle:'normal' }}>Hover each quadrant.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── GitHub Activity ── */
function GitHubActivity() {
  const [ok,setOk] = useState(true);
  return ok ? (
    <img
      src="https://github-readme-activity-graph.vercel.app/graph?username=garimadiyawar&bg_color=f2ede0&color=7a6e5a&line=111009&point=8b1a1a&area=true&hide_border=true&area_color=111009"
      alt="GitHub activity" style={{ width:'100%',height:'auto',display:'block' }}
      onError={()=>setOk(false)}
    />
  ) : (
    <div style={{ fontFamily:'var(--mono)',fontSize:12,color:'var(--muted)',padding:'20px 0' }}>
      Chart unavailable — <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer" style={{ color:'var(--ink)' }}>github.com/garimadiyawar ↗</a>
    </div>
  );
}

/* ── Main App ── */
export default function Portfolio() {
  const [activeProj,setActiveProj] = useState(null);
  const [activeSec,setActiveSec] = useState('home');
  const [ghRepos,setGhRepos] = useState(null);

  useEffect(()=>{
    fetch('https://api.github.com/users/garimadiyawar')
      .then(r=>r.ok?r.json():Promise.reject())
      .then(d=>setGhRepos(d.public_repos))
      .catch(()=>{});
  },[]);

  useEffect(()=>{ const t=document.createElement('style'); t.textContent=CSS; document.head.appendChild(t); return()=>document.head.removeChild(t); },[]);

  useEffect(()=>{
    const ob=new IntersectionObserver(entries=>entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('revealed'); }),{ threshold:0.08 });
    const t=setTimeout(()=>document.querySelectorAll('.reveal').forEach(el=>ob.observe(el)),100);
    return()=>{ clearTimeout(t); ob.disconnect(); };
  },[]);

  useEffect(()=>{
    const secs=['home','about','skills','projects','demo','github','contact'];
    const h=()=>{ for(const id of secs){ const el=document.getElementById(id); if(el){ const r=el.getBoundingClientRect(); if(r.top<=80&&r.bottom>80){ setActiveSec(id); break; } } } };
    window.addEventListener('scroll',h); return()=>window.removeEventListener('scroll',h);
  },[]);

  const go=id=>document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
  const NAV=[['home','Home'],['about','About'],['skills','Skills'],['projects','Work'],['demo','ML Lab'],['github','Activity'],['contact','Contact']];

  return (
    <div style={{ background:'var(--bg)',minHeight:'100vh' }}>

      {/* NAV */}
      <nav>
        <div className="nav-logo">Garima Diyawar</div>
        <div className="nav-links">
          {NAV.map(([id,lb])=>(
            <button key={id} className={`nav-btn${activeSec===id?' active':''}`} onClick={()=>go(id)}>{lb}</button>
          ))}
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="home" style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'60px 48px 48px',background:'var(--bg)' }}>
        <div style={{ textAlign:'center',maxWidth:820,width:'100%' }}>

          {/* Masthead strip */}
          <div style={{ borderTop:'1px solid var(--rule-dk)',borderBottom:'1px solid var(--rule-dk)',padding:'7px 0',marginBottom:40,display:'flex',alignItems:'center',justifyContent:'center',gap:20,animation:'fadeUp 0.4s ease 0.05s both' }}>
            <div style={{ height:1,flex:1,background:'var(--rule-dk)' }}/>
            <span style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:5,textTransform:'uppercase',whiteSpace:'nowrap' }}>The Intelligence Dispatch</span>
            <div style={{ height:1,flex:1,background:'var(--rule-dk)' }}/>
          </div>

          {/* Name */}
          <h1 style={{ fontFamily:'var(--serif)',fontWeight:900,fontSize:'clamp(72px,12vw,132px)',letterSpacing:'2px',lineHeight:0.92,marginBottom:0,animation:'fadeUp 0.65s ease 0.12s both' }}>
            <GlitchName/>
          </h1>

          {/* Rule */}
          <div style={{ width:56,height:3,background:'var(--red)',margin:'22px auto',animation:'fadeUp 0.4s ease 0.28s both' }}/>

          {/* Byline */}
          <div style={{ fontFamily:'var(--mono)',fontSize:8.5,color:'var(--muted)',letterSpacing:4,marginBottom:22,animation:'fadeUp 0.4s ease 0.32s both' }}>
            B.TECH CSE  ·  AI/ML ENGINEER  ·  2025
          </div>

          {/* Tagline */}
          <p style={{ fontFamily:'var(--body)',fontStyle:'italic',fontSize:'clamp(15px,1.9vw,19px)',color:'var(--mid)',lineHeight:1.9,maxWidth:520,margin:'0 auto 44px',animation:'fadeUp 0.55s ease 0.38s both' }}>
            ML engineer who builds models that work, explain themselves,
            and come with a receipt.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',animation:'fadeUp 0.5s ease 0.46s both' }}>
            <button className="btn-primary" onClick={()=>go('projects')}>Read the Work</button>
            <button className="btn-ghost" onClick={()=>go('contact')}>Correspondence</button>
            <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer"><button className="btn-ghost">GitHub ↗</button></a>
          </div>
        </div>
      </section>

      {/* Full-width rule between hero and about */}
      <div style={{ borderTop:'1px solid var(--rule-dk)',margin:'0 48px' }}/>

      {/* ══ ABOUT ══ */}
      <section id="about" style={{ padding:'80px 48px' }}>
        <div style={{ maxWidth:980,margin:'0 auto' }}>
          <div className="reveal">
            <div className="dispatch-tag"><span>About the Engineer</span></div>
            <h2 className="sec-title">The mind behind<br/><em>the models</em></h2>
          </div>

          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'1fr 1px 1fr',gap:'0 48px',marginTop:44,alignItems:'start' }}>
            {/* Left column */}
            <div>
              {[
                "B.Tech CSE graduate with a research interest in applied machine learning, particularly in making models legible. My thesis investigated credit risk prediction for thin-file borrowers, combining ensemble methods with SHAP and LIME-based explainability, and was published as a research paper.",
                "Beyond the thesis, the work has ranged widely: multi-agent retrieval systems, NLP classifiers for implicit bias in online text, a pharmacovigilance pipeline built on real FDA data, audio-to-arrangement ML, and most recently, a deployed dashboard examining Gen Z's economic position across cost of living, employment, education debt, and housing. The common thread is building things that run, not just things that look good in a notebook.",
                "Explainability is a recurring theme rather than an afterthought. There is a difference between a model that performs well and one whose decisions can be examined, questioned, and trusted.",
              ].map((para,i)=>(
                <p key={i} className={i===0?'drop-cap':''} style={{ fontFamily:'var(--body)',fontSize:i===0?17:15,color:i===0?'var(--ink)':'var(--mid)',lineHeight:1.95,marginBottom:18,fontWeight:400 }}>{para}</p>
              ))}
            </div>

            {/* Column rule */}
            <div style={{ background:'var(--rule-dk)',height:'100%',minHeight:200 }}/>

            {/* Right column */}
            <div>
              {[
                { l:'Education',   v:'B.Tech — Computer Science & Engineering' },
                { l:'Focus',       v:'Agentic AI · Explainable ML · NLP · Audio ML' },
                { l:'Stack',       v:'Python · LangGraph · PyTorch · SHAP · Azure AI · Streamlit' },
                { l:'Shipped',     v:'8 end-to-end systems — all public on GitHub' },
                { l:'Open to',     v:'AI/ML roles, research collabs, interesting problems' },
              ].map(({ l,v },i)=>(
                <div key={l} style={{ borderBottom:'1px solid var(--rule)',paddingBottom:11,marginBottom:11,display:'flex',gap:16,alignItems:'flex-start' }}>
                  <span style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:1,minWidth:72,paddingTop:2,flexShrink:0,textTransform:'uppercase' }}>{l}</span>
                  <span style={{ fontFamily:'var(--body)',fontSize:14,color:'var(--ink)',lineHeight:1.5 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,marginTop:48,borderTop:'1px solid var(--rule-dk)',borderLeft:'1px solid var(--rule-dk)' }}>
            {[
              { n:'8',   l:'Systems shipped' },
              { n:ghRepos!=null?String(ghRepos):'…', l:'Public repos' },
              { n:'0.847', l:'Best AUC, credit risk' },
              { n:'17%', l:'MAE improvement, M5' },
            ].map(({ n,l })=>(
              <div key={l} className="stat-pill" style={{ borderLeft:'none',borderTop:'none',borderRight:'1px solid var(--rule-dk)',borderBottom:'1px solid var(--rule-dk)' }}>
                <div style={{ fontFamily:'var(--serif)',fontSize:24,color:'var(--ink)',fontWeight:700,lineHeight:1 }}>{n}</div>
                <div style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--muted)',marginTop:7,letterSpacing:0.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills" style={{ padding:'72px 48px',borderTop:'1px solid var(--rule-dk)' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center',marginBottom:44 }}>
            <div className="dispatch-tag" style={{ justifyContent:'center' }}><span>Technical Arsenal</span></div>
            <h2 className="sec-title" style={{ textAlign:'center' }}>The Toolkit</h2>
            <p style={{ fontFamily:'var(--body)',color:'var(--muted)',fontSize:14,marginTop:6,fontStyle:'italic' }}>Hover any tile to explore the domain</p>
          </div>
          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,border:'1px solid var(--rule-dk)' }}>
            {SKILLS.map((sk,i)=>(
              <div key={sk.name} style={{ borderRight:i%4!==3?'1px solid var(--rule-dk)':'none', borderBottom:i<4?'1px solid var(--rule-dk)':'none' }}>
                <SkillTile sk={sk}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" style={{ padding:'72px 48px',borderTop:'1px solid var(--rule-dk)' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:40 }}>
            <div className="dispatch-tag"><span>From the Research Desk</span></div>
            <h2 className="sec-title">Projects &<br/><em>Research</em></h2>
            <p style={{ fontFamily:'var(--body)',color:'var(--muted)',fontSize:14,marginTop:6,fontStyle:'italic' }}>Click any headline to read more</p>
          </div>
          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:0,border:'1px solid var(--rule-dk)' }}>
            {PROJECTS.map((p,i)=>(
              <div key={p.id} style={{ borderRight:i%2===0?'1px solid var(--rule-dk)':'none', borderBottom:i<6?'1px solid var(--rule-dk)':'none' }}>
                <ProjectCard proj={p} onClick={()=>setActiveProj(p)}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ML LAB ══ */}
      <section id="demo" style={{ padding:'72px 48px',borderTop:'1px solid var(--rule-dk)' }}>
        <div style={{ maxWidth:920,margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:36 }}>
            <div className="dispatch-tag"><span>Dissertation Results</span></div>
            <h2 className="sec-title">Confusion Matrix<br/><em>Explorer</em></h2>
            <p style={{ fontFamily:'var(--body)',color:'var(--mid)',fontSize:15,lineHeight:1.85,maxWidth:500,marginTop:10,fontStyle:'italic' }}>
              200 test predictions from the credit risk thesis. Hover each quadrant. The numbers that matter aren't the big ones.
            </p>
          </div>

          <div className="reveal" style={{ border:'1px solid var(--rule-dk)',padding:'36px 36px 28px' }}>
            <ConfusionMatrix/>
          </div>

          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:0,marginTop:0,border:'1px solid var(--rule-dk)',borderTop:'none' }}>
            {[
              { q:'What makes a good model?', a:"In credit risk, the question isn't accuracy — it's whether the wrong answers hurt the right people. False negatives cost borrowers. False positives cost banks." },
              { q:'Why not just use accuracy?', a:"On imbalanced datasets, 'predicts safe every time' scores 90% accuracy and misses every default. Accuracy is the metric of someone who hasn't thought about the problem." },
              { q:'Where does SHAP come in?', a:"SHAP turns 'the model decided' into 'here's exactly why.' It makes decisions auditable to regulators, legible to loan officers, and contestable by borrowers." },
            ].map(({ q,a },i)=>(
              <div key={q} style={{ padding:18, borderRight:i<2?'1px solid var(--rule-dk)':'none' }}>
                <div style={{ fontFamily:'var(--serif)',fontSize:13,fontWeight:700,color:'var(--ink)',marginBottom:8,lineHeight:1.4 }}>{q}</div>
                <div style={{ fontFamily:'var(--body)',fontSize:13,color:'var(--mid)',lineHeight:1.8 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GITHUB ══ */}
      <section id="github" style={{ padding:'72px 48px',borderTop:'1px solid var(--rule-dk)' }}>
        <div style={{ maxWidth:860,margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:28 }}>
            <div className="dispatch-tag"><span>GitHub Activity</span></div>
            <h2 className="sec-title">Commit by<br/><em>commit</em></h2>
          </div>
          <div className="reveal" style={{ border:'1px solid var(--rule-dk)',padding:28 }}>
            <GitHubActivity/>
            <div style={{ marginTop:24,borderTop:'1px solid var(--rule)',paddingTop:18,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14 }}>
              <div>
                <div style={{ fontFamily:'var(--serif)',fontSize:15,color:'var(--ink)',fontWeight:700,marginBottom:3 }}>Consistently building</div>
                <div style={{ fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)' }}>
                  Live · <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer" style={{ color:'var(--ink)' }}>github.com/garimadiyawar ↗</a>
                </div>
              </div>
              {[[ghRepos!=null?String(ghRepos):'…','Public repos'],['8','Projects'],['∞','Experiments']].map(([n,l])=>(
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--serif)',fontSize:20,color:'var(--ink)',fontWeight:700 }}>{n}</div>
                  <div style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--muted)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{ padding:'72px 48px 110px',borderTop:'1px solid var(--rule-dk)' }}>
        <div style={{ maxWidth:540,margin:'0 auto',textAlign:'center' }}>
          <div className="reveal">
            <div className="dispatch-tag" style={{ justifyContent:'center' }}><span>Correspondence</span></div>
            <h2 className="sec-title">Send a dispatch.<br/><em>Let's talk.</em></h2>
            <p style={{ fontFamily:'var(--body)',fontStyle:'italic',color:'var(--mid)',fontSize:16,lineHeight:1.9,margin:'14px auto 36px',maxWidth:420 }}>
              Open to AI/ML roles, research collabs, or a genuinely interesting problem.
              Bonus points if it involves messy data and no obvious solution.
            </p>
          </div>

          <div className="reveal" style={{ display:'flex',flexDirection:'column',gap:0,border:'1px solid var(--rule-dk)' }}>
            {[
              { l:'Email',    v:'ndiyawar@gmail.com',              h:'mailto:ndiyawar@gmail.com' },
              { l:'GitHub',   v:'github.com/garimadiyawar',        h:'https://github.com/garimadiyawar' },
              { l:'LinkedIn', v:'linkedin.com/in/garima-diyawar',  h:'https://www.linkedin.com/in/garima-diyawar' },
            ].map(({ l,v,h },i,arr)=>(
              <a key={l} href={h} target={h.startsWith('http')?'_blank':undefined} rel="noreferrer" className="contact-link"
                style={{ borderBottom:i<arr.length-1?'1px solid var(--rule-dk)':'none', borderRadius:0 }}>
                <span style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:2 }}>{l.toUpperCase()}</span>
                <span style={{ fontFamily:'var(--body)',fontSize:14,color:'var(--ink)' }}>{v}</span>
              </a>
            ))}
          </div>

          <div className="reveal" style={{ marginTop:32 }}>
            <div style={{ display:'inline-flex',alignItems:'center',gap:8,border:'1px solid var(--rule)',padding:'8px 16px' }}>
              <div style={{ width:5,height:5,borderRadius:'50%',background:'#2E7D32',animation:'pulse 2.5s ease-in-out infinite' }}/>
              <span style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--muted)',letterSpacing:0.5 }}>Available for AI/ML roles · 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div style={{ fontFamily:'var(--serif)',fontSize:14,color:'var(--ink)',fontWeight:700,fontStyle:'italic' }}>Garima Diyawar</div>
        <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:1 }}>data · models · curiosity · 2025</div>
        <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:1 }}>© 2025</div>
      </footer>

      {activeProj&&<ProjectModal proj={activeProj} onClose={()=>setActiveProj(null)}/>}
    </div>
  );
}
