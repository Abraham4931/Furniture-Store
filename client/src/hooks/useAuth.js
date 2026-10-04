import { useAuth as useAuthContext } from "../context/AuthContext";

/*
|--------------------------------------------------------------------------
| useAuth
|--------------------------------------------------------------------------
| Provides a simple way for components to access authentication state.
|
| Usage:
|
| const {
|   user,
|   token,
|   isAuthenticated,
|   loading,
|   login,
|   register,
|   logout,
|   updateUser,
|   changePassword,
| } = useAuth();
|--------------------------------------------------------------------------
*/

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;