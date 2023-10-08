import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";

const APP_ID = process.env.MORALIS_APP_ID;
const SERVER_URL = process.env.MORALIS_SERVER_ID;

export default function App({ Component, pageProps }) {
    return (
        <>
            {" "}
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Header></Header>
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </>
    );
}
