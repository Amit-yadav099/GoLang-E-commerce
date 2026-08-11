
import React, {useState, useEffect} from 'react';
import ProductCard from '../components/ProductCard';

import '../styles/home.css';

const Home = () => {
  const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(true);

useEffect(()=>{
  const fetchProducts = async ()=>{
    try{
      const res=await fetch('/api/products');
      const data=await res.json();
      setProducts(data.slice(0,4)); //featured products
    }
    catch(error){
       console.error(error);
    } finally{
    setLoading(false);
    }
  };
  fetchProducts();
},[]);

return (
  <div className='home-container'>
    <div className='hero-banner'>'
       <h1>Welcome to ShopEase</h1>
       <p>Discover the best products at unbeatable prices.</p>
    </div>
    <h2>Featued Products</h2>
    {loading ?(
         <div>Loading...</div>
    ):
    ( <div className='product-grid'>
       {products.map((product)=>(
        <ProductCard key={product._id} product={product}/>
       ))}
    </div>
    )}
  </div>
 );
};

export default Home;