"use client";

import { useState, useEffect, useRef } from "react";
import {
  Stack,
  Title,
  Button,
  Group,
  Text,
  Paper,
  Center,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "./Header";
import { LetterTiles } from "./LetterTiles";
import { WordInput } from "./WordInput";
import { Timer } from "./Timer";
import { FoundWords } from "./FoundWords";
import { PostGame } from "./PostGame";
import { HelpModal } from "./HelpModal";
import { loadWordList, isValidDictionaryWord, canFormFromLetters } from "@/lib/words";
import { generateLetters, scoreWord, GAME_DURATION_SECONDS } from "@/lib/game";
import { getPersonalBest, savePersonalBest } from "@/lib/storage";

type GameState = "idle" | "loading" | "playing" | "finished";

export function GamePage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [letters, setLetters] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Map<string, number>>(new Map());
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION_SECONDS);
  const [personalBest, setPersonalBest] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [helpOpened, { open: openHelp, close: closeHelp }] = useDisclosure(false);

  const scoreRef = useRef(0);

  useEffect(() => {
    setPersonalBest(getPersonalBest());
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "finished") return;
    const newRecord = savePersonalBest(scoreRef.current);
    setIsNewRecord(newRecord);
    setPersonalBest(getPersonalBest());
  }, [gameState]);

  async function startGame() {
    setGameState("loading");
    try {
      await loadWordList();
    } catch {
      notifications.show({ message: "Failed to load word list", color: "red" });
      setGameState("idle");
      return;
    }
    scoreRef.current = 0;
    setLetters(generateLetters(9));
    setFoundWords(new Map());
    setScore(0);
    setTimeRemaining(GAME_DURATION_SECONDS);
    setIsNewRecord(false);
    setCurrentInput("");
    setGameState("playing");
  }

  function handleWordSubmit(word: string) {
    const w = word.toLowerCase();

    if (foundWords.has(w)) {
      notifications.show({ message: "Already found!", color: "yellow", autoClose: 1500 });
      return;
    }
    if (!canFormFromLetters(w, letters)) {
      notifications.show({ message: "Letters not available", color: "red", autoClose: 1500 });
      return;
    }
    if (!isValidDictionaryWord(w)) {
      notifications.show({ message: "Not a valid word", color: "red", autoClose: 1500 });
      return;
    }

    const pts = scoreWord(w);
    const newScore = scoreRef.current + pts;
    scoreRef.current = newScore;
    setScore(newScore);
    setFoundWords((prev) => new Map(prev).set(w, pts));
    notifications.show({
      message: `+${pts} point${pts !== 1 ? "s" : ""}!`,
      color: "green",
      autoClose: 1000,
    });
  }

  return (
    <>
      <HelpModal opened={helpOpened} onClose={closeHelp} />
      <Stack gap={0} style={{ minHeight: "100vh" }}>
        <Header personalBest={personalBest} onHelpClick={openHelp} />

        <Center style={{ flex: 1, padding: "2rem" }}>
          {gameState === "idle" && (
            <Stack align="center" gap="xl">
              <div style={{ overflow: "hidden", height: 54 }}>
                <img src="/logo.png" alt="Scramples" style={{ width: 480, display: "block" }} />
              </div>
              {personalBest > 0 && (
                <Text size="lg" fw={600} style={{ color: "#6b09b7" }}>
                  Personal Best: {personalBest} points
                </Text>
              )}
              <Button
                size="xl"
                onClick={startGame}
                style={{ "--button-bg": "#ff3d02", "--button-hover": "#e03500", minWidth: 200, fontSize: "1.2rem" } as React.CSSProperties}
              >
                Play
              </Button>
              <Button variant="subtle" color="violet" onClick={openHelp}>
                How to Play
              </Button>
            </Stack>
          )}

          {gameState === "loading" && (
            <Stack align="center" gap="md">
              <Loader color="violet" size="xl" />
              <Text c="dimmed">Loading word list…</Text>
            </Stack>
          )}

          {gameState === "playing" && (
            <Stack align="center" gap="lg" w="100%" maw={600}>
              <Group justify="space-between" w="100%" align="center">
                <Timer seconds={timeRemaining} total={GAME_DURATION_SECONDS} />
                <Paper
                  p="md"
                  style={{ backgroundColor: "#f0a7e8", textAlign: "center", minWidth: 110 }}
                >
                  <Text size="sm" c="dimmed" fw={600}>
                    Score
                  </Text>
                  <Title order={2} style={{ color: "#6b09b7" }}>
                    {score}
                  </Title>
                </Paper>
              </Group>

              <LetterTiles letters={letters} currentInput={currentInput} />

              <WordInput
                onSubmit={handleWordSubmit}
                onInputChange={setCurrentInput}
                disabled={gameState !== "playing"}
              />

              <Paper p="md" w="100%" style={{ backgroundColor: "#f0a7e8" }}>
                <Text fw={700} mb="xs" style={{ color: "#6b09b7" }}>
                  Found Words ({foundWords.size})
                </Text>
                <FoundWords words={foundWords} />
              </Paper>
            </Stack>
          )}

          {gameState === "finished" && (
            <PostGame
              score={score}
              personalBest={personalBest}
              isNewRecord={isNewRecord}
              foundWords={foundWords}
              onPlayAgain={startGame}
            />
          )}
        </Center>
      </Stack>
    </>
  );
}
