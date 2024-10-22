import React from "react";
import logo from "../logo.svg";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import SingleProduct from "./SingleProduct";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SingleRelatedProduct from "./SingleRelatedProduct";
const ProductDetail = () => {
  const [product, setProduct] = useState([]);
  const [productImgs, setProductImgs] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const baseURL = 'http://localhost:8000/api'

  const { product_id } = useParams();  

  const fetchData = async (url) => {
    try {
      const res = (await axios.get(url)).data
      setProduct(res)
      setProductImgs(res.product_imgs)
      setProductTags(res.tag_list)
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchRelatedData = async (url) => {
    try {
      const res = (await axios.get(url)).data
      setRelatedProduct(res.results)
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(()=>{
    fetchData(baseURL+`/product/${product_id}/`)
    fetchRelatedData(baseURL+`/related-products/${product_id}/`)
  },[])

  console.log(relatedProduct);
  
  
  const tagLinks = []
  for(let i=0;i<productTags.length;i++){
    const tag = productTags[i].trim()  
    tagLinks.push(<Link to={`/products/${tag}`} className="badge bg-secondary text-white me-1">{tag}</Link>)
  }

  return (
    <section className="container mt-4">
      <div className="row">
        <div className="col-4">
          <Carousel className=" mt-5 pt-3 carousel-dark">
            {productImgs.map((img)=>(
              <Carousel.Item>
                <img src={img?.image} className="card-img-top mb-5" alt="..." />
              </Carousel.Item>
             ))}
          </Carousel>
        </div>
        <div className="col-8">
          <h1>{product.title}</h1>
          <p>
            {product.detail}
          </p>
          <h5>
            {" "}
            Price: <span className="text-muted">Rs. {product.price}</span>
          </h5>
          <p>
            <Link title="Demo" target="blank" className="btn btn-dark ms-1">
              {" "}
              Demo <i className="fa-solid fa-cart-shopping"></i>
            </Link>
            <button title="Add to cart" className="btn btn-success ms-1">
              {" "}
              Add to cart <i className="fa-solid fa-cart-shopping"></i>
            </button>
            <button title="buy now" className="btn btn-primary ms-1">
              <i class="fa-solid fa-bag-shopping"></i> Buy now
            </button>
            <button title="Add to wishlist" className="btn btn-danger ms-1">
              <i className="fa-solid fa-heart"></i> Wishlist
            </button>
          </p>
          <div className="product tags">
            <h5>Tags</h5>
            <p className="mt-3">
             {tagLinks}
            </p>
          </div>
        </div>
      </div>
      {relatedProduct&& 
        <div controls={false} className=" mt-5 pt-3 carousel-dark">
        <div className="row mb-5">
          {relatedProduct.map((product)=>(
            <SingleRelatedProduct product={product}/>
          ))}
        </div>
    </div>
      }
    </section>
  );
};

export default ProductDetail;
