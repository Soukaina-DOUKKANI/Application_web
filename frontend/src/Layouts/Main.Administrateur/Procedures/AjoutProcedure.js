import React, { useState ,useEffect, useContext } from 'react' ; 
import {useForm} from "react-hook-form";
import {Link} from 'react-router-dom';
import {LoginContext} from '../../../Authentification/LoginContext';
import Axios from '../../../Authentification/AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Fonctions/AjoutFonction.styles.css';

export default function AjoutProcedure(){
    const {register, handleSubmit}= useForm();
    const [user,setUser]=useContext(LoginContext);
    const [bdd, setBDD]=useState([]);
    

    
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
        
        <div  >
            <div className="div2 ">
                <Link to={'/Affichage'}>
                    <button className="bouton" >Affichage</button>
                </Link>
                <Link to= {'/AjoutProcedure'}>
                    <button className="bouton2">Ajouter une procédure</button>
                </Link >
                <Link to= {'/ajoutFonction'}>
                    <button className="bouton3">Ajouter une fonction</button>
                </Link>
                <Link to={'/'}>
                    <button className="search-btn">Recherche</button>
                </Link>
            </div>
            <div className="div3">
   
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group row'>
                <div  className='col-md-2'>
                    <label  for="nameproc"> Nom Procédure </label>
                </div>
                <div className="col-sm-9">
                    <input autoComplete='off' type="text" className="form-control" id="nameproc" name='name'  placeholder="insérer un nom" ref={register}/>
                </div>
                </div>
                <div className="form-group row">
                    <div className='col-md-2'>
                    <label for="bdd">Base de données  </label>
                    </div>
                    <div className="col-sm-9">
                    <select  className="form-control" name ='bdd' ref={register}>
                        {bdd.map(item =>{
                          return (
                                   <option value={item.bdd}>{item.bdd}</option>
                          )})}
                    </select>
                    </div>
                       
                </div>
                
               
                
                <div class="form-group row">
                <div className='col-md-2'>

                    <label for="proc">Code SQL</label>
                    </div>
                <div className="col-sm-9">

                    <textarea autoComplete='off' type="text" className="form-control" id="proc" name='procedure' placeholder="insérer la requête SQL" ref={register}></textarea>
                </div>
                </div>
        
                <button onClick={()=>alert('Opération réussie')} type="submit" className=" btn1 btn btn-primary">Enregistrer</button>
          
            </form>
            </div>

           
        </div>
    )

}
