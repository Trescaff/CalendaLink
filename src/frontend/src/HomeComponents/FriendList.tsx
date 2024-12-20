import { IoAdd, IoChevronForward } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./FriendList.css";
import ContactSelector from "./ContactSelector";
import { useUser } from "../components/UserContext";
import chillguy from "../assets/chill.jpg";

type Friend = {
  username: string;
  fullName?: string;
  phoneNumber?: string;
};

function FriendList() {
  const [isContactSelectorOpen, setIsContactSelectorOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const { username } = useUser();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`https://localhost:5000/user/${username}/friends`);
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="friend-list-container">
      <div className="link-container">
        <Link to="/CombinedCalendar" className="calendar-button">
          Combined Calendar
          <IoChevronForward className="arrow-icon" />
        </Link>
      </div>
      <ul className="friend-list">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.username} className="friend-item">
              <div className="avatar">
              <img
                  src={chillguy}
                  alt="Profile Avatar"
                  className="profile-avatar"
                />
                <div>
                  <p className="friend-name">{friend.fullName || friend.username}</p>
                  <p className="friend-id">{friend.phoneNumber}</p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No friends connected</p>
        )}
      </ul>
      <button
        className="add-button"
        onClick={() => setIsContactSelectorOpen(true)}
      >
        <IoAdd /> Add
      </button>

      {isContactSelectorOpen && (
        <div className="popup-overlay">
          <ContactSelector onClose={() => setIsContactSelectorOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default FriendList;