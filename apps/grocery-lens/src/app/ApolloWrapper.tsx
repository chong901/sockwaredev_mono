"use client";
// ^ this file needs the "use client" pragma

import { HttpLink } from "@apollo/client";
import { ApolloClient, ApolloNextAppProvider, InMemoryCache } from "@apollo/experimental-nextjs-app-support";
import { getApolloUri } from "@repo/frontend-util/apollo";

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: getApolloUri({
      domainUrl: process.env.NEXT_PUBLIC_DOMAIN_URL,
      vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
    }),
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: { cache: "no-store" },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
  });

  // use the `ApolloClient` from "@apollo/experimental-nextjs-app-support"
  return new ApolloClient({
    // use the `InMemoryCache` from "@apollo/experimental-nextjs-app-support"
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getGroceryItems: {
              keyArgs: ["filter"],
              merge(existing, incoming, { args }) {
                const offset = args?.pagination.offset;
                const merged = existing ? existing.slice(0) : [];
                for (let i = 0; i < incoming.length; ++i) {
                  merged[offset + i] = incoming[i];
                }
                return merged;
              },
            },
          },
        },
      },
    }),
    link: httpLink,
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren): JSX.Element {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
