import React, { useState ,useEffect, useContext } from 'react' ; 
import {LoginContext} from './LoginContext';
import Axios from './AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";
import {useForm} from "react-hook-form";

export default function AjoutProcedure(){
    const {register, handleSubmit}= useForm();
    const {register: register2, handleSubmit:handleSubmit2}=useForm()
    const [user,setUser]=useContext(LoginContext);
    const [bdd, setBDD]=useState([])
    const [showForm, setShowForm] = useState(false);

    const formShow= () => {
      setShowForm(!showForm);
    }
  
    
    useEffect(()=>{
        Axios(setUser).get('http://localhost:4000/BDD')
        .then (result =>{ setBDD(result.data)
                          console.log('coci',result)})
        .catch(err => console.log(err));  
        
    },[])

    const onSubmit = (formData)=>{
        Axios(setUser).post(`http://localhost:4000/AjoutProcedure`, formData)
        .then (result => console.log(result))
        .catch(err => console.log(err));  
        

    }

    const onSubmit2=(data)=>{
        Axios(setUser).post('http://localhost:4000/AjoutBDD', data)
        .then (result => console.log(result))
        .catch(err => console.log(err));  
        
    }
    

    return(
        
        <div className='container'>
            <h2 style={{'marginTop':'20px'}}>Ajouter une procédure stockée</h2>
            <div >
                <button style={{'marginTop':'15px'}} type='button' onClick={formShow} className="btn btn-info" >Creer une nouvelle base de données </button>
            </div>
            <div>
            {showForm && (
                        <form onSubmit={handleSubmit2(onSubmit2)}>
                        <div>
                            <label style={{'marginTop':'20px'}} for='basedonnees'>Créer une nouvelle BDD</label>
                            <input style={{'marginLeft':'20px'}} id='basedonnees' type='text' name='baseBDD' ref={register2}/>
                        </div>
                          <button className='btn btn-secondary' type='submit'>Envoyer</button> 
                        </form>
                )}           
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
        
                <div style={{'marginTop':'20px'}} class="form-group">
                    <label for="nameproc">Nom de la procédure</label>
                    <input type="text" className="form-control" id="nameproc" name='name'  placeholder="insérer un nom" ref={register}/>
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
                    <textarea type="text" className="form-control" id="proc" name='procedure' placeholder="insérer la requête SQL" ref={register}></textarea>
                </div>
        
                <button onClick={()=>alert('Opération réussie')} type="submit" className="btn btn-primary">Enregistrer</button>
          
            </form>

           

           
        </div>
    )

}
