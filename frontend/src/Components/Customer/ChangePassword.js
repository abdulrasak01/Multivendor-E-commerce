import React, { useState } from "react";
import SlideBar from "./SideBar";
import ForgotPassword from "./ForgotPassword";
import api from "../../api/api";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // Assuming the username is available or entered in the form
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to control showing forgot password form

  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword || !username) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      // Sending the password change request to the API
      const response = await api.fetch(`/customer/update-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (data.bool) {
        setSuccessMessage(data.msg);
        setError(null); // Clear any previous errors
      } else {
        setError(data.msg);
        setSuccessMessage(""); // Clear any previous success messages
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12 mb-2">
          <SlideBar />
        </div>
        <div className="col-md-9 col-12 mb-2">
          <div className="card">
            <h4 className="card-header">Change Password</h4>
            <div className="table-body">
              <form className="m-5" onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>

                {/* Forgot Password Link */}
                <p
                  onClick={() => setShowForgotPassword(true)}
                  style={{ cursor: "pointer" }} // Add the cursor pointer style here
                  className="text-primary mt-3"
                >
                  Forgot your current password?
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Show Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPassword closeForm={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default ChangePassword;
