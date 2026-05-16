import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <title>Lyrics Generator — AI 작사 툴</title>
        <meta name="description" content="장르 선택하고 주제 입력하면 힙합 감성 가사 뚝딱. 무료로 써봐." />
        <meta property="og:title" content="Lyrics Generator — AI 작사 툴" />
        <meta property="og:description" content="장르 선택하고 주제 입력하면 힙합 감성 가사 뚝딱. 무료로 써봐." />
        <meta property="og:image" content="https://lyrics-generator-blond.vercel.app/og-image.png" />
        <meta property="og:url" content="https://lyrics-generator-blond.vercel.app" />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}