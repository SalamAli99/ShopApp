import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    supplier: '',
    price: 0,
    available: false
  });

  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch the product details to populate the form
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) setProduct(data.products);
        else setMessage(data.message || 'Failed to load product');
      } catch (err) {
        setMessage('Error fetching product');
      }
    };

    if (id && token) fetchProduct();
  }, [id, token]);

  const update = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('You must be logged in to update a product.');
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Product updated successfully');
        navigate('/products', { state: { product: data.products } });
      } else {
        setMessage(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server error.');
    }
  };

  return (
    <div>
      <h2>Update Product</h2>
      <form onSubmit={update}>
        <input
          value={product.name||''}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="Name"
        />
        <textarea
          value={product.description||''}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          placeholder="Description"
        />
        <input
          value={product.category||''}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          placeholder="Category"
        />
        <input
          value={product.supplier||''}
          onChange={(e) => setProduct({ ...product, supplier: e.target.value })}
          placeholder="Supplier"
        />
        <input
          type="number"
          value={product.price||0}
          onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
          placeholder="Price"
        />
        <label>
          avalible:
          <input
            type="checkbox"
            checked={product.avalible||false}
            onChange={(e) => setProduct({ ...product, avalible: e.target.checked })}
          />
        </label>
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateProduct;
