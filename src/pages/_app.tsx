import type { AppProps } from "next/app"
import Head from "next/head"
import Header from "../../components/header"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Head>
                <title>Ucant Latin</title>
                <meta name="description" content="The Best Site" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Component {...pageProps} />
        </div>
    )
}
