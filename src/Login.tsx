import React, {useState} from "react";
import "./styles.css"

interface LoginProps {
    onLogin : (email: string, password: string) => void;
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

    export default Login;