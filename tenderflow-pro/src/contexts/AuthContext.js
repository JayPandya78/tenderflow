import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  useEffect(() => {

    async function fetchUser() {

      const token = localStorage.getItem("token");

      if (!token) return;

      try {

        const res = await fetch("http://localhost:3000/auth/me", {
          headers: {
            Authorization: "Bearer " + token
          }
        });

        const data = await res.json();

        setUser(data);

      } catch (err) {

        console.log(err);

      }

    }

    fetchUser();

  }, []);

  const logout = () => {

    localStorage.removeItem("token");
    setUser(null);

  };

  return (

    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>

  );
}

export function useAuth() {
  return useContext(AuthContext);
}