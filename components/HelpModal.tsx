"use client";

import { Modal, Stack, Text, List, Title } from "@mantine/core";

interface HelpModalProps {
  opened: boolean;
  onClose: () => void;
}

export function HelpModal({ opened, onClose }: HelpModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3} style={{ color: "#6b09b7" }}>
          How to Play
        </Title>
      }
      centered
    >
      <Stack gap="md">
        <Text>
          Form as many words as you can from the 9 letters shown — before time
          runs out!
        </Text>
        <Title order={5} style={{ color: "#6b09b7" }}>
          Rules
        </Title>
        <List spacing="xs">
          <List.Item>Words must be at least 3 letters long</List.Item>
          <List.Item>
            You can only use each letter as many times as it appears
          </List.Item>
          <List.Item>Words must be valid English words</List.Item>
          <List.Item>You have 90 seconds per round</List.Item>
        </List>
        <Title order={5} style={{ color: "#6b09b7" }}>
          Scoring
        </Title>
        <List spacing="xs">
          <List.Item>3 letters — 1 point</List.Item>
          <List.Item>4 letters — 2 points</List.Item>
          <List.Item>5 letters — 4 points</List.Item>
          <List.Item>6 letters — 6 points</List.Item>
          <List.Item>7+ letters — 10 points</List.Item>
        </List>
      </Stack>
    </Modal>
  );
}
