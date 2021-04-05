import React, {useContext} from 'react';
import List_procedures from './List_procedures';
import {LoginContext} from './LoginContext';


export default function Home(){
    const [user,setUser]=useContext(LoginContext);
    if (user.role=='admin'){
        return(
            <List_procedures/>
            )
    }
    else{
        return(
            null
        )
    }



}