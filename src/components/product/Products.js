import { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom'; // Ensure this is here!

const api = `http://127.0.0.1:8000/api/products`;

function Products() {
  

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  
  const[type,setType]=useState('');
  const displayedProducts = type === 'list' ? data : products;
const fetchFilteredProducts = async () => {
   if (!category) {
    setMessage('Please select a category');
    
    return;
  }
 
   try {
      const res = await fetch(`http://127.0.0.1:8000/api/productfilter/?category=${encodeURIComponent(category)}`);
      const data = await res.json();
      setType('filter');
      if (res.ok) {
      setProducts(Array.isArray(data) ? data : data.products || []);   
      setMessage('');
        // setSearch (state), not just search = true
      } else {
        setMessage('Failed to fetch products');
      }
    } catch (err) {
      setMessage('Error fetching products');
    }
  };
  
const fetchProducts = async () => {
  setType('list');
      try {
        const res = await fetch(api);
        const data = await res.json();
        console.log('API response:', data);

        // Automatically use array if direct or in json.data
        const products = Array.isArray(data) ? data : data.data || [];
        setData(products);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  useEffect(() => {
 fetchProducts();
  }, []);

 
 
const deleteProduct = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this product?");
  if (!confirm) return;
if (!token) {
          console.log('you must be logged in ');
      return;}
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://127.0.0.1:8000/api/product/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert('Product deleted successfully');
      // Optionally refresh list or navigate
     fetchProducts();  // or navigate('/products')
    } else {
      alert(data.message || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Server error');
  }
};

const fetchSortedProducts = async (direction) => {
  setType('sort');
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/productsort/${direction}`);
    const data = await res.json();

    if (res.ok) {
      
      setProducts(data.products); 
      setMessage(data.message);
      
    } else {
      setMessage('Failed to fetch sorted products');
    }
  } catch (err) {
    setMessage('Error fetching sorted products');
  }
};

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/'); // Navigate to login page
  };

return (
  <div>
    <div>
       <button onClick={() => window.location.reload()}>
          Back to Product List
        </button>
      <button onClick={() => fetchSortedProducts('a')}>Sort A-Z</button>
      <button onClick={() => fetchSortedProducts('d')}>Sort Z-A</button>
      <button className="btn btn-warning" onClick={logout}>LogOut</button>
     <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />
      <button onClick={fetchFilteredProducts}>Search</button>
      
        




          <ul>
            {displayedProducts.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong>
                <p>Description: {item.description}</p>
                <p>Category: {item.category}</p>
                <p>Supplier: {item.supplier}</p>
                <p>Price: {item.price}</p>
                <p>Available: {item.avalible ? 'yes' : 'no'}</p>
                <button onClick={() => navigate(`/show/${item.id}`)}>Show</button>
                <button onClick={() => navigate(`/update/${item.id}`)}>Edit</button>
                <button onClick={() => deleteProduct(item.id)}>Delete</button>
                <hr />
              </li>
            ))}
          </ul>
  </div>
  </div>
);}

export default Products;
