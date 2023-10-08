import { useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Input, Modal } from "web3uikit";
import { ethers } from "ethers";
import contractAddresses from "../constants/ContractAddresses.json";
import abi from "../constants/NftMarketplace.json";
import { useNotification } from "web3uikit";

export default function UpdatePriceModal({
    nftAddress,
    tokenId,
    isVisible,
    hideModal,
}) {
    const [newPrice, setNewPrice] = useState("0");
    const { chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const dispatch = useNotification();

    const { runContractFunction: updateListing } = useWeb3Contract({
        contractAddress: contractAddresses[chainId]["NftMarketplace"][0],
        abi: abi,
        functionName: "updateListing",
        params: {
            nftContractAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(newPrice),
        },
    });

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            title: "Listing price updated",
            message: "Transaction completed!",
            position: "topR",
        });
        hideModal();
    };

    return (
        <Modal
            isVisible={isVisible}
            okText="Update price"
            onOk={async () => {
                await updateListing({
                    onSuccess: handleUpdateListingSuccess,
                    onError: (err) => console.log(err),
                });
            }}
            onCancel={hideModal}
            onCloseButtonPressed={hideModal}
        >
            <Input
                label="Update listing price (ETH)"
                name="New listing price"
                type="number"
                onChange={(e) => setNewPrice(e.target.value)}
            />
        </Modal>
    );
}
