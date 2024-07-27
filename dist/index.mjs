// config.ts
import { assign, get, castArray, has } from "lodash";
var oneOf = (data, options, def) => {
  const arrOpts = castArray(options);
  for (const opt of arrOpts) {
    if (has(data, opt)) {
      return get(data, opt);
    }
  }
  return def;
};
var _localConfig = {};
var configProvider = {
  get: (path) => {
    const config = process.env;
    return get(_localConfig, path) || oneOf(config, [path, `EXPO_PUBLIC_${path}`]);
  },
  set: (config) => {
    assign(_localConfig, config);
  }
};
var config_default = configProvider;

// index.ts
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// builder.ts
import { get as get2 } from "lodash";
import { gql } from "@apollo/client";
var builder_default = {
  createDefinition: (definition) => {
    return definition;
  },
  getBaseQuery: (selections, defs) => {
    const baseQuery = get2(defs, "baseQuery") || "";
    const baseSelection = get2(defs, "baseSelection") || "";
    if (!baseQuery || !baseSelection) {
      console.warn(`getBaseQuery ${baseQuery}: check definition`);
      return null;
    }
    return gql`
        query ${baseQuery} ($id: String!) {
            ${baseQuery}(id: $id) {
                ${baseSelection}
                ${selections}
            }
        }
    `;
  },
  getFindQuery: (selections, defs) => {
    const findQuery = get2(defs, "GQL_ACTIONS.FIND") || "";
    const baseSelection = get2(defs, "baseSelection") || "";
    const name = get2(defs, "name") || "";
    if (!findQuery || !baseSelection || !name) {
      console.warn(`getFindQuery of ${name}: check definition of ${name}`);
      return null;
    }
    return gql`
            query ${findQuery}($input: Query${name}Input!) {
                ${findQuery}(input: $input) {
                    ${baseSelection}
                    ${selections}
                }
            }
        `;
  },
  getCreateQuery: () => {
  },
  getDeleteQuery: () => {
  },
  getDeactivateQuery: () => {
  },
  getUpdateQuery: (selections, defs) => {
    const updateQuery = get2(defs, "GQL_ACTIONS.FIND") || "";
    const baseSelection = get2(defs, "baseSelection") || "";
    const name = get2(defs, "name") || "";
    if (!updateQuery || !baseSelection || !name) {
      console.warn(`getUpdateQuery of ${name}: check definition of ${name}`);
      return null;
    }
    return gql`
            mutation ${updateQuery}($input: Update${name}Input!) {
                ${updateQuery}(input: $input) {
                    ${baseSelection}
                    ${selections}
                }
            }
        `;
  }
};

// index.ts
var httpLink = createHttpLink({
  uri: config_default.get("GRAPHQL_URL")
});
var authLink = setContext((_, { headers }) => {
  const token = config_default.get("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});
var client = new ApolloClient({
  link: authLink.concat(httpLink),
  credentials: "include",
  cache: new InMemoryCache()
});
var graph_default = client;
export {
  builder_default as builder,
  graph_default as default
};
