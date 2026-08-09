import React, { useEffect, useState } from 'react';
import '../styles/Modal.css';

const Modal = ({ content, isOpen = true, onClose }) => {
    const [open, setOpen] = useState(isOpen);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    function close() {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }

  if (!open) return null;

  return (
    <div className="content-wrapper" role="dialog" aria-modal="true">
      {content}
      <button type="button" onClick={close} aria-label="Close modal">
        Close
      </button>
    </div>
  );
};

export default Modal;
