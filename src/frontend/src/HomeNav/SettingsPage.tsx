import { useNavigate } from "react-router-dom"; 
import { useState } from "react";
import SettingsNav from "../components/SettingsNav.tsx";
import Notifications from "../components/Notifications.tsx";
import Account from "../components/Account.tsx";
// import ConfirmLogout from "../components/ConfirmLogout.tsx";
import "./SettingsPage.css";

const SettingsPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("Profile");
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLogoutModalVisible(true); // Show the logout confirmation popup
  };

  const confirmLogout = () => {
    console.log("Confirmed logout");
    setIsLogoutModalVisible(false); // Close the popup
    navigate("/"); // Redirect to the login page
  };

  const cancelLogout = () => {
    console.log("Cancelled logout");
    setIsLogoutModalVisible(false); // Close the popup without logging out
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "Account":
        return <Account />;
      case "Notifications":
        return <Notifications />;
      case "Logout":
        handleLogoutClick();
        return null;
      default:
        return <Account />;
    }
  };


  return (
    <div className="settings-page">
      <div className="settings-nav">
        <SettingsNav
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption} 
          handleLogoutClick={handleLogoutClick}
         />
      </div>

      <div className="settings-content">
        {renderContent()}
      </div>

      {isLogoutModalVisible && (
        <div className="logout-modal">
          <div className="modal-content">
            <h3>Are you sure you want to log out?</h3>
            <div className="button-container">
              <button onClick={confirmLogout}>Yes</button>
              <button className="cancel" onClick={cancelLogout}>No</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
