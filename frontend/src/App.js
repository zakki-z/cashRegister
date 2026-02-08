import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/product';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter valid product details');
      return;
    }

    try {
      const url = isEditing ? API_URL : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
        setError('');
      } else {
        setError('Failed to save product');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString()
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProducts();
        setError('');
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', price: '' });
    setIsEditing(false);
  };

  return (
      <div className="container">
        <div className="content">
          <header className="header">
            <h1 className="title">Products</h1>
            <div className="divider"></div>
          </header>

          {error && (
              <div className="error">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <input
                  type="text"
                  placeholder="Product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
              />
              <input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="button-primary">
                {isEditing ? 'Update' : 'Create'}
              </button>
              {isEditing && (
                  <button type="button" onClick={resetForm} className="button-secondary">
                    Cancel
                  </button>
              )}
            </div>
          </form>

          <div className="product-list">
            {products.length === 0 ? (
                <p className="empty-state">No products yet</p>
            ) : (
                products.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-info">
                        <span className="product-name">{product.name}</span>
                        <span className="product-price">${product.price}</span>
                      </div>
                      <div className="product-actions">
                        <button
                            onClick={() => handleEdit(product)}
                            className="action-button"
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => handleDelete(product.id)}
                            className="action-button-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
  );
}

export default App;
