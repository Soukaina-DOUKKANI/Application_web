import React, {useContext,useEffect} from 'react';
import Login from './authentification/Login';
import Utilisateurs from './authentification/Utilisateurs';
import Details_procedures from './Details_procedure';
import Interface_utilisateur from './Interface_utilisateur';
import List_procedures from './List_procedures';
import {Route, Switch, useHistory} from 'react-router-dom';
import {LoginContext} from './LoginContext';
import Axios from './AxiosInstance';
import ProtectedRoutes from './ProtectedRoutes';
import GrapheParametres from './GrapheParametres';
import Lister_utilisateurs from './Lister_utilisateurs';
import AjoutProcedure from './AjoutProcedure';
import Details_fonction from './Details_fonction';
import GrapheParametresFct from './GrapheParametresFct';
import Interface_utilisateur2 from './Interface_utilisateur2';
import AjoutFonction from './AjoutFonction';


export default function AppRoutes(){
    const [user,setUser]=useContext(LoginContext);
    const history= useHistory();
    
    useEffect(()=> {
        if (!user.isLoggedIn){
            if(localStorage.getItem('token')){
                Axios(setUser).get('http://localhost:4000/IsConnected/')
                .then(result => {
                    setUser(result.data)
                })
                .catch(err => console.log(err))
                
            }
            else{
                history.push('/Login')
            }
        }    
    },[user])
        
    
    return(
        <div>

            <Switch> 
                <Route path="/Login" exact  component={Login} />
                <Route path="/" exact  component={List_procedures} />
                <ProtectedRoutes path="/AjoutProcedure" exact component={AjoutProcedure} role={['admin']}/>
                <ProtectedRoutes path="/AjoutFonction" exact component={AjoutFonction} role={['admin']}/>
                <ProtectedRoutes path="/Lister_utilisateurs" exact component={Lister_utilisateurs} role={['admin']}/>
                <ProtectedRoutes path="/Utilisateurs" exact component={Utilisateurs} role={['admin']}/>
                <ProtectedRoutes path="/Utilisateurs/:id" exact component={Utilisateurs} role={['admin']}/>
                <ProtectedRoutes path= "/Details_procedure/:name" exact component={Details_procedures} role={['admin']}/>
                <ProtectedRoutes path= "/Details_fonction/:name" exact component={Details_fonction} role={['admin']}/>
                <ProtectedRoutes path= "/Interface_utilisateur/:proc" exact component={Interface_utilisateur} role={['user']}/>
                <ProtectedRoutes path= "/Interface_utilisateur2/:fct" exact component={Interface_utilisateur2} role={['user']}/>
                <ProtectedRoutes path= "/GrapheParametres/:proc" exact component={GrapheParametres} role={['admin']}/>
                <ProtectedRoutes path= "/GrapheParametresFct/:fct" exact component={GrapheParametresFct} role={['admin']}/>

            </Switch>  
        </div>)

}