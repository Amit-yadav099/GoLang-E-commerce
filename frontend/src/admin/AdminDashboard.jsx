import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  IndianRupee,
  PlusCircle,
  Boxes,
  Truck,
  UserCog,
  ArrowRight
} from "lucide-react";


const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);



  return (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

    {/* Header */}

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">

      <div>

        <div className="flex items-center gap-3 mb-2">

          <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
            <LayoutDashboard
              size={24}
              className="text-pink-600"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

        </div>

        <p className="text-gray-500">
          Welcome back,
          <span className="font-semibold text-gray-900 ml-1">
            {user?.name}
          </span>
        </p>

      </div>

    </div>

    {/* Stats */}

    {stats ? (

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="bg-white border rounded-3xl p-6 shadow-sm">

          <ShoppingCart
            size={30}
            className="text-pink-600 mb-4"
          />

          <p className="text-gray-500">
            Total Orders
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.totalOrders}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm">

          <Package
            size={30}
            className="text-blue-600 mb-4"
          />

          <p className="text-gray-500">
            Products
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.totalProducts}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm">

          <Users
            size={30}
            className="text-green-600 mb-4"
          />

          <p className="text-gray-500">
            Users
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.totalUsers}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm">

          <IndianRupee
            size={30}
            className="text-orange-500 mb-4"
          />

          <p className="text-gray-500">
            Revenue
          </p>

          <h2 className="text-4xl font-bold mt-2">
            ₹{stats.totalRevenue.toFixed(2)}
          </h2>

        </div>

      </div>

    ) : (

      <div className="text-center py-20">
        Loading dashboard...
      </div>

    )}

    {/* Quick Actions */}

    <div className="bg-white border rounded-3xl p-8 shadow-sm">

      <h2 className="text-2xl font-bold mb-6">
        Administrative Controls
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Add Product */}

        <button
          onClick={() =>
            navigate("/admin/add-product")
          }
          className="
            p-6
            border
            rounded-2xl
            hover:border-pink-500
            hover:shadow-md
            transition
            text-left
          "
        >

          <PlusCircle
            size={30}
            className="text-pink-600 mb-4"
          />

          <h3 className="font-semibold text-lg">
            Add Product
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Create a new product.
          </p>

        </button>

        {/* Products */}

        <button
          onClick={() =>
            navigate("/admin/products")
          }
          className="
            p-6
            border
            rounded-2xl
            hover:border-blue-500
            hover:shadow-md
            transition
            text-left
          "
        >

          <Boxes
            size={30}
            className="text-blue-600 mb-4"
          />

          <h3 className="font-semibold text-lg">
            Manage Products
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Update inventory.
          </p>

        </button>

        {/* Orders */}

        <button
          onClick={() =>
            navigate("/admin/orders")
          }
          className="
            p-6
            border
            rounded-2xl
            hover:border-orange-500
            hover:shadow-md
            transition
            text-left
          "
        >

          <Truck
            size={30}
            className="text-orange-500 mb-4"
          />

          <h3 className="font-semibold text-lg">
            Manage Orders
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Process customer orders.
          </p>

        </button>

        {/* Users */}

        <button
          onClick={() =>
            navigate("/admin/users")
          }
          className="
            p-6
            border
            rounded-2xl
            hover:border-green-500
            hover:shadow-md
            transition
            text-left
          "
        >

          <UserCog
            size={30}
            className="text-green-600 mb-4"
          />

          <h3 className="font-semibold text-lg">
            User Directory
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Manage users.
          </p>

        </button>

      </div>

    </div>

  </div>
);
};

export default AdminDashboard;