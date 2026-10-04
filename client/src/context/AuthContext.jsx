import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Load authentication data when the application starts.
   */
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = localStorage.getItem("fernwood_user");

        if (!storedUser) {
          setUser(null);
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.token && parsedUser?.user) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("fernwood_user");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load authentication data:", error);

        localStorage.removeItem("fernwood_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  /*
   * Login
   *
   * The backend is expected to return:
   * {
   *   token,
   *   user
   * }
   */
  const login = async (credentials) => {
    const response = await authApi.login(credentials);

    const { token, user: authenticatedUser } = response.data;

    if (!token || !authenticatedUser) {
      throw new Error("Invalid login response from server.");
    }

    const authData = {
      token,
      user: authenticatedUser,
    };

    localStorage.setItem("fernwood_user", JSON.stringify(authData));

    setUser(authData);

    window.dispatchEvent(new Event("fernwood:auth-updated"));

    return response;
  };

  /*
   * Registration
   *
   * Some backends automatically log the user in after registration.
   * Others return only a success response.
   */
  const register = async (registrationData) => {
    const response = await authApi.register(registrationData);

    const { token, user: registeredUser } = response.data || {};

    if (token && registeredUser) {
      const authData = {
        token,
        user: registeredUser,
      };

      localStorage.setItem("fernwood_user", JSON.stringify(authData));

      setUser(authData);

      window.dispatchEvent(new Event("fernwood:auth-updated"));
    }

    return response;
  };

  /*
   * Logout
   */
  const logout = () => {
    authApi.logout();

    setUser(null);

    window.dispatchEvent(new Event("fernwood:auth-updated"));
  };

  /*
   * Update the user stored in the authentication state.
   *
   * Useful after Profile.jsx updates account information.
   */
  const updateUser = (updatedUser) => {
    if (!user) return;

    const updatedAuthData = {
      ...user,
      user: {
        ...user.user,
        ...updatedUser,
      },
    };

    localStorage.setItem(
      "fernwood_user",
      JSON.stringify(updatedAuthData)
    );

    setUser(updatedAuthData);

    window.dispatchEvent(new Event("fernwood:auth-updated"));
  };

  /*
   * Change password
   */
  const changePassword = async (passwordData) => {
    return authApi.changePassword(passwordData);
  };

  /*
   * Derived authentication state.
   */
  const isAuthenticated = Boolean(user?.token && user?.user);

  const value = {
    user: user?.user || null,
    token: user?.token || null,
    isAuthenticated,
    loading,

    login,
    register,
    logout,
    updateUser,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/*
 * Custom hook for accessing authentication state.
 *
 * Usage:
 *
 * const {
 *   user,
 *   isAuthenticated,
 *   login,
 *   logout
 * } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
};

export default AuthContext;