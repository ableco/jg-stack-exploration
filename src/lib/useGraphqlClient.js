import { useContext, useMemo } from "react";
import { GraphQLClient } from "graphql-request";
import AuthContext from "components/AuthContext";

function gql(strings, ...values) {
  return strings
    .reduce((previous, current, i) => {
      return previous + current + (i in values ? values[i] : "");
    }, "")
    .trim();
}

function useGraphqlClient() {
  const { currentAuthToken } = useContext(AuthContext);

  return useMemo(() => {
    const headers = {};

    if (currentAuthToken) {
      headers["Authorization"] = `Bearer token=${currentAuthToken}`;
    }

    return new GraphQLClient("/graphql", { headers });
  }, [currentAuthToken]);
}

export default useGraphqlClient;
export { gql };
