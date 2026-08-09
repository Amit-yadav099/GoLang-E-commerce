import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';

import About from './pages/About';
import ReturnPolicy from './pages/ReturnPolicy';
import Disclaimer from './pages/Disclaimer';

import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from "./pages/VerifyEmail";

import ProductDetail from './pages/ProductDetail.jsx';

import Shop from './pages/Shop.jsx';
import Cart from './pages/Cart.jsx';

import Checkout from './pages/Checkout.jsx';


import Profile from './pages/Profile.jsx';

import OrderSuccess from './pages/OrderSuccess.jsx';

import AdminDashboard from './admin/AdminDashboard.jsx';
import AddProduct from './admin/AddProduct.jsx';
import AdminProducts from './admin/AdminProducts.jsx';
import EditProduct from './admin/EditProduct.jsx';
import AdminOrders from './admin/AdminOrders.jsx';
import AdminUsers from './admin/AdminUsers.jsx';

import { Toaster } from "react-hot-toast";


function App() {
  return (
  <Router>
  
    <Navbar/>
    <div className='main-content'>
    <Toaster position="top-right" />
    <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/shop" element={<Shop/>}/>

         <Route path="/cart" element={<Cart/>}/>
         <Route path="/Checkout" element={<Checkout/>}/>

         <Route path="/about" element={<About/>}/>
         <Route path="/return" element={<ReturnPolicy/>}/>
         <Route path="/disclaimer" element={<Disclaimer/>}/>

          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/products/:id" element={<ProductDetail/>}/>

          <Route path="/profile" element={<Profile />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
    </Routes>
    </div>
    <Footer/>

  </Router>
  );
}

export default App;
