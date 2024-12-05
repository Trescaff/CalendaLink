import React, {useState} from "react";
import "./DeleteButton.css";

interface DeleteButtonProps {
  onClick: () => void;
}

function DeleteButton({ onClick }: DeleteButtonProps) {

  return (
    <div>
      <button className="delete-button" onClick={onClick}>
        Delete
      </button>
    </div>
  );
}

export default DeleteButton;
