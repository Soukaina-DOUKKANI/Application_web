import React, { useState, useEffect , useContext } from 'react' ; 
import {LoginContext} from './LoginContext';
import Axios from './AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";
import {useForm} from "react-hook-form";

export default function AjoutProcedure(){
    const {register, handleSubmit}= useForm();
    const [user,setUser]=useContext(LoginContext);
    

    const onSubmit = (formData)=>{
        Axios(setUser).post(`http://localhost:4000/AjoutProcedure`, formData)
        .then (result => console.log(result))
        .catch(err => console.log(err));  
        

    }
    const params= { name: '', type: '' };
    const [paramsData, setParamsData] = useState([
        { ...params },
    ]);
    
    const addParams = () => {
        setParamsData([...paramsData, { ...params }]);
    };



    return(
        
        <div className='container'>
            <h2>Ajouter une procédure stockée</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
        
                <div class="form-group">
                    <label for="nameproc">Nom</label>
                    <input type="text" className="form-control" id="nameproc" name='name'  placeholder="insérer le nom de la  procedure stockee" ref={register}/>
                </div>
                <div class="form-group">
                    <label for="bdd">Base de données</label>
                    <input type="text" className="form-control" id="bdd" name='bdd' placeholder="insérer le nom de la base de données" ref={register}/>
                </div>
               
                
                <div class="form-group">
                    <label for="proc">Procédure stockée</label>
                    <textarea type="text" className="form-control" id="proc" name='procedure' placeholder="insérer la requête SQL" ref={register}></textarea>
                </div>
               
                
                <input type="button" value="Ajouter un autre paramètre" onClick={addParams}/>      
                {
                    paramsData.map((val, idx) => {
                    const paramId = `param-${idx+1}`;
                    const typeId = `type-${idx+1}`;
                        return (
                            <div style={{'marginTop':'15px', 'marginBottom':'15px'}}>
                                
                                <label for={paramId}>{`Paramètre ${idx+1}`}</label>
                                <input style={{'marginLeft':'15px'}} type="text" className='name' name={paramId} id={paramId} ref={register} />
                                
                                <label style={{'marginLeft':'30px'}} for={typeId}>Type</label>
                                <input style={{'marginLeft':'15px'}} type="text" className='type' name={typeId} id={typeId} ref={register} />
                               
                            </div>
                        );      
                    })
                }
                
                <button onClick={()=>alert('Opération réussie')} type="submit" className="btn btn-primary">Enregistrer</button>
            </fieldset>
            </form>
           
        </div>
    )

}
