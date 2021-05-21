import React, { useState, useEffect ,  useContext } from 'react'  
import Axios from './AxiosInstance';  
import 'bootstrap/dist/css/bootstrap.min.css' 
import {Link} from "react-router-dom"
import {LoginContext} from './LoginContext';
import "./styles/Design.css";
import {useForm} from 'react-hook-form';

export default function List_procedures(){

    const [user,setUser]=useContext(LoginContext);
    const [display, setDisplay]= useState(false);
    const [data, setData] = useState([]);  
    const [search, setSearch]=useState("");
    const [fct, setFct]=useState(false);
    const [pcd, setPcd]=useState( false);
    const [dataFct, setDataFct]=useState([]);
    const [allData, setAllData]=useState([]);
    const [bdd,setBDD]=useState([]);
    const [baseDD, setBaseDD]=useState('BDD');
    const {handleSubmit,register}=useForm();
    const[searchData, setSearchData]=useState([]);
    

    useEffect(()=>{
        Axios(setUser).get('/BDD')
        .then (result =>setBDD(result.data))
        .catch(err => console.log(err));  
    }, []);   

    useEffect(() => {  
         Axios(setUser).get(`/appFonction/${baseDD}`)
         .then(resultat => {setDataFct(resultat.data)})
        .catch(err => console.log(err));  
    }, [baseDD]);  
        
    useEffect(() => {  
        Axios(setUser).get(`/appProcedure/${baseDD}`)
        .then(result => {setData(result.data)})
        .catch(err => console.log(err));  
    }, [baseDD]);  
    
    useEffect(() => {  
        Axios(setUser).get(`/allData/${baseDD}`)
        .then(resultat => {
            setAllData(resultat.data)})
        .catch(err => console.log(err));  
    }, [baseDD]);  
        
    const onChangeBDD=(e)=>{
       setBaseDD(e.target.value)
    }

    const setResult = p=>{
        setSearch(p);
        setDisplay(false);
    }
    
    const handleChange=(e)=>{
        setPcd(e.target.checked)
    }

    const handleChange2=(e)=>{
        setFct(e.target.checked)
    }
    
   const onSubmit=(searchData)=>{
       Axios(setUser).post('/search',searchData)
       .then(result=>{setSearchData(result.data)
                      console.log(result.data)})
       .catch(err=>console.log(err))
   }
   
    
    return(
        <div  className="container flex-column pas-rel">
            {(user.role=='admin')&&
            <div>
            <div style={{'marginTop': '20px'}} className="container col-md-6">
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="container input-group mb-3">
                    <input className="form-control" type='text' autoComplete='off' placeholder='search bar' ref={register} name= 'search'/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type='submit' >Rechercher</button>

                    </div>
                    </div>
                   
                </form>
            </div>
            <div styles={{'marginTop':'10px'}} className="container">
            {(searchData.length>0) && (searchData[0].table_name)  &&
            <table class="table table-bordered ">
                            <thead>
                            <tr>
                                <th>database_name</th>
                                <th>table_name</th>
                                <th>table_Description</th>
                                <th>column_name</th>
                                <th>column_type</th>
                                
                            </tr>
                            </thead>
                {searchData.map(item=>{
                    return(
                            <tbody>
                            <tr>
                                <td>{item.database_name}</td>
                                <td>{item.table_name}</td>
                                <td>{item.table_description}</td>
                                <td>{item.column_name}</td>
                                <td>{item.column_type}</td>
                                
                                 
                            </tr>
                            </tbody>
                        )   
                })
                }
            </table>
            }
            {(searchData.length>0) && (searchData[0].valeur)  &&
                <table class="table table-bordered ">
                <thead>
                    <tr>
                        <th>Nom_entreprise</th>
                        <th>Secteur d'activité</th>
                        <th>Domaine</th>
                        <th>Description</th>
                        
                    </tr>
                </thead>
                {searchData.map(item=>{
                    return(
                            <tbody>
                            <tr>
                                
                                <td>{item.valeur}</td>
                                <td>{item.secteur_activite}</td>
                                <td>{item.gics_sector_fr}</td>
                                <td>{item.description}</td>
                                 
                            </tr>
                            </tbody>
                        )   
                })
                }
            </table>
            }
            </div>
            
            
            <div style={{'marginTop':'20px'}} className=" form-group">
                    <label style={{'marginRight':'15PX' }} for="bdd">Base de données  </label>
                    <select  name = 'bdd'  onChange={onChangeBDD}>
                        {bdd.map(item =>{
                          return (
                                   <option value={item.bdd}>{item.bdd}</option>
                          )})}
                    </select>
                    
                       
            </div>
            </div>
            }

            <div style={{"width": "300px", 'marginTop': '20px'}}>
            <p>
              <input type='checkbox' name='procedure'  value={pcd}  onChange={handleChange}/>  Procédures

            </p>
            <p>
                <input type='checkbox' name='fonction' value={fct}   onChange={handleChange2} />  Fonctions

            </p>
           
            <div>
                { (pcd && !fct) &&(
                    <div>
                    <input style={{"width":"100%"}} id="auto" 
                            type="text"
                            placeholder="chercher une procédure....."
                            onClick={()=> setDisplay(!display)}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}/>

                    {display &&  (
                            <div  className="list-group" >
                            {data
                            .filter(({P})=>P.toLowerCase().indexOf(search.toLowerCase())>-1)
                            .map(item =>{
                                if(user.role=='admin'){
                                    return (

                                        <div  onClick={()=> setResult(item.P)}>
                                        <Link to={`/Details_procedure/${item.P}/${baseDD}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.P}</Link>
                                        
                                        </div>
                                        
                                    )
                                    
                                }
                                else{
                                    return (
                                        <div  onClick={()=> setResult(item.P)}>
                                        <Link to={`/Interface_utilisateur/${item.P}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.P}</Link>
                                        </div>
                                    )

                                }
                                
                        })
                        }
                        </div>
                    )}
                
               
                    
                    </div>
                )}
            </div>
            <div>
            { (fct && !pcd) &&(
                <div>
                    <input style={{"width":"100%"}} id="auto" 
                            type="text"
                            placeholder="chercher une fonction....."
                            onClick={()=> setDisplay(!display)}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}/>

                    {display &&  (
                            <div  className="list-group" >
                            {dataFct
                            .filter(({F})=>F.toLowerCase().indexOf(search.toLowerCase())>-1)
                            .map(item =>{
                                if(user.role=='admin'){
                                    return (

                                        <div  onClick={()=> setResult(item.F)}>
                                        <Link to={`/Details_fonction/${item.F}/${baseDD}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.F}</Link>
                                        
                                        </div>
                                        
                                    )
                                    
                                }
                                else{
                                    return (
                                        <div  onClick={()=> setResult(item.F)}>
                                        <Link to={`/Interface_utilisateur2/${item.F}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.F}</Link>
                                        </div>
                                    )

                                }
                                
                        })
                    }
                </div>
                    )}
                
                    </div>
                )}
            </div>
            <div>
                { (fct && pcd) &&(
                    <div>
                        <input style={{"width":"100%"}} id="auto" 
                            type="text"
                            placeholder="chercher....."
                            onClick={()=> setDisplay(!display)}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}/>
                        {display &&  (
                            <div>
                            <div  className="list-group" >
                            {allData
                            .map(item =>{
                                if(item.P){
                                    if(user.role=='admin'){
                                        return (
                                            <div>
                                            
                                                <div  onClick={()=> setResult(item.P)}>
                                                <Link to={`/Details_procedure/${item.P}/${baseDD}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.P}</Link>
                                                
                                                </div>
                                            </div>    
                                        )}
                                    else{
                                        return (
                                            <div  onClick={()=> setResult(item.P)}>
                                            <Link to={`/Interface_utilisateur/${item.P}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.P}</Link>
                                            </div>
                                        )}
                                }
                                else{
                                    if(user.role=='admin'){
                                        return (
    
                                            <div  onClick={()=> setResult(item.F)}>
                                            <Link to={`/Details_fonction/${item.F}/${baseDD}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.F}</Link>
                                            
                                            </div>
                                            
                                        )
                                        
                                    }
                                    else{
                                        return (
                                            <div  onClick={()=> setResult(item.F)}>
                                            <Link to={`/Interface_utilisateur2/${item.F}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.F}</Link>
                                            </div>
                                        )
    
                                    }

                                }        
                            })
                            }
                            </div>
                          
                           </div> 
                        
                        )}    
                    </div>
                )
                }
            </div>
       
        </div>
       </div>
       
        )
}