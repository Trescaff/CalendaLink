import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import axios from "axios";
import "./ProfileBar.css";
import { useUser } from "../components/UserContext";
import DisplayPicture from "../assets/DisplayProfile.jpg";

export const ProfileBar = () => {

  const [personalProfile, setPersonalProfile] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { username } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //const username = 
        const response = await axios.get(`https://localhost:5000/user/${username}`);
        const user = response.data;
        setPersonalProfile(user.fullName || user.username);
        setPhoneNumber(user.phoneNumber);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="profile-card">
      <ul>
        <Link to="/PersonalProfile">
          <li>
          <img
              src={DisplayPicture}
              alt="Profile Avatar"
              className="profile-avatar"
            />
            <div className="profile-details">
              <h3>{personalProfile}</h3>
              <p>{phoneNumber}</p>
            </div>
          </li>
        </Link>
        <div className="profile-settings">
          <Link to="/Setting">
            <IoSettingsOutline className="setting-icon" />
          </Link>
        </div>
      </ul>
    </nav>
  );
};
