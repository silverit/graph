"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var graph_exports = {};
__export(graph_exports, {
  builder: () => builder_default,
  default: () => graph_default
});
module.exports = __toCommonJS(graph_exports);

// config.ts
var import_lodash = require("lodash");
var oneOf = (data, options, def) => {
  const arrOpts = (0, import_lodash.castArray)(options);
  for (const opt of arrOpts) {
    if ((0, import_lodash.has)(data, opt)) {
      return (0, import_lodash.get)(data, opt);
    }
  }
  return def;
};
var _localConfig = {};
var configProvider = {
  get: (path) => {
    const config = process.env;
    return (0, import_lodash.get)(_localConfig, path) || oneOf(config, [path, `EXPO_PUBLIC_${path}`]);
  },
  set: (config) => {
    (0, import_lodash.assign)(_localConfig, config);
  }
};
var config_default = configProvider;

// index.ts
var import_client2 = require("@apollo/client");
var import_context = require("@apollo/client/link/context");

// builder.ts
var import_lodash2 = require("lodash");
var import_client = require("@apollo/client");
var builder_default = {
  createDefinition: (definition) => {
    return definition;
  },
  getBaseQuery: (selections, defs) => {
    const baseQuery = (0, import_lodash2.get)(defs, "baseQuery") || "";
    const baseSelection = (0, import_lodash2.get)(defs, "baseSelection") || "";
    if (!baseQuery || !baseSelection) {
      console.warn(`getBaseQuery ${baseQuery}: check definition`);
      return null;
    }
    return import_client.gql`
        query ${baseQuery} ($id: String!) {
            ${baseQuery}(id: $id) {
                ${baseSelection}
                ${selections}
            }
        }
    `;
  },
  getFindQuery: (selections, defs) => {
    const findQuery = (0, import_lodash2.get)(defs, "GQL_ACTIONS.FIND") || "";
    const baseSelection = (0, import_lodash2.get)(defs, "baseSelection") || "";
    const name = (0, import_lodash2.get)(defs, "name") || "";
    if (!findQuery || !baseSelection || !name) {
      console.warn(`getFindQuery of ${name}: check definition of ${name}`);
      return null;
    }
    return import_client.gql`
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
    const updateQuery = (0, import_lodash2.get)(defs, "GQL_ACTIONS.FIND") || "";
    const baseSelection = (0, import_lodash2.get)(defs, "baseSelection") || "";
    const name = (0, import_lodash2.get)(defs, "name") || "";
    if (!updateQuery || !baseSelection || !name) {
      console.warn(`getUpdateQuery of ${name}: check definition of ${name}`);
      return null;
    }
    return import_client.gql`
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
var httpLink = (0, import_client2.createHttpLink)({
  uri: config_default.get("GRAPHQL_URL")
});
var authLink = (0, import_context.setContext)((_, { headers }) => {
  const token = config_default.get("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});
var client = new import_client2.ApolloClient({
  link: authLink.concat(httpLink),
  credentials: "include",
  cache: new import_client2.InMemoryCache()
});
var graph_default = client;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder
});
