import { useState } from "react";
import { NavBar } from "./NavBar";
import BotNavBar from "../BottomNavBar/BotNavBar";
import "./Notification.css";

const Notification = () => {
  // State to handle dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <NavBar />
      <h1>Notification</h1>
      <BotNavBar />
      <div className="notification-container">
        <h1>Notifications</h1>
        <div className="notification-dropdown">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            Notifications
            <span className={`arrow ${isOpen ? "open" : ""}`}>&#x25BC;</span>
          </button>
          {isOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">You have a new event!</div>
              <div className="dropdown-item">Your friend has joined a calendar.</div>
              <div className="dropdown-item">Reminder: Event in 30 minutes.</div>
            </div>
          )}
        </div>
      </div>
      <BotNavBar />
    </div>
  );
};

export default Notification;
