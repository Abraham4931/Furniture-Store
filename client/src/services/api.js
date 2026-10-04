import axios from "axios";

/*
|--------------------------------------------------------------------------
| API Client
|--------------------------------------------------------------------------
| This is the central Axios instance used by all API services.
|
| Example:
|   productApi.js
|        ↓
|      api.js
|        ↓
|   Express Backend
|        ↓
|    PostgreSQL
|--------------------------------------------------------------------------
*/

const api = axios.create({
  /*
   * Vite development setup:
   *
   * Frontend:
   *   http://localhost:5173
   *
   * Backend:
   *   http://localhost:5000
   *
   * If you configure a Vite proxy for /api, this can remain:
   *   /api
   *
   * Otherwise change it to:
   *   http://localhost:5000/api
   */
  baseURL: "/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  timeout: 15000,
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
| Automatically attaches the JWT token to authenticated requests.
|
| The login process stores:
|
| localStorage
|   └── fernwood_user
|       ├── token
|       └── user
|
| The token is then sent as:
|
| Authorization: Bearer <token>
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem("fernwood_user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        const token = parsedUser?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Failed to read authentication data:", error);

      /*
       * Remove invalid authentication data so that
       * future requests are not affected by corrupted JSON.
       */
      localStorage.removeItem("fernwood_user");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
| Handles common API responses and errors in one place.
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    /*
     * No response means the request may have failed because of:
     *
     * - Backend is offline
     * - Network problem
     * - CORS problem
     * - Request timeout
     */
    if (!error.response) {
      console.error("Network error:", error.message);

      return Promise.reject(error);
    }

    /*
     * 401 = Unauthorized
     *
     * Usually means:
     * - JWT expired
     * - JWT is invalid
     * - User is no longer authenticated
     */
    if (error.response.status === 401) {
      console.warn("Authentication required or token expired.");

      /*
       * We intentionally do not automatically redirect here.
       *
       * AuthContext will eventually be responsible for global
       * authentication state and logout handling.
       */
    }

    /*
     * 403 = Forbidden
     *
     * The user is authenticated but does not have permission
     * to perform the requested action.
     */
    if (error.response.status === 403) {
      console.warn("You do not have permission to perform this action.");
    }

    /*
     * 404 = Resource/route not found
     */
    if (error.response.status === 404) {
      console.warn("Requested resource was not found.");
    }

    /*
     * 500+ = Server error
     */
    if (error.response.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;