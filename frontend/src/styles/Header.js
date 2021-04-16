import React, {useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import {LoginContext} from '../LoginContext';

import {Nav, NavDropdown} from 'react-bootstrap';

export default function Header(){
    const [user,setUser]=useContext(LoginContext);

    const Logout=()=>{
        localStorage.removeItem('token');
        setUser({isLoggedIn: false, role: ''});


    }

    if (user.isLoggedIn){
        if(user.role=='admin'){
            return(
                <nav className= "navbar  navbar-expand-lg bg-dark navbar-dark">
                    <Link to='/' class="navbar-brand" >LOGO</Link>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav  ">
                        <li className= "nav-item active">
                            <Link to="/" className="nav-link" > Accueil</Link>
                        </li>
                        <li className= "nav-item active">
                            <Link to="/Lister_utilisateurs" className="nav-link" > Utilisateurs</Link>
                        </li>
                        <NavDropdown title="Ajouter" id="basic-nav-dropdown">
                            <NavDropdown.Item> <Link to ="/AjoutProcedure">Ajouter une procedure</Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to="/AjoutFonction" >Ajouter une fonction</Link></NavDropdown.Item>
                            
                        </NavDropdown>
                       
                        <li className= "nav-item active">
                           <Link to="/Login" onClick={Logout} className="nav-link" > Déconnexion</Link>

                        </li>
                       
                    </ul>
                    </div>
        
        
                </nav>)

        }
        else{
            return(
                <nav className= "navbar navbar-expand-sm bg-dark navbar-dark">
                    <ul className="navbar-nav  ">
                        <li className= "nav-item active">
                            <Link to="/" className="nav-link" > Accueil</Link>
                            <Link to="/Login" onClick={Logout} className="nav-link" > Déconnexion</Link>

                        </li>
                        
                    </ul>
        
        
                </nav>)

        }
    }
    else{
        return null
    }

    


}

