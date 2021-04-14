import React, { useState, useEffect , useRef, useContext } from 'react'  
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
    const wrapperRef = useRef(null);
    

    const setResult = p=>{
        setSearch(p);
        setDisplay(false);
 
    }
  
    useEffect(() => {  
        Axios(setUser).get("http://localhost:4000/app").then(result => {setData(result.data)})
        .catch(err => console.log(err));  
    }, []);  
    
    useEffect(() => {
        document.addEventListener("mousedown",handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown",handleClickOutside);

        }
    }, []);

    const handleClickOutside = event => {
        const {current:wrap} = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplay(false);

        };
    };

    return(
        <div ref={wrapperRef} className="container flex-column pas-rel">
           
            
            {(user.role =='admin') &&
                
            <Link to= {`/AjoutProcedure`}> 
                <button style={{'marginBottom':'10px', 'marginTop': '10px', 'marginRight':'100px'}} className="button2" > Ajouter une procédure</button> 
            </Link>  
             }
            
            <h2>Liste des procédures stockées :</h2>
            <div style={{"width": "300px"}}>
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
        
        
        </div>
       
        )
}