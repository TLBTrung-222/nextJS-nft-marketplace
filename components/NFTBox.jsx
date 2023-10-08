import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftAbi from "../constants/BasicNft.json";
import marketplaceAbi from "../constants/NftMarketplace.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import UpdatePriceModal from "./UpdatePriceModal.jsx";

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
}) {
    const { isWeb3Enabled, account } = useMoralis();

    const [imageURI, setImageURI] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [showModal, setShowModal] = useState(false);

    // get the TokenURI from "tokenId" NFT
    // base on TokenURI -> render the image
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        contractAddress: nftAddress,
        abi: nftAbi,
        functionName: "tokenURI",
        params: { tokenId },
    });

    const { runContractFunction: buyItem } = useWeb3Contract({
        contractAddress: marketplaceAddress,
        abi: marketplaceAbi,
        functionName: "buyItem",
        params: {
            nftContractAddress: nftAddress,
            tokenId: tokenId,
        },
        msgValue: price,
    });

    async function updateUI() {
        const tokenURI = await getTokenURI();
        // to fetch metadata from this URI, need to convert IPFS URI to HTTPs URI
        if (tokenURI) {
            const requestURL = tokenURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            );

            // .json return a Promise
            const tokenURIResponse = await (await fetch(requestURL)).json();
            const imageURIFromResponse = tokenURIResponse.image;
            setImageURI(imageURIFromResponse);
            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const isOwner = seller === account || seller === undefined; // if there is no owner, you will be the owner

    const dispatch = useNotification();
    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            title: "Buy NFT Success",
            message: "NFT has been bought, please check your wallet!",
            position: "topR",
        });
    };

    const handleCardClick = () => {
        isOwner
            ? setShowModal(true)
            : buyItem({
                  onSuccess: handleBuyItemSuccess,
                  onError: (e) => console.log(e),
              });
    };

    const hideModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <UpdatePriceModal
                isVisible={showModal}
                nftAddress={nftAddress}
                tokenId={tokenId}
                hideModal={hideModal}
            ></UpdatePriceModal>
            <Card
                title={tokenName}
                description={tokenDescription}
                onClick={handleCardClick}
            >
                {imageURI ? (
                    <div className="flex flex-col items-end gap-2">
                        <div>#{tokenId}</div>
                        <div className="italic text-sm">
                            Owned by{" "}
                            {isOwner
                                ? "you"
                                : `${seller.slice(0, 5)}...${seller.slice(
                                      seller.length - 4
                                  )}`}
                        </div>
                        <Image src={imageURI} width={200} height={200}></Image>
                        <div className="font-bold">
                            {ethers.utils.formatEther(price)} ETH
                        </div>
                    </div>
                ) : (
                    <div>LOADING...!!!</div>
                )}
            </Card>
        </div>
    );
}
