import config from "./config";

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: config.get("GRAPHQL_URL"),
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = config.get("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  credentials: "include",
  cache: new InMemoryCache(),
});
export { default as builder } from "./builder";
export default client;
