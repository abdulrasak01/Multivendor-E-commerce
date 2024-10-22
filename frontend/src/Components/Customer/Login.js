import React, { useState } from "react";

const Login = () => {
   const baseURL = 'http://localhost:8000/api'
   const [formError,setFormError] = useState('')
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
                <button type="submit" className="btn btn-primary">
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

export default Login;
