import React from "react";
import SlideBar from "./SideBar";
import { Link } from "react-router-dom";

const UpdateProfile = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12 mb-2">
          <SlideBar />
        </div>
        <div className="col-md-9 col-12 mb-2">
          <div className="row">
            <div className="col-12">
              <Link to='/customer/add-address' className="btn btn-outline-success mb-4 float-end">
              <i className="fa fa-plus-circle me-1"></i>
                 Add Address
              </Link>
            </div>
            <div className="col-4 mb-4">
              <div className="card">
                <div className="card-body text-muted">
                  <h5>
                    <i className="fa fa-check-circle text-success mb-2"></i>
                    <br />
                    1099, Vaickam periyar nagar, Near Avaniyapuram, Madurai-12
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-muted">
                    <span className="badge bg-secondary mb-2">
                      Make Default
                    </span>
                    <br />
                    1099, Vaickam periyar nagar, Near Avaniyapuram, Madurai-12
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-muted">
                    <span className="badge bg-secondary mb-2">
                      Make Default
                    </span>
                    <br />
                    1099, Vaickam periyar nagar, Near Avaniyapuram, Madurai-12
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-muted">
                    <span className="badge bg-secondary mb-2">
                      Make Default
                    </span>
                    <br />
                    1099, Vaickam periyar nagar, Near Avaniyapuram, Madurai-12
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
