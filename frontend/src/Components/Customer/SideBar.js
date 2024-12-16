import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="list-group">
      <Link
        to="/customer/dashboard"
        className="list-group-item list-group-item-action"
      >
        Dashboard
      </Link>
      <Link
        to="/customer/orders"
        className="list-group-item list-group-item-action"
      >
        Orders
      </Link>
      <Link
        to="/customer/wish-list"
        className="list-group-item list-group-item-action"
      >
        Wishlist
      </Link>
      <Link
        to="/customer/update-profile"
        className="list-group-item list-group-item-action"
      >
        Profile
      </Link>
      <Link
        to="/customer/change-password"
        className="list-group-item list-group-item-action"
      >
        Change Password
      </Link>
      <Link
        to="/customer/addresses"
        className="list-group-item list-group-item-action"
      >
        Addresses
      </Link>
      <Link
        to="/customer/logout"
        className="list-group-item list-group-item-action text-danger"
      >
        Logout
      </Link>
    </div>
  );
};

export default SideBar;
