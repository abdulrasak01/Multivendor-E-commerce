import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context";
import { useNavigate } from "react-router-dom";
const CheckOut = (props) => {
  const { cartData, setCartData } = useContext(CartContext);
  const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);
  const navigate = useNavigate();

  const cartRemoveButtonHandler = (id) => {
    let previousCart = localStorage.getItem("cartData");
    previousCart = JSON.parse(previousCart);
    if (!Array.isArray(previousCart)) {
      previousCart = [];
    }
    const updatedCart = previousCart.filter((item) => item.product.id !== id);
    let cartString = JSON.stringify(updatedCart);
    localStorage.setItem("cartData", cartString);
    setCartButtonClickStatus(false);
    setCartData(updatedCart);
  };

  var sum = 0;
  cartData?.map((data) => {
    sum += parseFloat(data.product.price);
  });

  const navigator = (e) =>{
    e.preventDefault();
    navigate(`/confirm-order`);
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 ">
        All Items ({cartData?.length ? cartData?.length : 0})
      </h3>
      {cartData?.length > 0 && (
        <div className="row">
          <div className="col-md-8 col-12">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartData?.map((item, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <Link>
                            {" "}
                            <img
                              src={item?.product?.image}
                              className="img-thumbnail"
                              width={80}
                            />
                          </Link>
                          <Link>
                            <p>{item?.product?.title}</p>
                          </Link>
                        </td>
                        <td>Rs. {item?.product?.price}</td>
                        <td>
                          {" "}
                          <button
                            type="button"
                            onClick={() =>
                              cartRemoveButtonHandler(item?.product?.id)
                            }
                            title="Add to cart"
                            className="btn btn-warning ms-1"
                          >
                            {" "}
                            Remove from cart{" "}
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2">Total:</td>
                    <td>Rs. {sum}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" align="center">
                      <Link to="/categories" className="btn btn-secondary me-2">
                        {" "}
                        Continue Shopping
                      </Link>
                      <Link
                        className="btn btn-success"
                        onClick={(e) => navigator(e)}
                      >
                        Proceed
                      </Link>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
      {!cartData?.length && (
        <div>
          <h1>Nothing in the Cart</h1>
          <Link to="/categories" className="btn btn-secondary me-2">
            {" "}
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CheckOut;
