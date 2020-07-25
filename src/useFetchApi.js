import { useCallback, useContext } from "react";
import AuthContext from "AuthContext";

function useFetchApi() {
  const { currentAuthToken } = useContext(AuthContext);

  return useCallback(
    (url, options = {}) => {
      let returnResponse = false;
      const fetchOptions = {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
        ...options,
      };

      if (fetchOptions.returnResponse) {
        returnResponse = true;
        delete fetchOptions.returnResponse;
      }

      if (currentAuthToken) {
        fetchOptions.headers[
          "Authorization"
        ] = `Bearer token=${currentAuthToken}`;
      }

      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      return fetch(url, fetchOptions).then((response) =>
        returnResponse ? response : response.json()
      );
    },
    [currentAuthToken]
  );
}

export default useFetchApi;
