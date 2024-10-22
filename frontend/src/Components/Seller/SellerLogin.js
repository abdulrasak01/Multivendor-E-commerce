import React from "react";

const SellerLogin = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 col-12 offset-2">
          <div className="card">
            <h4 className="card-header">Login</h4>
            <div className="table-body">
              <form className="m-5">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    User Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="pwd">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="pwd"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
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

export default SellerLogin;
