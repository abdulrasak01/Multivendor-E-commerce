import React, { useEffect, useState } from "react";
import SlideBar from "./SideBar";
import logo from "../../logo.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../../api/api"; // Import your API instance for easy configuration

const WishList = () => {
  const [wishlist, setWishlist] = useState([]); // State to store wishlist products
  const [loading, setLoading] = useState(true); // State to manage loading state

  const customerId = localStorage.getItem("customer_id"); // Get customer ID from localStorage

  // Fetch the wishlist items when the component is mounted
  useEffect(() => {
    if (customerId) {
      fetchWishlistData(customerId);
    }
  }, [customerId]);

  // Function to fetch wishlist data
  const fetchWishlistData = async (customerId) => {
    try {
      const response = await api.get(`get-all-wishlist/${customerId}/`);
      setWishlist(response.data); // Set the fetched wishlist data
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setLoading(false); // Stop loading even if there is an error
    }
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const response = await api.post("remove-wishlist/", {
        customer: parseInt(customerId),
        product_id: productId,
      });
      // After successful removal, refetch the wishlist data
      if (response.data.bool) {
        alert("Product removed from wishlist");
        fetchWishlistData(customerId); // Re-fetch wishlist data
      } else {
        alert("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  // Loading spinner or skeleton while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(wishlist[1]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12 mb-2">
          <SlideBar />
        </div>
        <div className="col-md-9 col-12 mb-2">
          <div className="row">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.length > 0 ? (
                    wishlist.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <Link
                            to={`/product/${item?.Product?.title}/${item?.Product?.id}/`}
                          >
                            <img
                              src={ item?.Product?.image || logo} // This should be the correct image URL
                              className="img-thumbnail"
                              width={80}
                              alt={item?.product?.title}
                            />
                          </Link>
                          <Link
                            to={`/product/${item?.Product?.title}/${item?.Product?.id}/`}
                            style={{ textDecoration: "none" }}
                          >
                            <p>{item?.Product?.title}</p>
                          </Link>
                        </td>
                        <td>Rs. {item?.Product?.price}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              removeFromWishlist(item?.Product?.id)
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No items in your wishlist.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishList;
