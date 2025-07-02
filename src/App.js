import './App.css';
import Products from './components/product/Products';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import UpdateProduct from './components/product/UpdateProduct';
import ShowProduct from './components/product/ShowProduct';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/show/:id" element={<ShowProduct />} />
        <Route path="/update/:id" element={<UpdateProduct />} />

      </Routes>
    </Router>
  );
}

export default App;
