import api from "./api";

/*
|--------------------------------------------------------------------------
| Authentication API
|--------------------------------------------------------------------------
| Handles all customer authentication-related requests.
|
| Backend route:
|   /api/auth
|
| These functions are used by:
|   Login.jsx
|   Register.jsx
|   Profile.jsx
|   AuthContext.jsx
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
| Authenticates an existing customer.
|
| POST /api/auth/login
|
| Expected data:
| {
|   email: "customer@example.com",
|   password: "password123"
| }
|
| Expected response:
| {
|   token: "...",
|   user: { ... }
| }
|--------------------------------------------------------------------------
*/

export const login = (data) => {
  return api.post("/auth/login", data);
};

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
| Creates a new customer account.
|
| POST /api/auth/register
|
| Example data:
| {
|   first_name: "Abraham",
|   last_name: "Yitbarek",
|   email: "customer@example.com",
|   phone: "+251900000000",
|   password: "password123"
| }
|--------------------------------------------------------------------------
*/

export const register = (data) => {
  return api.post("/auth/register", data);
};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
| Changes the password of the currently authenticated customer.
|
| PUT /api/auth/change-password
|
| Example data:
| {
|   current_password: "oldPassword",
|   new_password: "newPassword"
| }
|--------------------------------------------------------------------------
*/

export const changePassword = (data) => {
  return api.put("/auth/change-password", data);
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
| Logout is primarily handled on the frontend by removing the
| stored authentication information.
|
| The backend does not necessarily need a logout request when
| using stateless JWT authentication.
|--------------------------------------------------------------------------
*/

export const logout = () => {
  localStorage.removeItem("fernwood_user");

  window.dispatchEvent(new Event("fernwood:auth-updated"));
};

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
| Sends a password-reset request.
|
| POST /api/auth/forgot-password
|
| Example data:
| {
|   email: "customer@example.com"
| }
|
| Only use this function after the corresponding backend route
| has been implemented.
|--------------------------------------------------------------------------
*/

export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
| Resets a customer's password using a reset token.
|
| POST /api/auth/reset-password
|
| Example data:
| {
|   token: "reset-token",
|   password: "newPassword"
| }
|
| Only use this function after the corresponding backend route
| has been implemented.
|--------------------------------------------------------------------------
*/

export const resetPassword = (data) => {
  return api.post("/auth/reset-password", data);
};

/*
|--------------------------------------------------------------------------
| Verify Email
|--------------------------------------------------------------------------
| Verifies a customer's email address.
|
| POST /api/auth/verify-email
|
| Example data:
| {
|   token: "verification-token"
| }
|
| Only use this function after the corresponding backend route
| has been implemented.
|--------------------------------------------------------------------------
*/

export const verifyEmail = (data) => {
  return api.post("/auth/verify-email", data);
};