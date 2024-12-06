// /*belum habis lagi*/
// import { Link } from "react-router-dom";
// import { IoIosNotifications } from "react-icons/io";
// import { useState } from "react";
// import "./NavBar.css"

// // Utility function to format the time
// const formatDateTime = (date: Date) => {
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   const time = `${hours}:${minutes}`;

//   // Format the full date as "YYYY-MM-DD"
//   const dateString = date.toISOString().split('T')[0];

//   return `${dateString} ${time}`;
// };

// // Get the current time here, before using it in state
// const currentTime = new Date();

// export const NavBar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [notifications, setNotifications] = useState([
//     { id: 1, message: "aekay joined", createdAt: new Date(currentTime.getTime() - 2 * 60 * 60 * 1000)},
//     { id: 2, message: "syushou left", createdAt: new Date()},
//   ]);

//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev);
//   };

//   const dismissNotification = (id: number) => {
//     setNotifications((prev) => prev.filter((notif) => notif.id !== id));
//   };

//   return (
//     <nav className="navbar">
//       <ul className="left-upper-navbar">
//         <Link to="/Home">Home</Link>
//       </ul>
//       <ul className="right-upper-navbar">
//         <div className="notification-dropdown">
//           <div onClick={toggleDropdown} className="notification-icon">
//           <IoIosNotifications />
//           </div>
//           {dropdownOpen && (
//             <div className="dropdown-menu">
//             {notifications.length > 0 ? (
//               notifications.map((notification) => (
//                 <div key={notification.id} className="notification-item">
//                   <div className="notification-text">
//                     <p>{notification.message}</p>
//                     <span>{formatDateTime(notification.createdAt)}</span>
//                   </div>
//                   <button
//                     onClick={() => dismissNotification(notification.id)}
//                     className={notification.id === 1 ? "close-button-1" : "close-button-2"}
//                   >
//                     X
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className="no-notifications">No new notifications</p>
//             )}
//           </div>
//         )}
//           </div>
//           <Link to="/AllCalendar">All Calendar</Link>
//         </ul>
//     </nav>
//   );
// };

import { Link } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../components/UserContext";
import "./NavBar.css";

interface Event {
  _id: number;
  title: string;
  description: string;
  startTime: string;

  endTime: string;
  date: Date;
  username: string; // Indicates the owner of the event
  type: "personal" | "combined"; // To differentiate between personal and combined events
}

export const NavBar = () => {
  const { username } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Event[]>([]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif._id !== id));
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const today = new Date();

        // Fetch combined events (groupmates' events)
        const combinedResponse = await axios.get(
          `https://localhost:5000/user/${username}/combined-events`
        );
        const combinedEvents = combinedResponse.data.map((event: any) => ({
          ...event,
          username: event.username,
          date: new Date(event.date),
          type: "combined",
        }));

        // Fetch user-specific events
        const userResponse = await axios.get(
          `https://localhost:5000/user/${username}/events`
        );
        const userEvents = userResponse.data.map((event: any) => ({
          ...event,
          username: username,
          date: new Date(event.date),
          type: "personal",
        }));

        // Combine both user and combined events
        const allEvents = [...userEvents, ...combinedEvents];

        // Filter for future and ongoing events
        const filteredEvents = allEvents.filter((event: Event) => {
          const eventEndDateTime = new Date(
            `${event.date.toISOString().split("T")[0]}T${event.endTime}`
          );
          return eventEndDateTime >= today; // Include ongoing and future events
        });

        // Set filtered events as notifications
        setNotifications(filteredEvents);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [username]);

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
                  <div key={notification._id} className="notification-item">
                    <div className="notification-text">
                      <p>
                        {notification.type === "personal"
                          ? "Your upcoming event:"
                          : "Upcoming event from combined calendar:"}
                      </p>
                      <p>
                        {notification.title}{" "}
                        <span className="username">
                          ({notification.username})
                        </span>
                      </p>
                      <p>
                        {notification.startTime} - {notification.endTime}
                      </p>
                      <p>
                        {new Date(notification.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification._id)}
                      className="close-button"
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-notifications">No upcoming events</p>
              )}
            </div>
          )}
        </div>
        <Link to="/AllCalendar">All Calendar</Link>
      </ul>
    </nav>
  );
};



