import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Background from "components/Background";
import Section from "components/Section";
import AuthContext from "components/AuthContext";

function NotFoundPage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Background>
      <Section>
        <h1 className="text-4xl mb-4">Page not found</h1>
        <Link to="/" className="text-indigo-600">
          <strong>{currentUser ? <>Go home?</> : <>Log in?</>}</strong>
        </Link>
      </Section>
    </Background>
  );
}

export default NotFoundPage;
