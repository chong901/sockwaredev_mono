/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

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
    "\n  query GetBusStops($lat: Float!, $long: Float!) {\n    getBusStops(lat: $lat, long: $long) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n": types.GetBusStopsDocument,
    "\n  query GetNearestBusStop($lat: Float!, $long: Float!) {\n    getNearestBusStops(lat: $lat, long: $long) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n": types.GetNearestBusStopDocument,
    "\n  query GetBusArrival($code: String!) {\n    getBusArrival(code: $code) {\n      Services {\n        ServiceNo\n        NextBus {\n          ...BusArrivalData\n        }\n\n        NextBus2 {\n          ...BusArrivalData\n        }\n        NextBus3 {\n          ...BusArrivalData\n        }\n      }\n    }\n  }\n\n  fragment BusArrivalData on BusArrival {\n    EstimatedArrival\n    OriginCode\n    Latitude\n    Longitude\n    Load\n  }\n": types.GetBusArrivalDocument,
    "\n  query SearchBusStops($search: String!) {\n    searchBusStops(search: $search) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n": types.SearchBusStopsDocument,
    "\n  query GetBusRoutes($serviceNo: String!, $originBusStopCode: String!) {\n    getBusRoutes(serviceNo: $serviceNo, originBusStopCode: $originBusStopCode)\n  }\n": types.GetBusRoutesDocument,
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
export function graphql(source: "\n  query GetBusStops($lat: Float!, $long: Float!) {\n    getBusStops(lat: $lat, long: $long) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n"): (typeof documents)["\n  query GetBusStops($lat: Float!, $long: Float!) {\n    getBusStops(lat: $lat, long: $long) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetNearestBusStop($lat: Float!, $long: Float!) {\n    getNearestBusStops(lat: $lat, long: $long) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n"): (typeof documents)["\n  query GetNearestBusStop($lat: Float!, $long: Float!) {\n    getNearestBusStops(lat: $lat, long: $long) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBusArrival($code: String!) {\n    getBusArrival(code: $code) {\n      Services {\n        ServiceNo\n        NextBus {\n          ...BusArrivalData\n        }\n\n        NextBus2 {\n          ...BusArrivalData\n        }\n        NextBus3 {\n          ...BusArrivalData\n        }\n      }\n    }\n  }\n\n  fragment BusArrivalData on BusArrival {\n    EstimatedArrival\n    OriginCode\n    Latitude\n    Longitude\n    Load\n  }\n"): (typeof documents)["\n  query GetBusArrival($code: String!) {\n    getBusArrival(code: $code) {\n      Services {\n        ServiceNo\n        NextBus {\n          ...BusArrivalData\n        }\n\n        NextBus2 {\n          ...BusArrivalData\n        }\n        NextBus3 {\n          ...BusArrivalData\n        }\n      }\n    }\n  }\n\n  fragment BusArrivalData on BusArrival {\n    EstimatedArrival\n    OriginCode\n    Latitude\n    Longitude\n    Load\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchBusStops($search: String!) {\n    searchBusStops(search: $search) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n"): (typeof documents)["\n  query SearchBusStops($search: String!) {\n    searchBusStops(search: $search) {\n      code\n      description\n      latitude\n      longitude\n      roadName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBusRoutes($serviceNo: String!, $originBusStopCode: String!) {\n    getBusRoutes(serviceNo: $serviceNo, originBusStopCode: $originBusStopCode)\n  }\n"): (typeof documents)["\n  query GetBusRoutes($serviceNo: String!, $originBusStopCode: String!) {\n    getBusRoutes(serviceNo: $serviceNo, originBusStopCode: $originBusStopCode)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;