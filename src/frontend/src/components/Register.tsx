import { Link } from "react-router-dom";
import React, { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    try {
      console.log("Submitting:", { username, password }); // Log the form data

      const response = await fetch("http://192.168.1.135:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", response.status); // Log response status

      const data = await response.json();

      console.log("Response data:", data); // Log the response data

      if (response.ok) {
        setMessage(data.message); // Show success message
      } else {
        setMessage(data.message); // Show error message
      }
    } catch (error) {
      console.error("Error occurred during registration:", error); // Log the error
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-register">
      <div className="wrapper">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
          <div className="register-link">
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Register;
