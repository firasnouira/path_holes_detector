import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MapComponent from './components/map/map';
import Home from './components/home/home';
import { useState } from 'react';
import UserC from './components/user/user';
import { floor } from '@tensorflow/tfjs';

function App() {

    interface User {
        username: string;
        password: string;
    }
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [displaySign,setDisplaySign] = useState(false);
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
    
    return (
        <div>
            
            {!showUserC && <Home loggedInUser={loggedInUser} onShowUserC={handleShowUserC}  />}
            {!showUserC && <MapComponent loggedInUser={loggedInUser} />}
            {showUserC && <UserC onLogin={handleLogin} onLogout={handleLogout} onHideUserC={handleHideUserC} />}

        </div>
    );
}

export default App;