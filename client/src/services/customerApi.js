import api from "./api";

/*
|--------------------------------------------------------------------------
| Customer API
|--------------------------------------------------------------------------
| Handles customer account and address-related API requests.
|
| Backend route:
|   /api/customer
|
| Used mainly by:
|   Profile.jsx
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get Customer Profile
|--------------------------------------------------------------------------
| Gets the currently authenticated customer's profile information.
|
| GET /api/customer/profile
|--------------------------------------------------------------------------
*/

export const getCustomerProfile = () => {
  return api.get("/customer/profile");
};

/*
|--------------------------------------------------------------------------
| Update Customer Profile
|--------------------------------------------------------------------------
| Updates the currently authenticated customer's profile.
|
| PUT /api/customer/profile
|
| Example data:
|
| {
|   first_name: "Abraham",
|   last_name: "Yitbarek",
|   email: "customer@example.com",
|   phone: "+251900000000"
| }
|--------------------------------------------------------------------------
*/

export const updateCustomerProfile = (data) => {
  return api.put("/customer/profile", data);
};

/*
|--------------------------------------------------------------------------
| Get Customer Addresses
|--------------------------------------------------------------------------
| Gets all saved addresses belonging to the authenticated customer.
|
| GET /api/customer/addresses
|--------------------------------------------------------------------------
*/

export const getCustomerAddresses = () => {
  return api.get("/customer/addresses");
};

/*
|--------------------------------------------------------------------------
| Add Customer Address
|--------------------------------------------------------------------------
| Adds a new address for the authenticated customer.
|
| POST /api/customer/addresses
|
| Example data:
|
| {
|   address: "Bole Road",
|   city: "Addis Ababa",
|   country: "Ethiopia"
| }
|--------------------------------------------------------------------------
*/

export const addCustomerAddress = (data) => {
  return api.post("/customer/addresses", data);
};

/*
|--------------------------------------------------------------------------
| Update Customer Address
|--------------------------------------------------------------------------
| Updates one of the customer's saved addresses.
|
| PUT /api/customer/addresses/:id
|--------------------------------------------------------------------------
*/

export const updateCustomerAddress = (id, data) => {
  return api.put(`/customer/addresses/${id}`, data);
};

/*
|--------------------------------------------------------------------------
| Delete Customer Address
|--------------------------------------------------------------------------
| Deletes one of the customer's saved addresses.
|
| DELETE /api/customer/addresses/:id
|--------------------------------------------------------------------------
*/

export const deleteCustomerAddress = (id) => {
  return api.delete(`/customer/addresses/${id}`);
};