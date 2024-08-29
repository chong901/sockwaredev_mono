import gql from "graphql-tag";

export const getBusStopsQuery = gql`
  query GetBusStops($lat: Float!, $long: Float!) {
    getBusStops(lat: $lat, long: $long) {
      code
      description
      latitude
      longitude
      roadName
    }
  }
`;

export const getNearestBusStopQuery = gql`
  query GetNearestBusStop($lat: Float!, $long: Float!) {
    getNearestBusStops(lat: $lat, long: $long) {
      code
      description
      latitude
      longitude
      roadName
    }
  }
`;

export const getBusArrivalQuery = gql`
  query GetBusArrival($code: String!) {
    getBusArrival(code: $code) {
      Services {
        ServiceNo
        NextBus {
          ...BusArrivalData
        }

        NextBus2 {
          ...BusArrivalData
        }
        NextBus3 {
          ...BusArrivalData
        }
      }
    }
  }

  fragment BusArrivalData on BusArrival {
    EstimatedArrival
    OriginCode
    Latitude
    Longitude
    Load
  }
`;

export const searchBusStopsQuery = gql`
  query SearchBusStops($search: String!) {
    searchBusStops(search: $search) {
      code
      description
      latitude
      longitude
      roadName
    }
  }
`;
