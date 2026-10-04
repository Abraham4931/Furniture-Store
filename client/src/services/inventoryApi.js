import api from "./api";

/*
|--------------------------------------------------------------------------
| Inventory API
|--------------------------------------------------------------------------
| Handles inventory-related communication with:
| /api/inventory
|
| Mainly used by the admin side of Fernwood Furniture.
|--------------------------------------------------------------------------
*/

// Get inventory information for all products/variants
export const getInventory = () => {
  return api.get("/inventory");
};

// Get inventory information for a specific product
export const getProductInventory = (productId) => {
  return api.get(`/inventory/product/${productId}`);
};

// Get inventory information for a specific variant
export const getVariantInventory = (variantId) => {
  return api.get(`/inventory/variant/${variantId}`);
};

// Check whether a product/variant has enough stock
export const checkStock = (data) => {
  return api.post("/inventory/check-stock", data);
};

// Get the currently available quantity for a variant
export const getAvailableQuantity = (variantId) => {
  return api.get(`/inventory/variant/${variantId}/quantity`);
};

// Update inventory quantity
export const updateInventory = (variantId, data) => {
  return api.put(`/inventory/variant/${variantId}`, data);
};

// Get products/variants that are low in stock
export const getLowStock = () => {
  return api.get("/inventory/low-stock");
};

// Get products/variants that are out of stock
export const getOutOfStock = () => {
  return api.get("/inventory/out-of-stock");
};