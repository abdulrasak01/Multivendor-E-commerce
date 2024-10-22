import React from 'react'
import { Link } from 'react-router-dom';
import logo from "../logo.svg";
const SingleProduct = (props) => {  
  console.log(props);
  const img = props.product?.product_imgs[0];
  
  return (
    <div className="col-12 col-md-3 mb-4">
          <div className="card">
            <Link to={`/product/${props.product?.title}/${props.product?.id}/`}><img src={img? img.image : logo} className="card-img-top" alt="..." /></Link>
            <div className="card-body">
            <Link to={`/product/${props.product?.title}/${props.product?.id}/`}>
              <h4 className="card-title">{props.product?.title}</h4>
              </Link>
              <h5>
                Price: <span className="text-muted">Rs. {props.product?.price}</span>
              </h5>
            </div>
            <div className="card-footer">
              <button title="Add to cart" className="btn btn-success">
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
              <button
                title="Add to wishlist"
                className="btn btn-danger ms-1"
              >
                <i className="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
  )
}

export default SingleProduct