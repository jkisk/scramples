"use client";

import { Tile } from "@/lib/game";
import { LetterTile } from "./LetterTile";

interface WordBuilderProps {
  tiles: Tile[];
  selected: number[];
  onTrayTap: (id: number) => void;
  shake: boolean;
  goodFlash: boolean;
  toast: { type: "good" | "bad"; text: string } | null;
  floatPts: { pts: number; key: number } | null;
}

export function WordBuilder({ tiles, selected, onTrayTap, shake, goodFlash, toast, floatPts }: WordBuilderProps) {
  const byId = (id: number) => tiles.find((t) => t.id === id);
  const cls = ["builder", shake ? "shake" : "", goodFlash ? "good" : ""].filter(Boolean).join(" ");

  return (
    <div className={cls} aria-label="Current word">
      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}
      {floatPts && (
        <div className="floatpts" key={floatPts.key}>
          +{floatPts.pts}
        </div>
      )}
      {selected.length === 0 ? (
        <span className="placeholder">spell something…</span>
      ) : (
        selected.map((id) => {
          const tile = byId(id);
          return tile ? (
            <LetterTile
              key={id}
              char={tile.char}
              kind="tray"
              mini
              onClick={() => onTrayTap(id)}
              label={`Remove letter ${tile.char}`}
            />
          ) : null;
        })
      )}
      {selected.length > 0 && <span className="caret" />}
    </div>
  );
}
