import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

import {
  Search,
  PackageSearch
} from "lucide-react";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="shop-container">

      {/* Hero Section */}

      <div className="shop-header">

        <h1>Discover Products</h1>

        <p>
          Explore premium products curated just for you.
        </p>

      </div>

      {/* Search */}

      <div className="search-wrapper">

        <Search
          size={18}
          className="search-icon"
        />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

      </div>

      {/* Results */}

      {!loading && (
        <div className="results-count">
          {filteredProducts.length} Products Found
        </div>
      )}

      {/* Loading */}

      {loading ? (
        <div className="loading-container">

          <div className="loader"></div>

          <p>Loading Products...</p>

        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">

          <PackageSearch
            size={70}
            strokeWidth={1.5}
          />

          <h2>No Products Found</h2>

          <p>
            Try searching with another keyword.
          </p>

        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;