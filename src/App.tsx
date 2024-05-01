
import MapForm from './components/form/form'
import './App.css'
import MapComponent from './components/map/map'

function App() {
  


  return (
    <>
  
    <body>
        <nav>
         
            <div className="navigation">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Report</a></li>
                    <li><a href="#">Login | Register</a></li>
                </ul>
            </div>
        </nav>
        <section id="home">
            <h2>Détection et classNameification des Défauts Routiers</h2>
            <p>Détectez et classNameez les Défauts Routiers avec IA . Des routes plus sûres et une gestion efficace de l'infrastructure !</p>
            <div className="btn">
                <a className="blue" href="#model-preview">Prévisualisation du modèle IA</a>
                <a className="yellow" href="#">About</a>
            </div>
        </section>
        <section id="features">
            <h1>Fonctionnalités du Projet</h1>
            <p>Détection, analyse et classNameification automatique des Défauts Routiers</p>
            <div className="fea-base">
                <div className="fea-box">
                    <i className="fa-sharp fa-solid fa-magnifying-glass-location"></i>
                    <h3>Détection</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="fea-box">
                    <i className="fas fa-cog"></i>
                    <h3>Analyse</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="fea-box">
                    <i className="fa-solid fa-chart-simple"></i>
                    <h3>classNameification</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            </div>
        </section>
        <section id="model-preview">
            <h1>Prévisualisation du modèle IA</h1>
            
            <video width="800px" height="300px" controls>
                
            </video>
        </section>
        <MapComponent/>
    </body>
    
    </>
  )
  
}

export default App
