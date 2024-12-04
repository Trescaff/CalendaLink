import React, { useState } from "react";
import "./Notifications.css";

interface Settings {
  mute: {
    personalCalendar: boolean;
    combinedCalendar: boolean;
    combinedCalendarJoinLeave: boolean;
  };
  reminders: {
    combinedCalendar: boolean;
    personalCalendar: boolean;
    friendCalendar: boolean;
  };
}

const Notifications: React.FC = () => {
  const initialSettings: Settings = {
    mute: {
      personalCalendar: false,
      combinedCalendar: true,
      combinedCalendarJoinLeave: true,
    },
    reminders: {
      combinedCalendar: true,
      personalCalendar: true,
      friendCalendar: false,
    },
  };

  const [settings, setSettings] = useState<Settings>(initialSettings);

  const handleToggle = <T extends keyof Settings, K extends keyof Settings[T]>(
    category: T,
    key: K
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [key]: !prevSettings[category][key],
      },
    }));
  };

  const handleResetToDefault = () => {
    setSettings(initialSettings);
  };

  const handleSave = () => {
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div>
      <h1>Notification Settings</h1>
      <div className="section">
        <h2>Allow Notifications</h2>
        <div className="noti-form-group">
          <label>
            Someone adds or deletes an event for personal calendar
            <span
              className={`material-icons toggle-icon ${settings.mute.personalCalendar ? "" : "off"}`}
              onClick={() => handleToggle("mute", "personalCalendar")}
            >
              {settings.mute.personalCalendar ? "toggle_on" : "toggle_off"}
            </span>
          </label>
        </div>
        <div className="noti-form-group">
          <label>
            Someone adds or deletes an event for combined calendar
            <span
              className={`material-icons toggle-icon ${settings.mute.combinedCalendar ? "" : "off"}`}
              onClick={() => handleToggle("mute", "combinedCalendar")}
            >
              {settings.mute.combinedCalendar ? "toggle_on" : "toggle_off"}
            </span>
          </label>
        </div>
        <div className="noti-form-group">
          <label>
            Someone joins or leaves the combined calendar
            <span
              className={`material-icons toggle-icon ${settings.mute.combinedCalendarJoinLeave ? "" : "off"}`}
              onClick={() =>
                handleToggle("mute", "combinedCalendarJoinLeave")
              }
            >
              {settings.mute.combinedCalendarJoinLeave ? "toggle_on" : "toggle_off"}
            </span>
          </label>
        </div>
      </div>

      <div className="section">
        <h2>Allow Reminders</h2>
        <div className="noti-form-group">
          <label>
            Upcoming event from combined calendar
            <span
              className={`material-icons toggle-icon ${settings.reminders.combinedCalendar ? "" : "off"}`}
              onClick={() => handleToggle("reminders", "combinedCalendar")}
            >
              {settings.reminders.combinedCalendar
                ? "toggle_on"
                : "toggle_off"}
            </span>
          </label>
        </div>
        <div className="noti-form-group">
          <label>
            Upcoming event from your calendar
            <span
              className={`material-icons toggle-icon ${settings.reminders.personalCalendar ? "" : "off"}`}
              onClick={() => handleToggle("reminders", "personalCalendar")}
            >
              {settings.reminders.personalCalendar
                ? "toggle_on"
                : "toggle_off"}
            </span>
          </label>
        </div>
        <div className="noti-form-group">
          <label>
            Upcoming event from your friend's calendar
            <span
              className={`material-icons toggle-icon ${settings.reminders.friendCalendar ? "" : "off"}`}
              onClick={() => handleToggle("reminders", "friendCalendar")}
            >
              {settings.reminders.friendCalendar ? "toggle_on" : "toggle_off"}
            </span>
          </label>
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleResetToDefault} className="default-button">
          Default
        </button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Notifications;
