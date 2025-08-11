// userAuth.js
import { useState, useEffect } from "react";

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      // Decode token to get user info if needed
      try {
        const { id, username, exp } = JSON.parse(atob(token.split('.')[1]));
        setUser({ id, username, exp });
      } catch (error) {
        console.error("Invalid token");
        logout();
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/signin"; // or use navigate() if in a component
  };

  return { token, user, logout };
};

export default useAuth;
