import React, {useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {LoginContext} from '../Authentification/LoginContext';


export default function Footer(){
    const [user,setUser]=useContext(LoginContext);

    if(user.isLoggedIn){
        return(
            <div style={{'marginTop':'100px'}} className=" footer fixed-bottom bg-dark text-center" >
                 <p style={{"color": "white" }}> 2021 © </p>
            
            </div> )

    }
    else{
        return null
    }
    
}