interface Props {
    selectedOption: string;
    onSelectOption: (option: string) => void;
    handleLogoutClick: () => void;
  }
  
  const SettingsNav: React.FC<Props> = ({ selectedOption, onSelectOption, handleLogoutClick }) => {
    const options = [
      { label: "Account", icon: "manage_accounts" },
      { label: "Notifications", icon: "notifications" },
      { label: "Logout", icon: "logout" },
    ];
  
    return (
      <nav>
        {options.map(({ label, icon }) => (
          <button
          key={label}
          onClick={() => {
            onSelectOption(label);  // Trigger the state update in SettingsPage
            if (label === "Logout") { // If Logout is selected, trigger the modal
              handleLogoutClick(); // Trigger logout when "Logout" is clicked
            } else {
              onSelectOption(label);
            }
          }}
          className={selectedOption === label ? "active" : ""}
        >
          <span className="material-icons">{icon}</span>
          {label}
          </button>
        ))}
      </nav>
    );
  };
  
  export default SettingsNav;
  