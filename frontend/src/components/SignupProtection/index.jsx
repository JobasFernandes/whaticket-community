import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSignupStatus } from "../../hooks/useSignupStatus";

const SignupProtection = ({ children }) => {
  const { signupEnabled, loading } = useSignupStatus();
  const history = useHistory();

  useEffect(() => {
    if (!loading && !signupEnabled) {
      history.replace("/login");
    }
  }, [signupEnabled, loading, history]);

  if (loading || !signupEnabled) {
    return null;
  }

  return children;
};

export default SignupProtection;
