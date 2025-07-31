import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';
import '../components/Product.css';

const ProductForm = ({ initialData, onCancel, onSave }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [description, setDescription] = useState(initialData?.description || '');

  useEffect(() => {
    setName(initialData?.name || '');
    setPrice(initialData?.price || '');
    setDescription(initialData?.description || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      alert('Please enter name and price');
      return;
    }

    onSave({
      id: initialData?.id || Date.now(),
      name: name.trim(),
      price: price.trim(),
      description: description.trim(),
    });
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Product Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Price
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="form-buttons">
          <button type="submit" className="btn btn-save">
            Save
          </button>
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
