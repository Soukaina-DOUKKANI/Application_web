import React, { useState, useEffect , useContext } from 'react' ; 
import {LoginContext} from './LoginContext';
import Axios from './AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";
import {useForm} from "react-hook-form";
import {Link} from 'react-router-dom';

export default function Details_fonction({match}){
    const {register, handleSubmit}= useForm();
    const [data, setData] = useState({parameters : []});  
    const [user,setUser]=useContext(LoginContext);

  
    useEffect(() => {  
        Axios(setUser).get(`/page_fct/${match.params.name}/${match.params.baseDD}`).then(result => setData(result.data))
        .catch(err => console.log(err));  
          
    }, []); 
    
    
    
    const onSubmit = (formData)=>{
        Axios(setUser).post(`/set_data_fct/${match.params.name}/${match.params.baseDD}`, formData)
        .then (result => console.log(result))
        .catch(err => console.log(err));  
        console.log(JSON.stringify(formData))

    }
    return(
        <div className="container-fluid">
            <div className="row">
            <h2 className="h2" > La fonction {data.SP_NAME} </h2>
            
            
        <form   className="container-fluid" onSubmit={handleSubmit(onSubmit)}> 
        <table className="table table-striped" >  
        
            <tbody>
                <tr>
                    <input type="hidden" value= {match.params.baseDD} name="bdd" ref={register}/>
                   <th>NOM DE LA FONCTION</th> 
                   <td>
                    <input  name="procedure" autoComplete="off"  type="text" placeholder="Renommer" ref={register}/>  

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
                   <textarea className='form-control' name="description" autoComplete="off"  type="text"  placeholder="Ajouter une description" ref={register} ></textarea> 
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
                                <p>
                                <span className="span" >{item.PARAMETER_NAME}</span>
                                <span className="span"><input  name={item.PARAMETER_NAME} autoComplete="off"  type="text" placeholder="Renommer" ref={register}/></span>
                                 </p>
                                     
                            );}
                            else {
                                return(
                                 <div >
                                 <span className="span" >{item.PARAMETER_NAME}</span>
                                  <span className="span" ><input className=' input'  autoComplete="off" name={item.PARAMETER_NAME} type="text" placeholder="Renommer" ref={register}/></span>
                                  <p className="p" ><input  autoComplete='OFF' placeholder='insérer une valeur' name='valeur' type='text' ref={register}/></p>
                                  OU
                                  <p className="p">
                                  <textarea  className=" textarea" autoComplete="off" placeholder=" insérer une requête" name="request" type="text" ref={register}></textarea>
                                  </p>
                                  </div>
                                );
                            }
                       })}</td>
                </tr>
            </tbody>
           </table> 
            <div className="div" > 
            <button onClick={()=> alert('Opération réussie')} className="button" type="submit"> Enregistrer</button>
            <Link to= {`/GrapheParametresFct/${data.SP_NAME} `}> 
                <button className="button2" > Paramétrer le graphe</button> 
            </Link>
            </div>
           
        </form> 
        
        </div> 
        
        </div>
        )
}