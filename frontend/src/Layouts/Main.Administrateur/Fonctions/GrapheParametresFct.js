import React, {useState,useEffect, useContext} from 'react';
import {useForm} from 'react-hook-form';
import Axios from '../../../Authentification/AxiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../styles/Design.css";
import {LoginContext} from '../../../Authentification/LoginContext';
import Parametre from '../Parametre';
import '../Procedures/procedures.css';

export default function GrapheParametreFct({match}){

    const [user, setUser]=useContext(LoginContext);
    const {control, setValue, register, handleSubmit}=useForm();
    const { register: register2, handleSubmit: handleSubmit2}=useForm();
    const [data, setData]= useState({});
    const [graph, setGraph]= useState([]);
    const [chartData, setChartData]=useState({});
    const [bdd, setBDD]=useState([])

    
    useEffect(()=>{
        Axios(setUser).get('/BDD')
        .then (result => setBDD(result.data))
        .catch(err => console.log(err));  
        
    },[])
        
    const onChartSubmit =(chartData)=>{
        Axios(setUser).post(`/setGraphFct/${match.params.fct}`, chartData)
        .then (result => {setChartData(result.data)
                           console.log(chartData)
                           console.log(result)})
        .catch(err => console.log(err));  
    }

    

    const onSubmit =(df)=>{

       console.log('df',df)
        Axios(setUser).post(`/set_function/`, df)
        .then (result => {
            setGraph(result.data);
        })
        .catch(err => console.log(err));  
    }

    useEffect(() => {  
        Axios(setUser).get(`/Get_values_fct/${match.params.fct}`)
        .then(result => {setData(result.data)
                         console.log(result.data)})
        .catch(err => console.log(err));  
        
    }, []);

   
    const options=[
        {value:'null',label:'null'},
        {value:'line', label:'Line chart'},
        {value:'bar', label:'Bar chart'},
        {value:'timeseries ', label:'Timeseries Chart'},
        {value:'spline', label:'Spline Chart'},
        {value:'area-spline', label:' area Spline Chart'},
        {value:'step', label:'Area Chart'},
        {value:'area-step', label:'Area Step Chart'},
        {value:'scatter ', label:'Scatter Plot'},
        {value:'pie', label:'Pie Chart'},
        {value:'donut', label:'Donut Chart'}
        ]

    const values=[
        {value:'null',label:'null'},
        {value:'x',label:'x'},
        {value:'y',label:'y'},
        {value:'y2',label:'y2'}
    ]
    
    console.log('result',graph[0])

    return (
        <div className="graphe-param"> 
        {(graph.length===0) &&
         <form key={1} onSubmit={handleSubmit(onSubmit)}>
             <div  >
             { 
                 
                 Object.keys(data).map((key ) =>{
                     if (key=='procedure'){
                         return (
                             
                             <div >
                             <h2 > {data[key]}  </h2>
                             <input type="hidden" value= {match.params.fct} name="nameProc" ref={register}/>
                             </div> 
                             )
                     }
                     if(key=='bdd'){
                        return(
                            <input type='hidden' value={data[key]} name='bdd' ref={register} />
                       )
                    }
                     if (key.charAt(0)=="@"){
                         return(
                            <div className="row"  > 
                                <label className='col-md-1'>{data[key]}</label> 
                                <Parametre  type={key} bdd={data['bdd']} valeur={data['valeur']} requete={data['request']} register={register} setValue ={setValue} control={control} />
                            </div>)
                     } 
                     
                 })
             }
             <div >
                 <button style={{'marginTop':'10px'}} className="btn btn-primary" type="submit"> Executer</button> 
             </div>
            
         </div>
         </form>
        }
         {graph.length>0 && (
             
            <form key={2} onSubmit={handleSubmit2(onChartSubmit)} >
                <h2>Paramétrage du graphe</h2>
                <table className=" table table2 table-bordered " > 
                
                <tr className="form-group" >
                        <th>Titre</th>
                        <td colspan='4'>
                            <input className='form-control' name='title' autoComplete='off' placeholder='Nom du graphe' ref={register2}/>
                        </td>
                </tr> 
                    
                {Object.keys(graph[0]).map(key =>{
                    return(
                    
                    <tr className='form-group' >
                        <th>{key}</th>
                       <td>
                        <input style={{'marginLeft':'1px', 'marginRight':'1px'}}class="form-check-input" type="checkbox"  name={key+'_visible'}  ref={register2}  />
                        <label style={{'marginLeft':'10px'}} className='col-md-2'>Visible</label>

                       </td> 
                       
                       <td>
                           <input className='form-control' autoComplete='off' placeholder='Label' name={key+'_label'}  ref={register2} />

                       </td>
                       <td>
                            <select className='form-control' name ={key + '_chart'} ref={register2}>
                                {options.map(item =>{
                                return (
                                        <option value={item.value}>{item.value}</option>
                            
                            
                                )})}
                            </select> 
                       </td>
                       
                       
                       <td>
                            <select className='form-control' name={key+'_axe'} ref={register2}>
                                {values.map(item =>{
                                return (
                                        <option value={item.value}>{item.value}</option>
                                )})}
                            </select> 
                       </td>
                    </tr> )
                })
                } 
                </table>
                <div className="div">
                    <button onClick={()=> alert('Opération réussie')} className="btn btn-primary" type="submit"> Enregistrer</button> 
                </div>
            </form>
        )}
         
       </div> 
    )
}
 



    
    






