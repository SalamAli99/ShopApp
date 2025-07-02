import { useState, useEffect } from 'react';
import { useLocation , useNavigate } from 'react-router-dom';

function CreateProduct()
{
 const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    supplier: '',
    price: 0,
    avalible: false // Ensure it's a boolean (false by default)
  });
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate(); 

   const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


   const createProduct = async (e) => {
  e.preventDefault();

  if (!token) {
    setMessage('You must be logged in to create a product.');
    return;
  }

  try {
    const res = await fetch('http://127.0.0.1:8000/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    const data = await res.json();

    if (res.ok) {
      // Handle the successful product creation
      setMessage(data.message); // Set success message
      console.log('Created Product:', data.product); // You can log or use the returned product

      // Optionally reset the form or update product state
      setProduct({
        name: '',
        description: '',
        category: '',
        supplier: '',
        price: '',
        avalible: false,
      });

      // Navigate to products list page
       navigate('/products', { state: { product: data.product } });
    } else {
      // If there was an issue with the request (e.g., validation errors)
      setMessage(data.message || 'Failed to create product');
    }
  } catch (error) {
    console.error('Error:', error);
    setMessage('Server error.');
  }
}; 
return (
    <div>
        <h2>Create Product</h2>
      <form onSubmit={createProduct}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={product.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="supplier"
          placeholder="Supplier"
          value={product.supplier}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />
        <label>Available</label>
        <input
          type="checkbox"
          name="avalible"
          checked={product.available}  // Controlled checkbox state
          onChange={handleChange}
          
        />
        <button type="submit">Create</button>
      </form>

      {message && <p>{message}</p>} {/* Display message if available */}

    </div>
) 
}

export default CreateProduct;


