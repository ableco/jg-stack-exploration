import React, {
  createContext,
  useState,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import Cookies from "js-cookie";

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

  const loadCurrentUser = useCallback(async () => {
    setLoading(true);
    const token = Cookies.get("AUTH_TOKEN");
    if (token) {
      const response = await fetch("/api/users/current", {
        method: "GET",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer token=${token}`,
        },
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
    setLoading(false);
  }, [authDispatch]);

  const logout = useCallback(async () => {
    const response = await fetch("/api/auth_tokens/current", {
      method: "DELETE",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer token=${authState.currentAuthToken}`,
      },
    });
    if (response.status === 204) {
      Cookies.remove("AUTH_TOKEN");
      authDispatch({ type: "UNAUTHENTICATED" });
    }
  }, [authState.currentAuthToken, authDispatch]);

  const login = useCallback(
    async (username, password) => {
      const response = await fetch("/api/auth_tokens", {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "authTokens",
            attributes: {
              username,
              password,
            },
          },
        }),
      });
      if (response.status === 201) {
        const {
          data: {
            attributes: { token, expires_at },
          },
        } = await response.json();

        Cookies.set("AUTH_TOKEN", token, { expires: new Date(expires_at) });
        await loadCurrentUser();
        return true;
      }
      return false;
    },
    [loadCurrentUser]
  );

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  return (
    <AuthContext.Provider value={{ ...authState, logout, login }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
