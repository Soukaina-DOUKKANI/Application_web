import React, { useState, useEffect } from 'react'  
import Axios from 'axios';  
import {Link} from 'react-router-dom';
export default function List_procedures(){
    const [data, setData] = useState([]);  
  
    useEffect(() => {  
        Axios.get("http://localhost:4000/app").then(result => setData(result.data));  
    }, []);  
    return(
        <div className="container">
            <h2>Liste des procédures stockées :</h2>
            <div className="row">
            <div>
            {data.map(item =>{
                return (
                <ul>
                <li><Link to={`/Details_procedure/${item.P}`}> {item.P}</Link></li>

                </ul>
               
            )})}
            </div>
        </div>
        </div>)
}