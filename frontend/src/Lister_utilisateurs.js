import React, {useContext,useState,useEffect} from 'react';
import {LoginContext} from './LoginContext';
import Axios from './AxiosInstance'; 
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css' ;


export default function Lister_utilisateurs(){

    const [listUser, setListUser]=useState([]);
    const [procedure, setProcedure]=useState([]);
    const [user,setUser]=useContext(LoginContext);

    useEffect(() => {
        Axios(setUser).get('http://localhost:4000/list_users')
        .then(result => setListUser(result.data))
        .catch(err=> console.log(err))
    },[])

    useEffect(() => {
        Axios(setUser).get('http://localhost:4000/List_procedures')
        .then(result => setProcedure(result.data))
        .catch(err=> console.log(err))
    },[])
    
    
   
    return(
        <div style={{'marginTop':'30px'}} className="container ">
            <div className='row'>
            <h2>Membres</h2> 
            <Link to={`/Utilisateurs`}>
                <button style={{'marginLeft':'30px'}} type="button" class="btn btn-info"> Ajouter un membre</button>
            </Link>
            </div>
            <table class="table " style={{'marginTop':'30px'}}>
                <thead>
                    <tr>
                        <th>Nom utilisateur</th>
                        <th>Identifiant</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { listUser.map(item=>{
                        return (
                            
                                <tr>
                                    <td>{item.nom_utilisateur}</td>
                                     <td >{item.identifiant}</td>
                                     <td>
                                     <Link to={`/Utilisateurs/${item.ID}`}>
                                            <button style={{'marginLeft':'30px'}} type="button" class="btn btn-info">
                                                Editer
                                                </button>
                                    </Link>
                                    </td>
                                        
                                   
                                    
                                </tr>    
                         
                            )
                        })
                        }
                    
                </tbody> 
            </table>


           
        </div>
    )




}