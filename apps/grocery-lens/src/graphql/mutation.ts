import { GroceryItemFragment } from "@/graphql/fragment";
import gql from "graphql-tag";

export const addLabelMutation = gql`
  mutation AddLabel($name: String!) {
    addLabel(name: $name) {
      id
      name
    }
  }
`;

export const addStoreMutation = gql`
  mutation AddStore($name: String!) {
    addStore(name: $name) {
      id
      name
    }
  }
`;

export const addGroceryItemMutation = gql`
  mutation AddGroceryItem($input: CreateGroceryItemInput!) {
    addGroceryItem(input: $input) {
      ...GroceryItemFragment
    }
  }
  ${GroceryItemFragment}
`;

export const updateGroceryItemMutation = gql`
  mutation UpdateGroceryItem($id: ID!, $input: CreateGroceryItemInput!) {
    updateGroceryItem(id: $id, input: $input) {
      ...GroceryItemFragment
    }
  }
  ${GroceryItemFragment}
`;

export const deleteGroceryItemMutation = gql`
  mutation DeleteGroceryItem($id: ID!) {
    deleteGroceryItem(id: $id) {
      id
    }
  }
`;

export const DELETE_STORE = gql`
  mutation DeleteStore($id: ID!) {
    deleteStore(id: $id) {
      id
    }
  }
`;

export const UPDATE_STORE = gql`
  mutation UpdateStore($id: ID!, $name: String!) {
    updateStore(id: $id, name: $name) {
      id
      name
      groceryItemsCount
    }
  }
`;
