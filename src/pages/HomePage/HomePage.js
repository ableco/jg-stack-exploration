import React, { useContext } from "react";
import Button from "components/Button";
import AuthContext from "AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <div>Home Page</div>
      <Button variant="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}

export default HomePage;
