import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import SingleRelatedProduct from "./SingleRelatedProduct";
import { CartContext } from "../Context";
import api from "../api/api";

const ProductDetail = () => {
  const [product, setProduct] = useState([]);
  const [productImgs, setProductImgs] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState(false); // To track if the product is in the wishlist

  const { cartData, setCartData } = useContext(CartContext);

  const userLogIn = localStorage.getItem("customer_login");
  const { product_id } = useParams();

  const currency = localStorage.getItem("currency") || "inr";

  // Fetch product data
  const fetchData = async (url) => {
    try {
      const res = (await api.get(url)).data;
      setProduct(res);
      setProductImgs(res.product_imgs);
      setProductTags(res.tag_list);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch related products
  const fetchRelatedData = async (url) => {
    try {
      const res = (await api.get(url)).data;
      setRelatedProduct(res.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData(`/product/${product_id}/`);
    fetchRelatedData(`/related-products/${product_id}/`);
  }, []);

  // Fetch the product's tags
  const tagLinks = [];
  for (let i = 0; i < productTags.length; i++) {
    const tag = productTags[i].trim();
    tagLinks.push(
      <Link to={`/products/${tag}`} className="badge bg-secondary text-white me-1">
        {tag}
      </Link>
    );
  }

  // Add to cart handler
  const cartAddButtonHandler = () => {
    let previousCart = localStorage.getItem("cartData");
    previousCart = JSON.parse(previousCart) || [];
    if (!Array.isArray(previousCart)) previousCart = [];

    const cartData = {
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: productImgs[0]?.image || null,
      },
      user: {
        id: "1", // Assuming the user ID is always "1"
      },
    };

    previousCart.push(cartData);
    const cartString = JSON.stringify(previousCart);
    localStorage.setItem("cartData", cartString);
    setCartData(previousCart);
    setCartButtonClickStatus(true);
  };

  // Remove from cart handler
  const cartRemoveButtonHandler = () => {
    let previousCart = localStorage.getItem("cartData");
    previousCart = JSON.parse(previousCart);
    if (!Array.isArray(previousCart)) previousCart = [];

    const updatedCart = previousCart.filter(
      (item) => item.product.id !== product.id
    );
    let cartString = JSON.stringify(updatedCart);
    localStorage.setItem("cartData", cartString);
    setCartButtonClickStatus(false);
    setCartData(updatedCart);
  };

  useEffect(() => {
    const isProductInCart = cartData?.some((cart) => cart.product.id === product.id);
    setCartButtonClickStatus(isProductInCart);
  }, [cartData, product.id]);

  // Add to wishlist handler
  const addToWishlistHandler = async () => {
    if (!userLogIn) {
      alert("Please log in to add to wishlist.");
      return;
    }

    const customerId = JSON.parse(localStorage.getItem("customer_id"));

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
  };

  // Check if the product is already in the wishlist
  const checkProductInWiseList = async (productId) => {
    if (!userLogIn) return;
    const customerId = JSON.parse(localStorage.getItem("customer_id"));
    try {
      const res = await api.post("/wishlist-check/", {
        product_id: productId,
        customer: parseInt(customerId),
      });

      // If the product is already in the wishlist, update the status
      setWishlistStatus(res.data.bool); // Set wishlist status based on the API response
    } catch (error) {
      console.error("Error checking wishlist", error);
    }
  };

  useEffect(() => {
    if(product){
      checkProductInWiseList(product.id);
    }
  }, [userLogIn, product]);

  console.log(relatedProduct);
  

  return (
    <section className="container mt-4">
      <div className="row">
        <div className="col-4">
          <Carousel className="mt-5 pt-3 carousel-dark">
            {productImgs.map((img) => (
              <Carousel.Item key={img.id}>
                <img src={img?.image} className="card-img-top mb-5" alt="..." />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="col-8">
          <h1>{product.title}</h1>
          <p>{product.detail}</p>

          {currency !== "usd" && (
            <h5>
              Price: <span className="text-muted">Rs. {product?.price}</span>
            </h5>
          )}
          {currency === "usd" && (
            <h5>
              Price: <span className="text-muted">$ {product?.usd_price}</span>
            </h5>
          )}

          <p>
            {!cartButtonClickStatus && (
              <button
                type="button"
                onClick={cartAddButtonHandler}
                title="Add to cart"
                className="btn btn-success ms-1"
              >
                Add to cart <i className="fa-solid fa-cart-shopping"></i>
              </button>
            )}
            {cartButtonClickStatus && (
              <button
                type="button"
                onClick={cartRemoveButtonHandler}
                title="Remove from cart"
                className="btn btn-warning ms-1"
              >
                Remove from cart <i className="fa-solid fa-cart-shopping"></i>
              </button>
            )}
            <button title="Buy now" className="btn btn-primary ms-1">
              <i className="fa-solid fa-bag-shopping"></i> Buy now
            </button>
            <button
              title={wishlistStatus ? "Already in wishlist" : "Add to wishlist"}
              className={`btn ms-1 ${wishlistStatus ? "btn-secondary" : "btn-danger"}`}
              disabled={wishlistStatus || !userLogIn}
              onClick={addToWishlistHandler}
            >
              <i className={`fa-solid fa-heart ${wishlistStatus ? "text-white" : ""}`}></i>{" "}
              {wishlistStatus ? "Added" : "Wishlist"}
            </button>
          </p>

          <div className="product tags">
            <h5>Tags</h5>
            <p className="mt-3">{tagLinks}</p>
          </div>
        </div>
      </div>

      {relatedProduct && (
        <div controls={false} className="mt-5 pt-3 carousel-dark">
          <div className="row mb-5">
            {relatedProduct.map((product) => (
              <SingleRelatedProduct key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetail;
