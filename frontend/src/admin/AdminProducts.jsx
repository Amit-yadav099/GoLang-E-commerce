import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import {
  Package,
  Search,
  Plus,
  Pencil,
  Trash2,
  IndianRupee,
  Boxes
} from "lucide-react";

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
 const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);


  const handleDelete = async (id) => {
    if (window.confirm('Are you strictly sure you want to delete this?')) {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    product.category
      .toLowerCase()
      .includes(search.toLowerCase())
  );

 return (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

    {/* Header */}

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

          <Package
            size={28}
            className="text-orange-600"
          />

        </div>

        <div>

          <h1 className="text-4xl font-bold">
            Manage Products
          </h1>

          <p className="text-gray-500">
            View, edit and manage inventory
          </p>

        </div>

      </div>

      <Link
        to="/admin/add-product"
        className="
          flex
          items-center
          gap-2
          bg-orange-500
          text-white
          px-5
          py-3
          rounded-xl
          hover:bg-orange-600
          transition
        "
      >
        <Plus size={18} />
        Add Product
      </Link>

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
        placeholder="Search products..."
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

    {/* Product Count */}

    <div className="mb-6 flex items-center gap-3">

      <Boxes
        size={18}
        className="text-orange-500"
      />

      <span className="text-gray-600">
        {filteredProducts.length} Products
      </span>

    </div>

    {/* Loading */}

    {loading ? (

      <div className="text-center py-20 text-gray-500">
        Loading products...
      </div>

    ) : filteredProducts.length === 0 ? (

      <div className="bg-white border rounded-3xl p-10 text-center">

        <h3 className="text-xl font-semibold mb-2">
          No Products Found
        </h3>

        <p className="text-gray-500">
          Try a different search.
        </p>

      </div>

    ) : (

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredProducts.map((product) => (

          <div
            key={product._id}
            className="
              bg-white
              border
              rounded-3xl
              overflow-hidden
              shadow-sm
              hover:shadow-lg
              transition-all
            "
          >

            {/* Product Image */}

            <div className="h-64 bg-gray-100 overflow-hidden">

              <img
                src={product.imageUrl}
                alt={product.name}
                className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-105
                  transition-transform
                  duration-300
                "
              />

            </div>

            {/* Product Info */}

            <div className="p-5">

              <div className="mb-3">

                <h3 className="font-bold text-lg line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {product.category}
                </p>

              </div>

              <div className="flex items-center gap-1 mb-4">

                <IndianRupee
                  size={18}
                  className="text-pink-600"
                />

                <span className="font-bold text-xl text-pink-600">
                  {product.price.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between items-center mb-5">

                <span className="text-gray-500">
                  Stock
                </span>

                <span
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${
                      product.stock > 10
                        ? "bg-green-100 text-green-700"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {product.stock}
                </span>

              </div>

              {/* Actions */}

              <div className="flex gap-3">

                <Link
                  to={`/admin/edit-product/${product._id}`}
                  className="
                    flex-1
                    flex
                    justify-center
                    items-center
                    gap-2
                    py-3
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    hover:bg-blue-100
                    transition
                  "
                >
                  <Pencil size={16} />
                  Edit
                </Link>

                <button
                  onClick={() =>
                    handleDelete(product._id)
                  }
                  className="
                    flex-1
                    flex
                    justify-center
                    items-center
                    gap-2
                    py-3
                    rounded-xl
                    bg-red-50
                    text-red-600
                    hover:bg-red-100
                    transition
                  "
                >
                  <Trash2 size={16} />
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>
);
};

export default AdminProducts;