import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "pages/LoginPage";
import HomePage from "pages/HomePage";
import AuthContext, { AuthContextProvider } from "AuthContext";
import NotFoundPage from "pages/NotFoundPage";

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
  return currentUser ? <AuthenticatedApp /> : <UnauthenticatedApp />;
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
