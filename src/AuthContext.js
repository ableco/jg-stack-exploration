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
import useFetchApi from "useFetchApi";

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

function AuthContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authState, authDispatch] = useReducer(authReducer, INITIAL_STATE);
  const fetchApi = useFetchApi();

  const loadCurrentUser = useCallback(
    async ({ updateLoader = true } = {}) => {
      if (updateLoader) {
        setLoading(true);
      }
      const token = Cookies.get("AUTH_TOKEN");
      if (token) {
        const response = await fetchApi("/api/users/current", {
          returnResponse: true,
        });
        if (response.status === 401) {
          Cookies.remove("AUTH_TOKEN");
          authDispatch({ type: "UNAUTHENTICATED" });
        } else {
          const {
            data: { id, attributes },
          } = await response.json();

          authDispatch({
            type: "AUTHENTICATED",
            currentUser: { id, ...attributes },
            currentAuthToken: token,
          });
        }
      }
      if (updateLoader) {
        setLoading(false);
      }
    },
    [fetchApi, authDispatch]
  );

  const logout = useCallback(async () => {
    const response = await fetchApi("/api/auth_tokens/current", {
      method: "DELETE",
      returnResponse: true,
    });
    if (response.status === 204) {
      Cookies.remove("AUTH_TOKEN");
      authDispatch({ type: "UNAUTHENTICATED" });
    }
  }, [fetchApi, authDispatch]);

  const login = useCallback(
    async (username, password) => {
      const response = await fetchApi("/api/auth_tokens", {
        method: "POST",
        body: {
          data: {
            type: "authTokens",
            attributes: {
              username,
              password,
            },
          },
        },
        returnResponse: true,
      });
      if (response.status === 201) {
        const {
          data: {
            attributes: { token, expires_at },
          },
        } = await response.json();

        Cookies.set("AUTH_TOKEN", token, { expires: new Date(expires_at) });
        await loadCurrentUser({ updateLoader: false });
        return true;
      }
      return false;
    },
    [fetchApi, loadCurrentUser]
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
