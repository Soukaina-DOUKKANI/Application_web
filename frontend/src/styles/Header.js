import React, {useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import {LoginContext} from '../LoginContext';



export default function Header(){
    const [user,setUser]=useContext(LoginContext);

    function Logout(){
        localStorage.removeItem('token');
        setUser({isLoggedIn: false, role: ''});


    }

    if (user.isLoggedIn){
        if(user.role=='admin'){
            return(
                <nav className= "navbar navbar-expand-sm bg-dark navbar-dark">
                    <ul className="navbar-nav  ">
                        <li className= "nav-item active">
                            <Link to="/" className="nav-link" > Home page</Link>
                            <Link to="/Utilisateurs" className="nav-link" > Utilisateurs</Link>
                            <Link to="/Login" onClick={Logout} className="nav-link" > Logout</Link>

                        </li>
                        
                    </ul>
        
        
                </nav>)

        }
        else{
            return(
                <nav className= "navbar navbar-expand-sm bg-dark navbar-dark">
                    <ul className="navbar-nav  ">
                        <li className= "nav-item active">
                            <Link to="/" className="nav-link" > Home page</Link>
                            <Link to="/Login" onClick={Logout} className="nav-link" > Logout</Link>

                        </li>
                        
                    </ul>
        
        
                </nav>)

        }
    }
    else{
        return null
    }

    


}

