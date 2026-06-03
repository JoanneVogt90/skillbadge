import type { ReactNode } from 'react';

import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>SkillBadge</title>
        <meta
          name="description"
          content="Claim a free onchain skill badge and show your Web3 skill identity with your wallet address."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="base:app_id" content="6a1fd6434fbf682eb25dc0bd" />
      </head>
      <body>{children}</body>
    </html>
  );
}
