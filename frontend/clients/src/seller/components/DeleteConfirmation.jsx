import React from 'react';
import Modal from './Modal';

const DeleteConfirmation = ({ product, onConfirm, onCancel }) => {
  return (
    <Modal isOpen={!!product} onClose={onCancel}>
      <h3>Confirm Deletion</h3>
      <p>
        Are you sure you want to delete <strong>{product?.name}</strong>?
      </p>

      <div className="modal-actions">
        <button className="btn btn-delete" onClick={onConfirm}>
          Yes, Delete
        </button>
        <button className="btn btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
