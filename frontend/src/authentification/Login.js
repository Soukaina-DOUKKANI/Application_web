import React , {useContext} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css';
import {LoginContext} from '../Authentification/LoginContext';
import { useHistory } from 'react-router-dom';
import logo from '../images/logo.png';
import "./Login.styles.css";
export default function Login(){

    const {handleSubmit, register}= useForm();
    const [user, setUser]=useContext(LoginContext);
    const history=useHistory();

    axios.defaults.withCredentials= true;

    const onSubmit= (login)=>{
        axios.post("http://localhost:4000/connexion", login) /* http://application.local/connexion */
        .then((result) => {
            if ( result.data.auth){
                localStorage.setItem('token', result.data.token )
                setUser({isLoggedIn: true, role : result.data.response.role})
                history.push('/')               
            }
            
        })   

 
    }

    return(
        <div className="background-image" >
            <div >
                <img className="image2"  src={logo} alt="logo"/>
            </div>
            <div className="login-block">
            <h1 className="h1">Bienvenue</h1>
            <form  onSubmit= {handleSubmit(onSubmit)}>
                <input  id="identifiant"  autoComplete='off' placeholder='Identifiant' name='identifiant' type="text" ref={register({ required: true })}/>
                <input id="password" autoComplete='off' placeholder='Mot de passe' name='pwd' type="password" ref={register({ required: true })}/> 
                
                <button   type="submit">Connexion</button>
               
            </form> 

       </div> 
        </div>
    )
}