import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "fernwood_cart";

/*
|--------------------------------------------------------------------------
| Cart Helpers
|--------------------------------------------------------------------------
*/

const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Failed to load cart:", error);

    localStorage.removeItem(CART_STORAGE_KEY);

    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
};

/*
|--------------------------------------------------------------------------
| Cart Provider
|--------------------------------------------------------------------------
*/

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
   * Load cart when the application starts.
   */
  useEffect(() => {
    const storedCart = loadCartFromStorage();

    setCartItems(storedCart);
    setLoading(false);
  }, []);

  /*
   * Save cart whenever cartItems changes.
   */
  useEffect(() => {
    if (!loading) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, loading]);

  /*
   |--------------------------------------------------------------------------
   | Add To Cart
   |--------------------------------------------------------------------------
   */

  const addToCart = (product, quantity = 1, variant = null) => {
    if (!product) {
      return;
    }

    const productId = product.id;
    const variantId = variant?.id || product.variant_id || null;

    /*
     * A product and its variant should be treated as separate cart items.
     *
     * Example:
     * Sofa - Black
     * Sofa - Brown
     *
     * These should not become one cart item.
     */
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        String(item.product_id) === String(productId) &&
        String(item.variant_id || "") === String(variantId || "")
    );

    setCartItems((currentItems) => {
      if (existingItemIndex !== -1) {
        return currentItems.map((item, index) => {
          if (index !== existingItemIndex) {
            return item;
          }

          return {
            ...item,
            quantity: Number(item.quantity || 0) + Number(quantity || 1),
          };
        });
      }

      const price =
        variant?.discount_price ??
        variant?.price ??
        product.discount_price ??
        product.price ??
        0;

      const newItem = {
        id: `${productId}-${variantId || "default"}-${Date.now()}`,

        product_id: productId,

        variant_id: variantId,

        name:
          product.name ||
          product.title ||
          variant?.name ||
          "Unnamed Product",

        variant_name: variant?.name || null,

        sku: variant?.sku || product.sku || null,

        price: Number(price),

        quantity: Number(quantity) || 1,

        image:
          variant?.image_url ||
          product.image_url ||
          product.image ||
          product.images?.[0]?.image_url ||
          product.images?.[0]?.url ||
          null,

        color: variant?.color || product.color || null,

        material: variant?.material || product.material || null,

        size: variant?.size || product.size || null,

        width: variant?.width || product.width || null,

        height: variant?.height || product.height || null,

        depth: variant?.depth || product.depth || null,

        dimension_unit:
          variant?.dimension_unit ||
          product.dimension_unit ||
          null,
      };

      return [...currentItems, newItem];
    });

    window.dispatchEvent(new Event("fernwood:cart-updated"));
  };

  /*
   |--------------------------------------------------------------------------
   | Update Quantity
   |--------------------------------------------------------------------------
   */

  const updateQuantity = (itemId, quantity) => {
    const newQuantity = Number(quantity);

    if (!Number.isFinite(newQuantity)) {
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        String(item.id) === String(itemId)
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );

    window.dispatchEvent(new Event("fernwood:cart-updated"));
  };

  /*
   |--------------------------------------------------------------------------
   | Increase Quantity
   |--------------------------------------------------------------------------
   */

  const increaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        String(item.id) === String(itemId)
          ? {
              ...item,
              quantity: Number(item.quantity || 0) + 1,
            }
          : item
      )
    );

    window.dispatchEvent(new Event("fernwood:cart-updated"));
  };

  /*
   |--------------------------------------------------------------------------
   | Decrease Quantity
   |--------------------------------------------------------------------------
   */

  const decreaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          String(item.id) === String(itemId)
            ? {
                ...item,
                quantity: Number(item.quantity || 0) - 1,
              }
            : item
        )
        .filter((item) => Number(item.quantity) > 0)
    );

    window.dispatchEvent(new Event("fernwood:cart-updated"));
  };

  /*
   |--------------------------------------------------------------------------
   | Remove Item
   |--------------------------------------------------------------------------
   */

  const removeFromCart = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => String(item.id) !== String(itemId)
      )
    );

    window.dispatchEvent(new Event("fernwood:cart-updated"));
  };

  /*
   |--------------------------------------------------------------------------
   | Clear Cart
   |--------------------------------------------------------------------------
   */

  const clearCart = () => {
    setCartItems([]);

    localStorage.removeItem(CART_STORAGE_KEY);

    window.dispatchEvent(new Event("fernwood:cart-updated"));
  };

  /*
   |--------------------------------------------------------------------------
   | Cart Calculations
   |--------------------------------------------------------------------------
   */

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  /*
   * Fernwood shipping rule currently used by Cart/Checkout:
   *
   * Free shipping when subtotal >= 5000
   * Otherwise 300
   */
  const shippingCost = useMemo(() => {
    if (cartItems.length === 0) {
      return 0;
    }

    return subtotal >= 5000 ? 0 : 300;
  }, [cartItems.length, subtotal]);

  const total = useMemo(() => {
    return subtotal + shippingCost;
  }, [subtotal, shippingCost]);

  /*
   |--------------------------------------------------------------------------
   | Context Value
   |--------------------------------------------------------------------------
   */

  const value = {
    cartItems,

    cartCount,

    subtotal,

    shippingCost,

    total,

    loading,

    addToCart,

    updateQuantity,

    increaseQuantity,

    decreaseQuantity,

    removeFromCart,

    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/*
|--------------------------------------------------------------------------
| useCart Hook
|--------------------------------------------------------------------------
*/

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider."
    );
  }

  return context;
};

export default CartContext;