import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MapComponent from './components/map/map';
import Home from './components/home/home';
import { useEffect, useState } from 'react';
import UserC from './components/user/user';
import axios from 'axios';


function App() {

    interface User {
        username: string;
        password: string;
    }
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    /*   const [displaySign,setDisplaySign] = useState(false); */
    const [showUserC, setShowUserC] = useState(false);
    // Function to update loggedInUser state
    const handleLogin = (user: User) => {
        setLoggedInUser(user);
    };
    const handleLogout = () => {
        setLoggedInUser(null);
    };
    const handleShowUserC = () => {
        setShowUserC(true); // Set showUserC state to true to display UserC
    };

    const handleHideUserC = () => {
        setShowUserC(false); // Set showUserC state to false to hide UserC
    };

    const [isBackendReady, setIsBackendReady] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Checking backend status...");
    useEffect(() => {
        let tries = 0;
        const wakeUpBackend = async () => {

            try {
                // Hit your normal login or a custom /ping endpoint on your HF space
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/ping`, {
                    timeout: 4000
                });

                if (response.data && response.data.status === "success") {
                    setIsBackendReady(true);
                }
            } catch (error) {

                if (tries >= 10 ) {
                    alert("The backend is taking longer than expected to wake up. starting front anyway, but some features may not work until it's ready.");
                    setIsBackendReady(true);
                } else {
                    console.error(error);
                    tries++;
                    setLoadingMessage("Waking up the AI/Flask backend on Hugging Face... This can take up to 60 seconds.  Number of tries: " + tries + " / 10");

                    setTimeout(wakeUpBackend, 5000);
                }
            }
        };

        wakeUpBackend();
    }, []);

    if (!isBackendReady) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center bg-light text-dark" style={{ height: '100vh' }}>
                {/* Bootstrap Spinning Wheel */}
                <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                
                {/* Your Loading Messages */}
                <div className="text-center px-3" style={{ maxWidth: '500px' }}>
                    <h5 className="fw-semibold text-secondary mb-2">Connecting to Backend</h5>
                    <p className="text-muted small">{loadingMessage}</p>
                </div>
            </div>
        );
    }
    return (
        <div>
            {!showUserC && <Home loggedInUser={loggedInUser} onShowUserC={handleShowUserC} />}
            {!showUserC && <MapComponent loggedInUser={loggedInUser} />}
            {showUserC && <UserC onLogin={handleLogin} onLogout={handleLogout} onHideUserC={handleHideUserC} />}

        </div>
    );
}

export default App;