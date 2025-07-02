import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ShowProduct() {
 // Get the dynamic 'id' from the URL
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [data, setData] = useState(null);
  const navigate = useNavigate();
const { id } = useParams();
  useEffect(() => {
    const showProduct = async () => {
      try {
         const res = await fetch(`http://127.0.0.1:8000/api/product/${id}`);
        
        const json = await res.json();
        console.log('API response:', json);

        if (res.ok) {
          setData(json.products); // Assuming API returns product as object
        } else {
          console.error('Failed to fetch product', json);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    if (id) {
      showProduct();
    }
  }, [id]); // Re-run when `id` changes
const deleteProduct = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this product?");
  if (!confirm) return;
if (!token) {
          console.log('yoy must be logged in ');
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
     navigate('/products');
    } else {
      alert(data.message || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Server error');
  }
};

  return (
    <div>
      <button type="button" onClick={() => navigate('/products')}>Back to Products List</button>

      <h2>Selected Product</h2>
      
      {data ? (
        <div>
          <strong>{data.name}</strong>
          <p>Description: {data.description}</p>
          <p>Category: {data.category}</p>
          <p>Supplier: {data.supplier}</p>
          <p>Price: ${data.price}</p>
          <p>avalible: {data.avalible ? 'Yes' : 'No'}</p>
          <button type="button" onClick={() => navigate(`/update/${data.id}`)}>Edit</button>
          <button onClick={() => deleteProduct(data.id)}>Delete</button>
        </div>
      ) : (
        <p>Loading or no product found.</p>
      )}
    </div>
  );
}

export default ShowProduct;
