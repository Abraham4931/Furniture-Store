import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { createOrder } from "../services/orderApi";

const SHIPPING_COST = 300;
const FREE_SHIPPING_THRESHOLD = 5000;

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    shippingAddress: "",
    shippingCity: "",
    shippingCountry: "Ethiopia",

    billingSameAsShipping: true,
    billingAddress: "",
    billingCity: "",
    billingCountry: "Ethiopia",

    paymentMethod: "cash_on_delivery",
  });

  const [validationErrors, setValidationErrors] = useState({});

  /*
   * -------------------------------------------------------
   * Authentication
   * -------------------------------------------------------
   */

  const storedUser = localStorage.getItem("fernwood_user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  /*
   * -------------------------------------------------------
   * Load cart
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });

      return;
    }

    const storedCart = localStorage.getItem("fernwood_cart");

    try {
      const parsedCart = storedCart
        ? JSON.parse(storedCart)
        : [];

      setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCartItems([]);
    }

    setLoading(false);
  }, []);

  /*
   * -------------------------------------------------------
   * Cart calculations
   * -------------------------------------------------------
   */

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;

      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : SHIPPING_COST;

  const total = subtotal + shippingCost;

  /*
   * -------------------------------------------------------
   * Form handling
   * -------------------------------------------------------
   */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    if (error) {
      setError("");
    }
  };

  /*
   * -------------------------------------------------------
   * Validation
   * -------------------------------------------------------
   */

  const validateForm = () => {
    const errors = {};

    if (!form.firstName.trim()) {
      errors.firstName = "First name is required.";
    }

    if (!form.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    if (!form.shippingAddress.trim()) {
      errors.shippingAddress = "Shipping address is required.";
    }

    if (!form.shippingCity.trim()) {
      errors.shippingCity = "City is required.";
    }

    if (!form.billingSameAsShipping) {
      if (!form.billingAddress.trim()) {
        errors.billingAddress = "Billing address is required.";
      }

      if (!form.billingCity.trim()) {
        errors.billingCity = "Billing city is required.";
      }
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /*
   * -------------------------------------------------------
   * Place order
   * -------------------------------------------------------
   */

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!validateForm()) {
      setError("Please correct the highlighted fields.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      /*
       * Build the order payload.
       *
       * Adjust the field names here if your backend
       * orderController expects different names.
       */
      const orderData = {
        customer: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },

        shipping_address: {
          address: form.shippingAddress.trim(),
          city: form.shippingCity.trim(),
          country: form.shippingCountry,
        },

        billing_address: form.billingSameAsShipping
          ? {
              address: form.shippingAddress.trim(),
              city: form.shippingCity.trim(),
              country: form.shippingCountry,
            }
          : {
              address: form.billingAddress.trim(),
              city: form.billingCity.trim(),
              country: form.billingCountry,
            },

        payment_method: form.paymentMethod,

        items: cartItems.map((item) => ({
          product_id: item.product_id || item.product?.id,
          variant_id: item.variant_id || item.variant?.id || null,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),

        subtotal,
        shipping_cost: shippingCost,
        total_amount: total,
      };

      const response = await createOrder(orderData);

      const createdOrder = response.data?.order || response.data;

      /*
       * Clear cart after successful order.
       */
      localStorage.removeItem("fernwood_cart");

      window.dispatchEvent(
        new CustomEvent("fernwood:cart-updated")
      );

      /*
       * Redirect to the newly created order when
       * the backend returns an order ID.
       */
      if (createdOrder?.id) {
        navigate(`/orders/${createdOrder.id}`);
      } else {
        navigate("/orders");
      }
    } catch (err) {
      console.error("Failed to place order:", err);

      setError(
        err.response?.data?.message ||
          "Failed to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  /*
   * -------------------------------------------------------
   * Loading
   * -------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader text="Preparing checkout..." />
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Empty cart
   * -------------------------------------------------------
   */

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F5EF]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <svg
              className="h-8 w-8 text-[#33473B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l2.4 11.4a2 2 0 001.95 1.6h8.9a2 2 0 001.95-1.6L22 7H6"
              />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#031008]">
            Your cart is empty
          </h1>

          <p className="mt-2 text-gray-500">
            Add some products to your cart before checking out.
          </p>

          <Link to="/products" className="mt-6">
            <Button size="large">
              Browse Products
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * Checkout UI
   * -------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#F8F5EF]">
      {/* Page header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wider text-[#33473B]">
            Fernwood Furniture
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#031008] sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-600">
            Complete your information to place your order.
          </p>
        </div>
      </section>

      <form
        onSubmit={handlePlaceOrder}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left side */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer information */}
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#031008]">
                  Customer Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your contact information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  error={validationErrors.firstName}
                  required
                  autoComplete="given-name"
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  error={validationErrors.lastName}
                  required
                  autoComplete="family-name"
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={validationErrors.email}
                  required
                  autoComplete="email"
                />

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  error={validationErrors.phone}
                  required
                  autoComplete="tel"
                />
              </div>
            </section>

            {/* Shipping address */}
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#031008]">
                  Shipping Address
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Where should we deliver your order?
                </p>
              </div>

              <div className="space-y-5">
                <Input
                  label="Address"
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  error={validationErrors.shippingAddress}
                  placeholder="Street address"
                  required
                  autoComplete="street-address"
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input
                    label="City"
                    name="shippingCity"
                    value={form.shippingCity}
                    onChange={handleChange}
                    error={validationErrors.shippingCity}
                    placeholder="City"
                    required
                    autoComplete="address-level2"
                  />

                  <Input
                    label="Country"
                    name="shippingCountry"
                    value={form.shippingCountry}
                    onChange={handleChange}
                    required
                    autoComplete="country-name"
                  />
                </div>
              </div>
            </section>

            {/* Billing address */}
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-[#031008]">
                  Billing Address
                </h2>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="billingSameAsShipping"
                  checked={form.billingSameAsShipping}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#031008] focus:ring-[#33473B]"
                />

                <span className="text-sm text-gray-700">
                  Billing address is the same as shipping address
                </span>
              </label>

              {!form.billingSameAsShipping && (
                <div className="mt-6 space-y-5">
                  <Input
                    label="Billing Address"
                    name="billingAddress"
                    value={form.billingAddress}
                    onChange={handleChange}
                    error={validationErrors.billingAddress}
                    required
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Input
                      label="City"
                      name="billingCity"
                      value={form.billingCity}
                      onChange={handleChange}
                      error={validationErrors.billingCity}
                      required
                    />

                    <Input
                      label="Country"
                      name="billingCountry"
                      value={form.billingCountry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#031008]">
                  Payment Method
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select how you would like to pay.
                </p>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                    form.paymentMethod === "cash_on_delivery"
                      ? "border-[#33473B] bg-[#F8F5EF]"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={
                      form.paymentMethod === "cash_on_delivery"
                    }
                    onChange={handleChange}
                    className="h-4 w-4 text-[#031008] focus:ring-[#33473B]"
                  />

                  <div>
                    <p className="font-medium text-[#031008]">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                    form.paymentMethod === "bank_transfer"
                      ? "border-[#33473B] bg-[#F8F5EF]"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={
                      form.paymentMethod === "bank_transfer"
                    }
                    onChange={handleChange}
                    className="h-4 w-4 text-[#031008] focus:ring-[#33473B]"
                  />

                  <div>
                    <p className="font-medium text-[#031008]">
                      Bank Transfer
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay using a bank transfer.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right side */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#031008]">
                Order Summary
              </h2>

              {/* Items */}
              <div className="mt-6 max-h-[360px] space-y-4 overflow-y-auto pr-1">
                {cartItems.map((item, index) => {
                  const itemPrice = Number(item.price) || 0;
                  const quantity = Number(item.quantity) || 0;

                  const itemName =
                    item.name ||
                    item.product?.name ||
                    "Product";

                  const image =
                    item.image_url ||
                    item.image ||
                    item.product?.image_url ||
                    "https://via.placeholder.com/100x100?text=Fernwood";

                  return (
                    <div
                      key={
                        item.id ||
                        item.variant_id ||
                        item.product_id ||
                        index
                      }
                      className="flex gap-3"
                    >
                      <img
                        src={image}
                        alt={itemName}
                        className="h-16 w-16 rounded-md object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-[#031008]">
                          {itemName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Quantity: {quantity}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#33473B]">
                          {(itemPrice * quantity).toLocaleString()}{" "}
                          ETB
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="my-6 border-t border-gray-200" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#031008]">
                    {subtotal.toLocaleString()} ETB
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-medium text-[#031008]">
                    {shippingCost === 0
                      ? "Free"
                      : `${shippingCost.toLocaleString()} ETB`}
                  </span>
                </div>

                {subtotal > 0 &&
                  subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-[#33473B]">
                      Add{" "}
                      {(
                        FREE_SHIPPING_THRESHOLD - subtotal
                      ).toLocaleString()}{" "}
                      ETB more to qualify for free shipping.
                    </p>
                  )}
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#031008]">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#031008]">
                  {total.toLocaleString()} ETB
                </span>
              </div>

              {/* Place order */}
              <Button
                type="submit"
                size="large"
                fullWidth
                loading={placingOrder}
                className="mt-6"
              >
                Place Order
              </Button>

              <Link
                to="/cart"
                className="mt-4 block text-center text-sm font-medium text-[#33473B] hover:underline"
              >
                ← Return to Cart
              </Link>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
};

export default Checkout;