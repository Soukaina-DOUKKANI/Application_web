import React, { useState ,useEffect, useContext } from 'react' ; 
import {LoginContext} from './LoginContext';
import Axios from './AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";
import {useForm} from "react-hook-form";

export default function AjoutFonction(){
    const {register, handleSubmit}= useForm();
    const [user,setUser]=useContext(LoginContext);
    const [bdd, setBDD]=useState([])

    
    useEffect(()=>{
        Axios(setUser).get('http://localhost:4000/BDD')
        .then (result => setBDD(result.data))
        .catch(err => console.log(err));  
        
    },[])

    const onSubmit = (formData)=>{
        Axios(setUser).post(`http://localhost:4000/AjoutFonction`, formData)
        .then (result => console.log(result))
        .catch(err => console.log(err));  
        

    }

    
    return(
        
        <div className='container'>
            <h2 style={{'marginTop':'20px'}}>Ajouter une fonction table</h2>
   
            <form onSubmit={handleSubmit(onSubmit)}>
        
                <div style={{'marginTop':'20px'}} class="form-group">
                    <label for="namefct">Nom de la fonction</label>
                    <input type="text" className="form-control" id="namefct" name='name'  placeholder="insérer un nom" ref={register}/>
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
                    <label for="proc">Insérer la fonction table </label>
                    <textarea type="text" className="form-control" id="proc" name='fonction' placeholder="insérer la requête SQL" ref={register}></textarea>
                </div>
        
                <button onClick={()=>alert('Opération réussie')} type="submit" className="btn btn-primary">Enregistrer</button>
          
            </form>

           

           
        </div>
    )

}
