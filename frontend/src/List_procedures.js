import React, { useState, useEffect ,  useContext } from 'react'  
import Axios from './AxiosInstance';  
import 'bootstrap/dist/css/bootstrap.min.css' 
import {Link} from "react-router-dom"
import {LoginContext} from './LoginContext';
import "./styles/Design.css";
 

export default function List_procedures(){

    const [user,setUser]=useContext(LoginContext);
    const [display, setDisplay]= useState(false);
    const [data, setData] = useState([]);  
    const [search, setSearch]=useState("");
    const [fct, setFct]=useState(false);
    const [pcd, setPcd]=useState( false);
    const [dataFct, setDataFct]=useState([]);
    const [allData, setAllData]=useState([]);
    

    useEffect(() => {  
        Axios(setUser).get("http://localhost:4000/appFonction").then(resultat => {setDataFct(resultat.data)})
        .catch(err => console.log(err));  
    }, []);  
    
    useEffect(() => {  
        Axios(setUser).get("http://localhost:4000/app").then(result => {setData(result.data)})
        .catch(err => console.log(err));  
    }, []);  

    useEffect(() => {  
        Axios(setUser).get("http://localhost:4000/allData").then(resultat => {setAllData(resultat.data)})
        .catch(err => console.log(err));  
    }, []);  

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
    
    
    return(
        <div  className="container flex-column pas-rel">

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
                            .map(item =>{
                                if(user.role=='admin'){
                                    return (

                                        <div  onClick={()=> setResult(item.P)}>
                                        <Link to={`/Details_procedure/${item.P}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.P}</Link>
                                        
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
                            .map(item =>{
                                if(user.role=='admin'){
                                    return (

                                        <div  onClick={()=> setResult(item.F)}>
                                        <Link to={`/Details_fonction/${item.F}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.F}</Link>
                                        
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
                                                <Link to={`/Details_procedure/${item.P}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.P}</Link>
                                                
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
                                            <Link to={`/Details_fonction/${item.F}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.F}</Link>
                                            
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