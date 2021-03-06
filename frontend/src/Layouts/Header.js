import React, {useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import {LoginContext} from '../Authentification/LoginContext';
import logo from '../images/logo-white.png';
import './Header.style.css';

export default function Header(){
    const [user,setUser]=useContext(LoginContext);

    const Logout=()=>{
        localStorage.removeItem('token');
        setUser({isLoggedIn: false, role: ''});
    }

    if (user.isLoggedIn){
        if(user.role=='admin'){
            return(
                <nav className= " navbar navbar-expand-lg nav-color">
                    <div className="container ">
                    <Link to='/' class="navbar-brand " >
                        <img className=" image3" src={logo} alt={logo}/>
                    </Link>
                        
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav  ">
                        <li className= "nav-item active">
                            <Link to="/" className="nav-link nav-text" > Accueil</Link>
                        </li>
                        <li className= "nav-item active">
                            <Link to="/Lister_utilisateurs" className="nav-link nav-text " > Utilisateurs</Link>
                        </li>
                        
                        <li className= "nav-item active">
                           <Link to="/Home" onClick={Logout} className="nav-link nav-text " > Déconnexion</Link>

                        </li>
                       
                    </ul>
                    
                    </div>
                    </div>
        
                </nav>)

        }
        else{
            return(
                <nav className= " navbar navbar-expand-lg nav-color">
                <div className="container ">
                <Link to='/' class="navbar-brand " >
                    <img className=" image3" src={logo} alt={logo}/>
                </Link>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav  ">
                        <li className= "nav-item active">
                            <Link to="/Affichage" className="nav-link nav-text" > Accueil</Link>
                        </li><li className= "nav-item active">
                           <Link to="/Home" onClick={Logout} className="nav-link nav-text " > Déconnexion</Link>

                        </li>
                       
                    </ul>
                        
                </div>   
                </div>
        
                </nav>)

        }
    }
    else{
        return null
    }

    


}

