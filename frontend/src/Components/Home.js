import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import SingleProduct from "./SingleProduct";
import api from "../api/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [totalResult, setTotalResult] = useState(0);
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]); // New state for popular products

  // Fetch popular products data
  const fetchPopularProducts = async () => {
    try {
      const res = (await api.get("/popular-products/")).data; // Fetch data from the popular products API
      setPopularProducts(res); // Set popular products to state
    } catch (error) {
      console.log("Error fetching popular products:", error.message);
    }
  };

  const fetchData = async (url) => {
    try {
      const res = (await api.get(url)).data;
      setProducts(res.results);
      setTotalResult(res.count);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData("/products/");
    fetchCategoryData("/categories/");
    fetchPopularProducts(); // Call fetch for popular products
  }, []);

  const changeUrl = (url) => {
    fetchData(url);
  };

  const fetchCategoryData = async (url) => {
    try {
      const res = (await api.get(url)).data;
      setCategories(res.data);
      setTotalResult(res.count);
    } catch (error) {
      console.log(error.message);
    }
  };

  const changeCategoryUrl = (url) => {
    fetchCategoryData(url);
  };

  var links = [];
  for (let i = 1; i <= totalResult; i++) {
    links.push(
      <li className="page-item" key={i}>
        <Link
          onClick={() => changeUrl(`/products/?page=${i}`)}
          className="page-link"
          to={`/products/?page=${i}`}
        >
          {i}
        </Link>
      </li>
    );
  }

  console.log(popularProducts);

  return (
    <main className="container mt-4">
      <div className="latest-products">
        <h3 className="mb-4">
          Latest Products{" "}
          <Link to="/products" className="float-end btn btn-dark ">
            View All products <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </h3>
        <div className="row mb-4">
          {products?.map((product) => (
            <SingleProduct product={product} key={product.id} />
          ))}
        </div>
      </div>

      <div className="popular-categories">
        <h3 className="mb-4">
          Popular Categories
          <a href="/categories" className="float-end btn btn-dark ">
            View All Categories <i className="fa-solid fa-arrow-right"></i>
          </a>
        </h3>
        <div className="row">
          {/* product box */}
          {categories.map((category) => (
            <div className="col-12 col-md-3 mb-4" key={category.id}>
              <div className="card">
                <img
                  src={category?.image}
                  className="card-img-top"
                  alt={category?.title}
                  style={{
                    objectFit: "cover",
                    height: "400px", // Set height of images
                    width: "100%", // Ensure the image fills the card width
                  }}
                />
                <div className="card-body">
                  <h4 className="card-title">
                    <Link to={`/category/${category.title}/${category.id}`}>
                      {category.title}
                    </Link>
                  </h4>
                </div>
                <div className="card-footer">Detail: {category?.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="popular-products">
        <h3 className="mb-4">
          Popular Products{" "}
          <a href="/products" className="float-end btn btn-dark ">
            View All products <i className="fa-solid fa-arrow-right"></i>
          </a>
        </h3>
        <div className="row">
          {/* Render popular products */}
          {popularProducts?.map((product) => (
            <div className="col-12 col-md-3 mb-4" key={product.id}>
              <div className="card">
                <img
                  src={product.image || logo} // Fallback image if product doesn't have an image
                  className="card-img-top"
                  alt={product.title}
                  style={{
                    objectFit: "cover",
                    height: "400px", // Ensure the height is fixed
                    width: "100%", // Ensure the image fills the card width
                  }}
                />
                <div className="card-body">
                  <h4 className="card-title">
                    <Link to={`/product/${product.slug}`}>
                      {product.title.length > 20
                        ? product.title.slice(0, 20) + "..."
                        : product.title}
                    </Link>
                  </h4>
                </div>
                <div className="card-footer">
                  Downloads: {product.downloads}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Carousel className="bg-dark mt-5 pb-5 pt-3 text-white text-center">
        {/* Carousel Items */}
        <Carousel.Item>
          <figure className="mt-5">
            <blockquote className="blockquote">
              <p>A well-known quote, contained in a blockquote element.</p>
            </blockquote>
            <figcaption className="blockquote-footer">
              <i className="fa fa-star text-warning"></i>
              <i className="fa fa-star text-warning"></i>
              <i className="fa fa-star text-warning"></i>
              <i className="fa fa-star text-warning"></i>
              <cite title="Source Title">Customer Name</cite>
            </figcaption>
          </figure>
        </Carousel.Item>
        {/* More Carousel Items */}
      </Carousel>
    </main>
  );
};

export default Home;
