'use client';

import './globals.css';
import Navbar from './components/Navbar';
import { Poppins } from '@next/font/google';
import { ThemeProvider } from 'next-themes';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>IntelliFit</title>
      </head>
      <body className={poppins.className}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
