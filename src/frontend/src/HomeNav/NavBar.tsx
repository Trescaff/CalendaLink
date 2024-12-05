/*belum habis lagi*/

import { Link } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { useState } from "react";
import "./NavBar.css"

export const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Syushou joined", time: "2 mins ago"},
    { id: 2, message: "Aekay left", time: "5 mins ago" },
  ]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <nav className="navbar">
      <ul className="left-upper-navbar">
        <Link to="/Home">Home</Link>
      </ul>
      <ul className="right-upper-navbar">
        <div className="notification-dropdown">
          <div onClick={toggleDropdown} className="notification-icon">
          <IoIosNotifications />
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-text">
                    <p>{notification.message}</p>
                    <span>{notification.time}</span>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="close-button"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p className="no-notifications">No new notifications</p>
            )}
          </div>
        )}
          </div>
          <Link to="/AllCalendar">All Calendar</Link>
        </ul>
    </nav>
  );
};
/*
export const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <ul className="left-upper-navbar">
        <Link to="/Home">Home</Link>
      </ul>
      <ul className="right-upper-navbar">
        <div className="notification-dropdown">
          <div onClick={toggleDropdown} className="notification-icon">
            <IoIosNotifications />
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p>No new notifications</p>
              <Link to="/SomeNotificationPage">View All</Link>
            </div>
          )}
        </div>
        <Link to="/AllCalendar">All Calendar</Link>
      </ul>
    </nav>
  );
};
*/