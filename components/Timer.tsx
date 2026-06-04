"use client";

import { RingProgress, Text } from "@mantine/core";

interface TimerProps {
  seconds: number;
  total: number;
}

export function Timer({ seconds, total }: TimerProps) {
  const isUrgent = seconds <= 5;
  const isWarning = seconds <= 15;
  const color = isUrgent ? "#ff3d02" : isWarning ? "#ff9800" : "#6b09b7";
  const progress = (seconds / total) * 100;

  return (
    <RingProgress
      size={90}
      thickness={7}
      sections={[{ value: progress, color }]}
      label={
        <Text size="xl" fw={800} ta="center" style={{ color }}>
          {seconds}
        </Text>
      }
    />
  );
}
