import { useNavigate } from "react-router-dom"; 
import { useState } from "react";
import SettingsNav from "../components/SettingsNav.tsx";
import Notifications from "../components/Notifications.tsx";
import Account from "../components/Account.tsx";
// import ConfirmLogout from "../components/ConfirmLogout.tsx";
import "./SettingsPage.css";

const SettingsPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("Profile");
//   const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (selectedOption) {
      case "Account":
        return <Account />;
      case "Notifications":
        return <Notifications />;
      case "Logout":
        navigate("/");
        return null;
      default:
        return <Account />;
    }
  };

//   const handleLogoutConfirm = () => {
//     navigate("/");
//     setIsModalOpen(false); 
//   };

//   const handleLogoutCancel = () => {
//     setIsModalOpen(false);
//   };

  return (
    <div className="settings-page">
      <div className="settings-nav">
        <SettingsNav
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />
      </div>

      <div className="settings-content">
        {renderContent()}
      </div>

      {/* <ConfirmLogout
        isOpen={isModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      /> */}
    </div>
  );
};

export default SettingsPage;
