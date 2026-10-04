import api from "./api";

/*
|--------------------------------------------------------------------------
| Cart API
|--------------------------------------------------------------------------
| Handles all shopping-cart related API requests.
|
| Backend route:
|   /api/cart
|
| Used by:
|   Cart.jsx
|   CartContext.jsx
|   ProductDetails.jsx
|   Checkout.jsx
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
| Gets the authenticated customer's current shopping cart.
|
| GET /api/cart
|--------------------------------------------------------------------------
*/

export const getCart = () => {
  return api.get("/cart");
};

/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
| Adds a product/variant to the customer's cart.
|
| POST /api/cart
|
| Example data:
| {
|   product_id: 10,
|   variant_id: 5,
|   quantity: 1
| }
|--------------------------------------------------------------------------
*/

export const addToCart = (data) => {
  return api.post("/cart", data);
};

/*
|--------------------------------------------------------------------------
| Update Cart Item
|--------------------------------------------------------------------------
| Changes the quantity of an existing cart item.
|
| PUT /api/cart/:itemId
|
| Example:
| updateCartItem(15, { quantity: 3 })
|--------------------------------------------------------------------------
*/

export const updateCartItem = (itemId, data) => {
  return api.put(`/cart/${itemId}`, data);
};

/*
|--------------------------------------------------------------------------
| Remove Cart Item
|--------------------------------------------------------------------------
| Removes one item from the customer's cart.
|
| DELETE /api/cart/:itemId
|--------------------------------------------------------------------------
*/

export const removeCartItem = (itemId) => {
  return api.delete(`/cart/${itemId}`);
};

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
| Removes all items from the customer's cart.
|
| DELETE /api/cart
|--------------------------------------------------------------------------
*/

export const clearCart = () => {
  return api.delete("/cart");
};