//FA Next.js config
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

import Head from "next/head"
import Header from "../../components/header"
import "../styles/globals.css"

export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>U Cant Latin</title>
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
