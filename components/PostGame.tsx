"use client";

import Image from "next/image";
import { FoundWord } from "./FoundWords";
import { scoreWord } from "@/lib/game";

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
  const best = found.reduce<FoundWord | null>((a, b) => (!a || b.word.length > a.word.length ? b : a), null);
  const topScore = found.reduce<number>((max, f) => Math.max(max, f.pts), 0);

  const verdict =
    score >= 60 ? "Scramazing!" :
    score >= 35 ? "Great round!" :
    score >= 15 ? "Nice work!" :
    "Time's up!";

  return (
    <div className="stage results">
      {score >= 25 && <Confetti />}
      <Image
        src="/scramples/logo.png"
        alt="Scramples"
        width={480}
        height={100}
        style={{ width: "min(58vw, 240px)", height: "auto" }}
        loading="eager"
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
          <div className="rv">{topScore > 0 ? `+${topScore}` : "—"}</div>
          <div className="rl">Top score</div>
        </div>
      </div>

      <div className="controls" style={{ maxWidth: 360 }}>
        <button className="btn ghost sm" onClick={onHome}>Home</button>
        <button className="btn" onClick={onPlayAgain}>Play again ↻</button>
      </div>
    </div>
  );
}
