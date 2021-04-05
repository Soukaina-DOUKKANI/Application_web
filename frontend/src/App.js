import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import Footer from './styles/Footer';
import Header from './styles/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppRoutes from './AppRoutes';


function App(){
    
     
    
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

   


export default App;