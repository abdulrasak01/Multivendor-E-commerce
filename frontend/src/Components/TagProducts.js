import React, { useEffect, useState } from "react";
import SingleProduct from "./SingleProduct";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const TagProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalResult, setTotalResult] = useState(0)
  const baseURL = 'http://localhost:8000/api'
  const { tag } = useParams();
  
  const fetchData = async (url) => {
    try {
      const res = (await axios.get(url)).data      
      setProducts(res.results)
      setTotalResult(res.count)
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(()=>{
    fetchData(baseURL+`/products/${tag}/`)
  },[])

  const changeUrl = (url) => {
    fetchData(url)
  }
  
  var links = []
  for(let i=1; i<=totalResult; i++) {
    links.push(<li className="page-item"><Link onClick={()=>changeUrl(baseURL+`/products/${tag}/&page=${i}`)} className="page-link" to={`/products/${tag}/&page=${i}`}>{i}</Link></li>)
  }

  return (
    <>
     <section className="latest-products container mt-5">
        <h3 className="mb-4">
          <span className="text-success">All </span>
          Products
        </h3>
        <div className="row mb-4">
            {products?.map((product) => (
            <SingleProduct product={product} />
          ))}
        </div>
        <nav aria-label="Page navigation">
          <ul className="pagination">
           {links}
          </ul>
        </nav>
      </section>
    </>
  );
};

export default TagProducts;
