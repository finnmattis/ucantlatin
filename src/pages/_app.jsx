//FA Next.js config
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

import Head from "next/head"
import { Toaster } from "react-hot-toast"
import Header from "../components/header"
import "../globals.css"
import { UserContext } from "../lib/context"
import { useUserData } from "../lib/hooks"

export default function App({ Component, pageProps }) {
    const userData = useUserData()

    return (
        <UserContext.Provider value={userData}>
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
            <Toaster
                toastOptions={{
                    style: {
                        backgroundColor: "#303854",
                        color: "#F9F7FB",
                    },
                }}
            />
        </UserContext.Provider>
    )
}
