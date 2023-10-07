import Image from "next/image";
import styles from "../styles/Home.module.css";
import NFTBox from "../components/NFTBox";
import { useMoralis } from "react-moralis";

export default function Home() {
    const { isWeb3Enabled } = useMoralis();
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently listed</h1>
            {isWeb3Enabled ? (
                <div className="flex flex-wrap">
                    <NFTBox
                        price={"100000000000000000"}
                        nftAddress={
                            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
                        }
                        tokenId={1}
                        marketplaceAddress={
                            "0x5FbDB2315678afecb367f032d93F642f64180aa3"
                        }
                        seller={"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"}
                    ></NFTBox>
                    <NFTBox // hardcode it because we don't user any server
                        price={"200000000000000000"}
                        nftAddress={
                            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
                        }
                        tokenId={2}
                        marketplaceAddress={
                            "0x5FbDB2315678afecb367f032d93F642f64180aa3"
                        }
                        seller={"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"}
                    ></NFTBox>
                    <NFTBox // hardcode it because we don't user any server
                        price={"200000000000000000"}
                        nftAddress={
                            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
                        }
                        tokenId={3}
                        marketplaceAddress={
                            "0x5FbDB2315678afecb367f032d93F642f64180aa3"
                        }
                        seller={"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"}
                    ></NFTBox>
                </div>
            ) : (
                <div>Web3 currently not connected</div>
            )}
        </div>
    );
}
