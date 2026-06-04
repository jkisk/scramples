"use client";

import { Group } from "@mantine/core";
import { LetterTile } from "./LetterTile";

interface LetterTilesProps {
  letters: string[];
  currentInput: string;
}

export function LetterTiles({ letters, currentInput }: LetterTilesProps) {
  // Track how many of each letter the current input has consumed
  const usedCounts: Record<string, number> = {};
  for (const ch of currentInput.toLowerCase()) {
    usedCounts[ch] = (usedCounts[ch] || 0) + 1;
  }

  // For each tile, determine if it's dimmed based on consumed counts
  const seenCounts: Record<string, number> = {};
  const dimmedFlags = letters.map((l) => {
    const ch = l.toLowerCase();
    const soFar = seenCounts[ch] || 0;
    seenCounts[ch] = soFar + 1;
    return soFar < (usedCounts[ch] || 0);
  });

  return (
    <Group gap="xs" justify="center" style={{ flexWrap: "wrap" }}>
      {letters.map((letter, i) => (
        <LetterTile key={i} letter={letter} dimmed={dimmedFlags[i]} />
      ))}
    </Group>
  );
}
