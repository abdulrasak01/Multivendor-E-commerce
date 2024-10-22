import React from "react";
import SellerSideBar from "./SellerSideBar";

const AddProduct = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12 mb-2">
          <SellerSideBar />
        </div>
        <div className="col-md-9 col-12 mb-2">
          <div className="card">
            <h4 className="card-header">Add Product</h4>
            <div className="table-body">
              <form className="m-5">
              <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select className="form-control" id="category">
                    <option>PHP</option>
                    <option>JS</option>
                    <option>Python</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label for="first_name" className="form-label">
                    Title
                  </label>
                  <input type="text" className="form-control" id="title" />
                </div>
                <div className="mb-3">
                  <label for="username" className="form-label">
                    Price
                  </label>
                  <input type="number" className="form-control" id="price" />
                </div>
                <div className="mb-3">
                  <label for="username" className="form-label">
                    Description
                  </label>
                  <textarea className="form-control" />
                </div>
                <div className="mb-3">
                  <label for="email" className="form-label">
                    Email
                  </label>
                  <input type="email" className="form-control" id="email" />
                </div>
                <div>
                  <div>
                    <label className="form-label">Profile Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="profileImg"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-4">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
