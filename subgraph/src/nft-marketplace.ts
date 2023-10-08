import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    ItemBought as ItemBoughtEvent,
    ItemCanceled as ItemCanceledEvent,
    ItemListed as ItemListedEvent,
    PriceUpdated as PriceUpdatedEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
    ItemBought,
    ItemCanceled,
    ItemListed,
    ActiveItem,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
    let itemBought = ItemBought.load(
        getIdFromEventParams(
            event.params.tokenId,
            event.params.nftContractAddress
        )
    );
    let activeItem = ActiveItem.load(
        getIdFromEventParams(
            event.params.tokenId,
            event.params.nftContractAddress
        )
    );

    if (!itemBought) {
        itemBought = new ItemBought(
            getIdFromEventParams(
                event.params.tokenId,
                event.params.nftContractAddress
            )
        );
    }
    // we don't need to check if activeItem for that NFT exist or not, because in below, we mark that NFT to have a buyer.
    // That's enough to know if the NFT is on our marketplace or not.
    // Remember, the point of ActiveItem table is to check the existing NFT on marketplace to display on front-end

    itemBought.buyer = event.params.buyer;
    itemBought.nftContractAddress = event.params.nftContractAddress;
    itemBought.tokenId = event.params.tokenId;
    itemBought.price = event.params.price;
    activeItem!.buyer = event.params.buyer; // if the NFT has buyer -> it has been bought
    // by marking the NFT as has been bought, we don't need to delete the NFT from Active Item "table"

    itemBought.save();
    activeItem!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
    let itemCanceled = ItemCanceled.load(
        getIdFromEventParams(
            event.params.tokenId,
            event.params.nftContractAddress
        )
    );
    let activeItem = ActiveItem.load(
        //this is for updating the listing item
        getIdFromEventParams(
            event.params.tokenId,
            event.params.nftContractAddress
        )
    );
    if (!itemCanceled) {
        itemCanceled = new ItemListed(
            getIdFromEventParams(
                event.params.tokenId,
                event.params.nftContractAddress
            )
        );
    }

    itemCanceled.seller = event.params.seller;
    itemCanceled.nftContractAddress = event.params.nftContractAddress;
    itemCanceled.tokenId = event.params.tokenId;
    activeItem!.buyer = Address.fromString("0x00000000000000000000000000dEaD"); //dead address

    itemCanceled.save();
    activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
    //* we check if the NFT already listed, if yes, we don't need to assign ID for it, just update the params
    let itemListed = ItemListed.load(
        getIdFromEventParams(
            event.params.tokenId,
            event.params.nftContractAddress
        )
    );
    let activeItem = ActiveItem.load(
        //this is for updating the listing item
        getIdFromEventParams(
            event.params.tokenId,
            event.params.nftContractAddress
        )
    );

    //* if not listed, we create new instance with ID, and update params
    if (!itemListed) {
        itemListed = new ItemListed(
            getIdFromEventParams(
                event.params.tokenId,
                event.params.nftContractAddress
            )
        );
    }
    if (!activeItem) {
        activeItem = new ActiveItem(
            getIdFromEventParams(
                event.params.tokenId,
                event.params.nftContractAddress
            )
        );
    }

    itemListed.nftContractAddress = event.params.nftContractAddress;
    activeItem.nftAddress = event.params.nftContractAddress;

    itemListed.seller = event.params.seller;
    activeItem.seller = event.params.seller;

    itemListed.tokenId = event.params.tokenId;
    activeItem.tokenId = event.params.tokenId;

    itemListed.price = event.params.price;
    activeItem.price = event.params.price;

    itemListed.save();
    activeItem.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
    return tokenId.toHexString() + nftAddress.toHexString();
}
