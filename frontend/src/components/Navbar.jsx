import React, {useContext} from 'react';

import {Link, useNavigate}  from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import {useSelector} from 'react-redux';

import "../styles/navbar.css";

import {
  ShoppingCart,
  Store,
  User,
  ShieldCheck,
  LogOut
} from "lucide-react";

 const Navbar= ()=>{
    const {user, logout}= useContext(AuthContext);
    const cartItems=useSelector((state)=> state.cart.cartItems);
    const navigate=useNavigate();

    const handleLogout=()=>{
        logout();
        navigate('/login');
    }

    return(
        <nav className="navbar">

  <div className="navbar-brand">
    <Link to="/" className="brand-link">
      <img
        src="/shopEase.png"
        alt="ShopEase Logo"
        className="navbar-logo"
      />
      <span className="brand-name">
        ShopEase
      </span>
    </Link>
  </div>

  <ul className="navbar-links">

    <li>
      <Link className="nav-link" to="/shop">
       Shop
      </Link>
    </li>
    <li>
      <Link className="nav-link cart-link" to="/cart">
    <ShoppingCart />
        Cart
        <span className="cart-count">
          {cartItems.length}
        </span>
      </Link>
    </li>

    {user ? (
      <>
        <li>
          <Link className="nav-link" to="/profile">
          <User/>
            Hi, {user.name}
          </Link>
        </li>

        {user.role === "admin" && (
          <li>
            <Link className="nav-link admin-link" to="/admin">
              Admin
            </Link>
          </li>
        )}

        <li>
          <button
            onClick={handleLogout}
            className="btn-logout"
          >
            Logout
          </button>
        </li>
      </>
    ) : (
      <li>
        <Link className="btn-login" to="/login">
          Login
        </Link>
      </li>
    )}
  </ul>

</nav>
    )
};



export default Navbar;
