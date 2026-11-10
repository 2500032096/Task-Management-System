import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Simulate slight network delay for better UX
      setTimeout(() => {
        // Retrieve existing users list from localStorage, or initialize empty array
        const existingUsers = JSON.parse(localStorage.getItem("taskflow_users")) || [];

        // Check if user already exists
        const userExists = existingUsers.some((user) => user.email === trimmedEmail);

        if (userExists) {
          alert("An account with this email already exists. Please login instead.");
          setLoading(false);
          return;
        }

        // Create new user object
        const newUser = {
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword, // In a real app, hash this on a backend
        };

        // Save updated users array to localStorage
        existingUsers.push(newUser);
        localStorage.setItem("taskflow_users", JSON.stringify(existingUsers));

        // Automatically set active session or redirect
        localStorage.setItem("active_session", JSON.stringify({ name: trimmedName, email: trimmedEmail }));

        alert("Registration Successful!");

        // Clear form inputs
        setName("");
        setEmail("");
        setPassword("");
        setLoading(false);

        // Optional: Redirect to dashboard/App view if routing is setup
        // window.location.href = "/";
      }, 300);
    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>TaskFlow</h1>
        <h2>Create Account</h2>
        <p>Register to manage your tasks</p>

        <form onSubmit={handleRegister}>
          <label htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;