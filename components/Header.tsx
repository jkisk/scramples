"use client";

import Image from "next/image";

interface HeaderProps {
  onHome: () => void;
  onShuffle: () => void;
}

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
);

const IconShuffle = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 3h5v5" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
    <path d="M16 21h5v-5" />
    <path d="M3 3l7 7" />
  </svg>
);

export function Header({ onHome, onShuffle }: HeaderProps) {
  return (
    <div className="topbar">
      <button className="iconbtn" onClick={onHome} title="Home">
        <IconHome />
      </button>
      <Image
        className="brand-mini"
        src="/logo.png"
        alt="Scramples"
        width={200}
        height={60}
        style={{ height: 30, width: "auto" }}
      />
      <button className="iconbtn" onClick={onShuffle} title="Shuffle">
        <IconShuffle />
      </button>
    </div>
  );
}
