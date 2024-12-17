/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  fragment GroceryItemFragment on GroceryItem {\n    id\n    name\n    store {\n      id\n      name\n    }\n    price\n    quantity\n    price\n    pricePerUnit\n    unit\n    notes\n    labels {\n      id\n      name\n    }\n    url\n    created_at\n  }\n":
    types.GroceryItemFragmentFragmentDoc,
  "\n  mutation AddLabel($name: String!) {\n    addLabel(name: $name) {\n      id\n      name\n    }\n  }\n": types.AddLabelDocument,
  "\n  mutation AddStore($name: String!) {\n    addStore(name: $name) {\n      id\n      name\n    }\n  }\n": types.AddStoreDocument,
  "\n  mutation AddGroceryItem($input: CreateGroceryItemInput!) {\n    addGroceryItem(input: $input) {\n      ...GroceryItemFragment\n    }\n  }\n  \n":
    types.AddGroceryItemDocument,
  "\n  mutation UpdateGroceryItem($id: ID!, $input: CreateGroceryItemInput!) {\n    updateGroceryItem(id: $id, input: $input) {\n      ...GroceryItemFragment\n    }\n  }\n  \n":
    types.UpdateGroceryItemDocument,
  "\n  mutation DeleteGroceryItem($id: ID!) {\n    deleteGroceryItem(id: $id) {\n      id\n    }\n  }\n": types.DeleteGroceryItemDocument,
  "\n  query GetGroceryItems($filter: GroceryItemFilter!, $pagination: Pagination!) {\n    getGroceryItems(filter: $filter, pagination: $pagination) {\n      ...GroceryItemFragment\n    }\n  }\n  \n":
    types.GetGroceryItemsDocument,
  "\n  query GetStores {\n    getStores {\n      id\n      name\n    }\n  }\n": types.GetStoresDocument,
  "\n  query GetLabels {\n    getLabels {\n      id\n      name\n    }\n  }\n": types.GetLabelsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment GroceryItemFragment on GroceryItem {\n    id\n    name\n    store {\n      id\n      name\n    }\n    price\n    quantity\n    price\n    pricePerUnit\n    unit\n    notes\n    labels {\n      id\n      name\n    }\n    url\n    created_at\n  }\n",
): (typeof documents)["\n  fragment GroceryItemFragment on GroceryItem {\n    id\n    name\n    store {\n      id\n      name\n    }\n    price\n    quantity\n    price\n    pricePerUnit\n    unit\n    notes\n    labels {\n      id\n      name\n    }\n    url\n    created_at\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation AddLabel($name: String!) {\n    addLabel(name: $name) {\n      id\n      name\n    }\n  }\n",
): (typeof documents)["\n  mutation AddLabel($name: String!) {\n    addLabel(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation AddStore($name: String!) {\n    addStore(name: $name) {\n      id\n      name\n    }\n  }\n",
): (typeof documents)["\n  mutation AddStore($name: String!) {\n    addStore(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation AddGroceryItem($input: CreateGroceryItemInput!) {\n    addGroceryItem(input: $input) {\n      ...GroceryItemFragment\n    }\n  }\n  \n",
): (typeof documents)["\n  mutation AddGroceryItem($input: CreateGroceryItemInput!) {\n    addGroceryItem(input: $input) {\n      ...GroceryItemFragment\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateGroceryItem($id: ID!, $input: CreateGroceryItemInput!) {\n    updateGroceryItem(id: $id, input: $input) {\n      ...GroceryItemFragment\n    }\n  }\n  \n",
): (typeof documents)["\n  mutation UpdateGroceryItem($id: ID!, $input: CreateGroceryItemInput!) {\n    updateGroceryItem(id: $id, input: $input) {\n      ...GroceryItemFragment\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteGroceryItem($id: ID!) {\n    deleteGroceryItem(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteGroceryItem($id: ID!) {\n    deleteGroceryItem(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetGroceryItems($filter: GroceryItemFilter!, $pagination: Pagination!) {\n    getGroceryItems(filter: $filter, pagination: $pagination) {\n      ...GroceryItemFragment\n    }\n  }\n  \n",
): (typeof documents)["\n  query GetGroceryItems($filter: GroceryItemFilter!, $pagination: Pagination!) {\n    getGroceryItems(filter: $filter, pagination: $pagination) {\n      ...GroceryItemFragment\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetStores {\n    getStores {\n      id\n      name\n    }\n  }\n",
): (typeof documents)["\n  query GetStores {\n    getStores {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetLabels {\n    getLabels {\n      id\n      name\n    }\n  }\n",
): (typeof documents)["\n  query GetLabels {\n    getLabels {\n      id\n      name\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
