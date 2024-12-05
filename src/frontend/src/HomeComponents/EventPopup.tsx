import React, { useState } from "react";
import axios from "axios";
import "./EventPopupCSS.css";
import { useUser } from "../components/UserContext";

interface EventPopupProps {
  onClose: () => void;
  onSaveSuccess: () => void; // Callback for successful save
}

const EventPopup: React.FC<EventPopupProps> = ({ onClose, onSaveSuccess }) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Me");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const { username } = useUser();

  const handleSave = async () => {

    const eventData = {
      title,
      startTime,
      endTime,
      description,
      category,
      location,
      date,
    };


    try {
      const response = await axios.post("https://localhost:5000/calendar/add", {
        username: username, // Use the dynamic username prop
        event: eventData,
      });

      if (response.status === 201) {
        console.log("Event added successfully:", response.data);
        onSaveSuccess(); // Notify parent of success
        onClose(); // Close the popup
      } else {
        console.error("Error adding event:", response.data.message);
        alert("Failed to add event: " + response.data.message);
      }
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response) {
        // The request was made and the server responded with an error status
        alert("An error occurred: " + error.response.data.message);
      } else {
        // The request was made but no response was received or another error occurred
        alert("An error occurred while saving the event.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="event-popup">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2 className="popup-title">
        <span role="img" aria-label="bell">
          🔔
        </span>{" "}
        Event
      </h2>
      <div className="popup-grid">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Text"
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Me">Me</option>
            <option value="All">All</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </div>
        <div className="repeat-section">
          <button className="repeat-button">Repeat</button>
          <span>Never</span>
        </div>
      </div>
      <div className="popup-actions">
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="save-button"
          onClick={handleSave}
          //onClick={() => console.log("Save Event")}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EventPopup;
