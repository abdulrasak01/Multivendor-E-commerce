import React from "react";
import logo from "../logo.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [totalResult, setTotalResult] = useState(0)
  const baseURL = 'http://localhost:8000/api'

  const fetchData = async (url) => {
    try {
      const res = (await axios.get(url)).data      
      setCategories(res.data)
      setTotalResult(res.count)
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(()=>{
    fetchData(baseURL+'/categories/')
  },[])

  const changeUrl = (url) => {
    fetchData(baseURL + url)
  }

  var links = []
  for(let i=1; i<=totalResult; i++) {
    links.push(<li className="page-item"><Link onClick={()=>changeUrl(`/categories/?page=${i}`)} className="page-link" to={`/categories/?page=${i}`}>{i}</Link></li>)
  }
  return (
    <section className="container mt-4">
      <div className="popular-categories">
        <h3 className="mb-4">
          All Categories
        </h3>
        <div className="row">
          {/* product box */}
          {categories.map((category, index) => (
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title" key={category.id}><Link to={`/category/${category.title}/${category.id}`}>{category.title}</Link></h4>
              </div>
              <div className="card-footer">Product downloads: 123</div>
            </div>
          </div>))}
          {/* productbox end */}
        </div>
      </div>
      <nav aria-label="Page navigation example">
    <ul className="pagination">
        {links}
    </ul>
    </nav>
    </section>
  );
};

export default Categories;
