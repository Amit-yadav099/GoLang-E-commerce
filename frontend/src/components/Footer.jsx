import React from "react";
import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";

import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand Section */}

        <div className="footer-section">
          <h2 className="footer-logo">
            ShopEase
          </h2>

          <p className="footer-description">
            Premium e-commerce platform offering quality
            products with secure shopping and fast delivery.
          </p>

          <div className="footer-socials">

            <a href="#">
              <FaFacebookF size={18} />
            </a>

            <a href="#">
              <FaInstagram size={18} />
            </a>

            <a href="#">
              <FaTwitter size={18} />
            </a>

            <a href="#">
              <FaLinkedinIn size={18} />
            </a>

          </div>
        </div>

        {/* Quick Links */}

        <div className="footer-section">

          <h3>Company</h3>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/shop">
            Shop
          </Link>

          <Link to="#">
            Contact
          </Link>

        </div>

        {/* Policies */}

        <div className="footer-section">

          <h3>Support</h3>

          <Link to="/return">
            Return Policy
          </Link>

          <Link to="/disclaimer">
            Disclaimer
          </Link>

          <Link to="/privacy">
            Privacy Policy
          </Link>

        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} ShopEase.
        All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;