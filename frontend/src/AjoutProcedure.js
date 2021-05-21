import React, { useState ,useEffect, useContext } from 'react' ; 
import {LoginContext} from './LoginContext';
import Axios from './AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";
import {useForm} from "react-hook-form";

export default function AjoutProcedure(){
    const {register, handleSubmit}= useForm();
    const [user,setUser]=useContext(LoginContext);
    const [bdd, setBDD]=useState([])

    
  
    
    useEffect(()=>{
        Axios(setUser).get('/BDD')
        .then (result =>setBDD(result.data))
        .catch(err => console.log(err));  
        
    },[])

    const onSubmit = (formData)=>{
        Axios(setUser).post(`/AjoutProcedure`, formData)
        .then (result => console.log(result))
        .catch(err => console.log(err));  
        

    }

    
    return(
        
        <div className='container'>
            <h2 style={{'marginTop':'20px'}}>Ajouter une procédure stockée</h2>
   
            <form onSubmit={handleSubmit(onSubmit)}>
        
                <div style={{'marginTop':'20px'}} class="form-group">
                    <label for="nameproc">Nom de la procédure</label>
                    <input autoComplete='off' type="text" className="form-control" id="nameproc" name='name'  placeholder="insérer un nom" ref={register}/>
                </div>
                <div class="form-group">
                    <label style={{'marginRight':'15PX' }} for="bdd">Base de données  </label>
                    <select  name = 'bdd' ref={register}>
                        {bdd.map(item =>{
                          return (
                                   <option value={item.bdd}>{item.bdd}</option>
                          )})}
                    </select>
                    
                       
                </div>
                
               
                
                <div class="form-group">
                    <label for="proc">Procédure stockée</label>
                    <textarea autoComplete='off' type="text" className="form-control" id="proc" name='procedure' placeholder="insérer la requête SQL" ref={register}></textarea>
                </div>
        
                <button onClick={()=>alert('Opération réussie')} type="submit" className="btn btn-primary">Enregistrer</button>
          
            </form>

           

           
        </div>
    )

}
