import React, { useEffect, useState } from "react";
import SlideBar from "./SideBar";
import api from "../../api/api"; // Assuming you have an API instance set up

const UpdateProfile = () => {
  const [details, setDetails] = useState({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    mobile: "", 
    profile_img: null,
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const customerId = localStorage.getItem("customer_id");
      try {
        const response = await api.get(`customer/${customerId}/`);
        setDetails(response.data);
        setFormData({
          first_name: response.data.user.first_name || "",
          last_name: response.data.user.last_name || "",
          username: response.data.user.username || "",
          email: response.data.user.email || "",
          mobile: response.data.mobile || "", // Handle mobile field
          profile_img: response.data.profile_img || null, // Handle existing profile image
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change (profile image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profile_img: file,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerId = localStorage.getItem("customer_id");
    const updateData = new FormData();

    // Append text fields to FormData
    updateData.append("first_name", formData.first_name);
    updateData.append("last_name", formData.last_name);
    updateData.append("username", formData.username);
    updateData.append("email", formData.email);
    updateData.append("mobile", formData.mobile); 

    // Check if the profile image exists and is a valid file
    if (formData.profile_img && formData.profile_img instanceof File) {
      updateData.append("profile_img", formData.profile_img);
    }

    try {
      const response = await api.put(`customer/${customerId}/`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming the response contains the updated profile image URL or data
      setFormData((prevData) => ({
        ...prevData,
        profile_img: response.data.profile_img || prevData.profile_img, // Update with the returned image URL if available
      }));

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
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
            <h4 className="card-header">Update Profile</h4>
            <div className="table-body">
              <form className="m-5" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
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
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="profileImg"
                    onChange={handleFileChange}
                  />
                  {formData.profile_img && (
                    <div className="mt-2">
                      {/* If it's a file object (newly uploaded), use URL.createObjectURL */}
                      {formData.profile_img instanceof File ? (
                        <img
                          src={URL.createObjectURL(formData.profile_img)}
                          alt="Profile Preview"
                          style={{ width: "100px", height: "100px" }}
                        />
                      ) : (
                        // Otherwise, display the image from the URL (fetched or updated)
                        <img
                          src={formData.profile_img}
                          alt="Profile"
                          style={{ width: "100px", height: "100px" }}
                        />
                      )}
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary mt-4">
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

export default UpdateProfile;
