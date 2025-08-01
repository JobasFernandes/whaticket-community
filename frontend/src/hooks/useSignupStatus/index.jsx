import { useState, useEffect } from "react";
import api from "../../services/api";

export const useSignupStatus = () => {
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSignupStatus = async () => {
      try {
        const { data } = await api.get("/auth/signup/status");
        setSignupEnabled(data.enabled);
      } catch (err) {
        console.error("Erro ao verificar status do registro:", err);
        setSignupEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkSignupStatus();
  }, []);

  return { signupEnabled, loading };
};
