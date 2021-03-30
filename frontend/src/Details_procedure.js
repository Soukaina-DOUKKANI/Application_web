import React, { useState, useEffect } from 'react' ; 
import Axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";
import {useForm} from "react-hook-form";
import {Link} from 'react-router-dom';

export default function Details_procedures({match}){
    const {register, handleSubmit}= useForm();
    const [data, setData] = useState({parameters : []});  
  
    useEffect(() => {  
        Axios.get(`http://localhost:4000/page1/${match.params.name}`).then(result => setData(result.data));  
    }, []); 
    
    
    const onSubmit = (formData)=>{
        Axios.post(`http://localhost:4000/set_data/${match.params.name}`, formData)
        .then (result => console.log(result))
        console.log(JSON.stringify(formData))

    }
    return(
        <div className="container-fluid">
            <div className="row">
            <h2 className="h2" > Détails de la procédure {data.SP_NAME} </h2>
            
            
        <form   className="container-fluid" onSubmit={handleSubmit(onSubmit)}> 
        <table className="table table-striped" >  
        
            <tbody>
                <tr>
                   <th>NOM DE LA PROCEDURE</th> 
                   <td>
                    <input name="procedure" autocomplete="off"  type="text" placeholder="Renommer" ref={register}/>  
                   </td>
                </tr>
                <tr>
                    <th>NOM DE LA BDD</th> 
                    <td>{data.DATABASE}</td>
                </tr>
                <tr>
                    <th>SCHEMA</th>  
                    <td>{data.SCHEMA}</td>
                </tr>
                <tr>
                   <th>DESCRIPTION</th>  
                   <td>{data.SP_DESCRIPTION}</td>
                </tr>
                <tr>
                   <th>NOM DE L'AUTEUR</th>
                   <td>{data.Author_name}</td>
                </tr>
                <tr>
                   <th>DATE DE CREATION</th> 
                   <td>{data.CREATE_DATE}</td>
                </tr>
                <tr>
                   <th>DATE DE MODIDIFCATION</th> 
                   <td>{data.MODIFY_DATE}</td>
                </tr>
                <tr>
                   <th>PARAMETRES</th> 
                   <td >
                       {data.parameters.map(item =>{
                           if (item.DATA_TYPE==='date'){
                            return (
                                <p>
                                <span className="span" >{item.PARAMETER_NAME}</span>
                                <span className="span"><input name={item.PARAMETER_NAME} autocomplete="off"  type="text" placeholder="Renommer" ref={register}/></span>
                                 </p>
                                     
                            );}
                            else {
                                return(
                                 <div >
                                 <span className="span" >{item.PARAMETER_NAME}</span>
                                  <span className="span" ><input className="input" autocomplete="off" name={item.PARAMETER_NAME} type="text" placeholder="Renommer" ref={register}/></span>
                                  <p className="p" ><input autoComplete='off' placeholder='insérer une valeur' name='valeur' type='text' ref={register}/></p>
                                  OU
                                  <p className="p">
                                  <textarea  className="textarea" autocomplete="off" placeholder=" insérer une requête" name="request" type="text" ref={register}></textarea>
                                  </p>
                                  </div>
                                      );
                            }
                       })}</td>
                </tr>

                   
            </tbody>
           </table> 
            <div className="div"> 
            <button  className="button" type="submit"> Enregistrer</button>
            <Link to= {`/Interface_utilisateur/${data.SP_NAME} `}> 
                <button className="button2" > Interface utilisateur</button> 
            </Link>
            </div>
        </form>   
        </div>  
        </div>
        )
}