import React, { useEffect } from 'react';
import './Product.css';

const Modal = ({ isOpen, onClose, children }) => {
  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Scroll lock
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto'; // Restore scroll
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box modal-animate"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside box
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
