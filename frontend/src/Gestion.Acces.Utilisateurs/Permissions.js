import React, {useContext} from 'react';
import {LoginContext} from '../Authentification/LoginContext';


export default function Permissions(roles){
    const [user,setUser]=useContext(LoginContext);
    if (user.isLoggedIn){
        if(user.role==roles ){
            return true;
        }

    }
    else {
        return false;
    }



}