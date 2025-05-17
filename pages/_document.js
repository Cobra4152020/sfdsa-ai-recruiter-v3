import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link 
          href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.17/dist/tailwind.min.css" 
          rel="stylesheet"
          integrity="sha256-K/5+/mMBMd0xbWrscEdm6+VhJ9jZdcxN4+fS0NJJoSQ=" 
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 