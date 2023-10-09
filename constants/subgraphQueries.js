import { gql } from "@apollo/client";

//* create GraphQL query syntax
const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(
            first: 5
            where: { buyer: "0x0000000000000000000000000000000000000000" }
        ) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`;

export default GET_ACTIVE_ITEMS;
