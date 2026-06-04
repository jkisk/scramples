"use client";

import { useState } from "react";
import { Group, TextInput, Button } from "@mantine/core";

interface WordInputProps {
  onSubmit: (word: string) => void;
  onInputChange: (value: string) => void;
  disabled?: boolean;
}

export function WordInput({ onSubmit, onInputChange, disabled }: WordInputProps) {
  const [value, setValue] = useState("");

  function handleChange(val: string) {
    setValue(val);
    onInputChange(val);
  }

  function handleSubmit() {
    const word = value.trim();
    if (word.length >= 3) {
      onSubmit(word);
      setValue("");
      onInputChange("");
    }
  }

  return (
    <Group gap="sm" w="100%">
      <TextInput
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Type a word..."
        size="lg"
        disabled={disabled}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        style={{ flex: 1 }}
        styles={{
          input: {
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "0.05em",
            borderColor: "#6b09b7",
          },
        }}
      />
      <Button
        size="lg"
        onClick={handleSubmit}
        disabled={disabled || value.trim().length < 3}
        style={{ "--button-bg": "#ff3d02", "--button-hover": "#e03500" } as React.CSSProperties}
      >
        Submit
      </Button>
    </Group>
  );
}
