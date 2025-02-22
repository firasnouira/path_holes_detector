import React, { useState } from 'react';
import axios from 'axios';
import reactLogo from "../../images/icon_1.png"
import './user.css';
interface User {
    username: string;
    password: string;
}

interface UserCProps {
    onLogin: (user: User) => void;
    onLogout: () => void;
    onHideUserC: () => void;
}

const UserC: React.FC<UserCProps> = ({ onLogin, onLogout, onHideUserC }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Track logged-in user

    const handleLogin = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/login`, { username, password })
            .then(response => {
                console.log(response.data);
                setMessage(response.data.message);
                onLogin({ username, password });
            })
            .catch(error => {
                console.error(error);
                setMessage('Error: Invalid username or password');
            });
    };

    const handleSignup = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/signup`, { username, password })
            .then(response => {
                console.log(response.data);
                setMessage(response.data.message);
                onLogin({ username, password });
            })
            .catch(error => {
                console.error(error);
                setMessage('Error: Username already exists');
            });
    };

    const handleLogout = () => {
        onLogout();
        setMessage('');
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin();
        } else {
            handleSignup();
        }
    };
    const toggleForm = () => {
        setIsLogin(prevState => !prevState);
        setMessage('');
      };

    return (

        <div className="userc-form-box">
            <nav>
                <a className="logo" href="index.html"><img src={reactLogo} alt="Logo"></img></a>
                <div className="navigation">
                    <ul>
                        <li><a href="index.html">Accueil</a></li>
                        <li><a href="#">À Propos</a></li>
                        <li><a href="#model-preview">Signaler</a></li>
                        <li><a href="#"><button className='btn btn-primary btn-sm' onClick={onHideUserC}>Sign In / Sign Up</button></a></li>
                    </ul>
                </div>
            </nav>
            <div className="fcontainer">
            <div className="form-container">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input className="form-control" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input className="form-control" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary" type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                    </div>
                </form>
                <p>{message}</p>
                <p>{isLogin ? "Don't have an account?" : "Already have an account?"} <button className="btn btn-link" onClick={toggleForm}>{isLogin ? 'Sign Up' : 'Login'}</button></p>
                <p><button className="btn btn-primary btn-sm" onClick={onHideUserC}>Close</button></p>
            </div>
        </div>
        </div>
    );
};
export default UserC