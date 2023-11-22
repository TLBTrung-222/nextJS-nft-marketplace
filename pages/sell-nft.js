import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Button, Form, useNotification } from "web3uikit";
import nftAbi from "../constants/BasicNft.json";
import contractAddresses from "../constants/ContractAddresses.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";

export default function Home() {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const nftMarketplaceAddress = chainId
        ? contractAddresses[chainId].NftMarketplace[0]
        : "31337";

    const { runContractFunction } = useWeb3Contract();
    const dispatch = useNotification();
    const [proceeds, setProceeds] = useState("0");

    // when user submit, need to approve the NFT and list it
    const approveAndList = async (data) => {
        // approve NFT
        console.log("Approving...");
        const nftAddress = data.data[0].inputResult;
        const tokenId = data.data[1].inputResult;
        const price = ethers.utils
            .parseEther(data.data[2].inputResult)
            .toString();
        const approveOptions = {
            contractAddress: nftAddress,
            abi: nftAbi,
            functionName: "approve",
            params: {
                to: nftMarketplaceAddress,
                tokenId: tokenId,
            },
        };

        await runContractFunction({
            params: approveOptions,
            onSuccess: (tx) =>
                handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (e) => console.log(e),
        });
    };

    const handleApproveSuccess = async (tx, nftAddress, tokenId, price) => {
        console.log("Ok! Now time to list");
        await tx.wait(1);
        // list NFT to marketplace
        const listOptions = {
            contractAddress: nftMarketplaceAddress,
            abi: nftMarketplaceAbi,
            functionName: "listItem",
            params: {
                nftContractAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        };

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess, // trigger notification
            onError: (e) => console.log(e),
        });
    };

    const handleListSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        });
    };

    async function setupUI() {
        // get the proceeds of seller
        const returnedProceeds = await runContractFunction({
            params: {
                contractAddress: nftMarketplaceAddress,
                abi: nftMarketplaceAbi,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (e) => console.log(e),
        });

        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString());
        }
    }

    const handleWithdrawSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Withdraw success",
            title: "Withdraw proceeds success, please check your wallet",
            position: "topR",
        });
    };

    useEffect(() => {
        setupUI();
    }, [proceeds, account, chainId, isWeb3Enabled]);

    return (
        <div>
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

            <div>
                Withdraw {ethers.utils.formatEther(proceeds)} ETH as proceeds
            </div>
            {proceeds != "0" ? (
                <Button
                    onClick={async () => {
                        await runContractFunction({
                            params: {
                                abi: nftMarketplaceAbi,
                                contractAddress: nftMarketplaceAddress,
                                functionName: "withdrawProceeds",
                                params: {},
                            },
                            onError: (error) => console.log(error),
                            onSuccess: () => handleWithdrawSuccess,
                        });
                    }}
                    text="Withdraw"
                    type="button"
                />
            ) : (
                <div>No proceeds detected</div>
            )}
        </div>
    );
}
