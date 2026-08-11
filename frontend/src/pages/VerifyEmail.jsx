import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from 'react-hot-toast';


import {
  MailCheck,
  ShieldCheck,
  KeyRound,
  Loader2
} from "lucide-react";


const VerifyEmail = () => {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const email =location.state?.email || localStorage.getItem("verificationEmail");

 const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    const data = await res.json();

    if (res.ok) {

      login({
        ...data.user,
        token: data.token,
      });

      toast.success("Email verified successfully");

      localStorage.removeItem("verificationEmail");
      navigate("/login");
    } 
    else {
      toast.error(data.message);
    }

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

 return (
  <div
    className="
      min-h-screen
      bg-gray-50
      flex
      items-center
      justify-center
      px-4
    "
  >

    <div
      className="
        w-full
        max-w-md
        bg-white
        rounded-3xl
        shadow-lg
        border
        p-8
      "
    >

      {/* Top Icon */}

      <div className="flex justify-center mb-6">

        <div
          className="
            w-20
            h-20
            rounded-full
            bg-orange-100
            flex
            items-center
            justify-center
          "
        >

          <MailCheck
            size={40}
            className="text-orange-500"
          />

        </div>

      </div>

      {/* Heading */}

      <div className="text-center mb-8">

        <h1
          className="
            text-3xl
            font-bold
            text-gray-900
            mb-3
          "
        >
          Verify Your Email
        </h1>

        <p className="text-gray-500">

          We've sent a verification code to

        </p>

        <p
          className="
            font-semibold
            text-gray-800
            mt-1
            break-all
          "
        >
          {email}
        </p>

      </div>

      {/* Security Message */}

      <div
        className="
          flex
          items-start
          gap-3
          bg-green-50
          border
          border-green-100
          rounded-2xl
          p-4
          mb-6
        "
      >

        <ShieldCheck
          size={20}
          className="text-green-600 mt-0.5"
        />

        <p className="text-sm text-green-700">
          Verifying your email helps keep your account
          secure and enables order tracking.
        </p>

      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
              text-gray-700
            "
          >
            Verification Code
          </label>

          <div className="relative">

            <KeyRound
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
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              placeholder="Enter 6-digit OTP"
              required
              className="
                w-full
                pl-12
                pr-4
                py-4
                border
                rounded-xl
                focus:ring-2
                focus:ring-orange-500
                outline-none
                text-center
                text-lg
                tracking-widest
              "
            />

          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-orange-500
            hover:bg-orange-600
            text-white
            py-4
            rounded-xl
            font-semibold
            transition
            disabled:opacity-60
            flex
            items-center
            justify-center
            gap-2
          "
        >

          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}

        </button>

      </form>

      {/* Footer Text */}

      <div
        className="
          text-center
          mt-6
          text-sm
          text-gray-500
        "
      >
        Didn't receive the code?
        <button
          className="
            ml-1
            text-orange-600
            font-medium
            hover:text-orange-700
          "
        >
          Resend OTP
        </button>
      </div>

    </div>

  </div>
);
};

export default VerifyEmail;