import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Header from "../components/Header";
import "../styles/globals.css";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/54982/nft-marketplace/v0.0.9", // where we connecting to get data?
    // eventhough we see https, it still decentralized, just like we do with IPFS gateway to make it easier
});

export default function App({ Component, pageProps }) {
    return (
        <>
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
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header></Header>
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </>
    );
}
