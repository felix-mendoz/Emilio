<<<<<<< HEAD
"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

interface LoginProps {
    onLogin: (email: string, password: string) => void
}

    const Login: React.FC<LoginProps> = ({onLogin}) => {
        const [email, setEmail] = useState("");
        const [password, setpassword] = useState("");

        const HandleSubmit = (event: React.FormEvent) => {
            event.preventDefault();
            onLogin(email,password);
        }

        return (
            <div className="login-container">
                <div className="login-box">
                    <div className="login-image"></div>
                    <div className="login-form">
                        <h2>Login</h2>
                        <form onSubmit={HandleSubmit}>
                            <div className="input-group">
                                <label htmlFor="">Email: </label>
                                <input type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} required className="input-field"/>
                                </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input type="password" className="input-field"
                                required
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}/>
                            </div>
                            
                            <button type="submit" className="login-button">Start session</button>
                        </form>
                        <div className="login-links">
                            <a href="#">Have you forgotten your password?</a>
                            <a href="#">Register</a>
                        </div>

                    </div>
                </div>
            </div>
        )

    }

export default Login
=======
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

export default Login;
>>>>>>> 0d2f521c0e463cf86c52caa4ec2ac2324d7d26f7
