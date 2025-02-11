
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';
import reactLogo from "../../images/icon_1.png"
import Model from '../model/model';

interface User {
    username: string;
    password: string;
  }
  
  interface HomeProps {
    loggedInUser: User | null;
    onShowUserC: () => void;
  }
  
function Home({loggedInUser, onShowUserC} : HomeProps) {
    
    return (
        <>
            <nav>
                <a className="logo" href="index.html"><img src={reactLogo} alt="Logo"></img></a>
                <div className="navigation">
                    <ul>
                        <li><a href="index.html">Accueil</a></li>
                        <li><a href="#">À Propos</a></li>
                        <li><a href="#model-preview">Signaler</a></li>
                        <li><a href="#"><button className='btn btn-primary btn-sm'onClick={onShowUserC}>Sign In / Sign Up</button></a></li>
                    </ul>
                </div>
            </nav>
            <section id="home">
                <h2>Signalement et Détection des Défauts Routiers</h2>
                <p>Signalez et Détectez les Défauts Routiers avec IA. Des routes plus sûres et une gestion efficace de l'infrastructure !</p>
                <div className="btn">
                    <a className="blue" href="#model-preview">Essayer Maintenant</a>
                    <a className="yellow" href="#">À Propos</a>
                </div>
            </section>
            <section id="features">
                <h1>Fonctionnalités du Projet</h1>
                <p>Détection, Signalement et classification automatique des Défauts Routiers</p>
                <div className="fea-base">
                    <div className="fea-box">
                        <i className="fa-sharp fa-solid fa-magnifying-glass-location"></i>
                        <h3>Détection</h3>
                        <p>Trouver ou Détecez Automatiquement les défauts sur les routes grâce à l'IA.</p>
                    </div>
                    <div className="fea-box">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <h3>Signalement</h3>
                        <p>Permettre aux citoyens de signaler les défauts rencontrés en interagissant avec une carte Google Maps et un formulaire.</p>
                    </div>
                    <div className="fea-box">
                        <i className="fa-solid fa-chart-simple"></i>
                        <h3>Classification</h3>
                        <p>Afficher les défauts routiers sur la carte avec différentes couleurs selon leur niveau de danger : bas, moyen et élevé.</p>
                    </div>
                </div>
            </section>
            <section id="model-preview">
                <section id="model-preview" className="text-center my-5">
                    <h1> Détecter les défauts routiers Maintenant</h1>
                    <Model loggedInUser={loggedInUser}  />
                </section>
            </section>
            <div className="hint">
                <strong>Hint : </strong>
                {loggedInUser ? "Double click on the map to simulate current location" : "Log in to begin detecting"}
            </div>
        </>
    )
}


export default Home