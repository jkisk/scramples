"use client";

interface TimerProps {
  seconds: number;
  total: number;
}

export function Timer({ seconds, total }: TimerProps) {
  const warn = seconds <= 15;
  const pct = (seconds / total) * 100;
  return (
    <div className="timerwrap">
      <div
        className="timertrack"
        role="progressbar"
        aria-label="Time remaining"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={seconds}
      >
        <div className={`timerfill ${warn ? "warn" : ""}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
