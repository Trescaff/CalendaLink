import React from "react";
import "./UserCard.css";

const UserCard: React.FC = () => {
  const members = [
    { name: "Faiz Chan", id: "2022320144", image: "../src/assets/chill.jpg" },
    { name: "Nur Afiqah Amni", id: "2022320153", image: "../src/assets/chill.jpg" },
    { name: "Hafizuddin", id: "2022320072", image: "../src/assets/chill.jpg" },
    { name: "Farah Dyana", id: "2022320038", image: "../src/assets/chill.jpg" },
    { name: "Anis Khatijah", id: "2022320060", image: "../src/assets/chill.jpg" },
    { name: "Nurul Syuhada", id: "2022320107", image: "../src/assets/chill.jpg" },
    { name: "Nur Syuhada", id: "2022320091", image: "../src/assets/chill.jpg" },
    { name: "Amirul Hafiz", id: "2022320015", image: "../src/assets/chill.jpg" },
  ];

  return (
    <div className="user-card">
      {/* Close Button */}
      <button
        className="close-button"
        onClick={() => {
          window.history.back(); // Go back when the close button is clicked
        }}
      >
        &times;
      </button>

      {/* Group Details */}
      <div className="user-card-image">
        <img
          src="../src/assets/header.jpg" // Replace with your group logo or picture
          alt="CalendaLink Logo"
        />
      </div>
      <div className="user-card-details">
        <p className="user-role">Our Team Members:</p>
        {/* Team List */}
        <ul className="team-list">
          {members.map((member, index) => (
            <li key={index} className="team-member">
              <img
                src={member.image}
                alt={member.name}
                className="member-picture"
              />
              <div>
                <div className="member-name">{member.name}</div>
                <div className="member-id">{member.id}</div>
              </div>
            </li>
          ))}
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
