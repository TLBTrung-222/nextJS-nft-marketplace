import { Input, Modal } from "web3uikit";

export default function UpdatePriceModal({ nftAddress, tokenId, isVisiable }) {
    return (
        <Modal isVisible={isVisiable}>
            <Input
                label="Update listing price in L1 Currency(ETH)"
                name="New listing price"
                type="number"
            />
        </Modal>
    );
}
