import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';
import './SearchBar.styles.css';
import logo from '../images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Search(){
    const {register, handleSubmit}=useForm();
    const [searchData, setSearchData]=useState([]);


    const onSubmit=(searchData)=>{
        axios.post('http://localhost:4000/searchBar', searchData)
        .then(result=> setSearchData(result.data))
        .catch(error=> console.log(error))

    }

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
            <div styles={{'marginTop':'10px'}} className="container">
            {(searchData.length>0) && (searchData[0].table_name)  &&
            <table className="table table-bordered ">
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
                <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th>Seance</th>
                        <th>Nom_entreprise</th>
                        <th>Descrption</th>
                        <th>Cours</th>
                        <th>Volume</th>
                        
                    </tr>
                </thead>
                {searchData.map(item=>{
                    return(
                            <tbody>
                            <tr>
                                <td>{item.seance_vf} </td>
                                <td>{item.valeur}</td>
                                <td>{item.description} </td>
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