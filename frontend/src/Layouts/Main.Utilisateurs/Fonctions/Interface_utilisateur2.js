import React ,{ useState, useEffect, useContext }  from 'react';
import Axios from '../../../Authentification/AxiosInstance'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../styles/Design.css"; 
import {LoginContext} from '../../../Authentification/LoginContext';
import Parametre from "../../Main.Administrateur/Parametre";
import {useForm} from "react-hook-form";
import GrapheFct  from '../../Main.Administrateur/Fonctions/GrapheFct';
import 'c3/c3.css';
import {ExportToExcel} from '../../Main.Administrateur/ExportToExcel';
import '../Procedures/interface.css';

export default function Interface_utilisateur2({match}){

    const [data, setData]= useState({});
    const [dataGraph, setDataGraph]= useState([]);
    const {control, setValue, register, handleSubmit}=useForm();
    const [user,setUser]=useContext(LoginContext);
    const fileName = "Data";



    useEffect(() => {  
        Axios(setUser).get(`/Get_function_user/${match.params.fct}`)
        .then(result => setData(result.data))
        .catch(err => console.log(err));  
        
    }, []); 


    const onSubmit =(df)=>{
       
        Axios(setUser).post(`/set_function`, df)
        .then (result => setDataGraph(result.data))
        .catch(err => console.log(err));  
    }
    
    
     
    return (
        <div className="interface-user"> 
        <form  onSubmit={handleSubmit(onSubmit)}>
        <table className="table table-light" >  

            <tbody  >
            {
                
                Object.keys(data).map((key ) =>{
                    if(key==='bdd'){
                        return(
                            <input type='hidden' name='bdd' value={data[key]} ref={register} />
                        )
                    }
                    if (key==='procedure'){
                        return(
                            
                            <div >
                            <h2 > {data[key]}  </h2>
                            <input type="hidden" value= {match.params.fct} name="nameProc" ref={register}/>

                            </div> 
                            )
                    }
                    if(key==='description'){
                        return(
                            <tr  className="row">
                                <th className='col-md-2'>DESCRIPTION</th>
                                <td className='col-sm-7' >{data[key]} </td>  
                            </tr>
                        )
                    }
                    if (key.charAt(0)==="@"){
                        return(
                            <tr className="row"  > 
                                <th className='col-md-2'>{data[key]} </th>  
                               <td className='col-sm-7'> <Parametre type={key} valeur={data['valeur']} requete={data['request']} register={register} setValue ={setValue} control={control} /> </td>
                            </tr>)
                    } 
                    
                })
            }
            <div className="div">
                <button style={{'marginTop':'10px'}} className="btn btn-primary" type="submit"> Executer</button> 
            </div>
        </tbody>
          
        </table>

        </form>
         <div className="container" style= {{"marginTop": "30px "}}>
         <GrapheFct data={dataGraph} fonction={match.params.fct}  />
    </div>
    <div>
      {

        (dataGraph.length>0 &&  <ExportToExcel apiData={dataGraph} fileName={fileName} />) 
      }
    </div>
    
    </div>
        
    )

    
    

        
}
        
    
           

