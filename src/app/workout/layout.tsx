'use client';

import { ThemeProvider } from 'next-themes';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <ThemeProvider>{children}</ThemeProvider>
    </main>
  );
}
