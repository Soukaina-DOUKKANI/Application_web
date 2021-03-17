import React from 'react';
import List_procedures from './List_procedures';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Details_procedures from './Details_procedure';
import Footer from './styles/Footer';
import Header from './styles/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
function App(){
    return(
        <div>
            <Header/>
            <Router>
            <div> 
            <Switch>
                <Route path="/" exact component={List_procedures}/>
                <Route path= "/Details_procedure/:name" component={Details_procedures}/>

                </Switch>   
            </div> 
            </Router>
            <Footer/>
        </div>
        )
}

export default App;