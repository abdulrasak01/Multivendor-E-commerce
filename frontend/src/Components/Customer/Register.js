import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/api";

const Register = () => {
  const [input,setInput] = useState()
  const [successMsg,setSuccessMsg] = useState('')
  const [formError,setFormError] = useState(false)
  const [errMsg,setErrMsg] = useState('')
  const handleInput = (e) => {
    const { id, value } = e.target
    setInput((prev) => {
      return {
        ...prev,
        [id]: value,
      }
    })
  }

  
  const handleSubmit = async (e) => {
    try {
      const res = await api.post('customer/register/',input)
      if(res.data.bool === false){
        setFormError(true)
        setErrMsg(res.data.msg)
      }
      else{
      setSuccessMsg(res.data.msg)}
    } catch (error) {
      console.log(error);
    }
  }

  const getValueForInput = (field) => {
    const value =
      input ? input[field] !== undefined ? input[field] : '' : ''
    return value
  }

  useEffect(()=>{
    console.log(successMsg);
  },[successMsg])
  
  

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 col-12 offset-2">
          <div className="card">
            <h4 className="card-header">Register</h4>
            <div className="table-body">
              <form className="mx-5 my-2">
              <div className="">
              <p className="text-secondary mt-1"><strong>Note: </strong>All fields are required</p>
              {successMsg && <p className="text-success bold">{successMsg}</p>}
              {errMsg && <p className="text-danger">{errMsg}</p>}
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    onChange={handleInput}
                    value={getValueForInput("first_name")}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    onChange={handleInput}
                    value={getValueForInput("last_name")}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    User Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={getValueForInput("username")}
                    onChange={handleInput}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={getValueForInput("email")}
                    onChange={handleInput}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="pwd">
                    Mobile no.
                  </label>
                  <input
                    type="mobile"
                    className="form-control"
                    id="mobile"
                    value={getValueForInput('mobile')}
                    onChange={handleInput}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="pwd">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={getValueForInput("password")}
                    onChange={handleInput}
                  />
                </div>
                <button onClick={handleSubmit} type="button" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
