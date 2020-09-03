import React, { forwardRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import AuthContext from "components/AuthContext";

function NavBar(_props, ref) {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed py-4 px-6 bg-white w-full z-50" ref={ref}>
      <div className="flex">
        <div className="flex"></div>
        <Button variant="secondary" onClick={handleLogout} className="ml-auto">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default forwardRef(NavBar);
