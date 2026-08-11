
import React, {useState, useContext} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext'
import '../styles/auth.css';

import { User, Mail, Lock } from "lucide-react";

const Register= ()=>{
   const [name,setName]=useState('');
   const[email,setEmail]=useState('');
   const [password,setPassword]=useState('');

   const {login}= useContext(AuthContext);
   
   const navigate= useNavigate();

    const handleSubmit = async (e)=>{
      e.preventDefault();
      try{
        const res= await fetch('/api/auth/register',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({name,email,password})
        });

        const data= await res.json();
        if(res.ok){
        navigate('/verify-email', {
        state: {email: data.email}
        });   
       }
        else{
        alert(data.message);
        }
      }
      catch(error){
         console.error(error);
      }
    };
    
   return (
  <div className="auth-container">

     
    <div className="auth-card">
    

      <div className="auth-header">
        
      <img src="/shopEase.png" alt="ShopEase" className="auth-logo"/>
      
        <h2>Create Account</h2>
        <p>Join ShopEase today</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">

        <div className="input-group">
          <User size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Mail size={18} className="input-icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Lock size={18} className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-btn">
          Create Account
        </button>

        <p className="auth-footer">
          Already have an account?
          <Link to="/login">
            Login
          </Link>
        </p>

      </form>

    </div>

  </div>
);
};

export default Register;
