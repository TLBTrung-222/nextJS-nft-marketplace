import { useQuery } from "@apollo/client";
import { useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";
import contractAddresses from "../constants/ContractAddresses.json";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";

export default function Home() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const nftMarketplaceAddress = chainId
        ? contractAddresses[chainId].NftMarketplace[0]
        : "31337";

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);
    console.log(GET_ACTIVE_ITEMS);

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently listed</h1>
            {isWeb3Enabled ? (
                loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {/* Insert NFT Box here */}
                        {listedNfts.activeItems.map((nft) => {
                            return (
                                <NFTBox
                                    price={nft.price}
                                    seller={nft.seller}
                                    nftAddress={nft.nftAddress}
                                    tokenId={nft.tokenId}
                                    marketplaceAddress={nftMarketplaceAddress}
                                ></NFTBox>
                            );
                        })}
                    </div>
                )
            ) : (
                <div>Web3 currently not connected</div>
            )}
        </div>
    );
}
