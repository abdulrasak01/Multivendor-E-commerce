import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import Carousel from "react-bootstrap/Carousel";
import AllProducts from "./AllProducts";
import { Link } from "react-router-dom";
import SingleProduct from "./SingleProduct";
import axios from "axios";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [totalResult, setTotalResult] = useState(0);
  const baseURL = "http://localhost:8000/api";

  const fetchData = async (url) => {
    try {
      const res = (await axios.get(url)).data;
      setProducts(res.results);
      setTotalResult(res.count);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchData(baseURL + "/products/");
  }, []);

  const changeUrl = (url) => {
    fetchData(baseURL + url);
  };

  var links = [];
  for (let i = 1; i <= totalResult; i++) {
    links.push(
      <li className="page-item">
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

  console.log(products);
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
            <SingleProduct product={product} />
          ))}
        </div>
      </div>
      <div className="popular-categories">
        <h3 className="mb-4">
          Popular Categories
          <a href="#" className="float-end btn btn-dark ">
            View All Categories <i className="fa-solid fa-arrow-right"></i>
          </a>
        </h3>
        <div className="row">
          {/* product box */}
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Product Title</h4>
              </div>
              <div className="card-footer">Product downloads: 123</div>
            </div>
          </div>
          {/* productbox end */}
          {/* product box */}
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Product Title</h4>
              </div>
              <div className="card-footer">Product downloads: 123</div>
            </div>
          </div>
          {/* productbox end */}
          {/* product box */}
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Product Title</h4>
              </div>
              <div className="card-footer">Product downloads: 123</div>
            </div>
          </div>
          {/* productbox end */}
          {/* product box */}
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Product Title</h4>
              </div>
              <div className="card-footer">Product downloads: 123</div>
            </div>
          </div>
          {/* productbox end */}
          {/* product box */}
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Product Title</h4>
              </div>
              <div className="card-footer">Product downloads: 123</div>
            </div>
          </div>
          {/* productbox end */}
          {/* product box */}
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Product Title</h4>
              </div>
              <div className="card-footer">Product downloads: 123</div>
            </div>
          </div>
          {/* productbox end */}
        </div>
      </div>
      <div className="popular-products">
        <h3 className="mb-4">
          Popular Products{" "}
          <a href="#" className="float-end btn btn-dark ">
            View All products <i className="fa-solid fa-arrow-right"></i>
          </a>
        </h3>
        <div className="row">
          <SingleProduct />
          <SingleProduct />
          <SingleProduct />
          <SingleProduct />
        </div>
      </div>
      <div className="popular-sellers">
        <h3 className="mb-4">
          Popular Sellers
          <a href="#" className="float-end btn btn-dark ">
            View All Sellers <i className="fa-solid fa-arrow-right"></i>
          </a>
        </h3>
        <div className="row">
          {/* seller box */}
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Seller Name</h4>
              </div>
              <div className="card-footer">
                Categories: <a href="#">python</a>
                <a className="ms-1" href="#">
                  PHP
                </a>
              </div>
            </div>
          </div>
          {/* seller box end */}
          {/* seller box */}
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Seller Name</h4>
              </div>
              <div className="card-footer">
                Categories: <a href="#">python</a>
                <a className="ms-1" href="#">
                  PHP
                </a>
              </div>
            </div>
          </div>
          {/* seller box end */}
        </div>
      </div>
      {/* rate and review */}
      <div></div>
      <Carousel className="bg-dark mt-5 pb-5 pt-3 text-white text-center">
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
      </Carousel>
      {/* end */}
    </main>
  );
};

export default Home;
