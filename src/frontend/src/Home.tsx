import React, { useState } from "react";
import { NavBar } from "./HomeNav/NavBar";
import FriendList from "./HomeComponents/FriendList";
import BotNavBar from "./BottomNavBar/BotNavBar";
import CalendarDisplay from "./Calendar/CalendarDisplay";
import handleDeleteEvent from "./Calendar/CalendarDisplay";
import { ProfileBar } from "./HomeNav/ProfileBar";
import "./Home.css";
import EventPopup from "./HomeComponents/EventPopup";
import DeleteButton from "./components/DeleteButton";


function Home() {
  const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  return (
    <div>
      <NavBar />
      <div className="main-container">
        <ul>
          <ProfileBar />
          <FriendList />
        </ul>
        <CalendarDisplay />
      </div>
      <BotNavBar />

      <button
        className="add-event-button"
        onClick={() => setIsEventPopupOpen(true)}
      >
       + 
      </button>

      <DeleteButton onClick={() => setShowDeletePopup(true)} />

      {showDeletePopup && (
        <div className="delete-popup">
        <div className="popup-content">
          <h3>Are you sure you want to delete this event?</h3>
          <div className="button-container">
            <button onClick={handleDeleteEvent}>Yes</button>
            <button className="cancel" onClick={() => setShowDeletePopup(false)}>
              No
            </button>
          </div>
        </div>
      </div>
    )}

      {isEventPopupOpen && (
        <EventPopup onClose={() => setIsEventPopupOpen(false)} onSaveSuccess={() => {}} />
      )} 
    </div>
  );
}

export default Home;
