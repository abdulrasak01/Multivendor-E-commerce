import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "../logo.svg";
import api from "../api/api";

const SingleProduct = ({ product }) => {
    const [wishlistStatus, setWishlistStatus] = useState(false);  // To track if the product is in the wishlist
    const [isAdding, setIsAdding] = useState(false);  // To show loading while adding to wishlist

    const img = product?.product_imgs[0];
    const maxTitleLength = 20; // Maximum length for the title
    const truncatedTitle = product?.title.length > maxTitleLength 
      ? product?.title.slice(0, maxTitleLength) + "..." 
      : product?.title;

    const customerId = localStorage.getItem("customer_id"); // Get customer ID from localStorage
    const currency = localStorage.getItem("currency") || 'inr';

    // Function to check if the product is already in the wishlist
    const checkProductInWishList = async () => {
      if (!customerId) return;
      try {
        const res = await api.post("/wishlist-check/", {
          product_id: product?.id,
          customer: customerId,
        });

      // Update the wishlist status based on the API response
      setWishlistStatus(res.data.bool); 
    } catch (error) {
      console.error("Error checking wishlist", error);
    }
  };

  // UseEffect to check if the product is in the wishlist on initial load
  useEffect(() => {
    checkProductInWishList();
  }, [product?.id, customerId]);

  // Add to wishlist handler
  const addToWishlist = async () => {
    if (!customerId) {
      alert('Please log in to add items to the wishlist');
      return;
    }

    setIsAdding(true);  // Show loading indicator while adding

    try {
      const res = await api.post("add-to-wishlist/", {
        product_id: product.id,
        customer: customerId,
      });

      setWishlistStatus(true); // Set wishlist status to true after successful addition
      alert("Product added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist", error);
      alert("Error adding to wishlist");
    }

    setIsAdding(false);  // Hide loading indicator
  };

  return (
    <div className="col-12 col-md-3 mb-4">
      <div className="card">
        <Link to={`/product/${product?.title}/${product?.id}/`}>
          <img 
            src={img ? img.image : logo} 
            className="card-img-top" 
            alt={product?.title} 
            style={{ 
              objectFit: 'cover',
              height: '400px', 
              width: '100%'        
            }} 
          />
        </Link>
        <div className="card-body">
          <Link style={{ textDecoration: 'none' }} to={`/product/${product?.title}/${product?.id}/`}>
            <h4 className="card-title">{truncatedTitle}</h4>
          </Link>
          <h5>
            {currency !== 'usd' && (
              <h5>
                Price: <span className="text-muted">Rs. {product?.price}</span>
              </h5>
            )}
            {currency === 'usd' && (
              <h5>
                Price: <span className="text-muted">$ {product?.usd_price}</span>
              </h5>
            )}
          </h5>
        </div>
        <div className="card-footer">
          <button title="Add to cart" className="btn btn-success">
            <i className="fa-solid fa-cart-shopping"></i>
          </button>

          <button 
            title={wishlistStatus ? "Already in wishlist" : "Add to wishlist"} 
            className={`btn ms-1 ${wishlistStatus ? "btn-secondary" : "btn-danger"}`}
            disabled={wishlistStatus || !customerId || isAdding}
            onClick={addToWishlist}
          >
            <i className={`fa-solid fa-heart ${wishlistStatus ? "text-white" : ""}`}></i> 
            {wishlistStatus ? "Added" : "Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
