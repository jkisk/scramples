"use client";

interface LetterTileProps {
  char: string;
  used?: boolean;
  kind?: "rack" | "tray";
  mini?: boolean;
  onClick?: () => void;
}

export function LetterTile({ char, used, kind = "rack", mini, onClick }: LetterTileProps) {
  const cls = ["tile", kind, used ? "used" : "", mini ? "mini" : ""].filter(Boolean).join(" ");
  return (
    <div className={cls} onClick={onClick}>
      {char}
    </div>
  );
}
