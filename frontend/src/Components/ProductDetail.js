import React, { useContext } from "react";
import logo from "../logo.svg";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import SingleProduct from "./SingleProduct";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SingleRelatedProduct from "./SingleRelatedProduct";
import { CartContext } from "../Context";
const ProductDetail = () => {
  const [product, setProduct] = useState([]);
  const [productImgs, setProductImgs] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);
  const {cartData, setCartData} = useContext(CartContext)
  const baseURL = "http://localhost:8000/api";

  const { product_id } = useParams();

  const fetchData = async (url) => {
    try {
      const res = (await axios.get(url)).data;
      setProduct(res);
      setProductImgs(res.product_imgs);
      setProductTags(res.tag_list);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchRelatedData = async (url) => {
    try {
      const res = (await axios.get(url)).data;
      setRelatedProduct(res.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData(baseURL + `/product/${product_id}/`);
    fetchRelatedData(baseURL + `/related-products/${product_id}/`);
  }, []);

  const tagLinks = [];
  for (let i = 0; i < productTags.length; i++) {
    const tag = productTags[i].trim();
    tagLinks.push(
      <Link
        to={`/products/${tag}`}
        className="badge bg-secondary text-white me-1"
      >
        {tag}
      </Link>
    );
  }

  const cartAddButtonHandler = () => {
    // Retrieve the previous cart data from localStorage and parse it
    let previousCart = localStorage.getItem('cartData');
    previousCart = JSON.parse(previousCart) || [];  // Default to an empty array if no cart data
  
    // Ensure previousCart is an array (though it should be already due to the default)
    if (!Array.isArray(previousCart)) {
      previousCart = [];
    }
    // Create the new cart item data
    const cartData = {
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: productImgs[0].image,  // Assuming the first product image is the main image for simplicity
      },
      user: {
        id: "1",  // Assuming the user ID is always "1"
      },
    };
  
    // Add the new cart item to the previous cart array
    previousCart.push(cartData);
  
    // Convert the updated cart array to a JSON string
    const cartString = JSON.stringify(previousCart);
  
    // Store the updated cart array back into localStorage
    localStorage.setItem("cartData", cartString);
  
    // Update the state with the new cart data
    setCartData(previousCart);  // Store the updated cart data in state
  
    // Optionally, update the button click status to reflect the action
    setCartButtonClickStatus(true);
  };
  
  const cartRemoveButtonHandler = () => {
    let previousCart = localStorage.getItem('cartData');
    previousCart = JSON.parse(previousCart);
    if (!Array.isArray(previousCart)) {
      previousCart = [];
    }
    const updatedCart = previousCart.filter(item => item.product.id !== product.id);
    let cartString = JSON.stringify(updatedCart);
    localStorage.setItem("cartData", cartString);
    setCartButtonClickStatus(false)
    setCartData(updatedCart)
  };

  useEffect(() => {
    const isProductInCart = cartData?.some(cart => cart.product.id === product.id);
    setCartButtonClickStatus(isProductInCart);
  }, [cartData, product.id]);


  return (
    <section className="container mt-4">
      <div className="row">
        <div className="col-4">
          <Carousel className=" mt-5 pt-3 carousel-dark">
            {productImgs.map((img) => (
              <Carousel.Item>
                <img src={img?.image} className="card-img-top mb-5" alt="..." />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="col-8">
          <h1>{product.title}</h1>
          <p>{product.detail}</p>
          <h5>
            {" "}
            Price: <span className="text-muted">Rs. {product.price}</span>
          </h5>
          <p>
            <a
              title="Demo"
              href={product.demo}
              target="blank"
              className="btn btn-dark ms-1"
            >
              {" "}
              Demo <i className="fa-solid fa-cart-shopping"></i>
            </a>
            {!cartButtonClickStatus && (
              <button
                type="button"
                onClick={cartAddButtonHandler}
                title="Add to cart"
                className="btn btn-success ms-1"
              >
                {" "}
                Add to cart <i className="fa-solid fa-cart-shopping"></i>
              </button>
            )}
            {cartButtonClickStatus && (
              <button
                type="button"
                onClick={cartRemoveButtonHandler}
                title="Add to cart"
                className="btn btn-warning ms-1"
              >
                {" "}
                Remove from cart <i className="fa-solid fa-cart-shopping"></i>
              </button>
            )}
            <button title="buy now" className="btn btn-primary ms-1">
              <i class="fa-solid fa-bag-shopping"></i> Buy now
            </button>
            <button title="Add to wishlist" className="btn btn-danger ms-1">
              <i className="fa-solid fa-heart"></i> Wishlist
            </button>
          </p>
          <div className="product tags">
            <h5>Tags</h5>
            <p className="mt-3">{tagLinks}</p>
          </div>
        </div>
      </div>
      {relatedProduct && (
        <div controls={false} className=" mt-5 pt-3 carousel-dark">
          <div className="row mb-5">
            {relatedProduct.map((product) => (
              <SingleRelatedProduct product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
export default ProductDetail;
