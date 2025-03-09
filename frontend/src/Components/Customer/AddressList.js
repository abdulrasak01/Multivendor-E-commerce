import React, { useEffect, useState } from "react";
import SlideBar from "./SideBar";
import { Link } from "react-router-dom";
import api from "../../api/api";

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve customer ID from localStorage
    const customerId = localStorage.getItem("customer_id");

    if (!customerId) {
      setError("Customer ID not found in localStorage.");
      setLoading(false);
      return;
    }

    // Fetch customer addresses using API
    const fetchAddresses = async () => {
      try {
        const response = await api.get(`/addresses/${customerId}/`);
        setAddresses(response.data); // assuming API returns an array of addresses
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch addresses.");
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSetDefaultAddress = async (addressId) => {
    const customerId = localStorage.getItem("customer_id");
  
    if (!customerId) {
      setError("Customer ID not found in localStorage.");
      return;
    }
  
    try {
      // Step 1: Find the address to be set as default
      const addressToMakeDefault = addresses.find((address) => address.id === addressId);
  
      if (!addressToMakeDefault) {
        setError("Address not found.");
        return;
      }
  
      // Step 2: Set all addresses to non-default in local state
      const updatedAddresses = addresses.map((address) =>
        address.id === addressId
          ? { ...address, default_address: true }
          : { ...address, default_address: false }
      );
  
      // Step 3: Update the local state with the new addresses
      setAddresses(updatedAddresses);
  
      // Step 4: Send the API request to update the address
      await api.patch(`/addresses/${addressId}/update/`, {
        customer: customerId,
        default_address: true,
      });
  
      // Step 5: Update other addresses to have default_address: false if needed
      await Promise.all(
        updatedAddresses
          .filter((address) => address.id !== addressId && address.default_address)
          .map((address) =>
            api.patch(`/addresses/${address.id}/update/`, {
              customer: customerId,
              default_address: false,
            })
          )
      );
    } catch (err) {
      setError("Failed to set address as default.");
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12 mb-2">
          <SlideBar />
        </div>
        <div className="col-md-9 col-12 mb-2">
          <div className="row">
            <div className="col-12">
              <Link
                to="/customer/add-address"
                className="btn btn-outline-success mb-4 float-end"
              >
                <i className="fa fa-plus-circle me-1"></i>
                Add Address
              </Link>
            </div>
            {/* Dynamically render the list of addresses */}
            {addresses.length === 0 ? (
              <div>No addresses found.</div>
            ) : (
              addresses.map((address, index) => (
                <div className="col-4 mb-4" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="text-muted">
                        {address.default_address && (
                          <span className="badge bg-success mb-2">
                            <i className="fa fa-check-circle me-1"></i>
                            Default Address
                          </span>
                        )}
                        {!address.default_address && (
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set as Default
                          </button>
                        )}
                        <br />
                        {address.address}
                      </h5>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressList;
