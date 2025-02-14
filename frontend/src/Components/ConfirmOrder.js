import { UserContext } from "../Context";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartContext } from "../Context";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const ConfirmOrder = () => {
  const userContext = useContext(UserContext);
  const { cartData, setCartData } = useContext(CartContext);
  const baseURL = "http://localhost:8000/api";
  const [orderId, setOrderId] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [totalAmountInINR, setTotalAmountInINR] = useState(0);
  const [totalAmountInUSD, setTotalAmountInUSD] = useState(0);

  const exchangeRate = 80;

  useEffect(() => {
    if (cartData && cartData.length > 0) {
      const totalInRupees = cartData.reduce((acc, cart) => acc + (cart.product.price * 1), 0);
      setTotalAmountInINR(totalInRupees);
      setTotalAmountInUSD((totalInRupees / exchangeRate).toFixed(2));
    }
  }, [cartData]);

  const addOrderInTable = async () => {
    const customerId = localStorage.getItem("customer_id");
    const payload = {
      customer: parseInt(customerId),
    };
    try {
      const res = await axios.post(baseURL + "/orders/", payload);
      const orderId = res.data.id;
      orderItems(orderId);
      setOrderId(orderId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userContext) {
      window.location.href = "/customer/login";
    } else {
      addOrderInTable();
    }
  }, [userContext]);

  const orderItems = async (orderId) => {
    // Retrieve cart data from localStorage
    var previousCart = localStorage.getItem("cartData");
    var cartJson = JSON.parse(previousCart);

    if (cartJson !== null && cartJson.length > 0) {
      // Create an array of promises for all axios requests
      const postRequests = cartJson.map((cart, index) => {
        const formData = new FormData();
        formData.append("order", orderId);
        formData.append("product", cart.product.id);
        formData.append("qry", 1);
        formData.append("price", cart.product.price);

        return axios
          .post(baseURL + "/order-items/", formData)
          .then(function (response) {
            // Return the updated cart to be used later
            return index; // Return index for removal
          })
          .catch(function (error) {
            console.log(error);
            return null; // In case of error, don't remove this item
          });
      });

      // Wait for all axios requests to complete
      const completedIndices = await Promise.all(postRequests);

      // Filter out items that were successfully added (based on the returned index)
      const updatedCartJson = cartJson.filter(
        (_, index) => !completedIndices.includes(index)
      );

      // Update localStorage with the modified cart
      localStorage.setItem("cartData", JSON.stringify(updatedCartJson));

      // Update the state
      setCartData(updatedCartJson);
    }
  };

  const changePaymentMethod = (payMethod) => {
    setPayMethod(payMethod);
  };

const updateOrderStatus = (orderStatus) =>{
    axios.post(baseURL+'update-order-status/'+orderId).then(function(response){
      window.location.href = '/customer/dashboard'
    }).catch(function(error){
      console.error(error);      
    })
}

console.log(totalAmountInUSD);

  

  return (
    <div className="container">
      <div className="row mt-5 py-3">
        <div className="card py-3 items-center">
          <h3 className="text-center">
            <i className="fa fa-check-circle text-success"></i>Your Order has
            been confirmed{" "}
          </h3>
          <h5 className="'text-center  mx-auto"> ORDER ID: {orderId}</h5>
          <h5 className="text-center mx-auto">
            Total Amount: ₹{totalAmountInINR} (Approx. ${totalAmountInUSD})
          </h5>
        </div>
        <div className="card p-3 mt-4">
          <form>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="payMethod"
                  onChange={() => {
                    changePaymentMethod("paypal");
                  }}
                />{" "}
                Paypal
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="payMethod"
                  onChange={() => {
                    changePaymentMethod("stripe");
                  }}
                />{" "}
                Stripe
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="payMethod"
                  onChange={() => {
                    changePaymentMethod("rozorpay");
                  }}
                />{" "}
                RazorPay
              </label>
            </div>
          </form>
          {payMethod === "paypal" && (
            <div className='mt-3 w-full mx-5'>
              <PayPalScriptProvider options={{"clientId":"Adegy14MEcUM1hoXd_rNquqImn6dpVRJuS9LSrUCJ8JrhpP7frE0f-udOW75JzjxecIkMetPY8of4K4D"}}>
                <PayPalButtons createOrder={(data,actions)=>{
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: totalAmountInUSD,
                        },
                      },
                    ],
                  });
                }} onApprove={(data,actions)=>{
                  return actions.order.capture().then(details => {
                    const name = details.payer.name.given_name;
                    alert(`Transaction completed by ${name}`)
                  })
                }}/>
              </PayPalScriptProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
