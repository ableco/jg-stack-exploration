import React, {
  createContext,
  useState,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import Background from "components/Background";
import LoadingBox from "components/LoadingBox";
import useGraphqlClient, { gql } from "lib/useGraphqlClient";

const AuthContext = createContext({
  currentUser: null,
  currentAuthToken: null,
  login: () => {},
  logout: () => {},
});

const INITIAL_STATE = { currentUser: null, currentAuthToken: null };

function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "AUTHENTICATED":
      return {
        ...state,
        currentUser: action.currentUser,
        currentAuthToken: action.currentAuthToken,
      };
    case "UNAUTHENTICATED":
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}

const LOAD_CURRENT_USER_QUERY = gql`
  {
    currentUser {
      id
      username
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken {
        token
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation {
    logout(input: {}) {
      success
    }
  }
`;

function AuthContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authState, authDispatch] = useReducer(authReducer, INITIAL_STATE);
  const graphqlClient = useGraphqlClient();

  const loadCurrentUser = useCallback(
    async ({ updateLoader = true } = {}) => {
      if (updateLoader) {
        setLoading(true);
      }
      const token = Cookies.get("AUTH_TOKEN");
      if (token) {
        const { currentUser } = await graphqlClient.request(
          LOAD_CURRENT_USER_QUERY
        );

        if (currentUser) {
          authDispatch({
            type: "AUTHENTICATED",
            currentUser,
            currentAuthToken: token,
          });
        } else {
          Cookies.remove("AUTH_TOKEN");
          authDispatch({ type: "UNAUTHENTICATED" });
        }
      }
      if (updateLoader) {
        setLoading(false);
      }
    },
    [graphqlClient, authDispatch]
  );

  const logout = useCallback(async () => {
    const {
      logout: { success },
    } = await graphqlClient.request(LOGOUT_MUTATION);

    if (success) {
      Cookies.remove("AUTH_TOKEN");
      authDispatch({ type: "UNAUTHENTICATED" });
    }
  }, [graphqlClient, authDispatch]);

  const login = useCallback(
    async (username, password) => {
      try {
        const { login } = await graphqlClient.request(LOGIN_MUTATION, {
          username,
          password,
        });
        const { token, expiresAt } = login.authToken;

        Cookies.set("AUTH_TOKEN", token, { expires: new Date(expiresAt) });
        await loadCurrentUser({ updateLoader: false });
        return true;
      } catch (error) {
        if (error.message.startsWith("User not found")) {
          return false;
        } else {
          throw error;
        }
      }
    },
    [graphqlClient, loadCurrentUser]
  );

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  return (
    <AuthContext.Provider value={{ ...authState, logout, login }}>
      {loading ? (
        <Background>
          <LoadingBox />
        </Background>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
