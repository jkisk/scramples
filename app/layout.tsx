import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Providers } from "./providers";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scramples",
  description: "A word scramble game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={openSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
