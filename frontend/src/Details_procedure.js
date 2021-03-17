import React, { useState, useEffect } from 'react'  
import Axios from 'axios';  
import Parametre from './Parametre';
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Details_procedures({match}){
    const [data, setData] = useState({parameters : []});  
  
    useEffect(() => {  
        Axios.get(`http://localhost:4000/page1/${match.params.name}`).then(result => setData(result.data));  
    }, []); 
    return(
        <div className="container-fluid">
            <div className="row">
            <h2 style={{'margin-top':"10px"}} > Détails de la procédure {data.SP_NAME} </h2>
            <div className="row" style={{'margin': "10px" }}>  
            </div>
             
        <table className="table table-striped" >  
            <tbody>

                <tr>
                   <th scope= "col">ID</th>
                   <td scope ="row"> {data.SP_ID}</td>
                </tr>
                <tr>
                    <th>DATABASE</th> 
                    <td>{data.DATABASE}</td>
                </tr>
                <tr>
                    <th>SCHEMA</th>  
                    <td>{data.SCHEMA}</td>
                </tr>
                <tr>
                   <th>SP_DESCRIPTION</th>  
                   <td>{data.SP_DESCRIPTION}</td>
                </tr>
                <tr>
                   <th>Author_name</th>
                   <td>{data.Author_name}</td>
                </tr>
                <tr>
                   <th>CREATE_DATE</th> 
                   <td>{data.CREATE_DATE}</td>
                </tr>
                <tr>
                   <th>MODIFY_DATE</th> 
                   <td>{data.MODIFY_DATE}</td>
                </tr>
                <tr>
                   <th>PARAMETERS</th> 
                   <td >
                       {data.parameters.map(item =>{
                       return (<p>
                                <span class="badge badge-secondary">{item.PARAMETER_NAME}</span><Parametre type={item.DATA_TYPE}/>
                 
                    </p>
                       )})}</td>
                </tr>
               
                    
            </tbody>
           </table> 
        </div>  
        </div>
        )
}