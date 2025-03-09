import React, { useState, useEffect } from "react";
import SlideBar from "./SideBar";
import logo from "../../logo.svg";
import { Link } from "react-router-dom";
import api from "../../api/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const customerId = localStorage.getItem("customer_id");
      try {
        const response = await api.get(`customer/${customerId}/order-items/`);
        setOrders(response?.data?.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle download count increase
  const handleIncreaseDownloadCount = async (productId) => {
    console.log(productId);

    try {
      const response = await api.post(
        `/update-product-download-count/${productId}/`
      );
      if (response.data.bool) {
        // Update the state to reflect the new download count
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.product.id === productId
              ? {
                  ...order,
                  product: {
                    ...order.product,
                    downloads: order.product.downloads + 1,
                  },
                }
              : order
          )
        );
      } else {
        console.error("Failed to update download count");
      }
    } catch (err) {
      console.error("Error while updating download count", err);
    }
  };

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
                  <tr key="">
                    <th>#</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order?.id}>
                      <td>{index + 1}</td>
                      <td>
                        <Link>
                          <img
                            src={order.product.image}
                            className="img-thumbnail"
                            width={80}
                          />
                        </Link>
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/product/${order?.product?.title}/${order?.product?.id}/`}
                        >
                          <p>{order?.product?.title || "Product Name"}</p>
                        </Link>
                      </td>
                      <td>{order?.price}</td>
                      <td>
                        <span
                          className={
                            order.order.order_status
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          <i
                            className={`fa ${
                              order?.order?.order_status
                                ? "fa-check-circle"
                                : "fa-exclamation-triangle"
                            }`}
                          ></i>{" "}
                          {order?.order?.order_status
                            ? "Confirmed"
                            : "Failed"}
                        </span>
                      </td>
                      <td>
                        {order?.order?.order_status &&
                        order?.product?.product_file ? (
                          <a
                            target="_blank"
                            download
                            href={order?.product?.product_file}
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              handleIncreaseDownloadCount(order?.product?.id)
                            }
                          >
                            download&nbsp;
                            <span className="badge bg-white text-black">
                              {order?.product?.downloads}
                            </span>
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
