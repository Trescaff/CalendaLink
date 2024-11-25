import React from "react";
import "../UserCard.css";

interface UserCardProps {
  onClose: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ onClose }) => {
  return (
    <div className="user-card">
      {/* Close Button */}
      <button className="close-button" onClick={onClose}>
        &times;
      </button>

      {/* Group Details */}
      <div className="user-card-image">
        <img
          src="../src/assets/header.png" // Replace with your group logo or picture
          alt="CalendaLink Logo"
        />
      </div>
      <div className="user-card-details">
        <h2 className="user-name">CalendaLink</h2>
        <p className="user-role">Our Team Members:</p>
        {/* Updated Team List */}
        <ul className="team-list">
          <li>
            <div className="member-name">Nur Syuhada</div>
            <div className="member-id">2022320091</div>
          </li>
          <li>
            <div className="member-name">Farah Dyana</div>
            <div className="member-id">2022320038</div>
          </li>
          <li>
            <div className="member-name">Faiz Chan</div>
            <div className="member-id">2022320144</div>
          </li>
          <li>
            <div className="member-name">Anis Khatijah</div>
            <div className="member-id">2022320060</div>
          </li>
          <li>
            <div className="member-name">Nur Afiqah Amni</div>
            <div className="member-id">2022320153</div>
          </li>
          <li>
            <div className="member-name">Nurul Syuhada</div>
            <div className="member-id">2022320107</div>
          </li>
          <li style={{ marginLeft: "300px" }}>
            <div className="member-name">Amirul Hafiz</div>
            <div className="member-id">2022320015</div>
          </li>
        </ul>
        <blockquote className="user-quote">
          "Connecting schedules, empowering collaboration – CalendaLink
          simplifies your time."
        </blockquote>
      </div>
    </div>
  );
};

export default UserCard;
