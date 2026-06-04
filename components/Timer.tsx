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
      <div className="timertrack">
        <div className={`timerfill ${warn ? "warn" : ""}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
