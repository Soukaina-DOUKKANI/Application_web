import React, {useContext,useEffect} from 'react';
import Login from '../Authentification/Login';
import Utilisateurs from '../Gestion.Comptes.Utilisateurs/Utilisateurs';
import Details_procedures from '../Layouts/Main.Administrateur/Procedures/Details_procedure';
import Interface_utilisateur from '../Layouts/Main.Utilisateurs/Procedures/Interface_utilisateur';
import List_procedures from '../Layouts/Home/List_procedures';
import {Route, Switch, useHistory} from 'react-router-dom';
import {LoginContext} from '../Authentification/LoginContext';
import Axios from '../Authentification/AxiosInstance';
import ProtectedRoutes from './ProtectedRoutes';
import GrapheParametres from '../Layouts/Main.Administrateur/Procedures/GrapheParametres';
import Lister_utilisateurs from '../Gestion.Comptes.Utilisateurs/Lister_utilisateurs';
import AjoutProcedure from '../Layouts/Main.Administrateur/Procedures/AjoutProcedure';
import Details_fonction from '../Layouts/Main.Administrateur/Fonctions/Details_fonction';
import GrapheParametresFct from '../Layouts/Main.Administrateur/Fonctions/GrapheParametresFct';
import Interface_utilisateur2 from '../Layouts/Main.Utilisateurs/Fonctions/Interface_utilisateur2';
import AjoutFonction from '../Layouts/Main.Administrateur/Fonctions/AjoutFonction';


export default function AppRoutes(){
    const [user,setUser]=useContext(LoginContext);
    const history= useHistory();
    
    useEffect(()=> {
        if (!user.isLoggedIn){
            if(localStorage.getItem('token')){
                Axios(setUser).get('/IsConnected/')
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
                <ProtectedRoutes path= "/Details_procedure/:name/:baseDD" exact component={Details_procedures} role={['admin']}/>
                <ProtectedRoutes path= "/Details_fonction/:name/:baseDD" exact component={Details_fonction} role={['admin']}/>
                <ProtectedRoutes path= "/Interface_utilisateur/:proc" exact component={Interface_utilisateur} role={['user']}/>
                <ProtectedRoutes path= "/Interface_utilisateur2/:fct" exact component={Interface_utilisateur2} role={['user']}/>
                <ProtectedRoutes path= "/GrapheParametres/:proc" exact component={GrapheParametres} role={['admin']}/>
                <ProtectedRoutes path= "/GrapheParametresFct/:fct" exact component={GrapheParametresFct} role={['admin']}/>

            </Switch>  
        </div>)

}