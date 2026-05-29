import { useState, useEffect } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=EB+Garamond:wght@400;500&family=DM+Mono:wght@300;400;500&display=swap');

  :root {
    --page:    #080C16;
    --dark:    #0C1020;
    --dark2:   #181E30;
    --gold:    #D4A820;
    --gold-b:  #F0C020;
    --teal:    #00D4C5;
    --teal-b:  #20EDE0;
    --panel:   rgba(12,18,36,0.62);
    --panel-b: rgba(12,18,36,0.45);
    --pb:      rgba(201,168,76,0.18);
    --p-ink:   #EDE8E0;
    --p-mid:   #A09888;
    --p-muted: #706860;
    --d-ink:   #EDE8E0;
    --d-mid:   #A09888;
    --d-muted: #706860;
    --serif:   'Playfair Display', Georgia, serif;
    --body:    'EB Garamond', Georgia, serif;
    --mono:    'DM Mono', 'Courier New', monospace;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; font-style:normal !important; }
  html { scroll-behavior:smooth; }
  body {
    font-family:var(--body); font-size:19px; font-weight:500;
    background: #080C16;
    min-height:100vh;
    color:var(--p-ink); overflow-x:hidden;
  }
  em { color:var(--gold); font-weight:700; }

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:rgba(12,18,36,0.3); }
  ::-webkit-scrollbar-thumb { background:var(--gold); border-radius:2px; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes barGrow { from { height:0; } to { height:var(--bh); } }
  @keyframes pulse   { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
  @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
  @keyframes orbDrift1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(8vw,5vh)} 66%{transform:translate(-5vw,12vh)} }
  @keyframes orbDrift2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-10vw,-8vh)} 66%{transform:translate(6vw,-4vh)} }
  @keyframes orbDrift3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(5vw,-8vh) scale(1.25)} }
  @keyframes orbDrift4 { 0%,100%{transform:translate(0,0)} 40%{transform:translate(-7vw,6vh)} 70%{transform:translate(4vw,-5vh)} }

  .reveal   { opacity:0; transform:translateY(18px); transition:opacity 0.6s ease, transform 0.6s ease; }
  .revealed { opacity:1; transform:translateY(0); }

  /* ── Storm background ── */
  .storm-bg { position:fixed; inset:0; z-index:-1; overflow:hidden; background:#080C16; }
  .storm-orb { position:absolute; border-radius:50%; pointer-events:none; }
  .s1 { width:70vw; height:70vw; filter:blur(75px);
        background:radial-gradient(circle, rgba(110,50,200,0.70) 0%, rgba(70,20,150,0.35) 40%, transparent 70%);
        top:-20%; left:-15%; animation:orbDrift1 28s ease-in-out infinite; }
  .s2 { width:60vw; height:60vw; filter:blur(70px);
        background:radial-gradient(circle, rgba(30,70,190,0.75) 0%, rgba(10,35,120,0.40) 40%, transparent 70%);
        bottom:-20%; right:-15%; animation:orbDrift2 34s ease-in-out infinite; }
  .s3 { width:52vw; height:52vw; filter:blur(85px);
        background:radial-gradient(circle, rgba(90,30,165,0.55) 0%, transparent 70%);
        top:35%; left:25%; animation:orbDrift3 22s ease-in-out infinite; }
  .s4 { width:45vw; height:45vw; filter:blur(100px);
        background:radial-gradient(circle, rgba(180,110,20,0.30) 0%, rgba(150,80,10,0.14) 40%, transparent 70%);
        top:55%; left:45%; animation:orbDrift4 38s ease-in-out infinite; }

  /* ── Thunder flashes ── */
  @keyframes thunderFlash {
    0%, 87%, 88.5%, 90%, 100% { opacity:0; }
    87.5%, 89% { opacity:1; }
  }
  .thunder-flash {
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background: radial-gradient(ellipse at 30% 10%, rgba(180,200,255,0.14) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 5%, rgba(200,180,255,0.09) 0%, transparent 50%);
    animation: thunderFlash 12s ease-in-out infinite;
  }
  .thunder-flash-2 {
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background: radial-gradient(ellipse at 75% 15%, rgba(200,210,255,0.16) 0%, transparent 55%);
    animation: thunderFlash 19s ease-in-out 6s infinite;
  }

  /* ── Rain particles ── */
  @keyframes rainFall {
    0%   { transform:translateY(-150px) translateX(0); opacity:0; }
    5%   { opacity:1; }
    95%  { opacity:0.5; }
    100% { transform:translateY(110vh) translateX(30px); opacity:0; }
  }
  .rain-container { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
  .rain-drop {
    position:absolute; top:0; width:1px;
    background: linear-gradient(to bottom, transparent 0%, rgba(140,170,255,0.5) 50%, rgba(120,150,255,0.2) 100%);
    animation: rainFall linear infinite;
  }

  /* ── Nav (floating glass bezel) ── */
  nav {
    position:fixed; top:14px; left:50%; transform:translateX(-50%); z-index:300;
    background:rgba(8,12,22,0.85);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(201,168,76,0.18);
    border-radius:50px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
    display:inline-flex; align-items:center; justify-content:space-between;
    padding:0 28px; height:50px;
    white-space:nowrap; gap:28px;
  }
  .nav-logo { font-family:var(--serif); font-size:17px; font-weight:700; color:var(--gold); }
  .nav-links { display:flex; gap:26px; }
  .nav-btn {
    background:none; border:none; border-bottom:1px solid transparent;
    padding-bottom:2px; cursor:pointer;
    font-family:var(--mono); font-size:11px; font-weight:500; color:var(--d-muted);
    letter-spacing:1.5px; text-transform:uppercase;
    transition:color 0.15s, border-color 0.15s;
  }
  .nav-btn.active,.nav-btn:hover { color:var(--gold); border-bottom-color:var(--gold); text-shadow:0 0 12px rgba(212,168,32,0.7); }

  /* ── Dark island wrappers ── */
  .island-a {
    background:rgba(10,14,28,0.78);
    backdrop-filter:blur(28px);
    -webkit-backdrop-filter:blur(28px);
    border:1px solid rgba(201,168,76,0.18);
    clip-path: polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px);
    filter:drop-shadow(0 12px 48px rgba(0,0,0,0.65)) drop-shadow(0 0 30px rgba(90,40,160,0.30));
  }
  .island-b {
    background:rgba(10,14,28,0.78);
    backdrop-filter:blur(28px);
    -webkit-backdrop-filter:blur(28px);
    border:1px solid rgba(201,168,76,0.18);
    clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px));
    filter:drop-shadow(0 8px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(80,50,140,0.15));
  }
  .island-c {
    background:rgba(10,14,28,0.78);
    backdrop-filter:blur(28px);
    -webkit-backdrop-filter:blur(28px);
    border:1px solid rgba(201,168,76,0.18);
    clip-path: polygon(28px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 28px 100%, 0 calc(100% - 28px), 0 28px);
    filter:drop-shadow(0 8px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(80,50,140,0.15));
  }

  /* ── Dark glass panel shapes ── */
  .panel-a { background:rgba(12,18,36,0.62); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border-radius:20px 4px 20px 20px; border:1px solid rgba(201,168,76,0.22); box-shadow:0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,32,0.10), inset 0 1px 0 rgba(255,255,255,0.06); transition:border-color 0.18s, box-shadow 0.18s; }
  .panel-a:hover { border-color:rgba(212,168,32,0.55); box-shadow:0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), 0 0 80px rgba(212,168,32,0.15), inset 0 1px 0 rgba(255,255,255,0.08); }
  .panel-b { background:rgba(12,18,36,0.62); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border-radius:4px 20px 20px 20px; border:1px solid rgba(201,168,76,0.22); box-shadow:0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,32,0.10), inset 0 1px 0 rgba(255,255,255,0.06); transition:border-color 0.18s, box-shadow 0.18s; }
  .panel-b:hover { border-color:rgba(212,168,32,0.55); box-shadow:0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), 0 0 80px rgba(212,168,32,0.15), inset 0 1px 0 rgba(255,255,255,0.08); }
  .panel-c { background:rgba(12,18,36,0.62); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border-radius:20px 20px 4px 20px; border:1px solid rgba(201,168,76,0.22); box-shadow:0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,32,0.10), inset 0 1px 0 rgba(255,255,255,0.06); transition:border-color 0.18s, box-shadow 0.18s; }
  .panel-c:hover { border-color:rgba(212,168,32,0.55); box-shadow:0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), 0 0 80px rgba(212,168,32,0.15), inset 0 1px 0 rgba(255,255,255,0.08); }
  .panel-d { background:rgba(12,18,36,0.62); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(201,168,76,0.22); clip-path:polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%); box-shadow:0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06); }
  .panel-e { background:rgba(12,18,36,0.62); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border-radius:20px; border:1px solid rgba(201,168,76,0.22); box-shadow:0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,32,0.10), inset 0 1px 0 rgba(255,255,255,0.06); transition:border-color 0.18s, box-shadow 0.18s; }
  .panel-e:hover { border-color:rgba(212,168,32,0.55); box-shadow:0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), 0 0 80px rgba(212,168,32,0.15), inset 0 1px 0 rgba(255,255,255,0.08); }

  /* ── Panel on page bg ── */
  .panel-light { background:rgba(12,18,36,0.62); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(201,168,76,0.22); box-shadow:0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06); }

  /* ── Section header ── */
  .dispatch-tag { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
  .dispatch-tag::before { content:''; width:20px; height:1px; flex-shrink:0; }
  .dispatch-tag::after  { content:''; flex:1; height:1px; }
  .dispatch-tag span { font-family:var(--mono); font-size:11px; font-weight:500; letter-spacing:4px; text-transform:uppercase; white-space:nowrap; }

  .dt-dark::before { background:var(--gold); }
  .dt-dark::after  { background:rgba(201,168,76,0.15); }
  .dt-dark span    { color:var(--p-muted); }

  .dt-light::before { background:var(--gold); }
  .dt-light::after  { background:rgba(201,168,76,0.15); }
  .dt-light span    { color:var(--p-muted); }

  h2.sec-title-dark  { font-family:var(--serif); font-size:clamp(34px,5vw,54px); color:var(--p-ink);  line-height:1.05; margin-bottom:6px; font-weight:900; }
  h2.sec-title-light { font-family:var(--serif); font-size:clamp(34px,5vw,54px); color:var(--p-ink);  line-height:1.05; margin-bottom:6px; font-weight:900; }

  /* ── Drop cap ── */
  .drop-cap::first-letter {
    font-family:var(--serif); font-size:4em; font-weight:900; color:var(--gold);
    float:left; line-height:0.8; margin-right:7px; margin-top:8px;
  }

  /* ── Skill tile ── */
  .skill-tile {
    background:rgba(12,18,36,0.62);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(201,168,76,0.22);
    box-shadow:0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,32,0.10), inset 0 1px 0 rgba(255,255,255,0.06);
    padding:22px; cursor:pointer;
    transition:background 0.22s, box-shadow 0.22s, min-height 0.28s, border-color 0.22s;
  }
  .skill-tile:hover { background:rgba(12,18,36,0.72); border-color:rgba(212,168,32,0.55); box-shadow:0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), 0 0 80px rgba(212,168,32,0.15), inset 0 1px 0 rgba(255,255,255,0.08); }

  /* ── Project card ── */
  .proj-card {
    background:rgba(12,18,36,0.62);
    border:1px solid rgba(201,168,76,0.22);
    padding:32px; cursor:pointer; position:relative; overflow:hidden;
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    box-shadow:0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,32,0.10), inset 0 1px 0 rgba(255,255,255,0.06);
    transition:background 0.22s, box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  }
  .proj-card:hover { background:rgba(12,18,36,0.78); border-color:rgba(212,168,32,0.55); transform:translateY(-3px); box-shadow:0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), 0 0 80px rgba(212,168,32,0.15), inset 0 1px 0 rgba(255,255,255,0.08); }
  .proj-card::after { content:'↗'; position:absolute; bottom:18px; right:18px; font-family:var(--mono); font-size:12px; color:var(--gold); opacity:0; transition:opacity 0.18s, transform 0.18s; transform:translateY(4px); }
  .proj-card:hover::after { opacity:0.7; transform:translateY(0); }

  /* ── Buttons ── */
  .btn-primary {
    background:linear-gradient(135deg, var(--gold), #A8882C); color:#080C16; border:none;
    padding:14px 30px; cursor:pointer;
    font-family:var(--mono); font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase;
    clip-path:polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
    backdrop-filter:blur(8px);
    transition:background 0.18s;
  }
  .btn-primary:hover { background:linear-gradient(135deg, var(--gold-b), var(--gold)); box-shadow:0 0 30px rgba(212,168,32,0.55), 0 0 60px rgba(212,168,32,0.22); filter:brightness(1.1); }

  .btn-ghost {
    background:rgba(201,168,76,0.08); color:var(--d-ink); border:1px solid rgba(201,168,76,0.28);
    padding:14px 30px; cursor:pointer;
    font-family:var(--mono); font-size:12px; font-weight:500; letter-spacing:1px; text-transform:uppercase;
    border-radius:4px 16px 4px 16px;
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    box-shadow:inset 0 1px 0 rgba(255,255,255,0.08);
    transition:background 0.18s, border-color 0.18s;
  }
  .btn-ghost:hover { background:rgba(201,168,76,0.16); border-color:rgba(201,168,76,0.5); box-shadow:0 0 20px rgba(212,168,32,0.35), inset 0 1px 0 rgba(255,255,255,0.08); }

  .btn-primary-d {
    background:linear-gradient(135deg, var(--gold), #A8882C); color:#080C16; border:none;
    padding:14px 30px; cursor:pointer;
    font-family:var(--mono); font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:600;
    clip-path:polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
    transition:background 0.18s;
  }
  .btn-primary-d:hover { background:linear-gradient(135deg, var(--gold-b), var(--gold)); box-shadow:0 0 30px rgba(212,168,32,0.55), 0 0 60px rgba(212,168,32,0.22); filter:brightness(1.1); }
  .btn-ghost-d {
    background:rgba(201,168,76,0.08); color:var(--d-ink); border:1px solid rgba(201,168,76,0.28);
    padding:14px 30px; cursor:pointer;
    font-family:var(--mono); font-size:12px; font-weight:500; letter-spacing:1px; text-transform:uppercase;
    border-radius:4px 16px 4px 16px;
    backdrop-filter:blur(8px);
    transition:background 0.18s, border-color 0.18s;
  }
  .btn-ghost-d:hover { background:rgba(201,168,76,0.16); border-color:rgba(201,168,76,0.5); box-shadow:0 0 20px rgba(212,168,32,0.35), inset 0 1px 0 rgba(255,255,255,0.08); }

  /* ── Matrix cell ── */
  .matrix-cell {
    text-align:center; padding:20px 12px; cursor:pointer;
    background:rgba(12,18,36,0.62);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(201,168,76,0.22);
    box-shadow:0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,32,0.10), inset 0 1px 0 rgba(255,255,255,0.06);
    transition:background 0.18s, border-color 0.18s, transform 0.18s, box-shadow 0.18s;
    border-radius:4px 16px 4px 16px;
  }
  .matrix-cell:hover { transform:scale(1.05); border-color:rgba(212,168,32,0.55); box-shadow:0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), 0 0 80px rgba(212,168,32,0.15); }

  /* ── Contact link ── */
  .contact-link {
    display:flex; justify-content:space-between; align-items:center;
    background:rgba(12,18,36,0.62);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(201,168,76,0.22);
    box-shadow:0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    padding:14px 20px; text-decoration:none;
    clip-path:polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
    transition:background 0.18s, box-shadow 0.18s, border-color 0.18s;
  }
  .contact-link:hover { background:rgba(12,18,36,0.78); border-color:rgba(212,168,32,0.55); box-shadow:4px 4px 0 rgba(212,168,32,0.5), 0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), inset 0 1px 0 rgba(255,255,255,0.08); }

  /* ── Stat pill ── */
  .stat-pill {
    background:rgba(12,18,36,0.62);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(201,168,76,0.22);
    padding:18px 20px; text-align:center;
    border-radius:16px 4px 16px 4px;
    box-shadow:0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,32,0.10), inset 0 1px 0 rgba(255,255,255,0.06);
    transition:background 0.18s, box-shadow 0.18s, border-color 0.18s;
  }
  .stat-pill:hover { background:rgba(12,18,36,0.78); border-color:rgba(212,168,32,0.55); box-shadow:0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,32,0.35), 0 0 80px rgba(212,168,32,0.15); }

  /* ── Modal ── */
  .modal-bg {
    position:fixed; inset:0; background:rgba(4,6,14,0.75);
    backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
    z-index:600; display:flex; align-items:center; justify-content:center;
    padding:20px; animation:fadeIn 0.15s ease;
  }
  .modal-box {
    background:rgba(12,18,36,0.78);
    backdrop-filter:blur(32px); -webkit-backdrop-filter:blur(32px);
    border-radius:20px 4px 20px 20px;
    padding:36px; max-width:580px; width:100%;
    border:1px solid rgba(201,168,76,0.22);
    box-shadow:0 20px 60px rgba(0,0,0,0.4), 0 0 20px rgba(80,50,140,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
    animation:fadeUp 0.22s ease; max-height:90vh; overflow-y:auto;
  }

  footer {
    background:rgba(8,12,22,0.90);
    backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
    border-top:1px solid rgba(201,168,76,0.15);
    padding:22px 48px;
    display:flex; justify-content:space-between; align-items:center;
    clip-path:polygon(28px 0, 100% 0, 100% 100%, 0 100%, 0 28px);
  }

  /* ── Mobile Responsive ── */
  @media (max-width: 768px) {
    nav {
      top:10px; padding:0 20px; height:48px; gap:16px;
    }
    .nav-logo { font-size:14px; }
    .nav-links { gap:14px; }
    .nav-btn { font-size:9px; letter-spacing:0.8px; padding-bottom:1px; }

    body { font-size:16px; }

    h2.sec-title-dark, h2.sec-title-light { font-size:clamp(28px,4vw,40px); }

    .skill-tile { padding:16px; }

    #home > div:first-child { grid-template-columns:1fr !important; }
    #about > div > div:nth-child(2) { grid-template-columns:1fr !important; }
    #skills .reveal { grid-template-columns:repeat(2,1fr) !important; }
    #projects .reveal { grid-template-columns:1fr !important; }
    #demo .island-a > div > .reveal:last-of-type { grid-template-columns:repeat(2,1fr) !important; }
    #github > div > div:last-child { grid-template-columns:1fr !important; }

    footer {
      padding:18px 24px; flex-direction:column; gap:12px; text-align:center;
      clip-path:none; border-radius:0;
    }
  }

  @media (max-width: 640px) {
    body { font-size:15px; }

    #home { padding:70px 20px 20px !important; }
    #about { padding:20px 16px !important; }
    #skills { padding:20px 16px !important; }
    #projects { padding:20px 16px !important; }
    #demo { padding:20px 16px !important; }
    #demo .island-a > div > .reveal:last-of-type { grid-template-columns:1fr !important; }
    #github { padding:20px 16px !important; }

    nav {
      top:8px; padding:0 16px; height:46px; gap:12px;
      border-radius:30px;
    }
    .nav-btn { font-size:8px; letter-spacing:0.5px; }

    h1 { font-size:clamp(48px,8vw,80px) !important; }
    h2 { font-size:clamp(24px,3.5vw,32px) !important; }
    h3 { font-size:18px !important; }

    .island-a, .island-b, .island-c { padding:40px 24px !important; }
    .panel-a, .panel-b, .panel-c, .panel-d, .panel-e { padding:24px 20px !important; }

    #home > div:first-child { grid-template-columns:1fr !important; gap:12px !important; }
    #about > div > div:nth-child(2) { grid-template-columns:1fr !important; gap:12px !important; }
    #skills .reveal { grid-template-columns:repeat(2,1fr) !important; gap:10px !important; }
    #projects .reveal { grid-template-columns:1fr !important; gap:10px !important; }

    .skill-tile { padding:14px; min-height:90px !important; }
    .skill-tile:hover { min-height:auto !important; }

    .proj-card { padding:20px !important; }

    .btn-primary, .btn-ghost, .btn-primary-d, .btn-ghost-d {
      padding:12px 24px; font-size:11px;
    }

    .stat-pill { padding:16px 14px; }

    .contact-link { clip-path:none; padding:14px 16px !important; }

    .modal-box { padding:24px; max-width:95vw; max-height:95vh; }

    footer { font-size:12px; gap:10px; }
    footer div { margin:0 !important; }

    .drop-cap::first-letter { display:none; }

    .dispatch-tag { gap:10px; margin-bottom:12px; }
    .dispatch-tag::before { width:14px; }
  }

  @media (max-width: 480px) {
    body { font-size:14px; }

    #home { padding:60px 16px 16px !important; }

    h1 { font-size:clamp(36px,7vw,56px) !important; }
    h2 { font-size:clamp(20px,3vw,28px) !important; }

    nav { padding:0 12px; height:44px; gap:10px; }
    .nav-btn { font-size:7px; letter-spacing:0.5px; }

    .island-a, .island-b, .island-c { padding:32px 18px !important; }
    .panel-a, .panel-b, .panel-c, .panel-d, .panel-e { padding:18px 16px !important; }

    #home > div:first-child { grid-template-columns:1fr !important; gap:10px !important; }
    #skills .reveal { grid-template-columns:1fr !important; gap:8px !important; }

    .skill-tile { padding:12px; font-size:12px !important; }

    .proj-card { padding:16px !important; }
    .proj-card h3 { font-size:18px !important; }

    .btn-primary, .btn-ghost, .btn-primary-d, .btn-ghost-d {
      padding:10px 18px; font-size:10px;
    }

    .stat-pill { padding:14px 12px; }

    footer { padding:14px 16px; font-size:11px; }
  }
`;

/* ── Static Name ── */
function GlitchName() {
  const line = { display:'block', lineHeight:0.92 };
  return (
    <div style={{ userSelect:'none' }}>
      <span style={{...line,color:'var(--d-ink)'}}>GARIMA</span>
      <span style={{...line,color:'var(--teal)'}}>DIYAWAR</span>
    </div>
  );
}

/* ── Skills ── */
const SKILL_SHAPES = ['16px 4px 16px 4px','4px 16px 4px 16px','16px 4px 4px 16px','4px 16px 16px 4px','16px','4px','16px 4px 16px 4px','4px 16px 4px 16px'];
const SKILLS = [
  { name:'Machine Learning', icon:'⚙', tools:['XGBoost','LightGBM','Scikit-learn','Optuna'],     accent:'#153935', viz:'pipe'    },
  { name:'Deep Learning',    icon:'◎', tools:['PyTorch','HuggingFace','RoBERTa','Transformers'], accent:'#2ABFB0', viz:'neural'  },
  { name:'Agentic AI',       icon:'◈', tools:['LangGraph','LangChain','Ollama','LangSmith'],      accent:'#153935', viz:'agent'   },
  { name:'Data Analysis',    icon:'▣', tools:['Pandas','NumPy','SQL','Polars'],                   accent:'#2A5550', viz:'bar'     },
  { name:'NLP',              icon:'◇', tools:['spaCy','Transformers','NLTK','Text Analytics'],    accent:'#2ABFB0', viz:'tok'     },
  { name:'XAI & Eval',       icon:'◬', tools:['SHAP','LIME','MLflow','Evidently'],                accent:'#153935', viz:'metrics' },
  { name:'Cloud & Deploy',   icon:'◐', tools:['Azure AI','Streamlit','FastAPI','GitHub Actions'], accent:'#2A5550', viz:'code'    },
  { name:'Data Viz',         icon:'▤', tools:['Plotly','Seaborn','Matplotlib','React'],           accent:'#153935', viz:'bars2'   },
];

function SkillViz({ type, accent }) {
  if (type==='pipe') return (
    <div style={{display:'flex',alignItems:'center',gap:3,margin:'10px 0'}}>
      {['Data','Clean','Train','Eval','Deploy'].map((s,i)=>(
        <div key={s} style={{display:'flex',alignItems:'center',gap:3}}>
          <div style={{background:accent,color:'#fff',fontSize:7.5,padding:'2px 4px',borderRadius:3,fontFamily:'var(--mono)',animation:`fadeUp 0.22s ease ${i*0.07}s both`}}>{s}</div>
          {i<4&&<div style={{width:5,height:1,background:'rgba(0,0,0,0.15)'}}/>}
        </div>
      ))}
    </div>
  );
  if (type==='neural') return (
    <div style={{display:'flex',alignItems:'center',gap:7,margin:'10px 0'}}>
      {[3,5,5,4,2].map((n,li)=>(
        <div key={li} style={{display:'flex',flexDirection:'column',gap:3}}>
          {Array.from({length:n}).map((_,ni)=>(
            <div key={ni} style={{width:6,height:6,borderRadius:'50%',background:(li===1||li===2||li===3)?accent:'rgba(0,0,0,0.12)'}}/>
          ))}
        </div>
      ))}
    </div>
  );
  if (type==='agent') return (
    <div style={{display:'flex',flexDirection:'column',gap:3,margin:'10px 0'}}>
      {['Fetcher → Analyzer → Reporter','↓  LangGraph orchestration','↓  LangSmith traces'].map((l,i)=>(
        <div key={i} style={{fontFamily:'var(--mono)',fontSize:7.5,color:accent,opacity:1-i*0.22}}>{l}</div>
      ))}
    </div>
  );
  if (type==='bar'||type==='bars2') return (
    <div style={{display:'flex',alignItems:'flex-end',gap:3,height:28,margin:'10px 0'}}>
      {[0.55,0.82,0.4,0.91,0.63,0.75,0.5].map((v,i)=>(
        <div key={i} style={{width:9,height:v*24,borderRadius:'3px 3px 0 0',background:accent,opacity:0.8,animation:`barGrow 0.32s ease ${i*0.06}s both`,'--bh':`${v*24}px`}}/>
      ))}
    </div>
  );
  if (type==='tok') return (
    <div style={{display:'flex',flexWrap:'wrap',gap:3,margin:'10px 0'}}>
      {['[CLS]','implicit','bias','detect','[SEP]'].map((t,i)=>(
        <span key={t} style={{fontSize:8,border:`1px solid ${accent}`,color:accent,borderRadius:2,padding:'1px 4px',fontFamily:'var(--mono)',animation:`fadeUp 0.2s ease ${i*0.07}s both`}}>{t}</span>
      ))}
    </div>
  );
  if (type==='metrics') return (
    <div style={{display:'flex',flexWrap:'wrap',gap:3,margin:'10px 0'}}>
      {[['AUC','0.847'],['F1','0.783'],['SHAP','✓'],['PR','0.79']].map(([k,v])=>(
        <div key={k} style={{border:`1px solid ${accent}`,color:accent,borderRadius:3,padding:'2px 5px',fontFamily:'var(--mono)',fontSize:8,lineHeight:1.4}}>
          <div style={{opacity:0.6}}>{k}</div><div style={{fontWeight:500}}>{v}</div>
        </div>
      ))}
    </div>
  );
  if (type==='code') return (
    <div style={{fontFamily:'var(--mono)',fontSize:8,color:accent,lineHeight:1.9,margin:'10px 0'}}>
      <div>$ streamlit run app.py</div>
      <div style={{color:'var(--teal)'}}>✓  Deployed on Streamlit Cloud</div>
      <div style={{color:'var(--p-muted)'}}>✓  Azure AI connected</div>
    </div>
  );
  return null;
}

function SkillTile({ sk, idx }) {
  const [hov,setHov] = useState(false);
  return (
    <div className="skill-tile" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:SKILL_SHAPES[idx%8], minHeight:hov?178:96 }}>
      <div style={{fontSize:18,marginBottom:8,opacity:0.5}}>{sk.icon}</div>
      <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:600,color:sk.accent,textTransform:'uppercase',letterSpacing:0.5}}>{sk.name}</div>
      {hov&&<div style={{animation:'fadeUp 0.16s ease'}}>
        <SkillViz type={sk.viz} accent={sk.accent}/>
        <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
          {sk.tools.map(t=><span key={t} style={{fontSize:10,fontWeight:500,border:'1px solid rgba(0,0,0,0.15)',color:'var(--p-muted)',padding:'2px 6px',borderRadius:3,fontFamily:'var(--mono)'}}>{t}</span>)}
        </div>
      </div>}
    </div>
  );
}

/* ── Projects ── */
const PROJ_SHAPES = [
  'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
  'polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)',
  'polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)',
  'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
  'polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)',
  'polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)',
  'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
  'polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)',
];

const PROJECTS = [
  { id:1,num:'01',title:'Enterprise Brain',subtitle:'Multi-Agent RAG Knowledge System',badge:'PRODUCTION',cat:'Agentic AI × RAG',live_badge:false,
    desc:'Zero-cost knowledge base that actually knows things and can cite its sources. PDFs, Slack, email ingested. Hybrid retrieval, hallucination detection, full RBAC. No cloud bill.',
    longDesc:'A production-ready multi-agent knowledge retrieval system built on free, local tooling. LangGraph for orchestration, ChromaDB for vector storage, BM25Okapi for sparse retrieval, and Reciprocal Rank Fusion to merge both. BAAI/bge-reranker-base re-ranks top candidates. Hallucination detection combines LLM NLI checking with Jaccard token overlap. Full RBAC with bcrypt + JWT across 4 roles.',
    tech:['LangGraph','ChromaDB','BM25 + RRF','BAAI/bge','Ollama (Llama3)','Streamlit','JWT/RBAC'],
    github:'https://github.com/garimadiyawar/enterprise_brain' },
  { id:2,num:'02',title:'Pharma AE Monitor',subtitle:'3-Agent Drug Safety Signal Detection',badge:'LIVE',cat:'Healthcare AI × Agents',live_badge:true,
    desc:'Type a drug name. Three agents later, you have a pharmacovigilance-grade report: organ clusters, RED/YELLOW/GREEN safety flags, structured narrative.',
    longDesc:'A 3-agent LangGraph pipeline doing real pharmacovigilance work. Agent 1 hits the OpenFDA FAERS API. Agent 2 clusters adverse reactions by organ system. Agent 3 writes a structured narrative report with tiered safety signal ratings. Powered by Claude 3.5 Haiku, fully traced in LangSmith.',
    tech:['LangGraph','Claude 3.5 Haiku','OpenFDA FAERS','LangSmith','Streamlit','Python 3.11'],
    github:'https://github.com/garimadiyawar/Pharma-ae-monitor' },
  { id:3,num:'03',title:'BeNice',subtitle:'Implicit Bigotry Multi-Label Classifier',badge:'INVESTIGATION',cat:'NLP Research × Social Good',live_badge:false,
    desc:'Catches the hate that hides behind "just asking questions." Fine-tuned RoBERTa to flag misogyny, racism, casteism, and cyberbullying, including the coded, plausibly deniable kind.',
    longDesc:'Research-grade multi-label NLP classifier. Fine-tuned RoBERTa-base with BCEWithLogitsLoss and positive class weighting. Minimal contrast pairs sharpen decision boundaries. Per-label threshold tuning improves recall on minority classes.',
    tech:['PyTorch','HuggingFace Transformers','RoBERTa-base','BCEWithLogitsLoss','scikit-learn','Contrast Pairs'],
    github:'https://github.com/garimadiyawar/BeNice' },
  { id:4,num:'04',title:'Credit Risk — Thin-File Borrowers',subtitle:'Published Research + B.Tech Thesis',badge:'PUBLISHED',cat:'FinTech × Explainable AI',live_badge:false,
    desc:"Published research paper and B.Tech thesis. The banks' models fail thin-file borrowers by ignoring them. XGBoost + SHAP + LIME + full fairness audit on 300k+ real Home Credit loan applications.",
    longDesc:'Full ML pipeline on the Home Credit Default Risk dataset (7 files, 300k+ rows), published as a research paper. Separate evaluation track for thin-file borrowers. Explainability via SHAP and LIME. Fairness evaluation: demographic parity, equalised odds, bootstrap CI.',
    tech:['XGBoost','LightGBM','SHAP','LIME','Optuna TPE','Fairness Eval','Home Credit Dataset'],
    github:'https://github.com/garimadiyawar/Explainable-credit-risk-modelling-for-thin-file-borrowers' },
  { id:5,num:'05',title:'Demand Forecasting',subtitle:'LightGBM + ROI Simulation on M5',badge:'FULL REPORT',cat:'Retail × Applied ML',live_badge:false,
    desc:'17% MAE improvement over seasonal naive. Rs. 35,000 in projected annual savings at pilot scale. The model was right. The simulation showed it.',
    longDesc:'End-to-end demand forecasting on the M5 Forecasting dataset. Global LightGBM trained across 30,000 SKUs using lag features, rolling means, calendar effects, and price data. 28-day inventory simulation demonstrates how forecast accuracy translates to real cost reduction.',
    tech:['LightGBM','Pandas','M5 Dataset','FastAPI','Streamlit','ROI Simulation'],
    github:'https://github.com/garimadiyawar/demand-forecasting' },
  { id:6,num:'06',title:'Knowledge Mining & Compliance',subtitle:'Azure AI Document Intelligence',badge:'DEPLOYED',cat:'Cloud AI × Compliance',live_badge:true,
    desc:'Azure AI stack scanning legal and financial documents for compliance risks in real time. Upload a doc, get a risk flag. No reading required.',
    longDesc:'A fully deployed compliance risk detection system using Azure AI services. Azure Text Analytics handles NLP, Azure Translator enables multilingual processing, Azure Cognitive Search provides full-text indexing. Built with GitHub Actions CI/CD.',
    tech:['Azure Text Analytics','Azure Cognitive Search','Translator API','Streamlit','GitHub Actions'],
    github:'https://github.com/garimadiyawar/Knowledge-Mining-and-Compliance-Risk-Detection-System',
    live:'https://compliance-risk-detection-system.streamlit.app/' },
  { id:7,num:'07',title:'Hum-to-Music AI',subtitle:'Audio ML + React Native Mobile App',badge:'FULL BUILD',cat:'Audio ML × Mobile',live_badge:false,
    desc:'Hum something. Get an orchestra back. Pitch detection, melody extraction, chord generation, multi-instrument arrangement, WAV output. Takes about as long as your coffee.',
    longDesc:'Full-stack audio ML pipeline: record a hummed melody on your phone, receive a fully arranged WAV. Backend: pitch detection (Librosa), chord generation (PyTorch), arrangement (PrettyMIDI), WAV render (Pydub). React Native Expo frontend.',
    tech:['PyTorch','Librosa','PrettyMIDI','FastAPI','React Native','Expo','Pydub'],
    github:'https://github.com/garimadiyawar/hum-to-music-ai' } ,
  { id:8,num:'08',title:'Gen Z Economy',subtitle:'Multi-Dimensional Economic Analysis',badge:'DEPLOYED',cat:'Data Research × Economics',live_badge:true,
    desc:"Turns out 'just work harder' doesn't track with the data. Cost of living, employment gaps, education debt, housing affordability, generational mobility: all sourced, all interactive.",
    longDesc:"A multi-dimensional analysis of Gen Z's economic position combining cost of living indices, youth employment data, education debt loads, housing affordability ratios, and generational wealth mobility metrics. Deployed as an interactive dashboard.",
    tech:['Pandas','SQL','Plotly','Streamlit','Data Analysis','Composite Indexing'],
    github:'https://github.com/garimadiyawar/genz-economy',
    live:'https://genzeconomy.vercel.app' },
];

function ProjectCard({ proj, idx, onClick }) {
  return (
    <div className="proj-card" onClick={onClick} style={{ clipPath:PROJ_SHAPES[idx%8] }}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <span style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--p-muted)',letterSpacing:0.8}}>{proj.cat}</span>
        <span style={{
          fontFamily:'var(--mono)',fontSize:10,fontWeight:600,letterSpacing:1.5,padding:'3px 9px',borderRadius:12,
          background:proj.live_badge?'var(--dark)':'rgba(21,57,53,0.12)',
          color:proj.live_badge?'var(--teal)':'var(--dark)',
          border:proj.live_badge?'none':'1px solid rgba(21,57,53,0.2)',
        }}>{proj.badge}</span>
      </div>
      <div style={{fontFamily:'var(--mono)',fontSize:11,color:'rgba(21,57,53,0.35)',letterSpacing:2.5,marginBottom:10,fontWeight:500}}>{proj.num}</div>
      <h3 style={{fontFamily:'var(--serif)',fontSize:24,fontWeight:900,color:'var(--p-ink)',marginBottom:4,lineHeight:1.15}}>{proj.title}</h3>
      <div style={{fontFamily:'var(--body)',fontSize:16,fontWeight:600,color:'var(--p-muted)',marginBottom:16}}>{proj.subtitle}</div>
      <p style={{fontFamily:'var(--body)',fontSize:17,fontWeight:500,color:'var(--p-mid)',lineHeight:1.65,marginBottom:22}}>{proj.desc}</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
        {proj.tech.slice(0,4).map(t=><span key={t} style={{fontSize:11,background:'rgba(21,57,53,0.08)',color:'var(--p-muted)',padding:'3px 9px',borderRadius:12,fontFamily:'var(--mono)',border:'1px solid rgba(21,57,53,0.12)',fontWeight:500}}>{t}</span>)}
        {proj.tech.length>4&&<span style={{fontSize:11,color:'var(--p-muted)',fontFamily:'var(--mono)',padding:'3px 4px',fontWeight:500}}>+{proj.tech.length-4}</span>}
      </div>
    </div>
  );
}

function ProjectModal({ proj, onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
          <span style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--dark)',letterSpacing:2}}>{proj.cat.toUpperCase()}</span>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:26,cursor:'pointer',color:'var(--p-muted)',lineHeight:1,padding:0,fontWeight:300}}>×</button>
        </div>
        <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'rgba(21,57,53,0.4)',letterSpacing:2.5,marginBottom:8}}>{proj.num}</div>
        <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:900,color:'var(--p-ink)',marginBottom:4,lineHeight:1.15}}>{proj.title}</h2>
        <div style={{fontFamily:'var(--body)',fontSize:17,fontWeight:600,color:'var(--p-muted)',marginBottom:20}}>{proj.subtitle}</div>
        <p style={{fontFamily:'var(--body)',color:'var(--p-mid)',lineHeight:1.7,fontSize:17,fontWeight:500,marginBottom:24}}>{proj.longDesc}</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:26}}>
          {proj.tech.map(t=><span key={t} style={{background:'rgba(21,57,53,0.08)',color:'var(--p-muted)',border:'1px solid rgba(21,57,53,0.15)',padding:'4px 12px',borderRadius:14,fontSize:12,fontWeight:500,fontFamily:'var(--mono)'}}>{t}</span>)}
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
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
  { k:'tp',label:'TP',val:85,name:'True Positives', bg:'rgba(76,175,80,0.15)', bdr:'#2E7D32',blurb:'Correctly predicted Default, actual Default. The model caught the risk.' },
  { k:'fp',label:'FP',val:12,name:'False Positives',bg:'rgba(230,120,0,0.15)',  bdr:'#E65100',blurb:'Model said Default, actually No Default. Unnecessary rejections — real harm to real people.' },
  { k:'fn',label:'FN',val:8, name:'False Negatives',bg:'rgba(198,40,40,0.15)',  bdr:'#C62828',blurb:'Missed a real Default. The costliest mistake in credit risk.' },
  { k:'tn',label:'TN',val:95,name:'True Negatives', bg:'rgba(21,101,192,0.15)', bdr:'#1565C0',blurb:'Correctly predicted No Default, actual No Default. Clean, confident predictions.' },
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
    <div style={{display:'flex',gap:40,flexWrap:'wrap',alignItems:'flex-start'}}>
      <div>
        <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--p-muted)',textAlign:'center',marginBottom:12,letterSpacing:1.5}}>← PREDICTED →</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,maxWidth:280}}>
          {CM_CELLS.map(cell=>(
            <div key={cell.k} className="matrix-cell" onMouseEnter={()=>setHov(cell.k)} onMouseLeave={()=>setHov(null)}
              style={{background:hov===cell.k?cell.bg:'rgba(255,255,255,0.48)',borderColor:hov===cell.k?cell.bdr:'rgba(255,255,255,0.72)',boxShadow:hov===cell.k?`3px 3px 0 ${cell.bdr}44`:'none'}}>
              <div style={{fontSize:36,fontWeight:900,fontFamily:'var(--serif)',color:hov===cell.k?cell.bdr:'var(--p-ink)'}}>{cell.val}</div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--p-muted)',fontFamily:'var(--mono)',marginTop:4}}>{cell.label}</div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--p-muted)',textAlign:'center',marginTop:12,letterSpacing:1.5}}>↕ ACTUAL ↕</div>
      </div>
      <div style={{flex:1,minWidth:240}}>
        {hovCell?(
          <div style={{animation:'fadeUp 0.16s ease'}}>
            <div style={{fontFamily:'var(--serif)',fontSize:22,color:'var(--p-ink)',marginBottom:10,fontWeight:900}}>{hovCell.name}</div>
            <div style={{fontFamily:'var(--body)',fontSize:17,fontWeight:500,color:'var(--p-mid)',marginBottom:22,lineHeight:1.65}}>{hovCell.blurb}</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {Object.entries(metrics).map(([k,v])=>(
                <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontFamily:'var(--mono)',fontSize:12,fontWeight:500,color:'var(--p-muted)',minWidth:92}}>{k}</span>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:90,height:3,background:'rgba(21,57,53,0.12)',overflow:'hidden',borderRadius:2}}>
                      <div style={{width:`${v*100}%`,height:'100%',background:'var(--dark)',transition:'width 0.35s ease'}}/>
                    </div>
                    <span style={{fontFamily:'var(--mono)',fontSize:12,fontWeight:600,color:'var(--dark)',minWidth:42}}>{v.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ):(
          <div style={{fontFamily:'var(--body)',color:'var(--p-muted)',fontSize:17,fontWeight:500,lineHeight:1.7}}>
            200 test predictions from the credit risk thesis. Hover each quadrant.{' '}
            <span style={{color:'var(--dark)',fontWeight:700}}>The numbers that matter aren't the big ones.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GitHubActivity() {
  const [ok,setOk] = useState(true);
  return ok?(
    <img src="https://github-readme-activity-graph.vercel.app/graph?username=garimadiyawar&bg_color=080C16&color=C9A84C&line=C9A84C&point=2ABFB0&area=true&hide_border=true&area_color=C9A84C"
      alt="GitHub activity" style={{width:'100%',height:'auto',display:'block',borderRadius:4}}
      onError={()=>setOk(false)}/>
  ):(
    <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--p-muted)',padding:'20px 0'}}>
      Chart unavailable — <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer" style={{color:'var(--dark)'}}>github.com/garimadiyawar ↗</a>
    </div>
  );
}

const CERTS = [
  { name:'Google IT Automation with Python',  url:'https://coursera.org/verify/professional-cert/PU03T5GY29SU' },
  { name:'Google Advanced Data Analytics',    url:'https://coursera.org/verify/professional-cert/CIJGIBJ3F6Q0' },
  { name:'Google Data Analytics',             url:'https://coursera.org/verify/professional-cert/CIJGIBJ3F6Q0' },
];

const RAIN_DROPS = Array.from({length:35}, (_,i) => ({
  left:`${(i*2.86+(i%9)*1.1)%100}%`,
  height:`${70+(i*17%60)}px`,
  duration:`${0.55+(i*0.031%0.65)}s`,
  delay:`${(i*0.097%4)}s`,
  opacity: 0.12+(i*0.009%0.22)
}));

export default function Portfolio() {
  const [activeProj,setActiveProj] = useState(null);
  const [activeSec,setActiveSec] = useState('home');
  const [ghRepos,setGhRepos] = useState(null);

  useEffect(()=>{
    fetch('https://api.github.com/users/garimadiyawar').then(r=>r.ok?r.json():Promise.reject()).then(d=>setGhRepos(d.public_repos)).catch(()=>{});
  },[]);
  useEffect(()=>{ const t=document.createElement('style'); t.textContent=CSS; document.head.appendChild(t); return()=>document.head.removeChild(t); },[]);
  useEffect(()=>{
    const ob=new IntersectionObserver(entries=>entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('revealed'); }),{threshold:0.08});
    const t=setTimeout(()=>document.querySelectorAll('.reveal').forEach(el=>ob.observe(el)),100);
    return()=>{ clearTimeout(t); ob.disconnect(); };
  },[]);
  useEffect(()=>{
    const secs=['home','about','skills','projects','demo','github'];
    const h=()=>{ for(const id of secs){ const el=document.getElementById(id); if(el){ const r=el.getBoundingClientRect(); if(r.top<=80&&r.bottom>80){ setActiveSec(id); break; } } } };
    window.addEventListener('scroll',h); return()=>window.removeEventListener('scroll',h);
  },[]);

  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const NAV=[['home','Home'],['about','About'],['skills','Skills'],['projects','Work'],['demo','ML Lab'],['github','Activity']];

  return (
    <div style={{background:'var(--page)',minHeight:'100vh'}}>
      <div className="storm-bg" aria-hidden="true">
        <div className="storm-orb s1"/><div className="storm-orb s2"/><div className="storm-orb s3"/><div className="storm-orb s4"/>
        <div className="thunder-flash"/><div className="thunder-flash-2"/>
        <div className="rain-container">
          {RAIN_DROPS.map((d,i) => (
            <div key={i} className="rain-drop" style={{
              left:d.left, height:d.height,
              animationDuration:d.duration,
              animationDelay:d.delay,
              opacity:d.opacity
            }}/>
          ))}
        </div>
      </div>
      <nav>
        {/*<div className="nav-logo">Garima Diyawar</div>*/}
        <div className="nav-links">{NAV.map(([id,lb])=><button key={id} className={`nav-btn${activeSec===id?' active':''}`} onClick={()=>go(id)}>{lb}</button>)}</div>
      </nav>

      {/* ══ HERO ══ */}
      <div id="home" style={{padding:'80px 36px 36px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.45fr 1fr',gap:18,alignItems:'stretch'}}>

          {/* LEFT */}
          <div className="island-a" style={{padding:'60px 56px',display:'flex',flexDirection:'column',justifyContent:'center',minHeight:'82vh'}}>
            <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:36,animation:'fadeUp 0.4s ease 0.05s both'}}>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.12)'}}/>
              <div style={{padding:'7px 20px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',backdropFilter:'blur(8px)'}}>
                <span style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:500,color:'var(--d-muted)',letterSpacing:4,textTransform:'uppercase',whiteSpace:'nowrap'}}>The Intelligence Dispatch</span>
              </div>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.12)'}}/>
            </div>

            <h1 style={{fontFamily:'var(--serif)',fontWeight:900,fontSize:'clamp(60px,9vw,108px)',letterSpacing:'1px',lineHeight:0.92,marginBottom:0,textAlign:'center',animation:'fadeUp 0.65s ease 0.12s both'}}>
              <GlitchName/>
            </h1>

            <div style={{width:64,height:3,background:'var(--teal)',margin:'24px auto',animation:'fadeUp 0.4s ease 0.28s both'}}/>

            <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--d-muted)',letterSpacing:4,marginBottom:24,textAlign:'center',animation:'fadeUp 0.4s ease 0.32s both'}}>
              B.TECH CSE  ·  AI/ML ENGINEER  ·  2026
            </div>

            <p style={{fontFamily:'var(--body)',fontSize:'clamp(17px,1.7vw,21px)',fontWeight:500,color:'var(--d-mid)',lineHeight:1.65,maxWidth:540,margin:'0 auto 40px',textAlign:'center',animation:'fadeUp 0.55s ease 0.38s both'}}>
              ML engineer who builds models that work, explain themselves, and come with a receipt.
            </p>

            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',animation:'fadeUp 0.5s ease 0.46s both'}}>
              <button className="btn-primary-d" onClick={()=>go('projects')}>Read the Work</button>
              <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer"><button className="btn-ghost-d">GitHub ↗</button></a>
            </div>

            <div style={{marginTop:48,paddingTop:24,borderTop:'1px solid rgba(255,255,255,0.1)',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,animation:'fadeUp 0.5s ease 0.55s both'}}>
              {[
                {n:'8',l:'Systems shipped'},
                {n:ghRepos!=null?String(ghRepos):'…',l:'Public repos'},
                {n:'0.847',l:'Best AUC'},
              ].map(({n,l})=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div style={{fontFamily:'var(--serif)',fontSize:28,color:'var(--teal)',fontWeight:900,lineHeight:1}}>{n}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:500,color:'var(--d-muted)',marginTop:6,letterSpacing:0.8,textTransform:'uppercase'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="island-b" style={{padding:'56px 44px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div className="reveal revealed" style={{textAlign:'center',animation:'fadeUp 0.5s ease 0.2s both'}}>
              <div className="dispatch-tag dt-dark" style={{justifyContent:'center'}}><span>Correspondence</span></div>
              <h2 className="sec-title-dark" style={{textAlign:'center',fontSize:'clamp(28px,3.2vw,38px)'}}>Send a dispatch.<br/><em>Let's talk.</em></h2>
              <p style={{fontFamily:'var(--body)',color:'var(--d-mid)',fontSize:16,fontWeight:500,lineHeight:1.7,margin:'14px auto 32px',maxWidth:380}}>
                Open to AI/ML roles, research collabs, or a genuinely interesting problem. Bonus points if it involves messy data and no obvious solution.
              </p>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:12,animation:'fadeUp 0.5s ease 0.32s both'}}>
              {[
                {l:'Email',    v:'ndiyawar@gmail.com',             h:'mailto:ndiyawar@gmail.com'},
                {l:'GitHub',   v:'github.com/garimadiyawar',       h:'https://github.com/garimadiyawar'},
                {l:'LinkedIn', v:'linkedin.com/in/garima-diyawar', h:'https://www.linkedin.com/in/garima-diyawar'},
              ].map(({l,v,h})=>(
                <a key={l} href={h} target={h.startsWith('http')?'_blank':undefined} rel="noreferrer" className="contact-link">
                  <span style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:600,color:'var(--teal)',letterSpacing:2}}>{l.toUpperCase()}</span>
                  <span style={{fontFamily:'var(--body)',fontSize:15,fontWeight:600,color:'var(--p-ink)'}}>{v}</span>
                </a>
              ))}
            </div>

            <div style={{marginTop:28,textAlign:'center',animation:'fadeUp 0.5s ease 0.45s both'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',backdropFilter:'blur(12px)',borderRadius:'4px 16px 4px 16px',padding:'11px 20px'}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:'#4CAF50',boxShadow:'0 0 8px #4CAF50',animation:'pulse 2.5s ease-in-out infinite'}}/>
                <span style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--d-muted)',letterSpacing:0.8}}>Available for AI/ML roles · 2026</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══ ABOUT ══ */}
      <div id="about" style={{padding:'36px 36px'}}>
        <div style={{maxWidth:980,margin:'0 auto'}}>
          <div className="reveal" style={{marginBottom:20}}>
            <div className="dispatch-tag dt-light"><span>About Me</span></div>
            <h2 className="sec-title-light">The mind behind<br/><em>the models</em></h2>
          </div>
          <div className="reveal" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,alignItems:'start'}}>
            <div className="panel-a" style={{padding:'34px 36px'}}>
              {[
                "B.Tech CSE graduate with a research interest in applied machine learning, particularly in making models legible. The thesis investigated credit risk prediction for thin-file borrowers, combining ensemble methods with SHAP and LIME-based explainability, and was published as a research paper.",
                "Beyond the thesis, the work has ranged widely: multi-agent retrieval systems, NLP classifiers for implicit bias in online text, a pharmacovigilance pipeline built on real FDA data, audio-to-arrangement ML, and most recently, a deployed dashboard examining Gen Z's economic position across cost of living, employment, education debt, and housing. The common thread is building things that run, not just things that look good in a notebook.",
                "Explainability is a recurring theme rather than an afterthought. There is a difference between a model that performs well and one whose decisions can be examined, questioned, and trusted.",
              ].map((para,i)=>(
                <p key={i} className={i===0?'drop-cap':''} style={{fontFamily:'var(--body)',fontSize:i===0?19:17,fontWeight:500,color:i===0?'var(--p-ink)':'var(--p-mid)',lineHeight:1.75,marginBottom:i<2?20:0}}>{para}</p>
              ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:18}}>
              <div className="panel-b" style={{padding:'34px 36px'}}>
                {[
                  {l:'Education',  v:'B.Tech, Computer Science & Engineering'},
                  {l:'Focus',      v:'Agentic AI · Explainable ML · NLP · Audio ML'},
                  {l:'Stack',      v:'Python · LangGraph · PyTorch · SHAP · Azure AI · Streamlit'},
                  {l:'Shipped',    v:'8 end-to-end systems, all public on GitHub'},
                  {l:'Open to',    v:'AI/ML roles, research collabs, interesting problems'},
                ].map(({l,v},i,arr)=>(
                  <div key={l} style={{borderBottom:i<arr.length-1?'1px solid rgba(21,57,53,0.12)':'none',paddingBottom:14,marginBottom:14,display:'flex',gap:18,alignItems:'flex-start'}}>
                    <span style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:600,color:'var(--teal)',letterSpacing:1,minWidth:82,paddingTop:3,flexShrink:0,textTransform:'uppercase'}}>{l}</span>
                    <span style={{fontFamily:'var(--body)',fontSize:16,fontWeight:500,color:'var(--p-ink)',lineHeight:1.5}}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Certifications island */}
              <div className="panel-e" style={{padding:'28px 32px'}}>
                <div className="dispatch-tag dt-light" style={{marginBottom:16}}><span>Certifications</span></div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {CERTS.map(({name,url})=>(
                    <a key={name} href={url} target="_blank" rel="noreferrer" style={{textDecoration:'none',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',background:'rgba(255,255,255,0.45)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.7)',borderRadius:'8px 20px 8px 8px',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.9)',transition:'background 0.18s, box-shadow 0.18s'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.68)';e.currentTarget.style.boxShadow='0 2px 12px rgba(21,57,53,0.1), inset 0 1px 0 rgba(255,255,255,0.95)';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.45)';e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.9)';}}>
                      <div>
                        <div style={{fontFamily:'var(--body)',fontSize:15,fontWeight:600,color:'var(--p-ink)',lineHeight:1.35}}>{name}</div>
                        <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--teal)',letterSpacing:0.8,marginTop:3,textTransform:'uppercase'}}>Google · Coursera Professional</div>
                      </div>
                      <span style={{fontFamily:'var(--mono)',fontSize:18,color:'var(--teal)',marginLeft:14,flexShrink:0,fontWeight:700}}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="reveal" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:18}}>
            {[{n:'8',l:'Systems shipped'},{n:ghRepos!=null?String(ghRepos):'…',l:'Public repos'},{n:'0.847',l:'Best AUC, credit risk'},{n:'17%',l:'MAE improvement, M5'}].map(({n,l})=>(
              <div key={l} className="stat-pill">
                <div style={{fontFamily:'var(--serif)',fontSize:32,color:'var(--dark)',fontWeight:900,lineHeight:1}}>{n}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--p-muted)',marginTop:10,letterSpacing:0.8}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SKILLS ══ */}
      <div id="skills" style={{padding:'36px'}}>
        <div className="island-b" style={{padding:'60px 48px'}}>
          <div style={{maxWidth:1060,margin:'0 auto'}}>
            <div className="reveal" style={{textAlign:'center',marginBottom:44}}>
              <div className="dispatch-tag dt-dark" style={{justifyContent:'center'}}><span>Technical Arsenal</span></div>
              <h2 className="sec-title-dark" style={{textAlign:'center'}}>The Toolkit</h2>
              <p style={{fontFamily:'var(--body)',color:'var(--d-muted)',fontSize:17,fontWeight:500,marginTop:8}}>Hover any tile to explore the domain</p>
            </div>
            <div className="reveal" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
              {SKILLS.map((sk,i)=><SkillTile key={sk.name} sk={sk} idx={i}/>)}
            </div>
          </div>
        </div>
      </div>

      {/* ══ PROJECTS ══ */}
      <div id="projects" style={{padding:'36px'}}>
        <div style={{maxWidth:1060,margin:'0 auto'}}>
          <div className="reveal" style={{marginBottom:36}}>
            <div className="dispatch-tag dt-light"><span>From the Research Desk</span></div>
            <h2 className="sec-title-light">Projects &<br/><em>Research</em></h2>
            <p style={{fontFamily:'var(--body)',color:'var(--p-muted)',fontSize:17,fontWeight:500,marginTop:8}}>Click any card to read more</p>
          </div>
          <div className="reveal" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
            {PROJECTS.map((p,i)=><ProjectCard key={p.id} proj={p} idx={i} onClick={()=>setActiveProj(p)}/>)}
          </div>
        </div>
      </div>

      {/* ══ ML LAB ══ */}
      <div id="demo" style={{padding:'36px'}}>
        <div className="island-a" style={{padding:'60px 48px'}}>
          <div style={{maxWidth:920,margin:'0 auto'}}>
            <div className="reveal" style={{marginBottom:36}}>
              <div className="dispatch-tag dt-dark"><span>Dissertation Results</span></div>
              <h2 className="sec-title-dark">Confusion Matrix<br/><em>Explorer</em></h2>
              <p style={{fontFamily:'var(--body)',color:'var(--d-mid)',fontSize:18,fontWeight:500,lineHeight:1.7,maxWidth:560,marginTop:12}}>
                200 test predictions from the credit risk thesis. Hover each quadrant. The numbers that matter aren't the big ones.
              </p>
            </div>
            <div className="reveal panel-e" style={{padding:'36px 36px 28px'}}>
              <ConfusionMatrix/>
            </div>
            <div className="reveal" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:12}}>
              {[
                {q:'What makes a good model?',a:"In credit risk, the question isn't accuracy. It's whether the wrong answers hurt the right people. False negatives cost borrowers. False positives cost banks."},
                {q:'Why not just use accuracy?',a:"On imbalanced datasets, 'predicts safe every time' scores 90% accuracy and misses every default. Accuracy is the metric of someone who hasn't thought about the problem."},
                {q:'Where does SHAP come in?',a:"SHAP turns 'the model decided' into 'here is exactly why.' It makes decisions auditable to regulators, legible to loan officers, and contestable by borrowers."},
              ].map(({q,a},i)=>(
                <div key={q} className={['panel-c','panel-a','panel-b'][i]} style={{padding:22}}>
                  <div style={{fontFamily:'var(--serif)',fontSize:17,fontWeight:900,color:'var(--p-ink)',marginBottom:10,lineHeight:1.3}}>{q}</div>
                  <div style={{fontFamily:'var(--body)',fontSize:15,fontWeight:500,color:'var(--p-mid)',lineHeight:1.7}}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ GITHUB ══ */}
      <div id="github" style={{padding:'36px'}}>
        <div style={{maxWidth:860,margin:'0 auto'}}>
          <div className="reveal" style={{marginBottom:24}}>
            <div className="dispatch-tag dt-light"><span>GitHub Activity</span></div>
            <h2 className="sec-title-light">Commit by<br/><em>commit</em></h2>
          </div>
          <div className="reveal panel-a" style={{padding:32}}>
            <GitHubActivity/>
            <div style={{marginTop:24,borderTop:'1px solid rgba(21,57,53,0.12)',paddingTop:20,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:18}}>
              <div>
                <div style={{fontFamily:'var(--serif)',fontSize:19,color:'var(--p-ink)',fontWeight:900,marginBottom:4}}>Consistently building</div>
                <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:500,color:'var(--p-muted)'}}>
                  Live · <a href="https://github.com/garimadiyawar" target="_blank" rel="noreferrer" style={{color:'var(--dark)',fontWeight:600}}>github.com/garimadiyawar ↗</a>
                </div>
              </div>
              {[[ghRepos!=null?String(ghRepos):'…','Public repos'],['8','Projects'],['∞','Experiments']].map(([n,l])=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div style={{fontFamily:'var(--serif)',fontSize:26,color:'var(--dark)',fontWeight:900}}>{n}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--p-muted)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div style={{fontFamily:'var(--serif)',fontSize:18,color:'var(--teal)',fontWeight:700}}>Garima Diyawar</div>
        <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--d-muted)',letterSpacing:1}}>data · models · curiosity · 2026</div>
        <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,color:'var(--d-muted)',letterSpacing:1}}>© 2026</div>
      </footer>

      {activeProj&&<ProjectModal proj={activeProj} onClose={()=>setActiveProj(null)}/>}
    </div>
  );
}
