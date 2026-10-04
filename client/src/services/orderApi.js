import api from "./api";

/*
|--------------------------------------------------------------------------
| Order API
|--------------------------------------------------------------------------
| Handles all customer order-related API requests.
|
| Backend route:
|   /api/orders
|
| Used by:
|   Checkout.jsx
|   Orders.jsx
|   OrderDetails.jsx
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
| Creates a new order for the authenticated customer.
|
| POST /api/orders
|
| Example data:
|
| {
|   customer: {
|     first_name: "Abraham",
|     last_name: "Yitbarek",
|     email: "customer@example.com",
|     phone: "+251900000000"
|   },
|
|   shipping_address: {
|     address: "Bole Road",
|     city: "Addis Ababa",
|     country: "Ethiopia"
|   },
|
|   billing_address: {
|     address: "Bole Road",
|     city: "Addis Ababa",
|     country: "Ethiopia"
|   },
|
|   payment_method: "cash_on_delivery",
|
|   items: [
|     {
|       product_id: 10,
|       variant_id: 5,
|       quantity: 1,
|       price: 2500
|     }
|   ],
|
|   subtotal: 2500,
|   shipping_cost: 300,
|   total_amount: 2800
| }
|--------------------------------------------------------------------------
*/

export const createOrder = (orderData) => {
  return api.post("/orders", orderData);
};

/*
|--------------------------------------------------------------------------
| Get Customer Orders
|--------------------------------------------------------------------------
| Gets all orders belonging to the authenticated customer.
|
| GET /api/orders
|--------------------------------------------------------------------------
*/

export const getOrders = () => {
  return api.get("/orders");
};

/*
|--------------------------------------------------------------------------
| Get Order By ID
|--------------------------------------------------------------------------
| Gets details for one specific order.
|
| GET /api/orders/:id
|--------------------------------------------------------------------------
*/

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};