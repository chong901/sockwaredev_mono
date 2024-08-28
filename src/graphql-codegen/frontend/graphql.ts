/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type BusArrival = {
  __typename?: "BusArrival";
  DestinationCode: Scalars["String"]["output"];
  EstimatedArrival: Scalars["String"]["output"];
  Feature: Scalars["String"]["output"];
  Latitude: Scalars["String"]["output"];
  Load: Scalars["String"]["output"];
  Longitude: Scalars["String"]["output"];
  OriginCode: Scalars["String"]["output"];
  Type: Scalars["String"]["output"];
  VisitNumber: Scalars["String"]["output"];
};

export type BusArrivalData = {
  __typename?: "BusArrivalData";
  BusStopCode: Scalars["String"]["output"];
  Services: Array<Service>;
};

export type BusStop = {
  __typename?: "BusStop";
  code: Scalars["ID"]["output"];
  description: Scalars["String"]["output"];
  latitude: Scalars["Float"]["output"];
  longitude: Scalars["Float"]["output"];
  roadName: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  getBusArrival: BusArrivalData;
  getBusStops: Array<BusStop>;
  getNearestBusStops: BusStop;
  searchBusStops: Array<BusStop>;
};

export type QueryGetBusArrivalArgs = {
  code: Scalars["String"]["input"];
};

export type QueryGetBusStopsArgs = {
  lat: Scalars["Float"]["input"];
  long: Scalars["Float"]["input"];
};

export type QueryGetNearestBusStopsArgs = {
  lat: Scalars["Float"]["input"];
  long: Scalars["Float"]["input"];
};

export type QuerySearchBusStopsArgs = {
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search: Scalars["String"]["input"];
};

export type Service = {
  __typename?: "Service";
  NextBus?: Maybe<BusArrival>;
  NextBus2?: Maybe<BusArrival>;
  NextBus3?: Maybe<BusArrival>;
  Operator: Scalars["String"]["output"];
  ServiceNo: Scalars["String"]["output"];
};

export type GetBusStopsQueryVariables = Exact<{
  lat: Scalars["Float"]["input"];
  long: Scalars["Float"]["input"];
}>;

export type GetBusStopsQuery = {
  __typename?: "Query";
  getBusStops: Array<{
    __typename?: "BusStop";
    code: string;
    description: string;
    latitude: number;
    longitude: number;
    roadName: string;
  }>;
};

export type GetNearestBusStopQueryVariables = Exact<{
  lat: Scalars["Float"]["input"];
  long: Scalars["Float"]["input"];
}>;

export type GetNearestBusStopQuery = {
  __typename?: "Query";
  getNearestBusStops: {
    __typename?: "BusStop";
    code: string;
    description: string;
    latitude: number;
    longitude: number;
    roadName: string;
  };
};

export type GetBusArrivalQueryVariables = Exact<{
  code: Scalars["String"]["input"];
}>;

export type GetBusArrivalQuery = {
  __typename?: "Query";
  getBusArrival: {
    __typename?: "BusArrivalData";
    Services: Array<{
      __typename?: "Service";
      ServiceNo: string;
      NextBus?: {
        __typename?: "BusArrival";
        EstimatedArrival: string;
        Latitude: string;
        Longitude: string;
        Load: string;
      } | null;
      NextBus2?: {
        __typename?: "BusArrival";
        EstimatedArrival: string;
        Latitude: string;
        Longitude: string;
        Load: string;
      } | null;
      NextBus3?: {
        __typename?: "BusArrival";
        EstimatedArrival: string;
        Latitude: string;
        Longitude: string;
        Load: string;
      } | null;
    }>;
  };
};

export type BusArrivalDataFragment = {
  __typename?: "BusArrival";
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  Load: string;
};

export type SearchBusStopsQueryVariables = Exact<{
  search: Scalars["String"]["input"];
}>;

export type SearchBusStopsQuery = {
  __typename?: "Query";
  searchBusStops: Array<{
    __typename?: "BusStop";
    code: string;
    description: string;
    latitude: number;
    longitude: number;
    roadName: string;
  }>;
};

export const BusArrivalDataFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "BusArrivalData" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "BusArrival" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "EstimatedArrival" } },
          { kind: "Field", name: { kind: "Name", value: "Latitude" } },
          { kind: "Field", name: { kind: "Name", value: "Longitude" } },
          { kind: "Field", name: { kind: "Name", value: "Load" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BusArrivalDataFragment, unknown>;
export const GetBusStopsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetBusStops" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "lat" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "long" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "getBusStops" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "lat" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "lat" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "long" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "long" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "code" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "latitude" } },
                { kind: "Field", name: { kind: "Name", value: "longitude" } },
                { kind: "Field", name: { kind: "Name", value: "roadName" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBusStopsQuery, GetBusStopsQueryVariables>;
export const GetNearestBusStopDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetNearestBusStop" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "lat" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "long" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "getNearestBusStops" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "lat" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "lat" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "long" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "long" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "code" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "latitude" } },
                { kind: "Field", name: { kind: "Name", value: "longitude" } },
                { kind: "Field", name: { kind: "Name", value: "roadName" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetNearestBusStopQuery,
  GetNearestBusStopQueryVariables
>;
export const GetBusArrivalDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetBusArrival" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "code" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "getBusArrival" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "code" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "code" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "Services" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "ServiceNo" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "NextBus" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "BusArrivalData" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "NextBus2" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "BusArrivalData" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "NextBus3" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "BusArrivalData" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "BusArrivalData" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "BusArrival" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "EstimatedArrival" } },
          { kind: "Field", name: { kind: "Name", value: "Latitude" } },
          { kind: "Field", name: { kind: "Name", value: "Longitude" } },
          { kind: "Field", name: { kind: "Name", value: "Load" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBusArrivalQuery, GetBusArrivalQueryVariables>;
export const SearchBusStopsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SearchBusStops" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "search" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "searchBusStops" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "code" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "latitude" } },
                { kind: "Field", name: { kind: "Name", value: "longitude" } },
                { kind: "Field", name: { kind: "Name", value: "roadName" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SearchBusStopsQuery, SearchBusStopsQueryVariables>;
