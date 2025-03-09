import React, { useState, useEffect } from "react";
import SlideBar from "./SideBar";
import api from "../../api/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalAddress: 0,
    totalOrders: 0,
    totalWishList: 0,
  });

  const customerId = localStorage.getItem("customer_id"); // Assuming customer_id is stored in localStorage

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(
          `/customer-dashboard/${customerId}/`
        );
        setDashboardData(response.data); // Set the data to state
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    if (customerId) {
      fetchDashboardData(); // Call the function to fetch the data
    }
  }, [customerId]); // Runs whenever customerId changes

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12 mb-2">
          <SlideBar />
        </div>
        <div className="col-md-9 col-12 mb-2">
          <div className="row">
            <div className="col-md-4 col-12 mb-2">
              <div className="card">
                <div className="card-body text-center">
                  <h4>Total Orders</h4>
                  <h4>
                    <a>{dashboardData.totalOrders || 0}</a>
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12 mb-2">
              <div className="card">
                <div className="card-body text-center">
                  <h4>Total Wishlist</h4>
                  <h4>
                    <a>{dashboardData.totalWishList || 0}</a>
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12 mb-2">
              <div className="card">
                <div className="card-body text-center">
                  <h4>Total Addresses</h4>
                  <h4>
                    <a>{dashboardData.totalAddress || 0}</a>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
