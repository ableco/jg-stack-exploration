import React, { useContext, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "pages/LoginPage";
import HomePage from "pages/HomePage";
import AuthContext, { AuthContextProvider } from "components/AuthContext";
import NotFoundPage from "pages/NotFoundPage";
import { SWRConfig } from "swr";
import LoadingBox from "components/LoadingBox";
// import useGraphqlClient from "lib/useGraphqlClient";
import Background from "components/Background";
import Navbar from "components/NavBar";
import NewInvestmentPage from "pages/NewInvestmentPage";

function AuthenticatedApp() {
  return (
    <Background>
      <Navbar />
      <div style={{ height: "96px" }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-investment" element={<NewInvestmentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Background>
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

function denormalize(jsonApiObject) {
  if (Array.isArray(jsonApiObject)) {
    return jsonApiObject.map((object) => denormalize(object));
  } else {
    const { id, type, attributes } = jsonApiObject;
    return { id, type, ...attributes };
  }
}

const fetcher = async (url) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
  });
  const { data } = await response.json();
  return denormalize(data);
};

function AuthApp() {
  const { currentUser } = useContext(AuthContext);

  // const graphqlClient = useGraphqlClient();
  // const fetcher = useCallback((...args) => graphqlClient.request(...args), [
  //   graphqlClient,
  // ]);

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
