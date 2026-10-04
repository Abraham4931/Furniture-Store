import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getOrderById } from "../services/orderApi";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * -------------------------------------------------------
   * Authentication
   * -------------------------------------------------------
   */

  const storedUser = localStorage.getItem("fernwood_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  /*
   * -------------------------------------------------------
   * Fetch order
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/orders/${id}`,
        },
      });

      return;
    }

    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrderById(id);

      const data = response.data;

      setOrder(data.order || data);
    } catch (err) {
      console.error("Failed to fetch order:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load this order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * -------------------------------------------------------
   * Helpers
   * -------------------------------------------------------
   */

  const getOrderNumber = () => {
    return (
      order?.order_number ||
      order?.orderNumber ||
      `#${order?.id}`
    );
  };

  const getOrderDate = () => {
    const date =
      order?.created_at ||
      order?.createdAt ||
      order?.order_date ||
      order?.date;

    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatus = () => {
    return (
      order?.status ||
      order?.order_status ||
      "Processing"
    );
  };

  const getStatusStyle = () => {
    const status = String(getStatus()).toLowerCase();

    if (
      status === "delivered" ||
      status === "completed"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      status === "cancelled" ||
      status === "canceled" ||
      status === "failed"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      status === "shipped" ||
      status === "out_for_delivery"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const getItems = () => {
    if (Array.isArray(order?.items)) {
      return order.items;
    }

    if (Array.isArray(order?.order_items)) {
      return order.order_items;
    }

    return [];
  };

  const getProduct = (item) => {
    return item.product || item;
  };

  const getItemName = (item) => {
    const product = getProduct(item);

    return (
      product.name ||
      item.product_name ||
      item.name ||
      "Product"
    );
  };

  const getItemImage = (item) => {
    const product = getProduct(item);

    return (
      product.image_url ||
      product.image ||
      item.image_url ||
      item.image ||
      "https://via.placeholder.com/160x160?text=Fernwood"
    );
  };

  const getItemPrice = (item) => {
    return Number(
      item.price ??
        item.unit_price ??
        item.product_price ??
        0
    );
  };

  const getItemQuantity = (item) => {
    return Number(item.quantity || 1);
  };

  const getItemTotal = (item) => {
    return getItemPrice(item) * getItemQuantity(item);
  };

  const getSubtotal = () => {
    if (order?.subtotal !== undefined) {
      return Number(order.subtotal);
    }

    return getItems().reduce(
      (total, item) => total + getItemTotal(item),
      0
    );
  };

  const getShippingCost = () => {
    return Number(
      order?.shipping_cost ??
        order?.shipping ??
        order?.shipping_amount ??
        0
    );
  };

  const getTotal = () => {
    return Number(
      order?.total_amount ??
        order?.total ??
        order?.grand_total ??
        getSubtotal() + getShippingCost()
    );
  };

  const formatPaymentMethod = () => {
    const method =
      order?.payment_method ||
      order?.paymentMethod ||
      "Not specified";

    return String(method)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getShippingAddress = () => {
    return (
      order?.shipping_address ||
      order?.shippingAddress ||
      {}
    );
  };

  const getBillingAddress = () => {
    return (
      order?.billing_address ||
      order?.billingAddress ||
      {}
    );
  };

  const formatAddress = (address) => {
    if (!address) {
      return "Address not available";
    }

    if (typeof address === "string") {
      return address;
    }

    return [
      address.address,
      address.street,
      address.city,
      address.state,
      address.country,
      address.postal_code,
    ]
      .filter(Boolean)
      .join(", ");
  };

  /*
   * -------------------------------------------------------
   * Loading
   * -------------------------------------------------------
   */

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader text="Loading order details..." />
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Error / order not found
   * -------------------------------------------------------
   */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#F8F5EF]">
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
          <ErrorMessage
            message={
              error || "The requested order could not be found."
            }
            onRetry={fetchOrder}
          />

          <Link to="/orders" className="mt-6">
            <Button variant="outline">
              Back to My Orders
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const items = getItems();
  const shippingAddress = getShippingAddress();
  const billingAddress = getBillingAddress();

  return (
    <main className="min-h-screen bg-[#F8F5EF]">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/orders"
            className="text-sm font-medium text-[#33473B] hover:underline"
          >
            ← Back to My Orders
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Order Details
              </p>

              <h1 className="mt-1 text-3xl font-bold text-[#031008]">
                {getOrderNumber()}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Placed on {getOrderDate()}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusStyle()}`}
            >
              {String(getStatus()).replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Products */}
            <section className="rounded-lg bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-xl font-semibold text-[#031008]">
                  Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {items.length}{" "}
                  {items.length === 1 ? "product" : "products"} in
                  this order
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {items.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-gray-500">
                    No product information is available.
                  </div>
                ) : (
                  items.map((item, index) => {
                    const product = getProduct(item);
                    const quantity = getItemQuantity(item);
                    const price = getItemPrice(item);

                    return (
                      <div
                        key={item.id || item.product_id || index}
                        className="flex gap-4 px-6 py-5"
                      >
                        {/* Image */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-[#F8F5EF]">
                          <img
                            src={getItemImage(item)}
                            alt={getItemName(item)}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Product information */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-[#031008]">
                            {getItemName(item)}
                          </h3>

                          {/* Variant */}
                          <div className="mt-2 space-y-1 text-sm text-gray-500">
                            {(item.variant?.name ||
                              item.variant_name ||
                              item.variant?.sku ||
                              item.sku) && (
                              <p>
                                Variant:{" "}
                                <span className="text-gray-700">
                                  {item.variant?.name ||
                                    item.variant_name ||
                                    item.variant?.sku ||
                                    item.sku}
                                </span>
                              </p>
                            )}

                            {(item.variant?.color ||
                              item.color) && (
                              <p>
                                Color:{" "}
                                <span className="text-gray-700">
                                  {item.variant?.color ||
                                    item.color}
                                </span>
                              </p>
                            )}

                            {(item.variant?.material ||
                              item.material) && (
                              <p>
                                Material:{" "}
                                <span className="text-gray-700">
                                  {item.variant?.material ||
                                    item.material}
                                </span>
                              </p>
                            )}

                            {(item.variant?.size ||
                              item.size) && (
                              <p>
                                Size:{" "}
                                <span className="text-gray-700">
                                  {item.variant?.size ||
                                    item.size}
                                </span>
                              </p>
                            )}

                            <p>
                              Quantity:{" "}
                              <span className="font-medium text-gray-700">
                                {quantity}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-end justify-between">
                          <p className="font-semibold text-[#031008]">
                            {getItemTotal(item).toLocaleString()} ETB
                          </p>

                          <p className="text-xs text-gray-500">
                            {price.toLocaleString()} ETB ×{" "}
                            {quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Shipping address */}
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#031008]">
                Shipping Address
              </h2>

              <div className="mt-5 rounded-md bg-[#F8F5EF] p-4">
                {order.customer && (
                  <p className="font-medium text-[#031008]">
                    {order.customer.first_name ||
                      order.customer.firstName ||
                      ""}{" "}
                    {order.customer.last_name ||
                      order.customer.lastName ||
                      ""}
                  </p>
                )}

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {formatAddress(shippingAddress)}
                </p>

                {(order.customer?.phone ||
                  order.phone ||
                  order.customer_phone) && (
                  <p className="mt-2 text-sm text-gray-600">
                    Phone:{" "}
                    {order.customer?.phone ||
                      order.phone ||
                      order.customer_phone}
                  </p>
                )}
              </div>
            </section>

            {/* Billing address */}
            {Object.keys(billingAddress).length > 0 && (
              <section className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#031008]">
                  Billing Address
                </h2>

                <div className="mt-5 rounded-md bg-[#F8F5EF] p-4">
                  <p className="text-sm leading-6 text-gray-600">
                    {formatAddress(billingAddress)}
                  </p>
                </div>
              </section>
            )}

            {/* Payment information */}
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#031008]">
                Payment Information
              </h2>

              <div className="mt-5 flex items-center justify-between rounded-md bg-[#F8F5EF] p-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Payment Method
                  </p>

                  <p className="mt-1 font-medium text-[#031008]">
                    {formatPaymentMethod()}
                  </p>
                </div>

                {order.payment_status && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#33473B]">
                    {String(order.payment_status).replace(
                      /_/g,
                      " "
                    )}
                  </span>
                )}
              </div>
            </section>
          </div>

          {/* Right: Summary */}
          <aside>
            <div className="sticky top-6 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#031008]">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#031008]">
                    {getSubtotal().toLocaleString()} ETB
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-medium text-[#031008]">
                    {getShippingCost() === 0
                      ? "Free"
                      : `${getShippingCost().toLocaleString()} ETB`}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#031008]">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#33473B]">
                  {getTotal().toLocaleString()} ETB
                </span>
              </div>

              <div className="mt-6">
                <Link to="/orders">
                  <Button
                    variant="outline"
                    fullWidth
                  >
                    Back to My Orders
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default OrderDetails;