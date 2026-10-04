import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getOrders } from "../services/orderApi";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
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
   * Fetch orders
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/orders",
        },
      });

      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders();

      const data = response.data;

      /*
       * Support common backend response formats:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * or
       *
       * {
       *   orders: [...]
       * }
       */

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your orders. Please try again."
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

  const getOrderNumber = (order) => {
    return (
      order.order_number ||
      order.orderNumber ||
      `#${order.id}`
    );
  };

  const getOrderDate = (order) => {
    const date =
      order.created_at ||
      order.createdAt ||
      order.order_date ||
      order.date;

    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOrderTotal = (order) => {
    return Number(
      order.total_amount ??
        order.total ??
        order.grand_total ??
        0
    );
  };

  const getOrderItems = (order) => {
    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (Array.isArray(order.order_items)) {
      return order.order_items;
    }

    return [];
  };

  const getItemCount = (order) => {
    const items = getOrderItems(order);

    if (items.length === 0) {
      return Number(
        order.item_count ??
          order.items_count ??
          order.quantity ??
          0
      );
    }

    return items.reduce((total, item) => {
      return total + Number(item.quantity || 1);
    }, 0);
  };

  const getStatus = (order) => {
    return (
      order.status ||
      order.order_status ||
      "Processing"
    );
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status).toLowerCase();

    if (
      normalizedStatus === "delivered" ||
      normalizedStatus === "completed"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled" ||
      normalizedStatus === "failed"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      normalizedStatus === "shipped" ||
      normalizedStatus === "out_for_delivery"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
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
        <Loader text="Loading your orders..." />
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Page
   * -------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#F8F5EF]">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#33473B]">
            Your purchases
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#031008] sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 text-gray-600">
                View your previous orders and track their status.
              </p>
            </div>

            {orders.length > 0 && (
              <p className="text-sm text-gray-500">
                {orders.length}{" "}
                {orders.length === 1 ? "order" : "orders"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage
              message={error}
              onRetry={fetchOrders}
            />
          </div>
        )}

        {orders.length === 0 ? (
          <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-lg bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F5EF]">
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
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 10a4 4 0 01-8 0"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-[#031008]">
              No orders yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              You haven't placed an order yet. Start exploring
              our furniture collection.
            </p>

            <Link to="/products" className="mt-6">
              <Button size="large">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const orderNumber = getOrderNumber(order);
              const orderDate = getOrderDate(order);
              const orderTotal = getOrderTotal(order);
              const itemCount = getItemCount(order);
              const status = getStatus(order);

              return (
                <article
                  key={order.id || orderNumber}
                  className="overflow-hidden rounded-lg bg-white shadow-sm"
                >
                  {/* Order header */}
                  <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-[#031008]">
                          {orderNumber}
                        </h2>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                          status
                        )}`}
                      >
                        {String(status).replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Order information */}
                  <div className="px-5 py-5 sm:px-6">
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Order Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#031008]">
                          {orderDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Items
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#031008]">
                          {itemCount}{" "}
                          {itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#33473B]">
                          {orderTotal.toLocaleString()} ETB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order preview */}
                  {getOrderItems(order).length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
                      <div className="flex flex-wrap gap-3">
                        {getOrderItems(order)
                          .slice(0, 4)
                          .map((item, index) => {
                            const product =
                              item.product || item;

                            const image =
                              product.image_url ||
                              product.image ||
                              item.image_url ||
                              "https://via.placeholder.com/80x80?text=Fernwood";

                            const name =
                              product.name ||
                              item.name ||
                              "Product";

                            return (
                              <div
                                key={
                                  item.id ||
                                  item.product_id ||
                                  index
                                }
                                className="flex items-center gap-2 rounded-md bg-[#F8F5EF] p-2"
                              >
                                <img
                                  src={image}
                                  alt={name}
                                  className="h-12 w-12 rounded object-cover"
                                />

                                <div className="max-w-[140px]">
                                  <p className="truncate text-xs font-medium text-[#031008]">
                                    {name}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    Qty:{" "}
                                    {item.quantity || 1}
                                  </p>
                                </div>
                              </div>
                            );
                          })}

                        {getOrderItems(order).length > 4 && (
                          <div className="flex items-center px-2 text-xs text-gray-500">
                            +
                            {getOrderItems(order).length - 4}{" "}
                            more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-end border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
                    <Link
                      to={`/orders/${order.id}`}
                    >
                      <Button variant="outline" size="small">
                        View Order
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Orders;