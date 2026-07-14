"use client";

import { Tile } from "@/lib/game";
import { LetterTile } from "./LetterTile";

interface LetterTilesProps {
  tiles: Tile[];
  selected: number[];
  onTap: (id: number) => void;
}

export function LetterTiles({ tiles, selected, onTap }: LetterTilesProps) {
  return (
    <div className="rackrow">
      {tiles.map((t) => (
        <LetterTile
          key={t.id}
          char={t.char}
          used={selected.includes(t.id)}
          kind="rack"
          onClick={() => onTap(t.id)}
          label={`Use letter ${t.char}`}
        />
      ))}
    </div>
  );
}
