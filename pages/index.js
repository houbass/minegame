import Head from 'next/head'

//components
import Game from '@/components/Game'

export default function Home() {
  return (
    <>
      <Head>
        <title>Mining game</title>
        <meta name="description" content="Seek the ideal path to achieve the highest score" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

        <link rel="manifest" href="/manifest.json" />

        <meta name="theme-color" content="#ffffff"/>

        <meta name="twitter:card" content="summary" />

        <meta
          property="og:image"
          content="background.png"
        />

        <meta
          property="og:image:type"
          content="image/webp"
        />

        <meta
          property="og:image:width"
          content="800"
        />
        <meta
          property="og:image:height"
          content="450"
        />

        <meta name="author" content="Ondrej Laube" />
      </Head>
      <main>
        <div>
          <Game />
        </div>
      </main>
    </>
  )
}
