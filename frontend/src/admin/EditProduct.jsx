import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';


import {
  Pencil,
  Package,
  IndianRupee,
  Tag,
  Boxes,
  Image as ImageIcon,
  Save,
  ArrowLeft
} from "lucide-react";



const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          stock: data.stock || "",
         });
      setCurrentImage(data.imageUrl || "");
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (image) data.append('image', image);

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
      body: data
    });
    setLoading(false);
    if (res.ok) {
      alert('Product updated successfully!');
      navigate('/admin/products');
    }
  };

  return (
  <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">

    {/* Header */}

    <div className="flex items-center gap-4 mb-8">

      <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
        <Pencil
          size={28}
          className="text-orange-600"
        />
      </div>

      <div>

        <h1 className="text-4xl font-bold">
          Edit Product
        </h1>

        <p className="text-gray-500">
          Update product information and inventory
        </p>

      </div>

    </div>

    <div className="grid lg:grid-cols-3 gap-8">

      {/* Product Preview */}

      <div
        className="
          bg-white
          border
          rounded-3xl
          p-6
          shadow-sm
          h-fit
        "
      >

        <h3 className="font-semibold text-lg mb-5">
          Product Preview
        </h3>

        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">

          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : currentImage ? (
            <img
              src={currentImage}
              alt="Product"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <ImageIcon
                size={50}
                className="text-gray-300"
              />
            </div>
          )}

        </div>

        <div className="mt-5">

          <h4 className="font-bold text-xl">
            {formData.name || "Product Name"}
          </h4>

          <p className="text-gray-500 mt-2">
            {formData.category || "Category"}
          </p>

          <p className="text-pink-600 font-bold text-2xl mt-3">
            ₹{formData.price || 0}
          </p>

        </div>

      </div>

      {/* Form */}

      <div className="lg:col-span-2">

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            border
            rounded-3xl
            p-8
            shadow-sm
            space-y-6
          "
        >

          {/* Product Name */}

          <div>

            <label className="block mb-2 font-medium">
              Product Name
            </label>

            <div className="relative">

              <Package
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
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="
                  w-full
                  pl-12
                  pr-4
                  py-3
                  border
                  rounded-xl
                  focus:ring-2
                  focus:ring-orange-500
                  outline-none
                "
              />

            </div>

          </div>

          {/* Description */}

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="5"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="
                w-full
                p-4
                border
                rounded-xl
                resize-none
                focus:ring-2
                focus:ring-orange-500
                outline-none
              "
            />

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Price */}

            <div>

              <label className="block mb-2 font-medium">
                Price
              </label>

              <div className="relative">

                <IndianRupee
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
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  className="
                    w-full
                    pl-12
                    pr-4
                    py-3
                    border
                    rounded-xl
                    focus:ring-2
                    focus:ring-orange-500
                    outline-none
                  "
                />

              </div>

            </div>

            {/* Category */}

            <div>

              <label className="block mb-2 font-medium">
                Category
              </label>

              <div className="relative">

                <Tag
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
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  className="
                    w-full
                    pl-12
                    pr-4
                    py-3
                    border
                    rounded-xl
                    focus:ring-2
                    focus:ring-orange-500
                    outline-none
                  "
                />

              </div>

            </div>

          </div>

          {/* Stock */}

          <div>

            <label className="block mb-2 font-medium">
              Stock Quantity
            </label>

            <div className="relative">

              <Boxes
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
                type="number"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value,
                  })
                }
                className="
                  w-full
                  pl-12
                  pr-4
                  py-3
                  border
                  rounded-xl
                  focus:ring-2
                  focus:ring-orange-500
                  outline-none
                "
              />

            </div>

          </div>

          {/* Image Upload */}

          <div>

            <label className="block mb-2 font-medium">
              Replace Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files[0])
              }
              className="
                w-full
                border
                rounded-xl
                p-3
              "
            />

          </div>

          {/* Buttons */}

          <div className="flex gap-4 pt-4">

            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
              className="
                flex
                items-center
                gap-2
                px-6
                py-3
                border
                rounded-xl
                hover:bg-gray-50
              "
            >
              <ArrowLeft size={18} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                gap-2
                px-6
                py-3
                bg-orange-500
                text-white
                rounded-xl
                hover:bg-orange-600
                disabled:opacity-50
              "
            >
              <Save size={18} />

              {loading
                ? "Updating..."
                : "Update Product"}
            </button>

          </div>

        </form>

      </div>

    </div>

  </div>
);
};

export default EditProduct;