import React , {useState, useEffect, useContext} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css';
import {LoginContext} from '../LoginContext';
import { useHistory } from 'react-router-dom';


export default function Login(){

    const {handleSubmit, register}= useForm();
    const [user, setUser]=useContext(LoginContext);
    const history=useHistory();

    axios.defaults.withCredentials= true;

    const onSubmit= (login)=>{
        axios.post("http://localhost:4000/connexion/", login)
        .then((result) => {
            if ( result.data.auth){
                localStorage.setItem('token', result.data.token )
                setUser({isLoggedIn: true, role : result.data.response.role})
                history.push('/')               
            }
            
        })   

 
    }

    return(
        <div className="container">
            <h1 > Connexion</h1>
            <form onSubmit= {handleSubmit(onSubmit)}>
               <div className="form-group" class="col-md-6" >
                   <div>
                   <label  for ="id">Identifiant</label>
                   <input id='id' class="form-control" autoComplete='off' placeholder='Saisir un identifiant' name='identifiant'type="text" ref={register({ required: true })}/>
                   
                   </div>
                 <div className="form-group">
                 <label  for ="pwd">Mot de passe</label>
                 <input class="form-control" autoComplete='off' placeholder='Saisir un mot de passe' name='pwd' type="password" ref={register({ required: true })}/> 

                 </div>
                <div>
                <button  className="btn btn-primary" type="submit">Connexion</button> 

                </div>
                </div>  
            </form> 


        </div>)
}