import { GetGroceryItemsQuery } from "@/graphql-codegen/frontend/graphql";
import gql from "graphql-tag";

export type GroceryItem = GetGroceryItemsQuery["getGroceryItems"][number];

export const getGroceryItemsQuery = gql`
  query GetGroceryItems(
    $filter: GroceryItemFilter!
    $pagination: PaginationInput!
  ) {
    getGroceryItems(filter: $filter, pagination: $pagination) {
      id
      name
      store {
        id
        name
      }
      price
      amount
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
