import axios from "axios";
import React, { useState } from "react";

const CustomerLogin = () => {
   const baseURL = 'http://localhost:8000/api/'
   const [formError,setFormError] = useState(false)
   const [errMsg,setErrMsg] = useState('')
   const [input,setInput] = useState()

    const handleInput = (e) => {
      const { id, value } = e.target
      setInput((prev) => {
        return {
          ...prev,
          [id]: value,
        }
      })
      setFormError((prevState) => ({
        ...prevState,
        [id]: '',
      }))
    }

    const getValueForInput = (field) => {
      const value =
        input ? input[field] !== undefined ? input[field] : '' : null
      return value
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        const res = await axios.post(baseURL+'customer/login/',input)
        console.log(res);
        if(res.data.bool === false){
          setFormError(true)
          setErrMsg(res.data.msg)
        }
        else{
          localStorage.setItem('customer_login',true)
          localStorage.setItem('customer_id',res.data.id)
          localStorage.setItem('customer_username',res.data.user)
          setFormError(false)
          setErrMsg('')
        }
      } catch (error) {
        console.log(error);
      }
    }

  const checkCustomer = localStorage.getItem('customer_login')
  if(checkCustomer){
    window.location.href='/customer/dashboard'
  }

    console.log(input);
    


  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 col-12 offset-2">
          <div className="card">
            <h4 className="card-header">Login</h4>
            <div className="table-body">
              <form className="m-5">
                <div className="mb-3">
                  <label for="username" className="form-label">
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
                  <label className="form-label" for="pwd">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
