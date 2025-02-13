import React from 'react'
import { Link } from 'react-router-dom';
import logo from "../logo.svg";

const SingleProduct = ({ product }) => {  
  const img = product?.product_imgs[0];
  const maxTitleLength = 20; // Maximum length for the title
  const truncatedTitle = product?.title.length > maxTitleLength 
    ? product?.title.slice(0, maxTitleLength) + "..." 
    : product?.title;

  return (
    <div className="col-12 col-md-3 mb-4">
      <div className="card">
        <Link to={`/product/${product?.title}/${product?.id}/`}>
          <img 
            src={img ? img.image : logo} 
            className="card-img-top" 
            alt="..." 
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
            Price: <span className="text-muted">Rs. {product?.price}</span>
          </h5>
        </div>
        <div className="card-footer">
          <button title="Add to cart" className="btn btn-success">
            <i className="fa-solid fa-cart-shopping"></i>
          </button>
          <button title="Add to wishlist" className="btn btn-danger ms-1">
            <i className="fa-solid fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SingleProduct;
