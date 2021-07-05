import React, { useState ,  useContext } from 'react'  
import Axios from '../../Authentification/AxiosInstance';  
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {Link} from "react-router-dom";
import {LoginContext} from '../../Authentification/LoginContext';
import {useForm} from 'react-hook-form';
import "./Home.procedures.css";

export default function Home(){
    const [user,setUser]=useContext(LoginContext);
    const[searchData, setSearchData]=useState([]);
    const {handleSubmit,register}=useForm();

    const onSubmit=(searchData)=>{
        Axios(setUser).post('/search',searchData)
        .then(result=>{setSearchData(result.data)
                       console.log(result.data)})
        .catch(err=>console.log(err))
    }
    return(
        <div>
            {(user.role=='admin')&&
                <div >
                    <div className="div2 ">
                        <div  className="search-bar col-md-6 ">
                            
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div  >
                                <div style={{ "position":"absolute","left":"420px","top":"10px"}} className=" input-group mb-3 ">
                                    <input  className=" barre form-control" type='text' autoComplete='off' placeholder='Chercher' ref={register} name= 'search'/>
                                    <div className=" input-group-append">
                                        <button className=" barre btn btn-info"  type='submit' > Recherche</button>
                                    </div>
                                </div>
                                </div>
                            
                            </form>
                            
                        </div>
                        
                        <Link to={'/Affichage'}>
                        <button className="bouton" >Affichage</button>
                        </Link>
                        <Link to= {'/AjoutProcedure'}>
                        <button className="bouton2">Ajouter une procédure</button>
                        </Link >
                        <Link to= {'/ajoutFonction'}>
                        <button className="bouton3">Ajouter une fonction</button>
                        </Link>

                    </div>
                    <div >
                        {(searchData.length==0)&&
                        <div  className='body-image' >
                            
                        </div>
                        }
                    </div>
                    <div style={{'marginTop':'20px'}} className="container">
                    {(searchData.length>0) && (searchData[0].table_name)  &&
                    <table className="table table-bordered ">
                                    <thead>
                                    <tr>
                                        <th>Nom de la base de données</th>
                                        <th>Nom de la table</th>
                                        <th>Description de la table</th>
                                        <th>Nom de la colonne </th>
                                        <th>Type de la colonne</th>
                                        
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
                        <table className="table table-bordered ">
                        <thead>
                            <tr>
                                <th>Séance</th>
                                <th>Nom de l'entreprise</th>
                                <th>Valeur du cours</th>
                                <th>Valeur du volume</th>
                                
                            </tr>
                        </thead>
                        {searchData.map(item=>{
                            return(
                                    <tbody>
                                    <tr>
                                        <td>{item.seance_vf} </td>
                                        <td>{item.valeur}</td>
                                        <td>{item.cours_cloture} </td>
                                        <td>{item.volume} </td>
                                        
                                    </tr>
                                    </tbody>
                                )   
                        })
                        }
                    </table>
                    }
                    
                    
                    </div>
                </div>
            }
            {(user.role=='user')&&(
                <div className='body-image'>
                </div>
            )

            }
        </div>
            
            
    )



}