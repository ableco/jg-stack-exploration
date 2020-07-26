import React, { useContext, useCallback, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "pages/LoginPage";
import HomePage from "pages/HomePage";
import AuthContext, { AuthContextProvider } from "components/AuthContext";
import NotFoundPage from "pages/NotFoundPage";
import { SWRConfig } from "swr";
import LoadingBox from "components/LoadingBox";
import useGraphqlClient from "lib/useGraphqlClient";

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function AuthApp() {
  const { currentUser } = useContext(AuthContext);

  const graphqlClient = useGraphqlClient();
  const fetcher = useCallback((...args) => graphqlClient.request(...args), [
    graphqlClient,
  ]);

  return (
    <SWRConfig value={{ suspense: true, fetcher }}>
      <Suspense fallback={<LoadingBox />}>
        {currentUser ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Suspense>
    </SWRConfig>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AuthApp />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
