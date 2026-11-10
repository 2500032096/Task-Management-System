import React, { useState } from "react";
import "./Login.css"; // Reuse or create a login stylesheet

function Login({ onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    // Retrieve registered users from localStorage
    const users = JSON.parse(localStorage.getItem("taskflow_users")) || [];

    // Find user matching email and password
    const foundUser = users.find(
      (u) => u.email === trimmedEmail && u.password === trimmedPassword
    );

    setTimeout(() => {
      if (foundUser) {
        // Save active session
        const sessionData = { name: foundUser.name, email: foundUser.email };
        localStorage.setItem("taskflow_active_session", JSON.stringify(sessionData));
        
        alert("Login Successful!");
        onLoginSuccess(sessionData); // Update parent state
      } else {
        alert("Invalid email or password. Please check your credentials.");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>TaskFlow</h1>
        <h2>Welcome Back</h2>
        <p>Login to manage your tasks</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={switchToRegister} style={{ color: "#6366f1", cursor: "pointer", fontWeight: "600" }}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;