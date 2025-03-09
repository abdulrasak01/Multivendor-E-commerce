import React, { useState } from "react";
import api from "../../api/api";
import SideBar from "./SideBar";

const AddAddress = () => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);  // New state for success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer_id = localStorage.getItem("customer_id"); // Get customer_id from localStorage

    if (!customer_id) {
      setError("Customer ID is required.");
      return;
    }

    const payload = {
      customer: customer_id,  // Add customer_id to payload
      address: address,
    };

    try {
      setLoading(true);
      const response = await api.post("/address/", payload); // POST API request
      console.log("Address added successfully:", response.data);
      setSuccessMessage("Address added successfully!"); // Set success message
      setAddress("");  // Optionally clear the address input field after successful submission
    } catch (error) {
      console.error("Error adding address:", error);
      setError("There was an error adding your address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12 mb-2">
          <SideBar />
        </div>
        <div className="col-md-9 col-12 mb-2">
          <div className="card">
            <h4 className="card-header">Add Address</h4>
            <div className="table-body">
              <form className="m-5" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="4"
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !address.trim()} // Disable if address is empty
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
