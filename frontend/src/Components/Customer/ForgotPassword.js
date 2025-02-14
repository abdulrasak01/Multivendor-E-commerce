import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = ({ closeForm }) => {
   const [email, setEmail] = useState('');
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const handleInputChange = (e) => {
      setEmail(e.target.value);
      setError('');
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post('http://localhost:8000/api/customer/forgot-password/', { email });
         if (response.data.bool) {
            setSuccess(response.data.msg);
            setEmail('');
         } else {
            setError(response.data.msg);
         }
      } catch (error) {
         setError('Something went wrong, please try again.');
      }
   };

   return (
      <div className="modal" style={{ display: 'block' }}>
         <div className="modal-dialog">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title">Forgot Password</h5>
                  <button type="button" className="btn-close" onClick={closeForm}></button>
               </div>
               <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                     <div className="mb-3">
                        <label htmlFor="email" className="form-label">Enter your email</label>
                        <input
                           type="email"
                           className="form-control"
                           id="email"
                           value={email}
                           onChange={handleInputChange}
                           required
                        />
                     </div>
                     {error && <p className="text-danger">{error}</p>}
                     {success && <p className="text-success">{success}</p>}
                     <button type="submit" className="btn btn-primary">Submit</button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword;
