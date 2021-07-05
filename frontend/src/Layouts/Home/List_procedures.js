import React, { useState, useEffect ,  useContext } from 'react'  
import Axios from '../../Authentification/AxiosInstance';  
import 'bootstrap/dist/css/bootstrap.min.css' ;
import {Link} from "react-router-dom";
import {LoginContext} from '../../Authentification/LoginContext';
import './Home.procedures.css';
import '../Main.Administrateur/Fonctions/AjoutFonction.styles.css';

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
    const [baseDD, setBaseDD]=useState('APP_WEB_DATA');
    

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
    
        
    
    return(
        <div>
            {(user.role=='admin')&&
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
            }
            <div className='div3' >
            {(user.role=='admin')&&
            <div  >
                
                <div >
                <div className="form-group row">
                    <div className='col-md-2'>
                        <label  for="bdd">Base de données  </label>
                    </div>
                    <div className="col-sm-6">
                        <select className="form-control"  name = 'bdd'  onChange={onChangeBDD}>
                            {bdd.map(item =>{
                                return (
                                    <option value={item.bdd}>{item.bdd}</option>
                            )})}
                        </select>         
                    </div>
                </div>
                </div>
                </div>
            }
            <div>
            <div className=' div5 row' >
            
                
              <input className='checkbox1'   type='checkbox' name='procedure'  value={pcd}  onChange={handleChange}/>  
              <label >Procédures</label>

            
                <input className='checkbox2'  type='checkbox' name='fonction' value={fct}   onChange={handleChange2} />  
                <label  > Fonctions</label>


            </div>
            <div style={{'width':'66%'}}>
                { (pcd && !fct) &&(
                    <div className="list-group">
                    <input id="auto" 
                            type="text"
                            placeholder="Chercher une procédure....."
                            onClick={()=> setDisplay(!display)}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}/>

                    {display &&  (
                            <div  className="list-group" >
                            {data
                            .filter(({P})=>P.toLowerCase().indexOf(search.toLowerCase())>-1)
                            .sort((a, b) => a.P> b.P? 1 : -1)
                            .map(item =>{
                                if(user.role=='admin'){
                                    return (

                                        <div  onClick={()=> setResult(item.P)}>
                                        <Link to={`/Details_procedure/${item.P}/${baseDD}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} key={item.P}> {item.P}</Link>
                                        
                                        </div>
                                        
                                    )
                                    
                                }
                                else{
                                    return (
                                        <div  onClick={()=> setResult(item.P)}>
                                        <Link to={`/Interface_utilisateur/${item.P}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} key={item.P} > {item.P}</Link>
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
            <div style={{'width':'66%'}}>
            { (fct && !pcd) &&(
                <div className="list-group">
                    <input   id="auto" 
                            type="text"
                            placeholder="Chercher une fonction....."
                            onClick={()=> setDisplay(!display)}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}/>

                    {display &&  (
                            <div  className="list-group" >
                            {dataFct
                            .filter(({F})=>F.toLowerCase().indexOf(search.toLowerCase())>-1)
                            .sort((a, b) => a.F> b.F? 1 : -1)
                            .map(item =>{
                                if(user.role=='admin'){
                                    return (

                                        <div  onClick={()=> setResult(item.F)}>
                                        <Link to={`/Details_fonction/${item.F}/${baseDD}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} key={item.F}> {item.F}</Link>
                                        
                                        </div>
                                        
                                    )
                                    
                                }
                                else{
                                    return (
                                        <div  onClick={()=> setResult(item.F)}>
                                        <Link to={`/Interface_utilisateur2/${item.F}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} key={item.F} > {item.F}</Link>
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
            <div style={{'width':'66%'}} >
                { (fct && pcd) &&(
                    <div className="list-group">
                        <input  id="auto" 
                            type="text"
                            placeholder="Chercher....."
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
                                                <Link to={`/Details_procedure/${item.P}/${baseDD}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} key={item.P}> {item.P}</Link>
                                                
                                                </div>
                                            </div>    
                                        )}
                                    else{
                                        return (
                                            <div  onClick={()=> setResult(item.P)}>
                                            <Link to={`/Interface_utilisateur/${item.P}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} key={item.P}> {item.P}</Link>
                                            </div>
                                        )}
                                }
                                else{
                                    if(user.role=='admin'){
                                        return (
    
                                            <div  onClick={()=> setResult(item.F)}>
                                            <Link to={`/Details_fonction/${item.F}/${baseDD}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} key={item.F}> {item.F}</Link>
                                            
                                            </div>
                                            
                                        )
                                        
                                    }
                                    else{
                                        return (
                                            <div  onClick={()=> setResult(item.F)}>
                                            <Link to={`/Interface_utilisateur2/${item.F}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} key={item.F}> {item.F}</Link>
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
       </div>
       
    )
}