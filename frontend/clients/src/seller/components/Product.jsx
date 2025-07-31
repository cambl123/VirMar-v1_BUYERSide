import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductForm from "../forms/ProductForm";
import DeleteConfirmation from "./DeleteConfirmation";
import sellerApi from "../../api/seller.api.js";
import "./Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // TODO: Replace with actual storeId (from context or seller profile)
  const storeId = "YOUR_SELLER_STORE_ID_HERE";

  useEffect(() => {
    if (!storeId) return;
    sellerApi
      .fetchStoreItems(storeId)
      .then((res) => setProducts(res.data.items))
      .catch((err) => console.error("Failed to fetch products", err));
  }, [storeId]);

  const openAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const res = await sellerApi.updateItemById(editingProduct._id, productData);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? res.data.item : p))
        );
      } else {
        const res = await sellerApi.addItemToStore(storeId, productData);
        setProducts((prev) => [...prev, res.data.item]);
      }
      closeForm();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const requestDelete = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    try {
      await sellerApi.deleteItemById(productToDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  return (
    <div className="product-section">
      <div className="product-header">
        <h2>Your Products</h2>
        <button className="add-btn" onClick={openAddForm}>
          + Add Product
        </button>
      </div>

      {isFormOpen && (
        <ProductForm
          initialData={editingProduct}
          onCancel={closeForm}
          onSave={handleSaveProduct}
        />
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={() => openEditForm(product)}
            onDelete={() => requestDelete(product)}
          />
        ))}
      </div>

      {productToDelete && (
        <DeleteConfirmation
          product={productToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Product;
