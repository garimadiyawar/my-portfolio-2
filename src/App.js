import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400;500&family=Noto+Serif+Devanagari:wght@400;700&display=swap');

  :root {
    --bg:          #081A18;
    --glass:       rgba(255,255,255,0.06);
    --glass-md:    rgba(255,255,255,0.1);
    --glass-hv:    rgba(255,255,255,0.13);
    --gb:          rgba(255,255,255,0.1);
    --gb-t:        rgba(42,191,176,0.4);
    --teal:        #2ABFB0;
    --teal-bright: #5BE8D8;
    --teal-dim:    rgba(42,191,176,0.12);
    --ink:         #E4F2EF;
    --mid:         #96BDB8;
    --muted:       #4E8880;
    --serif:       'Playfair Display', Georgia, serif;
    --body:        'EB Garamond', Georgia, serif;
    --mono:        'DM Mono', 'Courier New', monospace;
    --deva:        'Noto Serif Devanagari', serif;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body {
    font-family:var(--body); font-size:17px;
    background:var(--bg); color:var(--ink); overflow-x:hidden;
    background-image:
      radial-gradient(ellipse at 18% 14%, rgba(42,191,176,0.13) 0%, transparent 52%),
      radial-gradient(ellipse at 82% 80%, rgba(26,155,142,0.09) 0%, transparent 52%);
  }

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
  ::-webkit-scrollbar-thumb { background:var(--teal); border-radius:2px; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes barGrow { from { height:0; } to { height:var(--bh); } }
  @keyframes pulse   { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
  @keyframes tealGlow{ 0%,100% { box-shadow:0 0 16px rgba(42,191,176,0.15); } 50% { box-shadow:0 0 28px rgba(42,191,176,0.3); } }

  .reveal   { opacity:0; transform:translateY(20px); transition:opacity 0.6s ease, transform 0.6s ease; }
  .revealed { opacity:1; transform:translateY(0); }

  /* ── Nav ── */
  nav {
    position:fixed; top:0; left:0; right:0; z-index:300;
    backdrop-filter:blur(20px) saturate(1.6);
    background:rgba(8,26,24,0.88);
    border-bottom:1px solid var(--gb);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 48px; height:58px;
  }
  .nav-logo { font-family:var(--serif); font-size:15px; font-weight:700; font-style:italic; color:var(--teal); }
  .nav-links { display:flex; gap:28px; }
  .nav-btn {
    background:none; border:none; border-bottom:1px solid transparent;
    padding-bottom:2px; cursor:pointer;
    font-family:var(--mono); font-size:9px; color:var(--muted);
    letter-spacing:1.5px; text-transform:uppercase;
    transition:color 0.15s, border-color 0.15s;
  }
  .nav-btn.active,.nav-btn:hover { color:var(--teal); border-bottom-color:var(--teal); }

  section { padding:88px 48px; }

  /* ── Section header ── */
  .dispatch-tag { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
  .dispatch-tag::before { content:''; width:20px; height:1px; background:var(--teal); flex-shrink:0; }
  .dispatch-tag::after  { content:''; flex:1; height:1px; background:var(--gb); }
  .dispatch-tag span { font-family:var(--mono); font-size:8.5px; color:var(--muted); letter-spacing:4px; text-transform:uppercase; white-space:nowrap; }

  h2.sec-title { font-family:var(--serif); font-size:clamp(26px,4vw,42px); color:var(--ink); line-height:1.1; margin-bottom:6px; font-weight:700; }

  /* ── Drop cap ── */
  .drop-cap::first-letter {
    font-family:var(--serif); font-size:4em; font-weight:900; color:var(--teal);
    float:left; line-height:0.8; margin-right:7px; margin-top:8px;
  }

  /* ── Glass card base ── */
  .glass {
    background:var(--glass);
    backdrop-filter:blur(14px) saturate(1.4);
    border:1px solid var(--gb);
    border-radius:16px;
  }

  /* ── Skill tile ── */
  .skill-tile {
    background:var(--glass); border:1px solid var(--gb); border-radius:14px;
    padding:18px; cursor:pointer; min-height:88px;
    backdrop-filter:blur(12px);
    transition:background 0.25s, border-color 0.25s, box-shadow 0.25s, min-height 0.28s;
  }
  .skill-tile:hover {
    background:var(--glass-md); border-color:var(--teal);
    box-shadow:0 0 20px var(--teal-dim), 0 4px 24px rgba(0,0,0,0.3);
  }

  /* ── Project card ── */
  .proj-card {
    background:var(--glass); border:1px solid var(--gb); border-radius:16px;
    padding:26px; cursor:pointer; position:relative; overflow:hidden;
    backdrop-filter:blur(12px);
    transition:background 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.25s;
  }
  .proj-card:hover {
    background:var(--glass-md); border-color:var(--gb-t); transform:translateY(-3px);
    box-shadow:0 0 28px var(--teal-dim), 0 12px 40px rgba(0,0,0,0.4);
  }
  .proj-card::after { content:'↗'; position:absolute; bottom:20px; right:20px; font-size:13px; font-family:var(--mono); color:var(--teal); opacity:0; transition:opacity 0.2s, transform 0.2s; transform:translateY(4px); }
  .proj-card:hover::after { opacity:0.9; transform:translateY(0); }

  /* ── Buttons ── */
  .btn-primary {
    background:var(--teal); color:#081A18; border:none;
    padding:11px 26px; border-radius:8px; cursor:pointer;
    font-family:var(--mono); font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:500;
    transition:background 0.18s, box-shadow 0.18s;
  }
  .btn-primary:hover { background:var(--teal-bright); box-shadow:0 0 20px rgba(42,191,176,0.4); }
  .btn-ghost {
    background:var(--glass); color:var(--mid); border:1px solid var(--gb);
    padding:11px 26px; border-radius:8px; cursor:pointer;
    font-family:var(--mono); font-size:10px; letter-spacing:1px; text-transform:uppercase;
    backdrop-filter:blur(8px);
    transition:background 0.18s, border-color 0.18s, color 0.18s;
  }
  .btn-ghost:hover { background:var(--glass-md); border-color:var(--teal); color:var(--teal); }

  /* ── Matrix cell ── */
  .matrix-cell {
    text-align:center; padding:20px 12px; cursor:pointer;
    background:var(--glass); border:1px solid var(--gb); border-radius:10px;
    transition:background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .matrix-cell:hover { transform:scale(1.05); }

  /* ── Contact link ── */
  .contact-link {
    display:flex; justify-content:space-between; align-items:center;
    background:var(--glass); border:1px solid var(--gb); border-radius:10px;
    padding:14px 20px; text-decoration:none; backdrop-filter:blur(12px);
    transition:background 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.18s;
  }
  .contact-link:hover { background:var(--glass-md); border-color:var(--gb-t); transform:translateX(4px); box-shadow:0 0 16px var(--teal-dim); }

  /* ── Modal ── */
  .modal-bg {
    position:fixed; inset:0; background:rgba(4,12,11,0.8); backdrop-filter:blur(16px);
    z-index:600; display:flex; align-items:center; justify-content:center;
    padding:20px; animation:fadeIn 0.15s ease;
  }
  .modal-box {
    background:rgba(10,28,26,0.92); border-radius:18px; padding:36px;
    max-width:580px; width:100%;
    border:1px solid var(--gb); backdrop-filter:blur(20px);
    box-shadow:0 0 40px rgba(42,191,176,0.1), 0 24px 64px rgba(0,0,0,0.6);
    animation:fadeUp 0.22s ease; max-height:90vh; overflow-y:auto;
  }

  /* ── Stat pill ── */
  .stat-pill {
    background:var(--glass); border:1px solid var(--gb); border-radius:12px;
    padding:18px 20px; text-align:center; backdrop-filter:blur(12px);
    transition:background 0.18s, border-color 0.18s, box-shadow 0.18s;
  }
  .stat-pill:hover { background:var(--glass-md); border-color:var(--gb-t); box-shadow:0 0 18px var(--teal-dim); }

  footer {
    border-top:1px solid var(--gb); padding:22px 48px;
    display:flex; justify-content:space-between; align-items:center;
    background:rgba(8,26,24,0.7); backdrop-filter:blur(12px);
  }
`;

/* ── Glitch Name ── */
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
        <span style={{ ...line, color:'var(--teal)' }}>DIYAWAR</span>
      </>}
      {mode==='hi' && <>
        <span style={{ ...line, fontFamily:'var(--deva)', color:'var(--ink)', fontSize:'0.68em', lineHeight:1.15 }}>गरिमा</span>
        <span style={{ ...line, fontFamily:'var(--deva)', color:'var(--teal)', fontSize:'0.68em', lineHeight:1.15 }}>दियावार</span>
      </>}
      {mode==='glitch' && <>
        <span style={{ ...line, fontFamily:'var(--mono)', color:'var(--teal)', fontSize:'0.42em', letterSpacing:'5px' }}>{g[0]}</span>
        <span style={{ ...line, fontFamily:'var(--mono)', color:'var(--teal)', fontSize:'0.42em', letterSpacing:'5px' }}>{g[1]}</span>
      </>}
    </div>
  );
}

/* ── Skills ── */
const SKILLS = [
  { name:'Machine Learning', icon:'⚙', tools:['XGBoost','LightGBM','Scikit-learn','Optuna'],     accent:'var(--teal)',        viz:'pipe'    },
  { name:'Deep Learning',    icon:'◎', tools:['PyTorch','HuggingFace','RoBERTa','Transformers'], accent:'var(--teal-bright)', viz:'neural'  },
  { name:'Agentic AI',       icon:'◈', tools:['LangGraph','LangChain','Ollama','LangSmith'],      accent:'var(--teal)',        viz:'agent'   },
  { name:'Data Analysis',    icon:'▣', tools:['Pandas','NumPy','SQL','Polars'],                   accent:'var(--mid)',         viz:'bar'     },
  { name:'NLP',              icon:'◇', tools:['spaCy','Transformers','NLTK','Text Analytics'],    accent:'var(--teal-bright)', viz:'tok'     },
  { name:'XAI & Eval',       icon:'◬', tools:['SHAP','LIME','MLflow','Evidently'],                accent:'var(--teal)',        viz:'metrics' },
  { name:'Cloud & Deploy',   icon:'◐', tools:['Azure AI','Streamlit','FastAPI','GitHub Actions'], accent:'var(--mid)',         viz:'code'    },
  { name:'Data Viz',         icon:'▤', tools:['Plotly','Seaborn','Matplotlib','React'],           accent:'var(--teal)',        viz:'bars2'   },
];

function SkillViz({ type, accent }) {
  const a = accent === 'var(--teal-bright)' ? '#5BE8D8' : accent === 'var(--mid)' ? '#96BDB8' : '#2ABFB0';
  if (type==='pipe') return (
    <div style={{ display:'flex',alignItems:'center',gap:3,margin:'10px 0' }}>
      {['Data','Clean','Train','Eval','Deploy'].map((s,i)=>(
        <div key={s} style={{ display:'flex',alignItems:'center',gap:3 }}>
          <div style={{ background:a,color:'#081A18',fontSize:7.5,padding:'2px 4px',borderRadius:3,fontFamily:'var(--mono)',fontWeight:500,animation:`fadeUp 0.22s ease ${i*0.07}s both` }}>{s}</div>
          {i<4&&<div style={{ width:5,height:1,background:'var(--gb)' }}/>}
        </div>
      ))}
    </div>
  );
  if (type==='neural') return (
    <div style={{ display:'flex',alignItems:'center',gap:7,margin:'10px 0' }}>
      {[3,5,5,4,2].map((n,li)=>(
        <div key={li} style={{ display:'flex',flexDirection:'column',gap:3 }}>
          {Array.from({length:n}).map((_,ni)=>(
            <div key={ni} style={{ width:6,height:6,borderRadius:'50%',background:(li===1||li===2||li===3)?a:'rgba(255,255,255,0.12)' }}/>
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
        <div key={i} style={{ width:9,height:v*24,borderRadius:'3px 3px 0 0',background:`linear-gradient(180deg,${a},rgba(255,255,255,0.2))`,animation:`barGrow 0.32s ease ${i*0.06}s both`,'--bh':`${v*24}px` }}/>
      ))}
    </div>
  );
  if (type==='tok') return (
    <div style={{ display:'flex',flexWrap:'wrap',gap:3,margin:'10px 0' }}>
      {['[CLS]','implicit','bias','detect','[SEP]'].map((t,i)=>(
        <span key={t} style={{ fontSize:8,background:`${a}22`,color:a,border:`1px solid ${a}55`,borderRadius:3,padding:'1px 4px',fontFamily:'var(--mono)',animation:`fadeUp 0.2s ease ${i*0.07}s both` }}>{t}</span>
      ))}
    </div>
  );
  if (type==='metrics') return (
    <div style={{ display:'flex',flexWrap:'wrap',gap:3,margin:'10px 0' }}>
      {[['AUC','0.847'],['F1','0.783'],['SHAP','✓'],['PR','0.79']].map(([k,v])=>(
        <div key={k} style={{ background:`${a}18`,color:a,border:`1px solid ${a}44`,borderRadius:4,padding:'2px 5px',fontFamily:'var(--mono)',fontSize:8,lineHeight:1.4 }}>
          <div style={{ opacity:0.65 }}>{k}</div><div style={{ fontWeight:500 }}>{v}</div>
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
    <div className="skill-tile" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ minHeight:hov?162:88 }}>
      <div style={{ fontSize:16,marginBottom:6,opacity:0.6 }}>{sk.icon}</div>
      <div style={{ fontFamily:'var(--mono)',fontSize:10,fontWeight:500,color:sk.accent,letterSpacing:0.5,textTransform:'uppercase' }}>{sk.name}</div>
      {hov&&<div style={{ animation:'fadeUp 0.16s ease' }}>
        <SkillViz type={sk.viz} accent={sk.accent}/>
        <div style={{ display:'flex',flexWrap:'wrap',gap:3 }}>
          {sk.tools.map(t=><span key={t} style={{ fontSize:8,background:'var(--glass)',border:'1px solid var(--gb)',color:'var(--mid)',padding:'1px 5px',borderRadius:3,fontFamily:'var(--mono)' }}>{t}</span>)}
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
    desc:'Zero-cost knowledge base that actually knows things and can cite its sources. PDFs, Slack, email ingested. Hybrid retrieval, hallucination detection, full RBAC. No cloud bill.',
    longDesc:'A production-ready multi-agent knowledge retrieval system built entirely on free, local tooling. LangGraph for orchestration, ChromaDB for vector storage, BM25Okapi for sparse retrieval, and Reciprocal Rank Fusion to merge both. BAAI/bge-reranker-base re-ranks top candidates. Hallucination detection combines LLM NLI checking with Jaccard token overlap. Full RBAC with bcrypt + JWT across 4 roles. TinyDB-backed sliding window memory per session.',
    tech:['LangGraph','ChromaDB','BM25 + RRF','BAAI/bge','Ollama (Llama3)','Streamlit','JWT/RBAC'],
    github:'https://github.com/garimadiyawar/enterprise_brain',
  },
  {
    id:2, num:'02', title:'Pharma AE Monitor', subtitle:'3-Agent Drug Safety Signal Detection',
    badge:'LIVE', cat:'Healthcare AI × Agents', live_badge:true,
    desc:'Type a drug name. Three agents later, you have a pharmacovigilance-grade report: organ clusters, RED/YELLOW/GREEN safety flags, structured narrative. The analysis IQVIA charges a lot for, rebuilt on a weekend.',
    longDesc:'A 3-agent LangGraph pipeline doing real pharmacovigilance work. Agent 1 hits the OpenFDA FAERS API with conditional routing for missing data. Agent 2 clusters adverse reactions by organ system. Agent 3 writes a structured narrative report with tiered safety signal ratings. Powered by Claude 3.5 Haiku, fully traced in LangSmith.',
    tech:['LangGraph','Claude 3.5 Haiku','OpenFDA FAERS','LangSmith','Streamlit','Python 3.11'],
    github:'https://github.com/garimadiyawar/Pharma-ae-monitor',
  },
  {
    id:3, num:'03', title:'BeNice', subtitle:'Implicit Bigotry Multi-Label Classifier',
    badge:'INVESTIGATION', cat:'NLP Research × Social Good', live_badge:false,
    desc:'Catches the hate that hides behind "just asking questions." Fine-tuned RoBERTa to flag misogyny, racism, casteism, and cyberbullying, including the coded, plausibly deniable kind.',
    longDesc:'Research-grade multi-label NLP classifier targeting the hard cases in content moderation: not slurs or explicit threats, but normalised, emotionally framed, culturally coded prejudice. Fine-tuned RoBERTa-base with BCEWithLogitsLoss and positive class weighting. Minimal contrast pairs sharpen decision boundaries. Per-label threshold tuning improves recall on minority classes.',
    tech:['PyTorch','HuggingFace Transformers','RoBERTa-base','BCEWithLogitsLoss','scikit-learn','Contrast Pairs'],
    github:'https://github.com/garimadiyawar/BeNice',
  },
  {
    id:4, num:'04', title:'Credit Risk — Thin-File Borrowers', subtitle:'Published Research + B.Tech Thesis',
    badge:'PUBLISHED', cat:'FinTech × Explainable AI', live_badge:false,
    desc:"Published research paper and B.Tech thesis. The banks' models fail thin-file borrowers by ignoring them. XGBoost + SHAP + LIME + full fairness audit on 300k+ real Home Credit loan applications.",
    longDesc:"Full ML pipeline on the Home Credit Default Risk dataset (7 files, 300k+ rows), published as a research paper and submitted as the B.Tech thesis. Separate evaluation track for thin-file borrowers. LR, RF, XGBoost, and LightGBM trained with stratified splits and Optuna TPE hyperparameter search. Explainability via SHAP (global, local, interaction values) and LIME. Fairness evaluation: demographic parity, equalised odds, bootstrap CI.",
    tech:['XGBoost','LightGBM','SHAP','LIME','Optuna TPE','Fairness Eval','Home Credit Dataset'],
    github:'https://github.com/garimadiyawar/Explainable-credit-risk-modelling-for-thin-file-borrowers',
  },
  {
    id:5, num:'05', title:'Demand Forecasting', subtitle:'LightGBM + ROI Simulation on M5',
    badge:'FULL REPORT', cat:'Retail × Applied ML', live_badge:false,
    desc:'17% MAE improvement over seasonal naive. Rs. 35,000 in projected annual savings at pilot scale. The model was right. The simulation showed it.',
    longDesc:'End-to-end demand forecasting on the M5 Forecasting dataset. Global LightGBM trained across 30,000 SKUs using lag features, rolling means, calendar effects, SNAP flags, and price data. Time-based split prevents leakage. 28-day inventory simulation demonstrates how forecast accuracy translates to real cost reduction.',
    tech:['LightGBM','Pandas','M5 Dataset','FastAPI','Streamlit','ROI Simulation'],
    github:'https://github.com/garimadiyawar/demand-forecasting',
  },
  {
    id:6, num:'06', title:'Knowledge Mining & Compliance', subtitle:'Azure AI Document Intelligence',
    badge:'DEPLOYED', cat:'Cloud AI × Compliance', live_badge:true,
    desc:'Azure AI stack scanning legal and financial documents for compliance risks in real time. Upload a doc, get a risk flag. No reading required.',
    longDesc:'A fully deployed compliance risk detection system using Azure AI services. Azure Text Analytics handles NLP. Azure Translator enables multilingual processing. Azure Cognitive Search provides full-text indexing. Outputs structured risk flags with severity levels. Built with GitHub Actions CI/CD.',
    tech:['Azure Text Analytics','Azure Cognitive Search','Translator API','Streamlit','GitHub Actions','Python'],
    github:'https://github.com/garimadiyawar/Knowledge-Mining-and-Compliance-Risk-Detection-System',
    live:'https://compliance-risk-detection-system.streamlit.app/',
  },
  {
    id:7, num:'07', title:'Hum-to-Music AI', subtitle:'Audio ML + React Native Mobile App',
    badge:'FULL BUILD', cat:'Audio ML × Mobile', live_badge:false,
    desc:'Hum something. Get an orchestra back. Pitch detection, melody extraction, chord generation, multi-instrument arrangement, WAV output. Takes about as long as your coffee.',
    longDesc:'Full-stack audio ML pipeline: record a hummed melody on your phone, receive a fully arranged WAV. Backend: pitch detection (Librosa), melody extraction, chord generation (PyTorch), multi-instrument arrangement (PrettyMIDI), WAV render (Pydub). Served via FastAPI. React Native Expo frontend handles recording, API calls, and playback.',
    tech:['PyTorch','Librosa','PrettyMIDI','FastAPI','React Native','Expo','Pydub'],
    github:'https://github.com/garimadiyawar/hum-to-music-ai',
  },
  {
    id:8, num:'08', title:'Gen Z Economy', subtitle:'Multi-Dimensional Economic Analysis',
    badge:'DEPLOYED', cat:'Data Research × Economics', live_badge:true,
    desc:"Turns out 'just work harder' doesn't track with the data. Cost of living, employment gaps, education debt, housing affordability, generational mobility: all sourced, all interactive.",
    longDesc:"A multi-dimensional analysis of Gen Z's economic position combining cost of living indices, youth employment data, education debt loads, housing affordability ratios, and generational wealth mobility metrics. Deployed as an interactive dashboard covering multiple countries and cities.",
    tech:['Pandas','SQL','Plotly','Streamlit','Data Analysis','Composite Indexing'],
    github:'https://github.com/garimadiyawar/genz-economy',
    live:'https://genzeconomy.vercel.app',
  },
];

function ProjectCard({ proj, onClick }) {
  return (
    <div className="proj-card" onClick={onClick}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:13 }}>
        <span style={{ fontFamily:'var(--mono)',fontSize:8.5,color:'var(--muted)',letterSpacing:0.5 }}>{proj.cat}</span>
        <span style={{
          fontFamily:'var(--mono)', fontSize:7.5, letterSpacing:1.5, padding:'2px 7px', borderRadius:20,
          background: proj.live_badge ? 'var(--teal)' : 'rgba(42,191,176,0.12)',
          color: proj.live_badge ? '#081A18' : 'var(--teal)',
          border: proj.live_badge ? 'none' : '1px solid rgba(42,191,176,0.3)',
        }}>{proj.badge}</span>
      </div>
      <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'rgba(42,191,176,0.3)',letterSpacing:2.5,marginBottom:8 }}>{proj.num}</div>
      <h3 style={{ fontFamily:'var(--serif)',fontSize:19,fontWeight:700,color:'var(--ink)',marginBottom:3,lineHeight:1.2 }}>{proj.title}</h3>
      <div style={{ fontFamily:'var(--body)',fontSize:13,color:'var(--muted)',marginBottom:13,fontStyle:'italic' }}>{proj.subtitle}</div>
      <p style={{ fontFamily:'var(--body)',fontSize:15,color:'var(--mid)',lineHeight:1.75,marginBottom:20 }}>{proj.desc}</p>
      <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
        {proj.tech.slice(0,4).map(t=><span key={t} style={{ fontSize:9,background:'var(--glass)',border:'1px solid var(--gb)',color:'var(--mid)',padding:'2px 7px',borderRadius:20,fontFamily:'var(--mono)' }}>{t}</span>)}
        {proj.tech.length>4&&<span style={{ fontSize:9,color:'var(--muted)',fontFamily:'var(--mono)',padding:'2px 4px' }}>+{proj.tech.length-4}</span>}
      </div>
    </div>
  );
}

function ProjectModal({ proj, onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16 }}>
          <span style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--teal)',letterSpacing:2 }}>{proj.cat.toUpperCase()}</span>
          <button onClick={onClose} style={{ background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--muted)',lineHeight:1,padding:0 }}>×</button>
        </div>
        <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'rgba(42,191,176,0.35)',letterSpacing:2.5,marginBottom:6 }}>{proj.num}</div>
        <h2 style={{ fontFamily:'var(--serif)',fontSize:22,fontWeight:700,color:'var(--ink)',marginBottom:3,lineHeight:1.2 }}>{proj.title}</h2>
        <div style={{ fontFamily:'var(--body)',fontSize:13,color:'var(--muted)',marginBottom:16,fontStyle:'italic' }}>{proj.subtitle}</div>
        <p style={{ fontFamily:'var(--body)',color:'var(--mid)',lineHeight:1.9,fontSize:15,marginBottom:22 }}>{proj.longDesc}</p>
        <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:24 }}>
          {proj.tech.map(t=><span key={t} style={{ background:'var(--glass)',border:'1px solid var(--gb)',color:'var(--mid)',padding:'3px 10px',borderRadius:20,fontSize:10,fontFamily:'var(--mono)' }}>{t}</span>)}
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
  { k:'tp', label:'TP', val:85, name:'True Positives',  bg:'rgba(76,175,80,0.15)',  bdr:'#4CAF50', blurb:'Correctly predicted Default, actual Default. The model caught the risk.' },
  { k:'fp', label:'FP', val:12, name:'False Positives', bg:'rgba(255,152,0,0.15)',  bdr:'#FF9800', blurb:'Model said Default, actually No Default. Unnecessary rejections — real harm to real people.' },
  { k:'fn', label:'FN', val:8,  name:'False Negatives', bg:'rgba(244,67,54,0.15)',  bdr:'#F44336', blurb:'Missed a real Default. The costliest mistake in credit risk.' },
  { k:'tn', label:'TN', val:95, name:'True Negatives',  bg:'rgba(33,150,243,0.15)', bdr:'#2196F3', blurb:'Correctly predicted No Default, actual No Default. Clean, confident predictions.' },
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
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,maxWidth:264 }}>
          {CM_CELLS.map(cell=>(
            <div key={cell.k} className="matrix-cell" onMouseEnter={()=>setHov(cell.k)} onMouseLeave={()=>setHov(null)}
              style={{ background:hov===cell.k?cell.bg:'var(--glass)',borderColor:hov===cell.k?cell.bdr:'var(--gb)',boxShadow:hov===cell.k?`0 0 20px ${cell.bdr}44`:'none' }}>
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
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {Object.entries(metrics).map(([k,v])=>(
                <div key={k} style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <span style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--mid)',minWidth:84 }}>{k}</span>
                  <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                    <div style={{ width:80,height:3,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden' }}>
                      <div style={{ width:`${v*100}%`,height:'100%',background:'var(--teal)',borderRadius:2,transition:'width 0.35s ease' }}/>
                    </div>
                    <span style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--teal)',minWidth:38 }}>{v.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ):(
          <div style={{ fontFamily:'var(--body)',color:'var(--muted)',fontSize:15,lineHeight:1.9,fontStyle:'italic' }}>
            200 test predictions from the credit risk thesis. Hover each quadrant. The numbers that matter aren't the big ones.{' '}
            <span style={{ color:'var(--teal)',fontStyle:'normal' }}>False negatives carry the heaviest real-world cost.</span>
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
    <img src="https://github-readme-activity-graph.vercel.app/graph?username=garimadiyawar&bg_color=081a18&color=96bdb8&line=2abfb0&point=5be8d8&area=true&hide_border=true&area_color=2abfb0"
      alt="GitHub activity" style={{ width:'100%',height:'auto',display:'block',borderRadius:8 }}
      onError={()=>setOk(false)}
    />
  ) : (
    <div style={{ fontFamily:'var(--mono)',fontSize:12,color:'var(--muted)',padding:'20px 0' }}>
      Chart unavailable — <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer" style={{ color:'var(--teal)' }}>github.com/garimadiyawar ↗</a>
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
          {NAV.map(([id,lb])=><button key={id} className={`nav-btn${activeSec===id?' active':''}`} onClick={()=>go(id)}>{lb}</button>)}
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="home" style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'60px 48px 48px' }}>
        <div style={{ textAlign:'center',maxWidth:820,width:'100%' }}>

          {/* Masthead band */}
          <div style={{ display:'flex',alignItems:'center',gap:0,marginBottom:40,animation:'fadeUp 0.4s ease 0.05s both' }}>
            <div style={{ flex:1,height:'1px',background:'var(--gb)' }}/>
            <div style={{ padding:'6px 22px',background:'var(--glass)',border:'1px solid var(--gb)',borderRadius:4,backdropFilter:'blur(8px)' }}>
              <span style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:5,textTransform:'uppercase',whiteSpace:'nowrap' }}>The Intelligence Dispatch</span>
            </div>
            <div style={{ flex:1,height:'1px',background:'var(--gb)' }}/>
          </div>

          {/* Name */}
          <h1 style={{ fontFamily:'var(--serif)',fontWeight:900,fontSize:'clamp(72px,12vw,132px)',letterSpacing:'2px',lineHeight:0.92,marginBottom:0,animation:'fadeUp 0.65s ease 0.12s both' }}>
            <GlitchName/>
          </h1>

          {/* Rule */}
          <div style={{ width:56,height:2,background:'var(--teal)',margin:'22px auto',opacity:0.7,animation:'fadeUp 0.4s ease 0.28s both',boxShadow:'0 0 12px rgba(42,191,176,0.5)' }}/>

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

      {/* ══ ABOUT ══ */}
      <section id="about" style={{ padding:'80px 48px' }}>
        <div style={{ maxWidth:980,margin:'0 auto' }}>
          <div className="reveal">
            <div className="dispatch-tag"><span>About the Engineer</span></div>
            <h2 className="sec-title">The mind behind<br/><em>the models</em></h2>
          </div>

          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginTop:40,alignItems:'start' }}>
            {/* Bio */}
            <div className="glass" style={{ padding:'28px 30px' }}>
              {[
                "B.Tech CSE graduate with a research interest in applied machine learning, particularly in making models legible. The thesis investigated credit risk prediction for thin-file borrowers, combining ensemble methods with SHAP and LIME-based explainability, and was published as a research paper.",
                "Beyond the thesis, the work has ranged widely: multi-agent retrieval systems, NLP classifiers for implicit bias in online text, a pharmacovigilance pipeline built on real FDA data, audio-to-arrangement ML, and most recently, a deployed dashboard examining Gen Z's economic position across cost of living, employment, education debt, and housing. The common thread is building things that run, not just things that look good in a notebook.",
                "Explainability is a recurring theme rather than an afterthought. There is a difference between a model that performs well and one whose decisions can be examined, questioned, and trusted.",
              ].map((para,i)=>(
                <p key={i} className={i===0?'drop-cap':''} style={{ fontFamily:'var(--body)',fontSize:i===0?16:14,color:i===0?'var(--ink)':'var(--mid)',lineHeight:1.95,marginBottom:i<2?18:0 }}>{para}</p>
              ))}
            </div>

            {/* CV list */}
            <div className="glass" style={{ padding:'28px 30px' }}>
              {[
                { l:'Education',   v:'B.Tech, Computer Science & Engineering' },
                { l:'Focus',       v:'Agentic AI · Explainable ML · NLP · Audio ML' },
                { l:'Stack',       v:'Python · LangGraph · PyTorch · SHAP · Azure AI · Streamlit' },
                { l:'Shipped',     v:'8 end-to-end systems, all public on GitHub' },
                { l:'Open to',     v:'AI/ML roles, research collabs, interesting problems' },
              ].map(({ l,v },i,arr)=>(
                <div key={l} style={{ borderBottom:i<arr.length-1?'1px solid var(--gb)':'none',paddingBottom:12,marginBottom:12,display:'flex',gap:16,alignItems:'flex-start' }}>
                  <span style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--teal)',letterSpacing:1,minWidth:72,paddingTop:2,flexShrink:0,textTransform:'uppercase' }}>{l}</span>
                  <span style={{ fontFamily:'var(--body)',fontSize:14,color:'var(--ink)',lineHeight:1.5 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginTop:16 }}>
            {[
              { n:'8',   l:'Systems shipped' },
              { n:ghRepos!=null?String(ghRepos):'…', l:'Public repos' },
              { n:'0.847', l:'Best AUC, credit risk' },
              { n:'17%', l:'MAE improvement, M5' },
            ].map(({ n,l })=>(
              <div key={l} className="stat-pill">
                <div style={{ fontFamily:'var(--serif)',fontSize:24,color:'var(--teal)',fontWeight:700,lineHeight:1 }}>{n}</div>
                <div style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--muted)',marginTop:7,letterSpacing:0.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills" style={{ padding:'72px 48px' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center',marginBottom:44 }}>
            <div className="dispatch-tag" style={{ justifyContent:'center' }}><span>Technical Arsenal</span></div>
            <h2 className="sec-title" style={{ textAlign:'center' }}>The Toolkit</h2>
            <p style={{ fontFamily:'var(--body)',color:'var(--muted)',fontSize:14,marginTop:6,fontStyle:'italic' }}>Hover any tile to explore the domain</p>
          </div>
          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12 }}>
            {SKILLS.map(sk=><SkillTile key={sk.name} sk={sk}/>)}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" style={{ padding:'72px 48px' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:40 }}>
            <div className="dispatch-tag"><span>From the Research Desk</span></div>
            <h2 className="sec-title">Projects &<br/><em>Research</em></h2>
            <p style={{ fontFamily:'var(--body)',color:'var(--muted)',fontSize:14,marginTop:6,fontStyle:'italic' }}>Click any card to read more</p>
          </div>
          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14 }}>
            {PROJECTS.map(p=><ProjectCard key={p.id} proj={p} onClick={()=>setActiveProj(p)}/>)}
          </div>
        </div>
      </section>

      {/* ══ ML LAB ══ */}
      <section id="demo" style={{ padding:'72px 48px' }}>
        <div style={{ maxWidth:920,margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:36 }}>
            <div className="dispatch-tag"><span>Dissertation Results</span></div>
            <h2 className="sec-title">Confusion Matrix<br/><em>Explorer</em></h2>
            <p style={{ fontFamily:'var(--body)',color:'var(--mid)',fontSize:15,lineHeight:1.85,maxWidth:500,marginTop:10,fontStyle:'italic' }}>
              200 test predictions from the credit risk thesis. Hover each quadrant. The numbers that matter aren't the big ones.
            </p>
          </div>

          <div className="reveal glass" style={{ padding:'36px 36px 28px' }}>
            <ConfusionMatrix/>
          </div>

          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:12 }}>
            {[
              { q:'What makes a good model?', a:"In credit risk, the question isn't accuracy. It's whether the wrong answers hurt the right people. False negatives cost borrowers. False positives cost banks." },
              { q:'Why not just use accuracy?', a:"On imbalanced datasets, 'predicts safe every time' scores 90% accuracy and misses every default. Accuracy is the metric of someone who hasn't thought about the problem." },
              { q:'Where does SHAP come in?', a:"SHAP turns 'the model decided' into 'here is exactly why.' It makes decisions auditable to regulators, legible to loan officers, and contestable by borrowers." },
            ].map(({ q,a })=>(
              <div key={q} className="glass" style={{ padding:18 }}>
                <div style={{ fontFamily:'var(--serif)',fontSize:13,fontWeight:700,color:'var(--ink)',marginBottom:8,lineHeight:1.4 }}>{q}</div>
                <div style={{ fontFamily:'var(--body)',fontSize:13,color:'var(--mid)',lineHeight:1.8 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GITHUB ══ */}
      <section id="github" style={{ padding:'72px 48px' }}>
        <div style={{ maxWidth:860,margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:28 }}>
            <div className="dispatch-tag"><span>GitHub Activity</span></div>
            <h2 className="sec-title">Commit by<br/><em>commit</em></h2>
          </div>
          <div className="reveal glass" style={{ padding:28 }}>
            <GitHubActivity/>
            <div style={{ marginTop:24,borderTop:'1px solid var(--gb)',paddingTop:18,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14 }}>
              <div>
                <div style={{ fontFamily:'var(--serif)',fontSize:15,color:'var(--ink)',fontWeight:700,marginBottom:3 }}>Consistently building</div>
                <div style={{ fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)' }}>
                  Live · <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer" style={{ color:'var(--teal)' }}>github.com/garimadiyawar ↗</a>
                </div>
              </div>
              {[[ghRepos!=null?String(ghRepos):'…','Public repos'],['8','Projects'],['∞','Experiments']].map(([n,l])=>(
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--serif)',fontSize:20,color:'var(--teal)',fontWeight:700 }}>{n}</div>
                  <div style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--muted)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{ padding:'72px 48px 110px' }}>
        <div style={{ maxWidth:540,margin:'0 auto',textAlign:'center' }}>
          <div className="reveal">
            <div className="dispatch-tag" style={{ justifyContent:'center' }}><span>Correspondence</span></div>
            <h2 className="sec-title">Send a dispatch.<br/><em>Let's talk.</em></h2>
            <p style={{ fontFamily:'var(--body)',fontStyle:'italic',color:'var(--mid)',fontSize:16,lineHeight:1.9,margin:'14px auto 36px',maxWidth:420 }}>
              Open to AI/ML roles, research collabs, or a genuinely interesting problem.
              Bonus points if it involves messy data and no obvious solution.
            </p>
          </div>

          <div className="reveal" style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {[
              { l:'Email',    v:'ndiyawar@gmail.com',             h:'mailto:ndiyawar@gmail.com' },
              { l:'GitHub',   v:'github.com/garimadiyawar',       h:'https://github.com/garimadiyawar' },
              { l:'LinkedIn', v:'linkedin.com/in/garima-diyawar', h:'https://www.linkedin.com/in/garima-diyawar' },
            ].map(({ l,v,h })=>(
              <a key={l} href={h} target={h.startsWith('http')?'_blank':undefined} rel="noreferrer" className="contact-link">
                <span style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--teal)',letterSpacing:2 }}>{l.toUpperCase()}</span>
                <span style={{ fontFamily:'var(--body)',fontSize:14,color:'var(--ink)' }}>{v}</span>
              </a>
            ))}
          </div>

          <div className="reveal" style={{ marginTop:32 }}>
            <div className="glass" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'9px 18px',borderRadius:8 }}>
              <div style={{ width:6,height:6,borderRadius:'50%',background:'#4CAF50',boxShadow:'0 0 6px #4CAF50',animation:'pulse 2.5s ease-in-out infinite' }}/>
              <span style={{ fontFamily:'var(--mono)',fontSize:9,color:'var(--muted)',letterSpacing:0.5 }}>Available for AI/ML roles · 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div style={{ fontFamily:'var(--serif)',fontSize:14,color:'var(--teal)',fontWeight:700,fontStyle:'italic' }}>Garima Diyawar</div>
        <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:1 }}>data · models · curiosity · 2025</div>
        <div style={{ fontFamily:'var(--mono)',fontSize:8,color:'var(--muted)',letterSpacing:1 }}>© 2025</div>
      </footer>

      {activeProj&&<ProjectModal proj={activeProj} onClose={()=>setActiveProj(null)}/>}
    </div>
  );
}
