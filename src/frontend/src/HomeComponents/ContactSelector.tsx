import React, { useState } from "react";
import axios from "axios";
import "./ContactSelector.css";
import { useUser } from "../components/UserContext";

interface Contact {
  name: string;
  status: string;
}

interface ContactSelectorProps {
  onClose: () => void;
}
//HALLOOOO
const ContactSelector: React.FC<ContactSelectorProps> = ({ onClose }) => {
  //const [activeTab, setActiveTab] = useState<"Email" | "Contact">("Contact");
  //const [searchQuery, setSearchQuery] = useState("");
  const [newEmail, setNewEmail] = useState(""); // State for the email input
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const { username } = useUser(); 

  // Function to handle adding new email
  const handleEmailSubmit = async () => {
    if (newEmail.trim() !== "") {
      setContacts((prevContacts) => [
        ...prevContacts,
        { name: newEmail, status: "Added" },
      ]);

      try {
        const response = await axios.post("https://localhost:5000/Home", {
          email: newEmail,
          username: username,
        });

        if (response.data.success) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.name === newEmail
                ? { ...contact, status: "Email Sent" }
                : contact
            )
          );
          console.log("Email sent successfully");
        }
        } catch (error) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.name === newEmail
                ? { ...contact, status: "Failed" }
                : contact
            )
          );
          console.error("Failed to send email");
        }
    }
  };

  const handleCodeSubmit = async () => {
    if (verificationCode.trim() !== "") {
      try {
        const response = await axios.post("https://localhost:5000/verify-code", {
          email: newEmail,
          code: verificationCode,
          username: username,
        });

        if (response.data.success) {
          setContacts((prevContacts) => [
            ...prevContacts,
            { name: response.data.user, status: "Added" },
          ]);
          setStep(1); // Reset to step 1
          setNewEmail("");
          setVerificationCode("");
        } else {
          alert("Invalid verification code");
        }
      } catch (error) {
        console.error("Error verifying code:", error);
      }
      finally {
        setNewEmail(""); // Clear the input field after adding
      }
    }
  };

  return (
    <div 
      style={{
        width: "400px",
        height: "250px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(8, 0, 0, 0.1)",
        padding: "20px",
        position: "relative",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1>Add Email</h1>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#999",
          
        }}
      >
        &times;
      </button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "right",
            height: "40px", // Adjust height as needed
            gap: "20px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center", // Vertically center input and button
              gap: "10px", // Add spacing between input and button
            }}
          >
            <input
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEmailSubmit();
              }}
              style={{
                display: "inline-block",
                width: "60%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #e0e0e0",
                marginBottom: "10px",
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <button
              onClick={handleEmailSubmit}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#4F46E5",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              Add Email
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center", // Vertically center input and button
              gap: "10px", // Add spacing between input and button
            }}
          >
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              style={{
                width: "60%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #e0e0e0",
                marginBottom: "10px",
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <button onClick={handleCodeSubmit}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4F46E5",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              textAlign: "center",
              marginBottom: "10px",
            }}>
              Verify Code</button>
          </div>
        </div>
    </div>
  );
};

export default ContactSelector;