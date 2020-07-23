import React, {
  useRef,
  forwardRef,
  useState,
  useContext,
  useCallback,
} from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import AuthContext from "../../AuthContext";

function LabelText({ children }) {
  return <span className="inline-block w-1/3">{children}</span>;
}

function Field({ label, children, className = "", ...otherProps }) {
  return (
    <label className={clsx("mb-4", className)} {...otherProps}>
      {label && <LabelText>{label}</LabelText>}
      {children}
    </label>
  );
}

const TextInput = forwardRef(({ className = "", ...otherProps }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "inline-block px-2 py-1 outline-none w-2/3 rounded-md text-black border-2 border-solid border-gray-500 focus:border-black",
        className
      )}
      {...otherProps}
    />
  );
});

function LoginPage() {
  const navigate = useNavigate();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [showLoginError, setShowLoginError] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const username = usernameRef.current.value;
      const password = passwordRef.current.value;

      const success = await login(username, password);

      if (success) {
        navigate("/");
      } else {
        setShowLoginError(true);
      }
    },
    [login, navigate]
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-800">
      <h1 className="font-sans text-4xl text-gray-100">Log In</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 pb-8 rounded-md mt-8 flex flex-col"
      >
        {showLoginError && (
          <div className="text-red-800 mb-4 p-2">
            <p className="w-64 text-center">
              Your username or password is wrong. <strong>Try again!</strong>
            </p>
          </div>
        )}

        <Field label="Username:">
          <TextInput type="text" ref={usernameRef} />
        </Field>
        <Field label="Password:">
          <TextInput type="password" ref={passwordRef} />
        </Field>
        <Button type="submit">Enter</Button>
      </form>
    </div>
  );
}

export default LoginPage;
