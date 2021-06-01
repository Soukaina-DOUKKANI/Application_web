import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './Layouts/Footer';
import Header from './Layouts/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './Gestion.Acces.Utilisateurs/AppRoutes';

export default function App(){
     
    return(
         
        <div>
            <Router >
               
            <Header/>
            <AppRoutes/>
            <Footer/>
               
            </Router>
        </div>
        )
}

   


