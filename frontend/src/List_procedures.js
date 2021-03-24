import React, { useState, useEffect , useRef } from 'react'  
import Axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css' 
import {Link} from "react-router-dom"

export default function List_procedures(){
    const [display, setDisplay]= useState(false);
    const [data, setData] = useState([]);  
    const [search, setSearch]=useState("");
    const wrapperRef = useRef(null);

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

    const setResult = p=>{
        setSearch(p);
        setDisplay(false);
 
    }
  
    useEffect(() => {  
        Axios.get("http://localhost:4000/app").then(result => setData(result.data));  
    }, []);  

    

    return(
        <div ref={wrapperRef} className="container flex-column pas-rel">
            <h2>Liste des procédures stockées :</h2>
            <div style={{"width": "300px"}}>
            <input style={{"width":"100%"}} id="auto" 
                    type="text"
                    placeholder="chercher une procédure....."
                    onClick={()=> setDisplay(!display)}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}/>

            {display && (
                    <div  className="list-group" >
                    {data
                    .filter(({P})=>P.toLowerCase().indexOf(search.toLowerCase())>-1)
                    .map(item =>{
                        return (
                            <div  onClick={()=> setResult(item.P)}>
                            <Link to={`/Details_procedure/${item.P}`} className="list-group-item  list-group-item-action list-group-item-light " style={{"color":"black"}} > {item.P}</Link>
                            </div>
            )})}</div>
            )}
        </div>
        </div>
       
        )
}