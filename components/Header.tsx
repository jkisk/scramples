"use client";

import { Group, Text, Button } from "@mantine/core";

interface HeaderProps {
  personalBest: number;
  onHelpClick: () => void;
}

export function Header({ personalBest, onHelpClick }: HeaderProps) {
  return (
    <Group
      justify="space-between"
      p="md"
      style={{
        backgroundColor: "rgba(255, 197, 178, 0.5)",
        borderBottom: "1px solid rgba(107, 9, 183, 0.2)",
      }}
    >
      <div style={{ overflow: "hidden", height: 20 }}>
        <img src="/logo.png" alt="Scramples" style={{ width: 160, display: "block" }} />
      </div>
      <Group gap="md">
        {personalBest > 0 && (
          <Text fw={700} style={{ color: "#6b09b7" }}>
            Best: {personalBest}
          </Text>
        )}
        <Button variant="subtle" color="violet" onClick={onHelpClick} size="sm">
          How to Play
        </Button>
      </Group>
    </Group>
  );
}
