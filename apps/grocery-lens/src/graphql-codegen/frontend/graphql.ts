/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type CreateGroceryItemInput = {
  itemName: Scalars['String']['input'];
  labels: Array<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  storeId: Scalars['String']['input'];
  unit: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type GroceryItem = {
  __typename?: 'GroceryItem';
  created_at: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  labels: Array<Label>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  pricePerUnit: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  store: Store;
  unit: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type GroceryItemFilter = {
  keyword: Scalars['String']['input'];
  labels: Array<Scalars['String']['input']>;
  sortBy: GroceryItemSortBy;
  stores: Array<Scalars['String']['input']>;
};

export enum GroceryItemSortBy {
  HighestPrice = 'HIGHEST_PRICE',
  HighestPricePerUnit = 'HIGHEST_PRICE_PER_UNIT',
  LowestPrice = 'LOWEST_PRICE',
  LowestPricePerUnit = 'LOWEST_PRICE_PER_UNIT',
  Name = 'NAME',
  Recency = 'RECENCY'
}

export type Label = {
  __typename?: 'Label';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addGroceryItem: GroceryItem;
  addLabel: Label;
  addStore: Store;
  deleteGroceryItem: GroceryItem;
  deleteStore: Store;
  updateGroceryItem: GroceryItem;
  updateStore: Store;
};


export type MutationAddGroceryItemArgs = {
  input: CreateGroceryItemInput;
};


export type MutationAddLabelArgs = {
  name: Scalars['String']['input'];
};


export type MutationAddStoreArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteGroceryItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoreArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateGroceryItemArgs = {
  id: Scalars['ID']['input'];
  input: CreateGroceryItemInput;
};


export type MutationUpdateStoreArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Pagination = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  getGroceryItems: Array<GroceryItem>;
  getLabels: Array<Label>;
  getStores: Array<Store>;
};


export type QueryGetGroceryItemsArgs = {
  filter: GroceryItemFilter;
  pagination: Pagination;
};

export type Store = {
  __typename?: 'Store';
  groceryItemsCount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GroceryItemFragmentFragment = { __typename?: 'GroceryItem', id: string, name: string, price: number, quantity: number, pricePerUnit: number, unit: string, notes?: string | null, url?: string | null, created_at: any, store: { __typename?: 'Store', id: string, name: string }, labels: Array<{ __typename?: 'Label', id: string, name: string }> };

export type AddLabelMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type AddLabelMutation = { __typename?: 'Mutation', addLabel: { __typename?: 'Label', id: string, name: string } };

export type AddStoreMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type AddStoreMutation = { __typename?: 'Mutation', addStore: { __typename?: 'Store', id: string, name: string, groceryItemsCount: number } };

export type AddGroceryItemMutationVariables = Exact<{
  input: CreateGroceryItemInput;
}>;


export type AddGroceryItemMutation = { __typename?: 'Mutation', addGroceryItem: { __typename?: 'GroceryItem', id: string, name: string, price: number, quantity: number, pricePerUnit: number, unit: string, notes?: string | null, url?: string | null, created_at: any, store: { __typename?: 'Store', id: string, name: string }, labels: Array<{ __typename?: 'Label', id: string, name: string }> } };

export type UpdateGroceryItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: CreateGroceryItemInput;
}>;


export type UpdateGroceryItemMutation = { __typename?: 'Mutation', updateGroceryItem: { __typename?: 'GroceryItem', id: string, name: string, price: number, quantity: number, pricePerUnit: number, unit: string, notes?: string | null, url?: string | null, created_at: any, store: { __typename?: 'Store', id: string, name: string }, labels: Array<{ __typename?: 'Label', id: string, name: string }> } };

export type DeleteGroceryItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGroceryItemMutation = { __typename?: 'Mutation', deleteGroceryItem: { __typename?: 'GroceryItem', id: string } };

export type DeleteStoreMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStoreMutation = { __typename?: 'Mutation', deleteStore: { __typename?: 'Store', id: string } };

export type UpdateStoreMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateStoreMutation = { __typename?: 'Mutation', updateStore: { __typename?: 'Store', id: string, name: string, groceryItemsCount: number } };

export type GetGroceryItemsQueryVariables = Exact<{
  filter: GroceryItemFilter;
  pagination: Pagination;
}>;


export type GetGroceryItemsQuery = { __typename?: 'Query', getGroceryItems: Array<{ __typename?: 'GroceryItem', id: string, name: string, price: number, quantity: number, pricePerUnit: number, unit: string, notes?: string | null, url?: string | null, created_at: any, store: { __typename?: 'Store', id: string, name: string }, labels: Array<{ __typename?: 'Label', id: string, name: string }> }> };

export type GetStoresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStoresQuery = { __typename?: 'Query', getStores: Array<{ __typename?: 'Store', id: string, name: string, groceryItemsCount: number }> };

export type GetLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLabelsQuery = { __typename?: 'Query', getLabels: Array<{ __typename?: 'Label', id: string, name: string }> };

export const GroceryItemFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroceryItemFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GroceryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<GroceryItemFragmentFragment, unknown>;
export const AddLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AddLabelMutation, AddLabelMutationVariables>;
export const AddStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groceryItemsCount"}}]}}]}}]} as unknown as DocumentNode<AddStoreMutation, AddStoreMutationVariables>;
export const AddGroceryItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddGroceryItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroceryItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addGroceryItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroceryItemFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroceryItemFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GroceryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<AddGroceryItemMutation, AddGroceryItemMutationVariables>;
export const UpdateGroceryItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGroceryItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroceryItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGroceryItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroceryItemFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroceryItemFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GroceryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<UpdateGroceryItemMutation, UpdateGroceryItemMutationVariables>;
export const DeleteGroceryItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroceryItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroceryItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteGroceryItemMutation, DeleteGroceryItemMutationVariables>;
export const DeleteStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteStoreMutation, DeleteStoreMutationVariables>;
export const UpdateStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groceryItemsCount"}}]}}]}}]} as unknown as DocumentNode<UpdateStoreMutation, UpdateStoreMutationVariables>;
export const GetGroceryItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGroceryItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GroceryItemFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGroceryItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroceryItemFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroceryItemFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GroceryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<GetGroceryItemsQuery, GetGroceryItemsQueryVariables>;
export const GetStoresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groceryItemsCount"}}]}}]}}]} as unknown as DocumentNode<GetStoresQuery, GetStoresQueryVariables>;
export const GetLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetLabelsQuery, GetLabelsQueryVariables>;