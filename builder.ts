import { get } from "lodash";
import { gql, DocumentNode } from "@apollo/client";
export interface IDefinition {
  name: string;
  baseQuery: string;
  baseSelection: string;
  GQL_ACTIONS: {
    FIND: string;
    CREATE: string;
    UPDATE: string;
    DELETE: string;
  };
}

export default {
  createDefinition: (definition: IDefinition) => {
    return definition;
  },
  getBaseQuery: (selections: string, defs: object): DocumentNode | null => {
    const baseQuery = get(defs, "baseQuery") || "";
    const baseSelection = get(defs, "baseSelection") || "";
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
  getFindQuery: (selections: string, defs: object): DocumentNode | null => {
    const findQuery = get(defs, "GQL_ACTIONS.FIND") || "";
    const baseSelection = get(defs, "baseSelection") || "";
    const name = get(defs, "name") || "";

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
  getCreateQuery: () => {},
  getDeleteQuery: () => {},
  getDeactivateQuery: () => {},
  getUpdateQuery: (selections: string, defs: object): DocumentNode | null => {
    const updateQuery = get(defs, "GQL_ACTIONS.FIND") || "";
    const baseSelection = get(defs, "baseSelection") || "";
    const name = get(defs, "name") || "";
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
  },
};
