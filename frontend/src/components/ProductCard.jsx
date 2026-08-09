import React from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Eye,
  ShoppingBag
} from "lucide-react";

import "../styles/productCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">

      <div className="product-image-wrapper">

        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />

        <span className="product-badge">
          New
        </span>

      </div>

      <div className="product-info">

        <h3 className="product-name">
          {product.name}
        </h3>

        <p className="product-price">
          ${product.price.toFixed(2)}
        </p>

        <Link
          to={`/products/${product._id}`}
          className="product-btn"
        >
          <Eye size={16} />
          View Details
          <ArrowRight size={16} />
        </Link>

      </div>

    </div>
  );
};

export default ProductCard;