import React, { useState } from "react";
import "./styles.css";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-image" />
          <h2 className="login-title">AcadexPro</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Enter Password"
              />
            </div>
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          <div className="login-links">
            <a href="#">Forgot password?</a>
            <a href="#">Create account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;