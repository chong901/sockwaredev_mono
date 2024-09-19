import gql from "graphql-tag";

export const getGroceryItemsQuery = gql`
  query GetGroceryItems {
    getGroceryItems {
      id
      name
      store {
        id
        name
      }
      price
      amount
      unit
      notes
      labels {
        id
        name
      }
    }
  }
`;

export const getStoresQuery = gql`
  query GetStores {
    getStores {
      id
      name
    }
  }
`;

export const getLabelQuery = gql`
  query GetLabels {
    getLabels {
      id
      name
    }
  }
`;
