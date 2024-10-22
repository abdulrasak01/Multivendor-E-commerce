import "bootstrap/dist/css/bootstrap.css";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Categories from "./Components/Categories";
import CategoryProducts from "./Components/CategoryProducts";
import AllProducts from "./Components/AllProducts";
import ProductDetail from "./Components/ProductDetail";
import CheckOut from "./Components/CheckOut";
import TagProducts from "./Components/TagProducts";

// Customer Panel
import Register from "./Components/Customer/Register";
import Login from "./Components/Customer/Login";
import Dashboard from "./Components/Customer/Dashboard";
import Orders from "./Components/Customer/Orders";
import OrderSuccess from "./Components/Customer/OrderSuccess";
import OrderFailure from "./Components/Customer/OrderFailure";
import ChangePassword from "./Components/Customer/ChangePassword";
import WishList from "./Components/Customer/WishList";
import UpdateProfile from "./Components/Customer/UpdateProfile";
import AddressList from "./Components/Customer/AddressList";
import AddAddress from "./Components/Customer/AddAddress";

// Seller Panel
import SellerRegister from "./Components/Seller/SellerRegister";
import SellerLogin from "./Components/Seller/SellerLogin";
import SellerDashboard from "./Components/Seller/SellerDashboard";
import SellerProducts from "./Components/Seller/SellerProducts";
import AddProduct from "./Components/Seller/AddProduct";
import VendorOrders from "./Components/Seller/VendorOrders";
import Customers from "./Components/Seller/Customers";
import Reports from "./Components/Seller/Reports";
import VendorProfile from "./Components/Seller/VendorProfile";
import VendorChangePassword from "./Components/Seller/VendorChangePassword";

function App() {
  return (
    <div className="">
      <Router>
      <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/category/:category_slug/:category_id' element={<CategoryProducts />} />
          <Route path='/product/:product_slug/:product_id' element={<ProductDetail />} />
          <Route path='/products/:tag' element={<TagProducts />} />
          <Route path='/checkout' element={<CheckOut />} />
          <Route path='/customer/order-success' element={<OrderSuccess />} />
          <Route path='/customer/order-failure' element={<OrderFailure />} />
          <Route path='/customer/register' element={<Register />} />
          <Route path='/customer/login' element={<Login />} />
          <Route path='/customer/change-password' element={<ChangePassword />} />  {/* Redirect to login page after logout */}
          <Route path='/customer/dashboard' element={<Dashboard />} />
          <Route path='/customer/update-profile' element={<UpdateProfile />} /> 
          <Route path='/customer/orders' element={<Orders />} />
          <Route path='/customer/wish-list' element={<WishList />} /> 
          <Route path='/customer/addresses' element={<AddressList />} /> 
          <Route path='/customer/add-address' element={<AddAddress />} /> 

          {/* Seller route */}
          <Route path='/seller/login' element={<SellerLogin />} /> 
          <Route path='/seller/register' element={<SellerRegister />} /> 
          <Route path='/seller/dashboard' element={<SellerDashboard />} /> 
          <Route path='/seller/products' element={<SellerProducts />} />
          <Route path='/seller/add-product' element={<AddProduct />} />
          <Route path='/seller/orders' element={<VendorOrders />} />
          <Route path='/seller/customers' element={<Customers />} />
          <Route path='/seller/reports' element={<Reports />} />
          <Route path='/seller/profile' element={<VendorProfile />} />
          <Route path='/seller/password' element={<VendorChangePassword />} />
          
        </Routes>
      <Footer />
      </Router>
    </div>
  );
}

export default App;
