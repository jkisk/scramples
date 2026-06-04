"use client";

import { useState } from "react";
import { Stack, Group, Button } from "@mantine/core";

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

  function handleClear() {
    setValue("");
    onInputChange("");
  }

  return (
    <Stack gap="sm" w="100%">
      <div
        style={{
          border: "2px dashed #9ca3af",
          borderRadius: 14,
          padding: "14px 20px",
          minHeight: 62,
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="spell something..."
          disabled={disabled}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "1.15rem",
            fontStyle: "italic",
            color: value ? "#1a1a1a" : "#9ca3af",
            fontFamily: "inherit",
            letterSpacing: "0.04em",
          }}
        />
      </div>
      <Group gap="sm" w="100%">
        <Button
          size="lg"
          variant="outline"
          onClick={handleClear}
          disabled={disabled}
          style={{
            flex: 1,
            borderColor: "#1a1a1a",
            borderWidth: 2,
            color: "#1a1a1a",
            borderRadius: 999,
            fontWeight: 600,
            backgroundColor: "transparent",
          }}
        >
          Clear
        </Button>
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={disabled || value.trim().length < 3}
          style={{
            flex: 2,
            background: "linear-gradient(to right, #7c3aed, #ec4899)",
            border: "none",
            borderRadius: 999,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          Enter ↵
        </Button>
      </Group>
    </Stack>
  );
}
