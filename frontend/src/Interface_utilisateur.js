import React ,{ useState, useEffect }  from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";  
import Parametre from "./Parametre";
export default function Interface_utilisateur({match}){
    const [data, setData]= useState([]);

    useEffect(() => {  
        Axios.get(`http://localhost:4000/Get_values/${match.params.proc}`).then(result => setData(result.data[0]));  
    }, []); 

    return(
        <div className="container">
        <div className="row">
        <h2 className="h2" > La procédure {data.NOM_PROCEDURE} </h2>
        </div>  
        <table className="table table-hover " >  
        
            <tbody> 
                
                <tr>
                    <th>{data.PARAMETRE1}</th>
                    <td><Parametre type={data.PARAMETRE1}/></td>
                </tr>

                <tr>
                    <th>{data.PARAMETRE2} </th>
                    <td><Parametre type={data.PARAMETRE2}/></td>
                   
                </tr>

               
            </tbody>
        </table>
        <div className="div">
           <button className="button" type="submit"> Executer</button> 
        </div>
        </div>
        
        )

}