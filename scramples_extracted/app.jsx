// app.jsx — Scramples game
const { useState, useEffect, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "candy",
  "roundTime": 90,
  "tagline": ""
}/*EDITMODE-END*/;

const uid = (() => { let n = 0; return () => ++n; })();
function makeTiles(rack) { return rack.map((c) => ({ id: uid(), char: c })); }
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- TILE ----------
function Tile({ char, used, kind = "rack", onClick, mini }) {
  const cls = ["tile", kind, used ? "used" : "", mini ? "mini" : ""].join(" ");
  return (
    <div className={cls} onClick={onClick}>
      {char}
    </div>
  );
}

// ---------- CONFETTI ----------
function Confetti() {
  const colors = ["#7b2ff7", "#b528c9", "#e0218a", "#ffd166", "#36d8a2"];
  const bits = Array.from({ length: 70 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 1.8 + Math.random() * 1.6,
    color: colors[i % colors.length],
    rot: Math.random() * 360,
  }));
  return (
    <div className="confetti">
      {bits.map((b, i) => (
        <i key={i} style={{ left: b.left + "%", background: b.color, animationDuration: b.dur + "s", animationDelay: b.delay + "s", transform: `rotate(${b.rot}deg)` }} />
      ))}
    </div>
  );
}

// ---------- HOME ----------
function Home({ onPlay, tagline }) {
  const preview = ["S", "C", "R", "A", "M", "P", "L", "E", "S"];
  return (
    <div className="stage home">
      <img className="brandLogo" src="assets/logo.png" alt="Scramples" />
      {tagline ? <div className="tagline">{tagline}</div> : null}
      <p className="home-sub">Nine letters. Ninety seconds. How many words can you dig out before the clock runs dry?</p>
      <button className="btn big" onClick={onPlay}>Play ▸</button>

      <div className="card" style={{ marginTop: 6 }}>
        <div className="rules">
          <div>
            <h3>◆ How to play</h3>
            <ul>
              <li><span className="dot" /><span>Build words from the nine letters — at least <b>3 letters</b> long.</span></li>
              <li><span className="dot" /><span>Use each letter only as many times as it appears.</span></li>
              <li><span className="dot" /><span>Tap tiles or just type. Hit <b>Enter</b> to lock a word in.</span></li>
            </ul>
          </div>
          <div>
            <h3>◆ Scoring</h3>
            <div className="score-table">
              <div className="score-row"><span>3 letters</span><span className="pts">1</span></div>
              <div className="score-row"><span>4 letters</span><span className="pts">2</span></div>
              <div className="score-row"><span>5 letters</span><span className="pts">4</span></div>
              <div className="score-row"><span>6 letters</span><span className="pts">6</span></div>
              <div className="score-row"><span>7+ letters</span><span className="pts">10</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- ICONS ----------
const IconHome = () => (<svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>);
const IconShuffle = () => (<svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /><path d="M16 21h5v-5" /><path d="M3 3l7 7" /></svg>);

// ---------- PLAY ----------
function Play({ tiles, setTiles, roundTime, onEnd, onHome }) {
  const [selected, setSelected] = useState([]); // array of tile ids (for render)
  const selectedRef = useRef([]);               // synchronous source of truth
  const applySel = (next) => { selectedRef.current = next; setSelected(next); };
  const [found, setFound] = useState([]); // {word, pts}
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(roundTime);
  const [toast, setToast] = useState(null); // {type, text}
  const [shake, setShake] = useState(false);
  const [goodFlash, setGoodFlash] = useState(false);
  const [floatPts, setFloatPts] = useState(null);
  const endedRef = useRef(false);
  const foundRef = useRef(found);
  foundRef.current = found;

  // timer
  useEffect(() => {
    const t = setInterval(() => {
      setTime((v) => {
        if (v <= 1) { clearInterval(t); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (time === 0 && !endedRef.current) {
      endedRef.current = true;
      setTimeout(() => onEnd({ score, found }), 350);
    }
  }, [time]);

  const byId = (id) => tiles.find((t) => t.id === id);
  const currentWord = selected.map((id) => byId(id).char).join("");

  const flashToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 900);
  };

  const submit = useCallback(() => {
    const ids = selectedRef.current;
    const word = ids.map((id) => byId(id).char).join("").toLowerCase();
    if (word.length < 3) { setShake(true); setTimeout(() => setShake(false), 400); flashToast("bad", "Too short"); return; }
    if (foundRef.current.some((f) => f.word === word)) { setShake(true); setTimeout(() => setShake(false), 400); flashToast("bad", "Already found"); return; }
    if (!VALID.has(word)) { setShake(true); setTimeout(() => setShake(false), 400); flashToast("bad", "Not a word"); return; }
    const pts = scoreFor(word.length);
    setFound((f) => [{ word, pts }, ...f]);
    setScore((s) => s + pts);
    setGoodFlash(true); setTimeout(() => setGoodFlash(false), 350);
    flashToast("good", word.length >= 7 ? "Scramazing!" : word.length >= 5 ? "Nice!" : "+" + pts);
    setFloatPts({ pts, key: Date.now() });
    setTimeout(() => setFloatPts(null), 900);
    applySel([]);
  }, [tiles]);

  const tapTile = (id) => {
    const sel = selectedRef.current;
    applySel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  };
  const tapTray = (id) => applySel(selectedRef.current.filter((x) => x !== id));
  const clearWord = () => applySel([]);
  const doShuffle = () => setTiles((ts) => shuffled(ts));

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") { e.preventDefault(); submit(); return; }
      if (e.key === "Backspace") { e.preventDefault(); applySel(selectedRef.current.slice(0, -1)); return; }
      if (e.key === "Escape") { clearWord(); return; }
      const k = e.key.toUpperCase();
      if (/^[A-Z]$/.test(k)) {
        const sel = selectedRef.current;
        const avail = tiles.find((tl) => tl.char === k && !sel.includes(tl.id));
        if (avail) applySel([...sel, avail.id]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tiles, submit]);

  const warn = time <= 15;
  const pct = (time / roundTime) * 100;
  const mm = Math.floor(time / 60), ss = String(time % 60).padStart(2, "0");

  return (
    <div className="stage play">
      <div className="topbar">
        <button className="iconbtn" onClick={onHome} title="Home"><IconHome /></button>
        <img className="brand-mini" src="assets/logo.png" alt="Scramples" />
        <button className="iconbtn" onClick={doShuffle} title="Shuffle"><IconShuffle /></button>
      </div>

      <div className="scorebar">
        <div className="stat"><div className="label">Score</div><div className="val grad">{score}</div></div>
        <div className="stat"><div className="label">Words</div><div className="val">{found.length}</div></div>
        <div className={"stat timer" + (warn ? " warn" : "")}><div className="label">Time</div><div className="val">{mm}:{ss}</div></div>
      </div>

      <div className="timerwrap">
        <div className="timertrack"><div className={"timerfill" + (warn ? " warn" : "")} style={{ width: pct + "%" }} /></div>
      </div>

      <div className={"builder" + (shake ? " shake" : "") + (goodFlash ? " good" : "")}>
        {toast && <div className={"toast " + toast.type}>{toast.text}</div>}
        {floatPts && <div className="floatpts" key={floatPts.key}>+{floatPts.pts}</div>}
        {selected.length === 0
          ? <span className="placeholder">spell something…</span>
          : selected.map((id) => <Tile key={id} char={byId(id).char} kind="tray" mini onClick={() => tapTray(id)} />)}
        {selected.length > 0 && <span className="caret" />}
      </div>

      <div className="rackrow">
        {tiles.map((t) => (
          <Tile key={t.id} char={t.char} kind="rack" used={selected.includes(t.id)} onClick={() => tapTile(t.id)} />
        ))}
      </div>

      <div className="controls">
        <button className="btn ghost sm" onClick={clearWord}>Clear</button>
        <button className="btn" onClick={submit}>Enter ↵</button>
      </div>

      <div className="card">
        <div className="found-head">
          <h3>Found words</h3>
          <h3 style={{ color: "var(--accent)" }}>{found.length}</h3>
        </div>
        <div className="found-list">
          {found.length === 0
            ? <span className="found-empty">nothing yet — go find some!</span>
            : found.map((f, i) => (
              <span key={i} className={"chip" + (f.word.length >= 7 ? " big7" : "")}>
                {f.word.toUpperCase()} <span className="cpts">+{f.pts}</span>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

// ---------- RESULTS ----------
function Results({ result, onPlay, onHome }) {
  const { score, found } = result;
  const foundWords = new Set(found.map((f) => f.word));
  const best = found.reduce((a, b) => (b.word.length > (a ? a.word.length : 0) ? b : a), null);
  const pctWords = Math.round((found.length / TOTAL_WORDS) * 100);
  const missedBig = WORD_LIST.filter((w) => !foundWords.has(w) && w.length >= 6).sort((a, b) => b.length - a.length).slice(0, 8);

  const verdict = score >= 60 ? "Scramazing!" : score >= 35 ? "Great round!" : score >= 15 ? "Nice work!" : "Time's up!";

  return (
    <div className="stage results">
      {score >= 25 && <Confetti />}
      <img className="brandLogo" src="assets/logo.png" alt="Scramples" style={{ width: "min(58vw, 240px)" }} />
      <div className="result-title">{verdict}</div>
      <div className="scoreblock">
        <div className="bigscore">{score}</div>
        <div className="bigscore-sub">points</div>
      </div>

      <div className="result-stats">
        <div className="rstat"><div className="rv" style={{ background: "var(--grad)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{found.length}</div><div className="rl">Words</div></div>
        <div className="rstat"><div className="rv">{best ? best.word.toUpperCase() : "—"}</div><div className="rl">Best word</div></div>
        <div className="rstat"><div className="rv">{pctWords}%</div><div className="rl">Of all words</div></div>
      </div>

      {missedBig.length > 0 && (
        <div className="card missed">
          <h4>◆ Big words you missed</h4>
          <div className="found-list">
            {missedBig.map((w) => (
              <span key={w} className="chip"><span style={{ opacity: 0.55 }}>{w.toUpperCase()}</span> <span className="cpts">+{scoreFor(w.length)}</span></span>
            ))}
          </div>
        </div>
      )}

      <div className="controls" style={{ maxWidth: 360 }}>
        <button className="btn ghost sm" onClick={onHome}>Home</button>
        <button className="btn" onClick={onPlay}>Play again ↻</button>
      </div>
    </div>
  );
}

// ---------- APP ----------
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState("home");
  const [tiles, setTiles] = useState(() => makeTiles(RACK));
  const [result, setResult] = useState(null);

  useEffect(() => { document.body.setAttribute("data-theme", t.theme); }, [t.theme]);

  const startGame = () => { setTiles(shuffled(makeTiles(RACK))); setScreen("play"); };
  const endGame = (r) => { setResult(r); setScreen("results"); };

  return (
    <div className="app">
      {screen === "home" && <Home onPlay={startGame} tagline={t.tagline} />}
      {screen === "play" && <Play tiles={tiles} setTiles={setTiles} roundTime={t.roundTime} onEnd={endGame} onHome={() => setScreen("home")} />}
      {screen === "results" && <Results result={result} onPlay={startGame} onHome={() => setScreen("home")} />}

      <TweaksPanel>
        <TweakSection label="Look & feel" />
        <TweakRadio label="Theme" value={t.theme} options={["candy", "neon", "paper"]} onChange={(v) => setTweak("theme", v)} />
        <TweakSection label="Game" />
        <TweakRadio label="Round length" value={String(t.roundTime)} options={["60", "90", "120"]} onChange={(v) => setTweak("roundTime", Number(v))} />
        <TweakText label="Tagline" value={t.tagline} onChange={(v) => setTweak("tagline", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
