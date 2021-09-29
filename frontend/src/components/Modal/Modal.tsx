import React from 'react';
import './Modal.css';

interface ModalProps {
  open: Boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FunctionComponent<ModalProps> = ({
  open,
  onClose,
  children
}) => {

  if (!open) {
    return null
  }

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content box" style={{ width: 400 }}>
        {children}
      </div>
    </div>
  )
}

export default Modal
