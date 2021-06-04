import React, { useState, useEffect , useContext } from 'react' ; 
import {LoginContext} from '../../../Authentification/LoginContext';
import Axios from '../../../Authentification/AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../styles/Design.css";
import {useForm} from "react-hook-form";
import {Link} from 'react-router-dom';
import './procedures.css';

export default function Details_procedures({match}){
    const {register, handleSubmit}= useForm();
    const [data, setData] = useState({parameters : []});  
    const [user,setUser]=useContext(LoginContext);

  
    useEffect(() => {  
        Axios(setUser).get(`/page1/${match.params.name}/${match.params.baseDD}`).then(result => setData(result.data))
        .catch(err => console.log(err));  
          
    }, []); 
    
    
    
    const onSubmit = (formData)=>{
        Axios(setUser).post(`/set_data/${match.params.name}/${match.params.baseDD}`, formData)
        .then (result => console.log(result))
        .catch(err => console.log(err));  
        console.log(JSON.stringify(formData))

    }
    return(
        
        <div >
               
        <form   className="container" onSubmit={handleSubmit(onSubmit)}> 
        <h2   > Métadonnées de la  procédure {data.SP_NAME} </h2>

        <table className="table table-bordered" >  
        
            <tbody>
                <tr>
                    <input type="hidden" value= {match.params.baseDD} name="bdd" ref={register}/>
                   <th>NOM DE LA PROCEDURE</th> 
                   <td>
                    <input className='form-control col-sm-11' name="procedure" autoComplete="off"  type="text" placeholder="Renommer" ref={register}/>  
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
                   <td>
                   <textarea className='form-control col-sm-11' name="description" autoComplete="off"  type="text"  placeholder="Ajouter une description" ref={register} ></textarea> 
                   </td>
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
                   <th>DATE DE MODIFICATION</th> 
                   <td>{data.MODIFY_DATE}</td>
                </tr>
                <tr>
                   <th>PARAMETRES</th> 
                   <td >
                       {data.parameters.map(item =>{
                           if (item.DATA_TYPE==='date'){
                            return (
                                <div className='parameter-border'>
                                    <p className='row'> 
                                        <label className="col-md-2" >{item.PARAMETER_NAME}</label>
                                        <input  className='form-control col-sm-9' name={item.PARAMETER_NAME} autoComplete="off"  type="text" placeholder="Renommer" ref={register}/>
                                    </p>
                                </div>
                                     
                            );}
                            else {
                                return(
                                <div className='parameter-border'>
                                    <p className='row' >
                                        <label className="col-md-2">{item.PARAMETER_NAME}</label>
                                        <input   className='form-control col-sm-9'  autoComplete="off" name={item.PARAMETER_NAME} type="text" placeholder="Renommer" ref={register}/>
                                    </p>
                                    <p className='row'>
                                        <label className="col-md-2"></label>
                                        <input className='form-control col-sm-9' autoComplete='OFF' placeholder='insérer une valeur' name='valeur' type='text' ref={register}/>
                                        
                                    </p>
                                    <p className='row'>
                                        <label className="col-md-2">OU</label>
                                        <textarea className='form-control col-sm-9'   autoComplete="off" placeholder=" insérer une requête" name="request" type="text" ref={register}></textarea>
                                    </p>
                                </div>
                                );
                            }
                       })}</td>
                </tr>
            </tbody>
           </table> 
            <div className=" container row "  style={{'marginBottom':'60px'}}> 
            <button style={{'marginLeft':'400px'}} onClick={()=> alert('Opération réussie')} className="btn btn-primary" type="submit"> Enregistrer</button>
            <div style={{'marginLeft':'30px'}}>
            <Link to= {`/GrapheParametres/${data.SP_NAME} `}> 
                <button className="btn btn-info" > Paramétrer le graphe</button> 
            </Link>
            </div>
            </div>
           
        </form> 
        
        </div> 
        
        )
}