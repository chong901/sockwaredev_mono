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
      id
      name
      store {
        name
      }
      price
      amount
      unit
      labels {
        name
      }
      notes
      url
    }
  }
`;

export const updateGroceryItemMutation = gql`
  mutation UpdateGroceryItem($id: ID!, $input: CreateGroceryItemInput!) {
    updateGroceryItem(id: $id, input: $input) {
      id
      name
      store {
        name
      }
      price
      amount
      unit
      labels {
        name
      }
      notes
      url
    }
  }
`;

export const deleteGroceryItemMutation = gql`
  mutation DeleteGroceryItem($id: ID!) {
    deleteGroceryItem(id: $id) {
      id
    }
  }
`;
