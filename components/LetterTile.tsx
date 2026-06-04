"use client";

import { Box, Text } from "@mantine/core";

interface LetterTileProps {
  letter: string;
  dimmed?: boolean;
}

export function LetterTile({ letter, dimmed }: LetterTileProps) {
  return (
    <Box
      w={52}
      h={52}
      style={{
        backgroundColor: dimmed ? "#d8b4c8" : "#ffffff",
        border: `2px solid ${dimmed ? "#b090c0" : "#6b09b7"}`,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: dimmed ? 0.6 : 1,
        transition: "all 0.15s ease",
        boxShadow: dimmed ? "none" : "0 2px 6px rgba(107, 9, 183, 0.25)",
        userSelect: "none",
      }}
    >
      <Text fw={800} size="xl" tt="uppercase" style={{ color: dimmed ? "#9060b0" : "#6b09b7" }}>
        {letter}
      </Text>
    </Box>
  );
}
