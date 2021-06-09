import React, { useState ,useEffect, useContext } from 'react' ; 
import {Link} from 'react-router-dom';
import {useForm} from "react-hook-form";
import {LoginContext} from '../../../Authentification/LoginContext';
import Axios from '../../../Authentification/AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './AjoutFonction.styles.css';

export default function AjoutFonction(){
    const {register, handleSubmit}= useForm();
    const [user,setUser]=useContext(LoginContext);
    const [bdd, setBDD]=useState([]);
    
    
    useEffect(()=>{
        Axios(setUser).get('/BDD')
        .then (result => setBDD(result.data))
        .catch(err => console.log(err));  
        
    },[])

    const onSubmit = (formData)=>{
        Axios(setUser).post(`/AjoutFonction`, formData)
        .then (result => console.log(result))
        .catch(err => console.log(err));  

    }

    
    return(
        <div>
        <div className="div2">
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
        
        <div   className=' div3'>
   
            <form  onSubmit={handleSubmit(onSubmit)}>
                <div  className='form-group row'>
                <div className='col-md-2'>
                <label  for='namefct'>Nom Fonction  </label>
                </div>
                <div className="col-sm-9">
                <input  autoComplete='off' type="text" className=" content form-control" id="namefct" name='name'  placeholder="Insérer le nom de la fonction " ref={register}/>
               </div>
               </div> 

                <div class=" form-group row">
                <div className='col-md-2'>
                    <label  for="bdd">Base de données</label>
                    </div>
                    <div className='col-sm-9'>
                    <select id='bdd' name = 'bdd' className=' content form-control' ref={register}>
                        {bdd.map(item =>{
                          return (
                                   <option value={item.bdd}>{item.bdd}</option>
                          )})}
                    </select>
                    </div>     
                </div>
                
               
                <div class="form-group row">
                <div className='col-md-2'>
                    <label  for='proc' > Requête SQL </label>
                    </div>
                    <div className='col-sm-9'>
                    <textarea autoComplete='off' type="text" className="form-control" id="proc" name='fonction' placeholder="Insérer la requête " ref={register}></textarea>
                    </div>
                </div>

                <button onClick={()=>alert('Opération réussie')} type="submit" className=" btn1 btn btn-primary  ">Enregistrer</button>
          
            </form>
           
        </div>
        </div>
    )

}
