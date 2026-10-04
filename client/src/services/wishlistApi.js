import api from "./api";

/*
|--------------------------------------------------------------------------
| Wishlist API
|--------------------------------------------------------------------------
| Handles all customer wishlist-related API requests.
|
| Backend route:
|   /api/wishlist
|
| Used by:
|   Wishlist.jsx
|   ProductCard.jsx
|   ProductDetails.jsx
|   WishlistContext (if added later)
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get Wishlist
|--------------------------------------------------------------------------
| Gets all products saved by the authenticated customer.
|
| GET /api/wishlist
|--------------------------------------------------------------------------
*/

export const getWishlist = () => {
  return api.get("/wishlist");
};

/*
|--------------------------------------------------------------------------
| Add To Wishlist
|--------------------------------------------------------------------------
| Adds a product to the authenticated customer's wishlist.
|
| POST /api/wishlist
|
| Example data:
| {
|   product_id: 10
| }
|--------------------------------------------------------------------------
*/

export const addToWishlist = (productId) => {
  return api.post("/wishlist", {
    product_id: productId,
  });
};

/*
|--------------------------------------------------------------------------
| Remove From Wishlist
|--------------------------------------------------------------------------
| Removes a product from the authenticated customer's wishlist.
|
| DELETE /api/wishlist/:productId
|--------------------------------------------------------------------------
*/

export const removeFromWishlist = (productId) => {
  return api.delete(`/wishlist/${productId}`);
};