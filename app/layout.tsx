import type { ReactNode } from 'react';

import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Warm Badge</title>
        <meta name="description" content="Claim a free Base builder reward and connect with your preferred wallet." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="base:app_id" content="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
