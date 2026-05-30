// ARCHIVED EFFECTS - Rain, Clouds, and Thunder
// Saved from App.js to temporarily disable these ambient background effects
// To restore: copy the CSS sections back into the CSS const, add RAIN_DROPS constant,
// and uncomment the JSX divs in the main Portfolio component

/* ═══════════════════════════════════════════════════════════════
   CSS FOR EFFECTS (paste into CSS const in App.js to restore)
   ═══════════════════════════════════════════════════════════════ */

const ARCHIVED_CSS = `
  /* ── Thunder flashes ── */
  @keyframes thunderFlash {
    0%, 85%, 88%, 91%, 100% { opacity:0; }
    86%, 87.5%, 89%, 90% { opacity:1; }
  }
  @keyframes thunderFlash2 {
    0%, 87%, 90%, 93%, 100% { opacity:0; }
    88%, 89.5%, 91%, 92% { opacity:0.8; }
  }
  .thunder-flash {
    position:fixed; inset:0; z-index:40; pointer-events:none;
    background: radial-gradient(ellipse at 30% 10%, rgba(220,210,255,0.35) 0%, rgba(200,180,255,0.15) 40%, transparent 70%),
                radial-gradient(ellipse at 70% 5%, rgba(200,190,255,0.25) 0%, transparent 60%);
    animation: thunderFlash 11s ease-in-out infinite;
  }
  .thunder-flash-2 {
    position:fixed; inset:0; z-index:40; pointer-events:none;
    background: radial-gradient(ellipse at 75% 15%, rgba(210,200,255,0.40) 0%, rgba(180,160,220,0.15) 50%, transparent 70%),
                radial-gradient(ellipse at 20% 70%, rgba(200,190,240,0.20) 0%, transparent 60%);
    animation: thunderFlash2 15s ease-in-out 6s infinite;
  }

  /* ── Atmospheric fog ── */
  .atmos-fog { position:fixed; inset:0; z-index:2; pointer-events:none;
    background: linear-gradient(180deg,
      rgba(120,100,150,0.08) 0%,
      rgba(100,80,130,0.12) 30%,
      rgba(80,70,110,0.08) 60%,
      rgba(100,90,130,0.10) 100%);
    animation: fogDrift 45s ease-in-out infinite;
  }
  @keyframes fogDrift {
    0%, 100% { opacity:0.6; }
    50% { opacity:0.9; }
  }

  /* ── Animated cloud fog layers ── */
  @keyframes cloudDrift1 { 0% { transform:translateX(-100%); } 100% { transform:translateX(100vw); } }
  @keyframes cloudDrift2 { 0% { transform:translateX(0); } 100% { transform:translateX(100vw); } }
  @keyframes cloudDrift3 { 0% { transform:translateX(-50%); } 100% { transform:translateX(100vw); } }

  .cloud-layer {
    position:fixed; inset:0; z-index:3; pointer-events:none;
    background-size:200% 100%;
    filter:blur(40px);
    opacity:0.15;
    will-change:transform;
  }

  .cloud-1 {
    background:linear-gradient(90deg, transparent 0%, rgba(150,150,150,0.8) 15%, rgba(140,140,140,0.8) 30%, transparent 50%, transparent 70%, rgba(150,150,150,0.7) 85%, transparent 100%);
    animation:cloudDrift1 180s linear infinite;
    top:0; height:35%;
  }

  .cloud-2 {
    background:linear-gradient(90deg, transparent 0%, rgba(160,160,160,0.7) 10%, rgba(150,150,150,0.8) 25%, transparent 45%, transparent 60%, rgba(160,160,160,0.75) 80%, transparent 100%);
    animation:cloudDrift2 220s linear infinite 30s;
    top:30%; height:40%;
  }

  .cloud-3 {
    background:linear-gradient(90deg, transparent 0%, rgba(140,140,140,0.75) 12%, rgba(150,150,150,0.8) 28%, transparent 48%, transparent 65%, rgba(140,140,140,0.7) 82%, transparent 100%);
    animation:cloudDrift3 200s linear infinite 60s;
    top:60%; height:38%;
  }

  .cloud-4 {
    background:linear-gradient(90deg, transparent 0%, rgba(155,155,155,0.7) 18%, rgba(145,145,145,0.75) 35%, transparent 55%, transparent 70%, rgba(155,155,155,0.65) 88%, transparent 100%);
    animation:cloudDrift1 240s linear infinite 90s;
    top:20%; height:30%;
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
`;

/* ═══════════════════════════════════════════════════════════════
   RAIN DROPS DATA (add back to App.js to restore)
   ═══════════════════════════════════════════════════════════════ */

const ARCHIVED_RAIN_DROPS = Array.from({length:35}, (_,i) => ({
  left:`${(i*2.86+(i%9)*1.1)%100}%`,
  height:`${70+(i*17%60)}px`,
  duration:`${0.55+(i*0.031%0.65)}s`,
  delay:`${(i*0.097%4)}s`,
  opacity: 0.12+(i*0.009%0.22)
}));

/* ═══════════════════════════════════════════════════════════════
   JSX RENDERING (paste inside <div> in Portfolio component to restore)
   ═══════════════════════════════════════════════════════════════ */

const ARCHIVED_JSX = `
      {/* Storm background with orbs */}
      <div className="storm-bg" aria-hidden="true">
        <div className="storm-orb s1"/><div className="storm-orb s2"/><div className="storm-orb s3"/><div className="storm-orb s4"/>
      </div>

      {/* Thunder flashes */}
      <div className="thunder-flash" aria-hidden="true"/><div className="thunder-flash-2" aria-hidden="true"/>

      {/* Atmospheric fog */}
      <div className="atmos-fog" aria-hidden="true"/>

      {/* Cloud layers */}
      <div className="cloud-layer cloud-1" aria-hidden="true"/>
      <div className="cloud-layer cloud-2" aria-hidden="true"/>
      <div className="cloud-layer cloud-3" aria-hidden="true"/>
      <div className="cloud-layer cloud-4" aria-hidden="true"/>
      <div className="atmos-fog" aria-hidden="true"/>

      {/* Rain particles */}
      <div className="rain-container" style={{zIndex:50}}>
        {RAIN_DROPS.map((d,i) => (
          <div key={i} className="rain-drop" style={{
            left:d.left, height:d.height,
            animationDuration:d.duration,
            animationDelay:d.delay,
            opacity:d.opacity
          }}/>
        ))}
      </div>
`;

/* ═══════════════════════════════════════════════════════════════
   RESTORATION INSTRUCTIONS
   ═══════════════════════════════════════════════════════════════

1. CSS: Find the CSS const in App.js and add the ARCHIVED_CSS content
   (particularly the thunderFlash, fog, cloudDrift, and rainFall sections)

2. CONSTANT: Add ARCHIVED_RAIN_DROPS constant before the Portfolio component

3. JSX: In the Portfolio component's main return div, add the ARCHIVED_JSX
   right after opening <div style={{...}}>

The storm-bg with orbs is still present and needed for the background;
only the thunder, fog, clouds, and rain are archived here.

   ═══════════════════════════════════════════════════════════════ */

export { ARCHIVED_CSS, ARCHIVED_RAIN_DROPS, ARCHIVED_JSX };
