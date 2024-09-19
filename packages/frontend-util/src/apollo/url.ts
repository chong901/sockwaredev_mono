export const getApolloUri = ({
  domainUrl,
  vercelUrl,
  path = "/api/graphql",
}: {
  domainUrl?: string;
  vercelUrl?: string;
  path?: string;
}) => {
  const scheme = domainUrl || vercelUrl ? "https" : "http";
  return `${scheme}://${domainUrl ?? vercelUrl ?? "localhost:3000"}${path}`;
};
