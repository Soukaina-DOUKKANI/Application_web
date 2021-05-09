import React, { useState, useEffect ,  useContext } from 'react'  
import Axios from './AxiosInstance';  
import 'bootstrap/dist/css/bootstrap.min.css' 
import {Link} from "react-router-dom"
import {LoginContext} from './LoginContext';
import "./styles/Design.css";
import {useForm} from 'react-hook-form';
import AutoSuggest from 'react-autosuggest';

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
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);


    useEffect(()=>{
        Axios(setUser).get('http://localhost:4000/BDD')
        .then (result =>setBDD(result.data))
        .catch(err => console.log(err));  
    }, []);   

    useEffect(() => {  
         Axios(setUser).get(`http://localhost:4000/appFonction/${baseDD}`)
         .then(resultat => {setDataFct(resultat.data)})
        .catch(err => console.log(err));  
    }, [baseDD]);  
        
    useEffect(() => {  
        Axios(setUser).get(`http://localhost:4000/appProcedure/${baseDD}`)
        .then(result => {setData(result.data)})
        .catch(err => console.log(err));  
    }, [baseDD]);  
    
    useEffect(() => {  
        Axios(setUser).get(`http://localhost:4000/allData/${baseDD}`)
        .then(resultat => {setAllData(resultat.data)})
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
       Axios(setUser).post('http://localhost:4000/search',searchData)
       .then(result=>{setSearchData(result.data)
                      console.log(result.data)})
       .catch(err=>console.log(err))
   }
    /*
    const getSuggestions=(value)=>{
       Axios(setUser).post('http://localhost:9200/meta/_search',{
        query: {
            multi_match: {
                query: value,
                fuzziness: "auto",
                fuzzy_transpositions: true,
                max_expansions: 50,
                prefix_length: 1
            }
        }

       }).then(res=>{
           const results=res.data.body.hits.hits.map(h=>h._source)
           setSuggestions(results)
       }).catch(err=>console.log(err))   
    }

    const clearSuggestions=()=>{
        setSuggestions([])
    }

    
    
    const renderSuggestion=(item)=>{
        return(
            <table class="table table-bordered ">
                <thead>
                    <tr>
                        <th>database_name</th>
                        <th>table_name</th>
                        <th>table_Description</th>
                        <th>column_name</th>
                        <th>column_description</th>
                        <th>column_type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{item.database_name}</td>
                        <td>{item.table_name}</td>
                        <td>{item.table_description}</td>
                        <td>{item.column_name}</td>
                        <td>{item.column_description}</td>
                        <td>{item.column_type}</td>
                        
                    </tr>
                </tbody>
            </table>
        )
    }
   */
    
    
    return(
        <div  className="container flex-column pas-rel">
            {(user.role=='admin')&&
            <div>
            <div style={{'marginTop': '20px'}} className="container col-md-6">
                {/*<AutoSuggest
                inputProps={{
                    placeholder:'search bar',
                    value:value,
                    onChange: (_, { newValue, method }) => {
                        setValue(newValue);
                      }
                }}
                suggestions={suggestions}
                onSuggestionsFetchRequested={getSuggestions}
                onSuggestionsClearRequested={clearSuggestions}
                getSuggestionValue={item => item.database_name}
                renderSuggestion={renderSuggestion}
                highlightFirstSuggestion={true}

            />*/}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="container input-group mb-3">
                    
                    <input class="form-control" type='text' autoComplete='off' placeholder='search bar' name='search' ref={register}/> 
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type='submit' >Rechercher</button>

                    </div>
                    </div>
                   
                </form>
            </div>
            <div styles={{'marginTop':'10px'}} className="container">
            {(searchData.length>0) &&
            <table class="table table-bordered ">
                            <thead>
                            <tr>
                                <th>database_name</th>
                                <th>table_name</th>
                                <th>table_Description</th>
                                <th>column_name</th>
                                <th>column_description</th>
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
                                <td>{item.column_description}</td>
                                <td>{item.column_type}</td>
                                 
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