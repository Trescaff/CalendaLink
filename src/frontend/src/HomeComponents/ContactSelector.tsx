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

const ContactSelector: React.FC<ContactSelectorProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"Email" | "Contact">("Contact");
  const [searchQuery, setSearchQuery] = useState("");
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
        const response = await axios.post("http://localhost:5000/Home", {
          email: newEmail,
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
        const response = await axios.post("http://localhost:5000/verify-code", {
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


  const handleStatusChange = (index: number) => {
    setContacts((prev) =>
      prev.map((contact, i) =>
        i === index
          ? { ...contact, status: contact.status === "Add" ? "Added" : "Add" }
          : contact
      )
    );
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        width: "400px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(8, 0, 0, 0.1)",
        padding: "20px",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
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

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e0e0e0",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveTab("Email")}
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            borderBottom: activeTab === "Email" ? "3px solid #4F46E5" : "none",
            background: "none",
            color: activeTab === "Email" ? "#4F46E5" : "#999",
            fontWeight: activeTab === "Email" ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          Email
        </button>
        <button
          onClick={() => setActiveTab("Contact")}
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            borderBottom:
              activeTab === "Contact" ? "3px solid #4F46E5" : "none",
            background: "none",
            color: activeTab === "Contact" ? "#4F46E5" : "#999",
            fontWeight: activeTab === "Contact" ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          Contact
        </button>
      </div>

      {/* Email Tab */}
      {activeTab === "Email" && step === 1 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "150px", // Adjust height as needed
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
              width: "80%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0",
              marginBottom: "10px",
              textAlign: "center",
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
            }}
          >
            Add Email
          </button>
        </div>
      ): (
        <div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
          />
          <button onClick={handleCodeSubmit}>Verify Code</button>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === "Contact" && (
        <div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0",
              marginBottom: "20px",
            }}
          />
          {filteredContacts.map((contact, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: `2px solid ${
                      contact.status === "Added" ? "#4F46E5" : "#E11D48"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    fontWeight: "bold",
                    color: contact.status === "Added" ? "#4F46E5" : "#E11D48",
                  }}
                >
                  {contact.name[0]}
                </div>
                <span>{contact.name}</span>
              </div>
              <button
                onClick={() => handleStatusChange(index)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor:
                    contact.status === "Added" ? "#4F46E5" : "#e0e0e0",
                  color: contact.status === "Added" ? "white" : "#333",
                  cursor: "pointer",
                }}
              >
                {contact.status}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactSelector;