"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "orange",
  colors: {
    salmon: [
      "#fff0ec",
      "#ffddd4",
      "#ffb8a3",
      "#ff9070",
      "#ff6e46",
      "#ff5a2c",
      "#ff4f1f",
      "#e44014",
      "#cc380e",
      "#b42d06",
    ],
    purple: [
      "#f4e8ff",
      "#e3ccff",
      "#c79bff",
      "#a966ff",
      "#9040fe",
      "#7f27fe",
      "#7718ff",
      "#6609e3",
      "#5a05cb",
      "#4d00b4",
    ],
  },
  other: {
    peachy: "#ffc5b2",
    pinkPurple: "#f0a7e8",
    orangeRed: "#ff3d02",
    deepPurple: "#6b09b7",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  );
}
