import React , { useEffect, useState } from 'react';
import {useParams, Link} from 'react-router-dom';

import {useDispatch} from 'react-redux';
import {addToCart} from '../redux/CartSlice';
import '../styles/product.css';

import toast from "react-hot-toast";

import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Star,
  PackageCheck
} from "lucide-react";

const ProductDetail = () =>{
   const {id}= useParams();
   const [product,setProduct]=useState(null);
   const [loading,setLoading]=useState(true);
   const [cartCount,setCartCount]=useState(0);
   const dispatch=useDispatch();

   useEffect(()=>{
      const fetchProduct = async()=> { 
         try{
            const res=await fetch(`/api/products/${id}`);
            const data=await res.json();
            setProduct(data);
         }
         catch(error){
            console.error(error);
         }
         finally{
            setLoading(false);
         }
      };
      fetchProduct();
   },[id]);

   const handleAddToCart=()=>{
      if(product){
         dispatch(addToCart({
            productId:product._id,
            name:product.name,
            price:product.price,
            imageUrl:product.imageUrl,
         }));

         toast.success("Added to cart");
      }
   };

  if (loading) return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>Product Not Found</div>;


return (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

    {/* Breadcrumb */}

    <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-8">

      <Link
        to="/"
        className="hover:text-pink-500 transition"
      >
        Home
      </Link>

      <ChevronRight size={16} />

      <Link
        to="/shop"
        className="hover:text-pink-500 transition"
      >
        Shop
      </Link>

      <ChevronRight size={16} />

      <span className="text-gray-900 font-medium">
        {product.name}
      </span>

    </div>

    {/* Main Layout */}

    <div className="grid lg:grid-cols-2 gap-12 items-start">

      {/* Product Image */}

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">

        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-[500px] object-cover rounded-2xl"
        />

      </div>

      {/* Product Details */}

      <div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-600 font-medium mb-4">
          New Arrival
        </span>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>

        {/* Ratings */}

        <div className="flex items-center gap-1 mb-4">

          <Star
            size={18}
            fill="currentColor"
            className="text-yellow-400"
          />

          <Star
            size={18}
            fill="currentColor"
            className="text-yellow-400"
          />

          <Star
            size={18}
            fill="currentColor"
            className="text-yellow-400"
          />

          <Star
            size={18}
            fill="currentColor"
            className="text-yellow-400"
          />

          <Star
            size={18}
            className="text-gray-300"
          />

          <span className="text-gray-500 ml-2">
            (124 Reviews)
          </span>

        </div>

        {/* Price */}

        <div className="mb-6">

          <h2 className="text-5xl font-bold text-pink-600">
            ₹{product.price.toFixed(2)}
          </h2>

        </div>

        {/* Stock */}

        <div className="mb-6">

          {product.stock > 0 ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">

              <PackageCheck size={18} />

              In Stock ({product.stock} available)

            </div>
          ) : (
            <div className="text-red-500 font-medium">
              Out of Stock
            </div>
          )}

        </div>

        {/* Description */}

        <div className="mb-8">

          <h3 className="text-xl font-semibold mb-3">
            Product Description
          </h3>

          <p className="text-gray-600 leading-8">
            {product.description}
          </p>

        </div>

        {/* Add To Cart */}

        <button
          onClick={handleAddToCart}
          className="
            w-full
            bg-pink-600
            hover:bg-pink-700
            text-white
            font-semibold
            py-4
            rounded-xl
            flex
            items-center
            justify-center
            gap-3
            transition
          "
        >
          <ShoppingCart size={20} />
          Add To Cart
        </button>

        {/* Trust Section */}

        <div className="grid sm:grid-cols-3 gap-4 mt-8">

          <div className="flex items-center gap-3 p-4 border rounded-xl">

            <Truck
              size={20}
              className="text-pink-600"
            />

            <span className="text-sm">
              Free Delivery
            </span>

          </div>

          <div className="flex items-center gap-3 p-4 border rounded-xl">

            <RotateCcw
              size={20}
              className="text-pink-600"
            />

            <span className="text-sm">
              Easy Returns
            </span>

          </div>

          <div className="flex items-center gap-3 p-4 border rounded-xl">

            <ShieldCheck
              size={20}
              className="text-pink-600"
            />

            <span className="text-sm">
              Secure Checkout
            </span>

          </div>

        </div>

      </div>

    </div>

  </div>
);

};

export default ProductDetail;