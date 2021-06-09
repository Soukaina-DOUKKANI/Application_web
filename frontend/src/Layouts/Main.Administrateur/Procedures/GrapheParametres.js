import React, {useState,useEffect, useContext} from 'react';
import {useForm} from 'react-hook-form';
import Axios from '../../../Authentification/AxiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../styles/Design.css";
import {LoginContext} from '../../../Authentification/LoginContext';
import Parametre from '../Parametre';
import './procedures.css';

export default function GrapheParametre({match}){

    const [user, setUser]=useContext(LoginContext);
    const {control, setValue, register, handleSubmit}=useForm();
    const { register: register2, handleSubmit: handleSubmit2}=useForm();
    const [data, setData]= useState({});
    const [graph, setGraph]= useState([]);
    const [chartData, setChartData]=useState({});
    const [bdd, setBDD]=useState([]);

    
        
    const onChartSubmit =(chartData)=>{
        Axios(setUser).post(`/setGraph/${match.params.proc}`, chartData)
        .then (result => {setChartData(result.data)
                           console.log(result.data)})
        .catch(err => console.log(err));  
    }

    useEffect(()=>{
        Axios(setUser).get('/BDD')
        .then (result => setBDD(result.data))
        .catch(err => console.log(err));  
        
    },[])

    const onSubmit =(df)=>{
        Axios(setUser).post(`/set_procedure/`, df)
        .then (result => {
            setGraph(result.data[0]);
        })
        .catch(err => console.log(err));  
    }

    useEffect(() => {  
        Axios(setUser).get(`/Get_values/${match.params.proc}`)
        .then(result => {
            if(result.data.type=='procedure'){
                setData(result.data.content)
            }
            else{
                setGraph(corrigerGraphe(result.data.content))
            }

        })
        .catch(err => console.log(err));  
        
    }, []);

    const corrigerGraphe=(obj)=>{
        Object.keys(obj).map(item=>{
            if(item.indexOf('_visible' )>0){
                if(obj[item]=='true'){
                    obj[item]=true
                }
                else{
                    obj[item]=false
                }
            }
        })
        return obj;
    }

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
    
    const traiterObj = (obj) => {
        let tb_keys = [];
        Object.keys(obj).map(key=>{
          let key_ = key.split('_')[0];
          if (!tb_keys.find((item) => { return item == key_})){
            if(key_!='title'){
                tb_keys.push(key_);

            }
          }
        })
    
        return tb_keys;   
     };
    
     const handleChange = e =>{
        const {name, value }=e.target;
        setGraph (prevUser => ({
            ...prevUser,
            [name] :value
        }));

    }

    const handleChangeCheckbox = e =>{
        const {name, checked }=e.target;
        setGraph (prevUser => ({
            ...prevUser,
            [name] :checked
        }));

    }

    

      
    const items=traiterObj(graph)
    console.log('result',graph)
    console.log('data',data)
    console.log('item',items)

    

    return (
        <div className="graphe-param"> 
        {(!Object.keys(graph).length) &&
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
        {(Object.keys(graph).length>0)  && (

            <form key={2} onSubmit={handleSubmit2(onChartSubmit)} >
                <h2>Paramétrage du graphe</h2>
                <table className=" table table2 table-bordered " > 
                
                <tr className="form-group" >
                        <th>Titre</th>
                        <td colSpan='4'>
                            <input className='form-control' onChange={handleChange} name='title' autoComplete='off' value={graph['title']} placeholder='Nom du graphe' ref={register2}/>
                        </td>
                </tr> 
                    
                {traiterObj(graph).map(key =>{
                    return(
                    
                    <tr className='form-group' >
                       <th>{key}</th>
                       <td >
                        <input style={{'marginLeft':'1px', 'marginRight':'1px'}} onChange={handleChangeCheckbox} className="  form-check-input" type="checkbox"  name={key+'_visible'} value={graph[key+'_visible']} defaultChecked={graph[key+'_visible']} ref={register2}  />
                        <label style={{'marginLeft':'10px'}} className='col-md-2'>Visible</label>

                       </td> 
                       
                       <td>
                           <input className='form-control' onChange={handleChange} autoComplete='off' placeholder='Label' name={key+'_label'} value={graph[key+'_label']} ref={register2} />
                       </td>
                       <td>
                            <select className='form-control' onChange={handleChange} name ={key + '_chart'} value={graph[key+'_chart']} ref={register2}>
                                {options.map(item =>{
                                return (
                                        <option value={item.value}>{item.value}</option>
                            
                            
                                )})}
                            </select> 
                       </td>
                       
                       
                       <td>
                            <select  className='form-control' onChange={handleChange} name={key+'_axe'} value={graph[key+'_axe']} ref={register2}>
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
 



    
    






