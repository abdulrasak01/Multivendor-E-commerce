import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { UserContext } from "../Context";
import { useContext } from "react";
import { CartContext } from "../Context";
import Font from "react-font";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  const userContext = useContext(UserContext);
  const { cartData, setCartData } = useContext(CartContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-lg px-4 py-3">
      <div className="container-fluid">
        <Link
          style={{ backgroundColor: "transparent" }}
          className="navbar-brand header-font"
          to="/"
        >
          <div className="navbar-nav align-items-center w-auto">
            <div className="nav-item">
              <FontAwesomeIcon icon="fa-solid fa-dumpster" size="2x" />
            </div>
            <div className="nav-item mt-3">
              <Font family="Roboto Bold">
                <h3>``  Elite Market Place</h3>
              </Font>
            </div>
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/categories">
                Categories
              </Link>
            </li>

            {/* User Account Dropdown */}
            <li className="nav-item">
              <Dropdown>
                <Dropdown.Toggle
                  variant="transparent"
                  id="dropdown-user"
                  className="text-white"
                >
                  My Account
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {userContext === "true" ? (
                    <>
                      <Dropdown.Item>
                        <Link to="/customer/dashboard">Dashboard</Link>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Link to="/customer/logout">Logout</Link>
                      </Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item>
                        <Link to="/customer/login">Login</Link>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Link to="/customer/register">Register</Link>
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </li>

            {/* Seller Panel Dropdown */}
            <li className="nav-item">
              <Dropdown>
                <Dropdown.Toggle
                  variant="transparent"
                  id="dropdown-seller"
                  className="text-white"
                >
                  Seller Panel
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link to="/seller/login">Login</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to="/seller/register">Register</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to="/seller/dashboard">Dashboard</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to="/seller/logout">Logout</Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>

            {/* New Orders Link */}
            <li className="nav-item">
              <Link className="nav-link text-white p-1" to="/checkout">
                New Orders <span className="badge bg-success ms-1">4</span>
              </Link>
            </li>

            {/* Cart Icon with Item Count */}
            <li className="nav-item">
              <Link className="nav-link text-white p-1" to="/checkout">
                <FaShoppingCart className="fs-4" />
                <span className="badge bg-success ms-2">
                  {cartData?.length ? cartData.length : 0}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
