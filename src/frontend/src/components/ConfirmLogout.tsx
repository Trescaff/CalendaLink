import React from "react";
import "./ConfirmLogout.css";

interface ConfirmLogoutProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmLogout: React.FC<ConfirmLogoutProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Are you sure you want to log out?</h3>
        <div className="modal-actions">
          <button onClick={onConfirm}>Yes, log out</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogout;
