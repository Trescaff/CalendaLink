import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!email.includes('@')) {
      setMessage("Please enter a valid email address with'@'");
      return; // Stop the form submission if the email is invalid
    }

    try {
      console.log("Submitting:", { email, username, password }); // Log the form data

      const response = await axios.post("http://localhost:5000/register", {
        email,
        username,
        password,
      });

      console.log("Response status:", response.status); // Log response status

      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.message || "An error occurred");
      } else {
        setMessage("An unexpected error occurred");
      }
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
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
