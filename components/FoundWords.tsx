"use client";

import { Group, Text, Badge, ScrollArea, Stack } from "@mantine/core";

interface FoundWordsProps {
  words: Map<string, number>;
}

export function FoundWords({ words }: FoundWordsProps) {
  if (words.size === 0) {
    return (
      <Text c="dimmed" ta="center" size="sm">
        No words found yet
      </Text>
    );
  }

  const entries = Array.from(words.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <ScrollArea h={180}>
      <Stack gap={6}>
        {entries.map(([word, pts]) => (
          <Group key={word} justify="space-between" px="xs">
            <Text tt="uppercase" fw={600} style={{ color: "#6b09b7" }}>
              {word}
            </Text>
            <Badge color="violet" variant="filled">
              +{pts}
            </Badge>
          </Group>
        ))}
      </Stack>
    </ScrollArea>
  );
}
