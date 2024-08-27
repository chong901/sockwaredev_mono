import { GraphQLResolveInfo } from 'graphql';
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

export type BusArrival = {
  __typename?: 'BusArrival';
  DestinationCode: Scalars['String']['output'];
  EstimatedArrival: Scalars['String']['output'];
  Feature: Scalars['String']['output'];
  Latitude: Scalars['String']['output'];
  Load: Scalars['String']['output'];
  Longitude: Scalars['String']['output'];
  OriginCode: Scalars['String']['output'];
  Type: Scalars['String']['output'];
  VisitNumber: Scalars['String']['output'];
};

export type BusArrivalData = {
  __typename?: 'BusArrivalData';
  BusStopCode: Scalars['String']['output'];
  Services: Array<Service>;
};

export type BusStop = {
  __typename?: 'BusStop';
  code: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  roadName: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getBusArrival: BusArrivalData;
  getBusStops: Array<BusStop>;
  getNearestBusStops: BusStop;
};


export type QueryGetBusArrivalArgs = {
  code: Scalars['String']['input'];
};


export type QueryGetBusStopsArgs = {
  lat: Scalars['Float']['input'];
  long: Scalars['Float']['input'];
};


export type QueryGetNearestBusStopsArgs = {
  lat: Scalars['Float']['input'];
  long: Scalars['Float']['input'];
};

export type Service = {
  __typename?: 'Service';
  NextBus?: Maybe<BusArrival>;
  NextBus2?: Maybe<BusArrival>;
  NextBus3?: Maybe<BusArrival>;
  Operator: Scalars['String']['output'];
  ServiceNo: Scalars['String']['output'];
};

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
  BusArrival: ResolverTypeWrapper<BusArrival>;
  BusArrivalData: ResolverTypeWrapper<BusArrivalData>;
  BusStop: ResolverTypeWrapper<BusStop>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Query: ResolverTypeWrapper<{}>;
  Service: ResolverTypeWrapper<Service>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  BusArrival: BusArrival;
  BusArrivalData: BusArrivalData;
  BusStop: BusStop;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Query: {};
  Service: Service;
  String: Scalars['String']['output'];
}>;

export type BusArrivalResolvers<ContextType = any, ParentType extends ResolversParentTypes['BusArrival'] = ResolversParentTypes['BusArrival']> = ResolversObject<{
  DestinationCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  EstimatedArrival?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Feature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Latitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Load?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Longitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  OriginCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  VisitNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BusArrivalDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['BusArrivalData'] = ResolversParentTypes['BusArrivalData']> = ResolversObject<{
  BusStopCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Services?: Resolver<Array<ResolversTypes['Service']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BusStopResolvers<ContextType = any, ParentType extends ResolversParentTypes['BusStop'] = ResolversParentTypes['BusStop']> = ResolversObject<{
  code?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  roadName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getBusArrival?: Resolver<ResolversTypes['BusArrivalData'], ParentType, ContextType, RequireFields<QueryGetBusArrivalArgs, 'code'>>;
  getBusStops?: Resolver<Array<ResolversTypes['BusStop']>, ParentType, ContextType, RequireFields<QueryGetBusStopsArgs, 'lat' | 'long'>>;
  getNearestBusStops?: Resolver<ResolversTypes['BusStop'], ParentType, ContextType, RequireFields<QueryGetNearestBusStopsArgs, 'lat' | 'long'>>;
}>;

export type ServiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Service'] = ResolversParentTypes['Service']> = ResolversObject<{
  NextBus?: Resolver<Maybe<ResolversTypes['BusArrival']>, ParentType, ContextType>;
  NextBus2?: Resolver<Maybe<ResolversTypes['BusArrival']>, ParentType, ContextType>;
  NextBus3?: Resolver<Maybe<ResolversTypes['BusArrival']>, ParentType, ContextType>;
  Operator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ServiceNo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  BusArrival?: BusArrivalResolvers<ContextType>;
  BusArrivalData?: BusArrivalDataResolvers<ContextType>;
  BusStop?: BusStopResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Service?: ServiceResolvers<ContextType>;
}>;

