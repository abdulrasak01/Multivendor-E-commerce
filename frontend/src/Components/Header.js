import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { UserContext } from "../Context";
import { useContext } from "react";
import { CartContext } from "../Context";

const Header = () => {
  const userContext = useContext(UserContext);
  const {cartData,setCartData} = useContext(CartContext);

  return (
    <nav className="navbar navbar-expand-lg bg-success navbar-dark justify-between px-5 py-3">
      <div className="container-fluid w-auto">
        <Link className="navbar-brand" to="/">
          Python Market Place
        </Link>
      </div>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-5 mb-2 mb-lg-0 position-absolute end-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/categories">
              Categories
            </Link>
          </li>
          <li className="text-decoration-none">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                My Account
              </Dropdown.Toggle>

              <Dropdown.Menu>
              {userContext == "true" && (
                  <>
                    <Dropdown.Item>
                      <Link to="/customer/dashboard">Dashboard</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to="/customer/logout">Logout</Link>
                    </Dropdown.Item>
                  </>
                )}
                {userContext != "true" && (
                  <>
                    <Dropdown.Item>
                      <Link to="/customer/login">Login </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to="/customer/register"> Register </Link>
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="text-decoration-none">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Seller Panel
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/seller/login">Login </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/seller/register"> Register </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/seller/dashboard">Dashboard</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/seller/login">Logout</Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/checkout">
              New Orders {4}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/checkout">
              My Cart ({cartData?.length? cartData.length : 0})
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
