import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Form } from "web3uikit";

export default function Home() {
    const approveAndList = (data) => {};

    return (
        <>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        inputWidth: "20%",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        inputWidth: "20%",
                        value: "0",
                    },
                ]}
                title="Sell your NFT!"
            ></Form>
            <h1>Sell page</h1>
        </>
    );
}
