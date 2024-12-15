import gql from "graphql-tag";

export const GroceryItemFragment = gql`
  fragment GroceryItemFragment on GroceryItem {
    id
    name
    store {
      id
      name
    }
    price
    quantity
    price
    pricePerUnit
    unit
    notes
    labels {
      id
      name
    }
    url
  }
`;
