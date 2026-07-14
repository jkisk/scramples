"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { makeTiles, shuffled, generateLetters, scoreWord, GAME_DURATION_SECONDS, Tile } from "@/lib/game";
import { loadWordList, isValidDictionaryWord } from "@/lib/words";
import { assetPath } from "@/lib/paths";
import { getPersonalBest, savePersonalBest } from "@/lib/storage";
import { Header } from "./Header";
import { LetterTiles } from "./LetterTiles";
import { WordBuilder } from "./WordBuilder";
import { Timer } from "./Timer";
import { FoundWords, FoundWord } from "./FoundWords";
import { PostGame } from "./PostGame";

type Theme = "candy" | "neon" | "paper";
type Screen = "home" | "loading" | "play" | "results" | "error";

interface GameResult {
  score: number;
  found: FoundWord[];
  personalBest: number;
  isNewBest: boolean;
}

export function GamePage() {
  const [theme, setTheme] = useState<Theme>("candy");
  const [screen, setScreen] = useState<Screen>("home");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    void loadWordList().catch(() => undefined);
  }, []);

  const startGame = useCallback(async () => {
    setScreen("loading");
    try {
      await loadWordList();
    } catch {
      setScreen("error");
      return;
    }
    const letters = generateLetters(9);
    setTiles(shuffled(makeTiles(letters)));
    setScreen("play");
  }, []);

  const endGame = useCallback((r: Omit<GameResult, "personalBest" | "isNewBest">) => {
    const previousBest = getPersonalBest();
    const isNewBest = savePersonalBest(r.score);
    setResult({
      ...r,
      personalBest: Math.max(previousBest, r.score),
      isNewBest,
    });
    setScreen("results");
  }, []);

  return (
    <div className="app">
      {screen === "home" && (
        <HomeScreen onPlay={startGame} theme={theme} onThemeChange={setTheme} />
      )}
      {screen === "loading" && (
        <div className="stage" style={{ justifyContent: "center", minHeight: "60vh" }}>
          <div className="found-empty" style={{ fontSize: 28 }}>Loading…</div>
        </div>
      )}
      {screen === "error" && (
        <div className="stage home">
          <Image
            src={assetPath("/logo.png")}
            alt="Scramples"
            width={480}
            height={100}
            className="brandLogo"
            style={{ height: "auto" }}
            loading="eager"
          />
          <div className="card">
            <div className="found-empty" style={{ textAlign: "center" }}>
              Could not load the word list.
            </div>
          </div>
          <button className="btn big" onClick={startGame}>
            Retry
          </button>
        </div>
      )}
      {screen === "play" && (
        <PlayScreen
          tiles={tiles}
          setTiles={setTiles}
          onEnd={endGame}
          onHome={() => setScreen("home")}
        />
      )}
      {screen === "results" && result && (
        <PostGame
          score={result.score}
          found={result.found}
          personalBest={result.personalBest}
          isNewBest={result.isNewBest}
          onPlayAgain={startGame}
          onHome={() => setScreen("home")}
        />
      )}
    </div>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────

function HomeScreen({
  onPlay,
  theme,
  onThemeChange,
}: {
  onPlay: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}) {
  return (
    <div className="stage home">
      <Image
        src={assetPath("/logo.png")}
        alt="Scramples"
        width={480}
        height={100}
        className="brandLogo"
        style={{ height: "auto" }}
        loading="eager"
      />
      <button className="btn big" onClick={onPlay}>
        Play ▸
      </button>

      <div className="card" style={{ marginTop: 6 }}>
        <div className="rules">
          <div>
            <h3>◆ How to play</h3>
            <ul>
              <li>
                <span className="dot" />
                <span>Build words from the nine letters — at least <b>3 letters</b> long.</span>
              </li>
              <li>
                <span className="dot" />
                <span>Use each letter only as many times as it appears.</span>
              </li>
              <li>
                <span className="dot" />
                <span>Tap tiles or type letters. Hit <b>Enter</b> to lock in a word.</span>
              </li>
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

      <div className="theme-picker">
        {(["candy", "neon", "paper"] as Theme[]).map((t) => (
          <button
            key={t}
            className={`theme-btn${theme === t ? " active" : ""}`}
            onClick={() => onThemeChange(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Play Screen ───────────────────────────────────────────────────────────────

function PlayScreen({
  tiles,
  setTiles,
  onEnd,
  onHome,
}: {
  tiles: Tile[];
  setTiles: React.Dispatch<React.SetStateAction<Tile[]>>;
  onEnd: (result: Omit<GameResult, "personalBest" | "isNewBest">) => void;
  onHome: () => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const selectedRef = useRef<number[]>([]);
  const applySel = useCallback((next: number[]) => {
    selectedRef.current = next;
    setSelected(next);
  }, []);

  const [found, setFound] = useState<FoundWord[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_DURATION_SECONDS);
  const [toast, setToast] = useState<{ type: "good" | "bad"; text: string } | null>(null);
  const [shake, setShake] = useState(false);
  const [goodFlash, setGoodFlash] = useState(false);
  const [floatPts, setFloatPts] = useState<{ pts: number; key: number } | null>(null);

  const endedRef = useRef(false);
  const foundRef = useRef<FoundWord[]>([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    foundRef.current = found;
  }, [found]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

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
      const timeout = setTimeout(() => {
        onEnd({ score: scoreRef.current, found: foundRef.current });
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [time, onEnd]);

  const byId = useCallback((id: number) => tiles.find((t) => t.id === id), [tiles]);

  const flashToast = useCallback((type: "good" | "bad", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 900);
  }, []);

  const submit = useCallback(() => {
    const ids = selectedRef.current;
    const word = ids.map((id) => byId(id)?.char ?? "").join("").toLowerCase();
    if (word.length < 3) {
      setShake(true); setTimeout(() => setShake(false), 400);
      flashToast("bad", "Too short");
      return;
    }
    if (foundRef.current.some((f) => f.word === word)) {
      setShake(true); setTimeout(() => setShake(false), 400);
      flashToast("bad", "Already found");
      return;
    }
    if (!isValidDictionaryWord(word)) {
      setShake(true); setTimeout(() => setShake(false), 400);
      flashToast("bad", "Not a word");
      return;
    }
    const pts = scoreWord(word.length);
    setFound((f) => [{ word, pts }, ...f]);
    setScore((s) => s + pts);
    setGoodFlash(true); setTimeout(() => setGoodFlash(false), 350);
    flashToast("good", word.length >= 7 ? "Scramazing!" : word.length >= 5 ? "Nice!" : "+" + pts);
    setFloatPts({ pts, key: Date.now() });
    setTimeout(() => setFloatPts(null), 900);
    applySel([]);
  }, [applySel, byId, flashToast]);

  const tapTile = (id: number) => {
    const sel = selectedRef.current;
    applySel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  };
  const tapTray = (id: number) => applySel(selectedRef.current.filter((x) => x !== id));
  const clearWord = useCallback(() => applySel([]), [applySel]);
  const doShuffle = () => setTiles((ts) => shuffled([...ts]));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
  }, [applySel, clearWord, submit, tiles]);

  const warn = time <= 15;
  const mm = Math.floor(time / 60);
  const ss = String(time % 60).padStart(2, "0");

  return (
    <div className="stage play">
      <Header onHome={onHome} onShuffle={doShuffle} />

      <div className="scorebar">
        <div className="stat">
          <div className="label">Score</div>
          <div className="val grad">{score}</div>
        </div>
        <div className="stat">
          <div className="label">Words</div>
          <div className="val">{found.length}</div>
        </div>
        <div className={`stat timer${warn ? " warn" : ""}`}>
          <div className="label">Time</div>
          <div className="val">{mm}:{ss}</div>
        </div>
      </div>

      <Timer seconds={time} total={GAME_DURATION_SECONDS} />

      <WordBuilder
        tiles={tiles}
        selected={selected}
        onTrayTap={tapTray}
        shake={shake}
        goodFlash={goodFlash}
        toast={toast}
        floatPts={floatPts}
      />

      <LetterTiles tiles={tiles} selected={selected} onTap={tapTile} />

      <div className="controls">
        <button className="btn ghost sm" onClick={clearWord}>Clear</button>
        <button className="btn" onClick={submit}>Enter ↵</button>
      </div>

      <FoundWords words={found} />
    </div>
  );
}
