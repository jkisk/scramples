"use client";

interface LetterTileProps {
  char: string;
  used?: boolean;
  kind?: "rack" | "tray";
  mini?: boolean;
  onClick?: () => void;
  label?: string;
}

export function LetterTile({ char, used, kind = "rack", mini, onClick, label }: LetterTileProps) {
  const cls = ["tile", kind, used ? "used" : "", mini ? "mini" : ""].filter(Boolean).join(" ");
  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      disabled={used}
      aria-label={label ?? `${kind === "tray" ? "Remove" : "Use"} letter ${char}`}
      aria-pressed={kind === "rack" ? used : undefined}
    >
      {char}
    </button>
  );
}
