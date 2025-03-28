import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Disable unused JavaScript features when possible */}
        <meta name="next-size-adjust" content="false" />
        
        {/* Add resource hints for critical assets */}
        <link rel="preload" href="/img/hero.jpg" as="image" fetchPriority="high" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 