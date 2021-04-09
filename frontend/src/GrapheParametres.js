import React, {useState,useEffect, useContext} from 'react';
import {useForm} from 'react-hook-form';
import Axios from './AxiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Design.css";
import {LoginContext} from './LoginContext';
import Parametre from './Parametre';


export default function GrapheParametre({match}){

    const [user, setUser]=useContext(LoginContext);
    const {control, setValue, register, handleSubmit}=useForm();
    const { register: register2, handleSubmit: handleSubmit2}=useForm();
    const [data, setData]= useState({});
    const [graph, setGraph]= useState([]);
    const [chartData, setChartData]=useState({});
    
    
        
    const onChartSubmit =(chartData)=>{
        Axios(setUser).post(`http://localhost:4000/setGraph/${match.params.proc}`, chartData)
        .then (result => {setChartData(result.data)
                           console.log(chartData)
                           console.log(result)})
        .catch(err => console.log(err));  
    }

    

    const onSubmit =(df)=>{
       
        Axios(setUser).post(`http://localhost:4000/set_procedure`, df)
        .then (result => {
            setGraph(result.data);
        })
        .catch(err => console.log(err));  
    }

    useEffect(() => {  
        Axios(setUser).get(`http://localhost:4000/Get_values/${match.params.proc}`)
        .then(result => setData(result.data))
        .catch(err => console.log(err));  
        
    }, []);

   
    const options=[
        {value:'null',label:'null'},
        {value:'line', label:'Line chart'},
        {value:'bar', label:'Bar chart'},
        {value:'timeseries ', label:'Timeseries Chart'},
        {value:'spline', label:'Spline Chart'},
        {value:'simple XY Line ', label:'Simple XY Line Chart'},
        {value:'multiple XY Line ', label:'Multiple XY Line Chart'},
        {value:'line Chart with Regions', label:'Line Chart with Regions'},
        {value:'area', label:'Area Chart'},
        {value:'scatter ', label:'Scatter Plot'},
        {value:'stacked Area ', label:'Stacked Area Chart'},
        {value:'stacked Bar', label:'Stacked Bar Chart'},
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
        <div className="container"> 
         <form key={1} onSubmit={handleSubmit(onSubmit)}>
             <div  >
             { 
                 
                 Object.keys(data).map((key ) =>{
                     if (key=='procedure'){
                         return (
                             
                             <div >
                             <h2 > {data[key]}  </h2>
                             <input type="hidden" value= {match.params.proc} name="nameProc" ref={register}/>
                             </div> 
                             )
                     }
                     if (key.charAt(0)=="@"){
                         return(
                             <div className="row"  > 
                                 <span style={{ "marginLeft": "15px","marginRight": "10px"}}>{data[key]} </span>  
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

         {graph.length>0 && (
             
            <form key={2} onSubmit={handleSubmit2(onChartSubmit)} >
                <table style={{'marginTop': '30px'}} className="table " > 
                
                <tr >
                        <th>Titre</th>
                        <td>
                            <input name='title' autoComplete='off' placeholder='Nom du graphe' ref={register2}/>
                        </td>
                </tr> 
                    
                {Object.keys(graph[0]).map(key =>{
                    return(
                    
                    <tr>
                       <th>{key}</th>
                       <td>
                        <input class="form-check-input" type="checkbox"  name={key+'_visible'}  ref={register2}  />Visible
                       </td> 
                       
                       <td>
                           <input autoComplete='off' placeholder='Label' name={key+'_label'}  ref={register2} />
                       </td>
                       <td>
                            <select  name ={key + '_chart'} ref={register2}>
                                {options.map(item =>{
                                return (
                                        <option value={item.value}>{item.value}</option>
                            
                            
                                )})}
                            </select> 
                       </td>
                       
                       
                       <td>
                            <select  name={key+'_axe'} ref={register2}>
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
                    <button onClick={()=> alert('Opération réussie')} className="button" type="submit"> Enregistrer</button> 
                </div>
            </form>
        )}
         
       </div> 
    )
}
 



    
    






