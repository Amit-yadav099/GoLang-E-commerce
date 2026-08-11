import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import {
  Package,
  FileText,
  IndianRupee,
  Boxes,
  Tag,
  ImagePlus,
  Upload,
  ArrowLeft
} from "lucide-react";

import toast from "react-hot-toast";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      
      if (res.ok) {
        toast.success('Product created successfully with Cloudinary Image URL!');
        navigate('/shop');
      } else {
        toast.error(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="max-w-4xl mx-auto px-4 py-10">

    {/* Header */}

    <div className="mb-8">

      <button
        onClick={() => navigate("/admin")}
        className="
          flex items-center gap-2
          text-gray-500
          hover:text-pink-600
          mb-4
        "
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold text-gray-900">
        Add New Product
      </h1>

      <p className="text-gray-500 mt-2">
        Create and publish products to your store.
      </p>

    </div>

    {/* Form Card */}

    <div className="bg-white border rounded-3xl shadow-sm p-8">

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Product Name */}

        <div>

          <label className="flex items-center gap-2 font-medium mb-2">
            <Package size={18} />
            Product Name
          </label>

          <input
            type="text"
            required
            placeholder="Nike Air Max 270"
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              focus:ring-2
              focus:ring-pink-500
              outline-none
            "
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
              })
            }
          />

        </div>

        {/* Description */}

        <div>

          <label className="flex items-center gap-2 font-medium mb-2">
            <FileText size={18} />
            Description
          </label>

          <textarea
            rows="5"
            required
            placeholder="Write product details..."
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              resize-none
              focus:ring-2
              focus:ring-pink-500
              outline-none
            "
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value
              })
            }
          />

        </div>

        {/* Price + Stock */}

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="flex items-center gap-2 font-medium mb-2">
              <IndianRupee size={18} />
              Price
            </label>

            <input
              type="number"
              required
              placeholder="999"
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                focus:ring-2
                focus:ring-pink-500
                outline-none
              "
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value
                })
              }
            />

          </div>

          <div>

            <label className="flex items-center gap-2 font-medium mb-2">
              <Boxes size={18} />
              Stock Quantity
            </label>

            <input
              type="number"
              required
              placeholder="50"
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                focus:ring-2
                focus:ring-pink-500
                outline-none
              "
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value
                })
              }
            />

          </div>

        </div>

        {/* Category */}

        <div>

          <label className="flex items-center gap-2 font-medium mb-2">
            <Tag size={18} />
            Category
          </label>

          <input
            type="text"
            required
            placeholder="Footwear"
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              focus:ring-2
              focus:ring-pink-500
              outline-none
            "
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value
              })
            }
          />

        </div>

        {/* Image Upload */}

        <div>

          <label className="flex items-center gap-2 font-medium mb-3">
            <ImagePlus size={18} />
            Product Image
          </label>

          <label
            className="
              border-2
              border-dashed
              rounded-2xl
              p-8
              flex
              flex-col
              items-center
              justify-center
              text-center
              cursor-pointer
              hover:border-pink-500
              transition
            "
          >

            <Upload
              size={40}
              className="text-pink-600 mb-3"
            />

            <p className="font-medium">
              Upload Product Image
            </p>

            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, WEBP supported
            </p>

            <input
              type="file"
              accept="image/*"
              required
              className="hidden"
              onChange={(e) =>
                setImage(e.target.files[0])
              }
            />

          </label>

          {image && (
            <p className="mt-3 text-green-600 font-medium">
              ✓ {image.name}
            </p>
          )}

        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-pink-600
            hover:bg-pink-700
            disabled:opacity-50
            text-white
            font-semibold
            py-4
            rounded-xl
            transition
          "
        >
          {loading
            ? "Uploading Product..."
            : "Publish Product"}
        </button>

      </form>

    </div>

  </div>
);
};

export default AddProduct;