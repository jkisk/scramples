"use client";

import Image from "next/image";
import { FoundWord } from "./FoundWords";
import { WORD_LIST, TOTAL_WORDS, scoreWord } from "@/lib/words";

interface PostGameProps {
  score: number;
  found: FoundWord[];
  onPlayAgain: () => void;
  onHome: () => void;
}

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
        <i
          key={i}
          style={{
            left: b.left + "%",
            background: b.color,
            animationDuration: b.dur + "s",
            animationDelay: b.delay + "s",
            transform: `rotate(${b.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function PostGame({ score, found, onPlayAgain, onHome }: PostGameProps) {
  const foundSet = new Set(found.map((f) => f.word));
  const best = found.reduce<FoundWord | null>((a, b) => (!a || b.word.length > a.word.length ? b : a), null);
  const pctWords = Math.round((found.length / TOTAL_WORDS) * 100);
  const missedBig = WORD_LIST
    .filter((w) => !foundSet.has(w) && w.length >= 6)
    .sort((a, b) => b.length - a.length)
    .slice(0, 8);

  const verdict =
    score >= 60 ? "Scramazing!" :
    score >= 35 ? "Great round!" :
    score >= 15 ? "Nice work!" :
    "Time's up!";

  return (
    <div className="stage results">
      {score >= 25 && <Confetti />}
      <Image
        src="/logo.png"
        alt="Scramples"
        width={480}
        height={100}
        style={{ width: "min(58vw, 240px)", height: "auto" }}
      />
      <div className="result-title">{verdict}</div>
      <div className="scoreblock">
        <div className="bigscore">{score}</div>
        <div className="bigscore-sub">points</div>
      </div>

      <div className="result-stats">
        <div className="rstat">
          <div
            className="rv"
            style={{
              background: "var(--grad)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {found.length}
          </div>
          <div className="rl">Words</div>
        </div>
        <div className="rstat">
          <div className="rv">{best ? best.word.toUpperCase() : "—"}</div>
          <div className="rl">Best word</div>
        </div>
        <div className="rstat">
          <div className="rv">{pctWords}%</div>
          <div className="rl">Of all words</div>
        </div>
      </div>

      {missedBig.length > 0 && (
        <div className="card missed">
          <h4>◆ Big words you missed</h4>
          <div className="found-list">
            {missedBig.map((w) => (
              <span key={w} className="chip">
                <span style={{ opacity: 0.55 }}>{w.toUpperCase()}</span>{" "}
                <span className="cpts">+{scoreWord(w.length)}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="controls" style={{ maxWidth: 360 }}>
        <button className="btn ghost sm" onClick={onHome}>Home</button>
        <button className="btn" onClick={onPlayAgain}>Play again ↻</button>
      </div>
    </div>
  );
}
