import React, {
  useEffect,
  useState,
  useContext
} from "react";

import { AuthContext } from "../context/AuthContext";

import {
  ShoppingBag,
  Search,
  User,
  CalendarDays,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id
              ? { ...order, status }
              : order
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (order.userId?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

      {/* Header */}

      <div className="flex items-center gap-4 mb-8">

        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
          <ShoppingBag
            size={28}
            className="text-orange-600"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold">
            Manage Orders
          </h1>

          <p className="text-gray-500">
            Track and manage customer orders
          </p>
        </div>

      </div>

      {/* Search */}

      <div className="relative mb-8">

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search by Order ID or Customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            pl-12
            pr-4
            py-4
            border
            rounded-2xl
            focus:ring-2
            focus:ring-orange-500
            outline-none
          "
        />

      </div>

      {/* Loading */}

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border rounded-3xl p-10 text-center">
          No orders found.
        </div>
      ) : (
        <div className="space-y-5">

          {filteredOrders.map((order) => {

            const isExpanded =
              expandedOrder === order._id;

            const badgeClass =
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Shipped"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700";

            return (
              <div
                key={order._id}
                className="
                  bg-white
                  border
                  rounded-3xl
                  shadow-sm
                  overflow-hidden
                "
              >

                {/* Top Section */}

                <div className="p-6">

                  <div className="flex flex-col lg:flex-row justify-between gap-5">

                    <div>

                      <div className="flex items-center gap-2 mb-3">

                        <ShoppingBag
                          size={18}
                          className="text-orange-500"
                        />

                        <span className="font-semibold">
                          Order #
                          {order._id.substring(
                            0,
                            8
                          )}
                        </span>

                      </div>

                      <div className="space-y-2 text-sm text-gray-600">

                        <div className="flex items-center gap-2">
                          <User size={15} />
                          {order.userId?.name ||
                            "Deleted User"}
                        </div>

                        <div className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </div>

                      </div>

                    </div>

                    <div>

                      <p className="text-gray-500 text-sm">
                        Total Amount
                      </p>

                      <h3 className="text-2xl font-bold text-pink-600">
                        ₹
                        {order.totalAmount.toFixed(
                          2
                        )}
                      </h3>

                    </div>

                    <div className="flex flex-col gap-3">

                      <span
                        className={`
                          px-4
                          py-2
                          rounded-full
                          text-sm
                          font-medium
                          ${badgeClass}
                        `}
                      >
                        {order.status}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="
                          border
                          rounded-lg
                          px-3
                          py-2
                        "
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>
                      </select>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setExpandedOrder(
                        isExpanded
                          ? null
                          : order._id
                      )
                    }
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      text-orange-600
                      font-medium
                    "
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={18} />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown size={18} />
                        View Details
                      </>
                    )}
                  </button>

                </div>

                {isExpanded && (

                  <div className="border-t bg-gray-50 p-6">

                    <div className="grid md:grid-cols-2 gap-8">

                      <div>

                        <h4 className="font-semibold flex items-center gap-2 mb-4">
                          <MapPin size={18} />
                          Shipping Address
                        </h4>

                        <div className="space-y-1 text-gray-600">

                          <p>
                            {
                              order.address
                                ?.fullName
                            }
                          </p>

                          <p>
                            {
                              order.address
                                ?.street
                            }
                          </p>

                          <p>
                            {
                              order.address
                                ?.city
                            }
                          </p>

                          <p>
                            {
                              order.address
                                ?.postalCode
                            }
                          </p>

                          <p>
                            {
                              order.address
                                ?.country
                            }
                          </p>

                        </div>

                      </div>

                      <div>

                        <h4 className="font-semibold flex items-center gap-2 mb-4">
                          <CreditCard size={18} />
                          Payment
                        </h4>

                        <p className="text-gray-600 break-all">
                          {order.paymentId ||
                            "Payment ID unavailable"}
                        </p>

                      </div>

                    </div>

                    <div className="mt-8">

                      <h4 className="font-semibold flex items-center gap-2 mb-4">
                        <Package size={18} />
                        Ordered Items
                      </h4>

                      <div className="space-y-3">

                        {order.items?.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={index}
                              className="
                                bg-white
                                border
                                rounded-xl
                                p-4
                                flex
                                justify-between
                              "
                            >
                              <div>

                                <p className="font-medium">
                                  Product ID
                                </p>

                                <p className="text-sm text-gray-500">
                                  {
                                    item.productId
                                  }
                                </p>

                              </div>

                              <div className="text-right">

                                <p>
                                  Qty:{" "}
                                  {item.quantity ??
                                    item.qunatity}
                                </p>

                                <p className="font-semibold text-pink-600">
                                  ₹
                                  {item.price}
                                </p>

                              </div>

                            </div>
                          )
                        )}

                      </div>

                    </div>

                  </div>

                )}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default AdminOrders;