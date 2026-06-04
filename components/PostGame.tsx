"use client";

import { Stack, Title, Text, Button, Group, Paper, Badge } from "@mantine/core";

interface PostGameProps {
  score: number;
  personalBest: number;
  isNewRecord: boolean;
  foundWords: Map<string, number>;
  onPlayAgain: () => void;
}

export function PostGame({
  score,
  personalBest,
  isNewRecord,
  foundWords,
  onPlayAgain,
}: PostGameProps) {
  const sortedWords = Array.from(foundWords.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );

  return (
    <Stack align="center" gap="xl" p="xl" w="100%" maw={600}>
      <Title order={2} style={{ color: "#6b09b7" }}>
        {isNewRecord ? "New Personal Best!" : "Time's Up!"}
      </Title>

      <Group gap="xl" justify="center">
        <Paper
          p="xl"
          style={{ backgroundColor: "#f0a7e8", textAlign: "center", minWidth: 130 }}
        >
          <Text size="sm" c="dimmed" fw={600}>
            Your Score
          </Text>
          <Title order={1} style={{ color: "#ff3d02" }}>
            {score}
          </Title>
        </Paper>
        <Paper
          p="xl"
          style={{ backgroundColor: "#f0a7e8", textAlign: "center", minWidth: 130 }}
        >
          <Text size="sm" c="dimmed" fw={600}>
            Personal Best
          </Text>
          <Title order={1} style={{ color: "#6b09b7" }}>
            {personalBest}
          </Title>
        </Paper>
      </Group>

      {sortedWords.length > 0 && (
        <Stack w="100%" gap="xs">
          <Text fw={700} style={{ color: "#6b09b7" }}>
            Words Found ({sortedWords.length})
          </Text>
          <Group gap="xs" style={{ flexWrap: "wrap" }}>
            {sortedWords.map(([word, pts]) => (
              <Badge key={word} variant="filled" color="violet" size="lg">
                {word} ({pts}pt{pts !== 1 ? "s" : ""})
              </Badge>
            ))}
          </Group>
        </Stack>
      )}

      {sortedWords.length === 0 && (
        <Text c="dimmed">No words found — try again!</Text>
      )}

      <Button
        size="xl"
        onClick={onPlayAgain}
        style={{ "--button-bg": "#ff3d02", "--button-hover": "#e03500", minWidth: 200 } as React.CSSProperties}
      >
        Play Again
      </Button>
    </Stack>
  );
}
