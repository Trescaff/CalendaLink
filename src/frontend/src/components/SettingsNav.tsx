interface Props {
    selectedOption: string;
    onSelectOption: (option: string) => void;
  }
  
  const SettingsNav: React.FC<Props> = ({ selectedOption, onSelectOption }) => {
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
          onClick={() => onSelectOption(label)}
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
  