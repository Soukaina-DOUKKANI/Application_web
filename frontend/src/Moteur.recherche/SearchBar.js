import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';
import './SearchBar.styles.css';
import logo from '../images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import microphone from '../images/microphone.png';

export default function Search(){
    const {register, handleSubmit}=useForm();
    const [searchData, setSearchData]=useState([]);
    const { transcript } = useSpeechRecognition()
    const [searchKey , setSearchKey]=useState("");
    
    const handleChange=(e)=>{
        const value=e.target.value;
        setSearchKey(value)
    }

    
    const speech=()=>{
        SpeechRecognition.startListening({continuous:false, language:'fr-FR'})
        
    }

    useEffect(()=>{
        setSearchKey(transcript)
    },[transcript])

    const onSubmit=(search)=>{
        axios.post('http://localhost:4000/searchBar', search)
        .then(result=> setSearchData(result.data))
        .catch(error=> console.log(error))

    }
    
    
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return(
        <div className="container flex-column pas-rel" >
            <div >
               <Link to={'/Login'}>
                    <button style={{"position":"absolute", "top":"30px","right":"30px"}} className="btn btn-info" > S'authentifier</button> 
                </Link> 
            </div>
            <div>
                <img className="image" src={logo} alt="logo"/>
            </div>
            <div style={{"marginTop": "40px"}} className="container col-md-6">

            <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="container input-group mb-3">
                        <input className="form-control" type='text' autoComplete='off'  ref={register} name= 'search'/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-primary" type='submit' >Rechercher</button>
                        </div>
                        
                        
                    </div>
            </form>
            </div>

            
            <div styles={{'marginTop':'10px'}} className="container ">
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
    )
    }
    else{
        return(
            <div className="container flex-column pas-rel" >
                <div >
                   <Link to={'/Login'}>
                        <button style={{"position":"absolute", "top":"30px","right":"30px"}} className="btn btn-info" > S'authentifier</button> 
                    </Link> 
                </div>
                <div>
                    <img className="image" src={logo} alt="logo"/>
                </div>
                <div style={{"marginTop": "40px"}} className="container col-md-6">
    
                <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="container input-group mb-2">
                            <input className="form-control" type='text' value={searchKey} onChange={handleChange}  autoComplete='off'  ref={register} name= 'search'/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-primary" type='submit' >Rechercher</button>
                            </div>
                            <div>
                                <button  className='vocal-search' onClick={speech}> 
                                    <img className="vocal-search-icon" src={microphone} />
                                </button>
                            </div>
                            
                        </div>
                </form>
                </div>
    
                
                <div styles={{'marginTop':'10px'}} className="container ">
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
        )

    }

}