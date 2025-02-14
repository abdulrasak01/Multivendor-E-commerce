import axios from "axios";
import React, { useState } from "react";
import ForgotPassword from './ForgotPassword';  // Import the ForgotPassword component

const CustomerLogin = () => {
   const baseURL = 'http://localhost:8000/api/';
   const [formError, setFormError] = useState(false);
   const [errMsg, setErrMsg] = useState('');
   const [input, setInput] = useState({});
   const [showForgotPassword, setShowForgotPassword] = useState(false);  // State to control showing forgot password form

   const handleInput = (e) => {
      const { id, value } = e.target;
      setInput((prev) => ({
        ...prev,
        [id]: value,
      }));
      setFormError((prevState) => ({
        ...prevState,
        [id]: '',
      }));
   };

   const getValueForInput = (field) => {
      return input && input[field] ? input[field] : '';
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await axios.post(baseURL + 'customer/login/', input);
         if (res.data.bool === false) {
            setFormError(true);
            setErrMsg(res.data.msg);
         } else {
            localStorage.setItem('customer_login', true);
            localStorage.setItem('customer_id', res.data.id);
            localStorage.setItem('customer_username', res.data.user);
            setFormError(false);
            setErrMsg('');
         }
      } catch (error) {
         console.log(error);
      }
   };

   const checkCustomer = localStorage.getItem('customer_login');
   if (checkCustomer) {
      window.location.href = '/customer/dashboard';
   }

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
                              value={getValueForInput('username')}
                              onChange={handleInput}
                              error={formError.username}
                           />
                        </div>
                        <div className="mb-3">
                           <label htmlFor="password" className="form-label">
                              Password
                           </label>
                           <input
                              type="password"
                              className="form-control"
                              id="password"
                              value={getValueForInput('password')}
                              onChange={handleInput}
                              error={formError.password}
                           />
                        </div>
                        <button type="button" onClick={handleSubmit} className="btn btn-primary">
                           Submit
                        </button>
                        {errMsg && <p className="text-danger">{errMsg}</p>}
                     </form>
                     <p onClick={() => setShowForgotPassword(true)} className="text-primary cursor-pointer m-5">
                        Forgot Password?
                     </p>
                     {showForgotPassword && <ForgotPassword closeForm={() => setShowForgotPassword(false)} />}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CustomerLogin;
