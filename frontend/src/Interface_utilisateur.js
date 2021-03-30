import React ,{ useState, useEffect }  from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";  
import Parametre from "./Parametre";
import {useForm} from "react-hook-form";
import Graphe  from './Graphe';
import 'c3/c3.css';

export default function Interface_utilisateur({match}){
    const [data, setData]= useState({});
    const [dataGraph, setDataGraph]= useState([]);
    const {control, setValue, register, handleSubmit}=useForm();

    const onSubmit =(df)=>{
       
        Axios.post(`http://localhost:4000/set_procedure`, df)
        .then (result => setDataGraph(result.data))
        console.log(df)
    }

    useEffect(() => {  
        Axios.get(`http://localhost:4000/Get_values/${match.params.proc}`).then(result => setData(result.data));  
    }, []); 
    console.log(data)

    
     
    return (
       <div> 
        <form onSubmit={handleSubmit(onSubmit)}>
            <div  className="container">
            {
                
                Object.keys(data).map((key ) =>{
                    if (key=='procedure'){
                        return (
                            
                            <div >
                            <h2 > La procédure {data[key]}  </h2>
                            <input type="hidden" value= {match.params.proc} name="nameProc" ref={register}/>
                            </div> 
                            )
                    }
                    if (key.charAt(0)=="@"){
                        return(
                            <div className="row" > 
                                <span style={{"marginRight": "10px"}}>{data[key]} </span>  
                                <Parametre type={key} valeur={data['valeur']} requete={data['request']} register={register} setValue ={setValue} control={control} />
                            </div>)
                    } 
                    
                })
            }
            <div className="div">
                <button className="button" type="submit"> Executer</button> 
            </div>
           
        </div>

        </form>
         <div className="container" style= {{"margin-top": "30px "}}>
         <Graphe data={dataGraph} />
     </div>
     </div>
        
        
        )

    
    

        
}
        
    
           
