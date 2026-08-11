import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart,updateCartQty } from '../redux/CartSlice';
import '../styles/cart.css';

import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck
} from "lucide-react";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

const handleUpdateQty = (item, qty) => {
  if (qty <= 0) {
    dispatch(removeFromCart(item.productId));
    return;
  }
  dispatch(
    updateCartQty({
      productId: item.productId,
      qty,
    })
  );
};

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

    {/* Header */}

    <div className="mb-10">

      <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
        <ShoppingCart size={36} />
        Shopping Cart
      </h1>

      <p className="text-gray-500 mt-2">
        {cartItems.length} item(s) in your cart
      </p>

    </div>

    {cartItems.length === 0 ? (

      <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">

        <Package
          size={80}
          className="mx-auto text-gray-300 mb-4"
        />

        <h2 className="text-2xl font-semibold mb-3">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/shop"
          className="
            inline-flex
            items-center
            gap-2
            px-6
            py-3
            rounded-xl
            bg-pink-600
            text-white
            font-medium
            hover:bg-pink-700
            transition
          "
        >
          Start Shopping
          <ArrowRight size={18} />
        </Link>

      </div>

    ) : (

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">

        {/* Cart Items */}

        <div className="space-y-5">

          {cartItems.map((item) => (

            <div
              key={item.productId}
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                flex
                flex-col
                md:flex-row
                gap-5
                shadow-sm
              "
            >

              <img
                src={item.imageUrl}
                alt={item.name}
                className="
                  w-full
                  md:w-36
                  h-36
                  object-cover
                  rounded-xl
                "
              />

              <div className="flex-1">

                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>

                <p className="text-pink-600 font-bold text-xl mt-2">
                  ₹{item.price}
                </p>

                {/* Quantity Controls */}

                <div className="flex items-center gap-3 mt-4">

                  <button
                    onClick={() =>
                      handleUpdateQty(
                        item,
                        item.qty - 1
                      )
                    }
                    className="
                      w-10
                      h-10
                      border
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      hover:bg-gray-100
                    "
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-semibold text-lg">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      handleUpdateQty(
                        item,
                        item.qty + 1
                      )
                    }
                    className="
                      w-10
                      h-10
                      border
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      hover:bg-gray-100
                    "
                  >
                    <Plus size={16} />
                  </button>

                </div>

                <button
                  onClick={() =>
                    handleRemove(item.productId)
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    text-red-500
                    mt-4
                    hover:text-red-600
                  "
                >
                  <Trash2 size={16} />
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* Order Summary */}

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            p-6
            h-fit
            sticky
            top-24
            shadow-sm
          "
        >

          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">
                Free
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>

          </div>

          <button
            onClick={() =>
              navigate("/checkout")
            }
            className="
              mt-6
              w-full
              bg-pink-600
              hover:bg-pink-700
              text-white
              py-4
              rounded-xl
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >
            Proceed To Checkout
            <ArrowRight size={18} />
          </button>

          {/* Trust Badges */}

          <div className="mt-6 space-y-3">

            <div className="flex items-center gap-3 text-gray-600">
              <Truck size={18} />
              Free Delivery
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck size={18} />
              Secure Checkout
            </div>

          </div>

        </div>

      </div>

    )}

  </div>
);
};

export default Cart;