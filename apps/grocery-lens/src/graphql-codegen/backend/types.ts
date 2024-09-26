import { GraphQLResolveInfo } from 'graphql';
import { ApolloContext } from '@/types/apollo/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateGroceryItemInput = {
  amount: Scalars['Float']['input'];
  itemName: Scalars['String']['input'];
  labels: Array<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  store: Scalars['String']['input'];
  unit: Unit;
};

export type GroceryItem = {
  __typename?: 'GroceryItem';
  amount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  labels: Array<Label>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  pricePerUnit: Scalars['Float']['output'];
  store: Store;
  unit: Scalars['String']['output'];
};

export type GroceryItemFilter = {
  keyword: Scalars['String']['input'];
  labels: Array<Scalars['String']['input']>;
  stores: Array<Scalars['String']['input']>;
};

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
  updateGroceryItem: GroceryItem;
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


export type MutationUpdateGroceryItemArgs = {
  id: Scalars['ID']['input'];
  input: CreateGroceryItemInput;
};

export type Query = {
  __typename?: 'Query';
  getGroceryItems: Array<GroceryItem>;
  getLabels: Array<Label>;
  getStores: Array<Store>;
};


export type QueryGetGroceryItemsArgs = {
  filter: GroceryItemFilter;
};

export type Store = {
  __typename?: 'Store';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export enum Unit {
  Bag = 'bag',
  Box = 'box',
  Gram = 'gram',
  Kilogram = 'kilogram',
  Liter = 'liter',
  Milliliter = 'milliliter',
  Piece = 'piece'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateGroceryItemInput: CreateGroceryItemInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GroceryItem: ResolverTypeWrapper<GroceryItem>;
  GroceryItemFilter: GroceryItemFilter;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Label: ResolverTypeWrapper<Label>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Store: ResolverTypeWrapper<Store>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Unit: Unit;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CreateGroceryItemInput: CreateGroceryItemInput;
  Float: Scalars['Float']['output'];
  GroceryItem: GroceryItem;
  GroceryItemFilter: GroceryItemFilter;
  ID: Scalars['ID']['output'];
  Label: Label;
  Mutation: {};
  Query: {};
  Store: Store;
  String: Scalars['String']['output'];
}>;

export type GroceryItemResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['GroceryItem'] = ResolversParentTypes['GroceryItem']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  pricePerUnit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LabelResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Label'] = ResolversParentTypes['Label']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addGroceryItem?: Resolver<ResolversTypes['GroceryItem'], ParentType, ContextType, RequireFields<MutationAddGroceryItemArgs, 'input'>>;
  addLabel?: Resolver<ResolversTypes['Label'], ParentType, ContextType, RequireFields<MutationAddLabelArgs, 'name'>>;
  addStore?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<MutationAddStoreArgs, 'name'>>;
  deleteGroceryItem?: Resolver<ResolversTypes['GroceryItem'], ParentType, ContextType, RequireFields<MutationDeleteGroceryItemArgs, 'id'>>;
  updateGroceryItem?: Resolver<ResolversTypes['GroceryItem'], ParentType, ContextType, RequireFields<MutationUpdateGroceryItemArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getGroceryItems?: Resolver<Array<ResolversTypes['GroceryItem']>, ParentType, ContextType, RequireFields<QueryGetGroceryItemsArgs, 'filter'>>;
  getLabels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  getStores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType>;
}>;

export type StoreResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ApolloContext> = ResolversObject<{
  GroceryItem?: GroceryItemResolvers<ContextType>;
  Label?: LabelResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Store?: StoreResolvers<ContextType>;
}>;

