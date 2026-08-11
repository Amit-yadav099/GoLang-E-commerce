import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';


import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  ArrowRight
} from "lucide-react";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          // Token obsolete or 401: clear and bounce
          if (res.status === 401) {
             logout();
             navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

 return (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

    {/* Profile Header */}

    <div
      className="
      bg-white
      rounded-3xl
      border
      border-gray-200
      p-8
      shadow-sm
      mb-8
    "
    >

      <div className="flex flex-col md:flex-row justify-between gap-6">

        <div className="flex items-center gap-5">

          {/* Avatar */}

          <div
            className="
            w-20
            h-20
            rounded-full
            bg-pink-100
            flex
            items-center
            justify-center
          "
          >
            <User
              size={38}
              className="text-pink-600"
            />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              {user.name}
            </h1>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <Mail size={16} />
              {user.email}
            </div>

            <div
              className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1
              mt-3
              rounded-full
              bg-green-100
              text-green-700
              text-sm
              font-medium
            "
            >
              <ShieldCheck size={14} />
              {user.role}
            </div>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="
            h-fit
            px-5
            py-3
            rounded-xl
            bg-red-500
            hover:bg-red-600
            text-white
            font-medium
            flex
            items-center
            gap-2
            transition
          "
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>

    {/* Stats Section */}

    <div className="grid md:grid-cols-3 gap-5 mb-10">

      <div className="bg-white border rounded-2xl p-6 shadow-sm">

        <ShoppingBag
          size={30}
          className="text-pink-600 mb-3"
        />

        <p className="text-gray-500">
          Orders
        </p>

        <h2 className="text-3xl font-bold">
          {orders.length}
        </h2>

      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">

        <Package
          size={30}
          className="text-blue-600 mb-3"
        />

        <p className="text-gray-500">
          Delivered
        </p>

        <h2 className="text-3xl font-bold">
          {
            orders.filter(
              o => o.status === "Delivered"
            ).length
          }
        </h2>

      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">

        <Truck
          size={30}
          className="text-orange-500 mb-3"
        />

        <p className="text-gray-500">
          In Transit
        </p>

        <h2 className="text-3xl font-bold">
          {
            orders.filter(
              o => o.status === "Shipped"
            ).length
          }
        </h2>

      </div>

    </div>

    {/* Orders */}

    <div className="bg-white border rounded-3xl shadow-sm p-8">

      <h2 className="text-2xl font-bold mb-6">
        Order History
      </h2>

      {loading ? (

        <div className="text-center py-10 text-gray-500">
          Loading orders...
        </div>

      ) : orders.length === 0 ? (

        <div className="text-center py-12">

          <ShoppingBag
            size={60}
            className="
              mx-auto
              text-gray-300
              mb-4
            "
          />

          <h3 className="text-xl font-semibold mb-2">
            No Orders Yet
          </h3>

          <p className="text-gray-500 mb-6">
            Start shopping to see your orders here.
          </p>

          <Link
            to="/shop"
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-3
              bg-pink-600
              hover:bg-pink-700
              text-white
              rounded-xl
              transition
            "
          >
            Shop Now
            <ArrowRight size={16} />
          </Link>

        </div>

      ) : (

        <div className="space-y-4">

          {orders.map((order) => {

            const statusColor =
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Shipped"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700";

            return (

              <div
                key={order._id}
                className="
                  border
                  rounded-2xl
                  p-5
                  hover:shadow-md
                  transition
                "
              >

                <div className="flex flex-col md:flex-row justify-between gap-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="font-medium">
                      {order._id}
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                      Date
                    </p>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="text-xl font-bold text-pink-600">
                      ₹
                      {order.totalAmount.toFixed(
                        2
                      )}
                    </p>

                  </div>

                  <div>

                    <span
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-medium
                        ${statusColor}
                      `}
                    >
                      {order.status ===
                      "Delivered" ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={14} />
                          Delivered
                        </span>
                      ) : order.status ===
                        "Shipped" ? (
                        <span className="flex items-center gap-2">
                          <Truck size={14} />
                          Shipped
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Clock3 size={14} />
                          Processing
                        </span>
                      )}
                    </span>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>

  </div>
);
};

export default Profile;