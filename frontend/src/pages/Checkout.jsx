import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/CartSlice";

import toast from "react-hot-toast";

import {
  User,
  MapPin,
  Building2,
  Globe,
  CreditCard,
  ShieldCheck,
  Truck,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handlePayment = async () => {
    try {
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.message || "Payment gateway not configured");
        return;
      }

      if (!orderData.keyId || !orderData.id) {
        toast.error("Invalid payment response from server");
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopEase",
        description: "Secure Payment",

        order_id: orderData.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            if (!verifyRes.ok) {
              toast.error("Payment verification failed");
              return;
            }

            const saveOrderRes = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                items: cartItems,
                totalAmount: totalPrice,
                address,
                paymentId: response.razorpay_payment_id,
              }),
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              toast.success("Order placed successfully!");
              navigate("/ordersuccess");
            } else {
              toast.error("Failed to save order");
            }
          } catch (err) {
            toast.error("Something went wrong");
          }
        },

        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: "9999999999",
        },

        theme: {
          color: "#ec4899",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment initialization failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    handlePayment();
  };

 return (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

    {/* Page Header */}

    <div className="mb-10">

      <h1 className="text-4xl font-bold text-gray-900">
        Checkout
      </h1>

      <p className="text-gray-500 mt-2">
        Complete your purchase securely.
      </p>

    </div>

    <div className="grid lg:grid-cols-[2fr_1fr] gap-8">

      {/* Shipping Form */}

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          p-8
          shadow-sm
        "
      >

        <h2 className="text-2xl font-semibold mb-6">
          Shipping Address
        </h2>

        {/* Full Name */}

        <div className="relative mb-5">

          <User
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
            placeholder="Full Name"
            required
            value={address.fullName}
            onChange={(e) =>
              setAddress({
                ...address,
                fullName: e.target.value,
              })
            }
            className="
              w-full
              pl-12
              pr-4
              py-3
              border
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-pink-500
            "
          />

        </div>

        {/* Street */}

        <div className="relative mb-5">

          <MapPin
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
            placeholder="Street Address"
            required
            value={address.street}
            onChange={(e) =>
              setAddress({
                ...address,
                street: e.target.value,
              })
            }
            className="
              w-full
              pl-12
              pr-4
              py-3
              border
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-pink-500
            "
          />

        </div>

        {/* City */}

        <div className="relative mb-5">

          <Building2
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
            placeholder="City"
            required
            value={address.city}
            onChange={(e) =>
              setAddress({
                ...address,
                city: e.target.value,
              })
            }
            className="
              w-full
              pl-12
              pr-4
              py-3
              border
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-pink-500
            "
          />

        </div>

        {/* Postal + Country */}

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Postal Code"
            required
            value={address.postalCode}
            onChange={(e) =>
              setAddress({
                ...address,
                postalCode: e.target.value,
              })
            }
            className="
              w-full
              px-4
              py-3
              border
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-pink-500
            "
          />

          <div className="relative">

            <Globe
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
              placeholder="Country"
              required
              value={address.country}
              onChange={(e) =>
                setAddress({
                  ...address,
                  country: e.target.value,
                })
              }
              className="
                w-full
                pl-12
                pr-4
                py-3
                border
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-pink-500
              "
            />

          </div>

        </div>

      </form>

      {/* Order Summary */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          p-6
          shadow-sm
          h-fit
          sticky
          top-24
        "
      >

        <h2 className="text-2xl font-semibold mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 mb-6">

          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="
                flex
                justify-between
                text-sm
              "
            >
              <span>
                {item.name} × {item.qty}
              </span>

              <span>
                ₹{(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}

        </div>

        <hr className="my-4" />

        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>Delivery</span>
          <span className="text-green-600">
            Free
          </span>
        </div>

        <div className="flex justify-between text-xl font-bold mt-5">
          <span>Total</span>
          <span>
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Pay Button */}

        <button
          onClick={handleSubmit}
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
          <CreditCard size={18} />
          Pay Now
        </button>

        {/* Trust Badges */}

        <div className="mt-6 space-y-3">

          <div className="flex items-center gap-3 text-gray-600">
            <ShieldCheck size={18} />
            Secure Payment
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <Truck size={18} />
            Fast Delivery
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <PackageCheck size={18} />
            Easy Returns
          </div>

        </div>

      </div>

    </div>

  </div>
);
};

export default Checkout;