import React, {useContext,useState,useEffect} from 'react';
import {LoginContext} from '../Authentification/LoginContext';
import Axios from '../Authentification/AxiosInstance'; 
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css' ;


export default function Lister_utilisateurs(){

    const [listUser, setListUser]=useState([]);
    const [user,setUser]=useContext(LoginContext);

    useEffect(() => {
        Axios(setUser).get('/list_users')
        .then(result => setListUser(result.data))
        .catch(err=> console.log(err))
    },[])
    
    
   
    
    return(
        <div style={{'marginTop':'30px'}} className=" div3  ">
            <div className='row'>
            <h2 style={{'marginLeft':'10px'}}>Membres</h2> 
            <Link to={`/Utilisateurs`}>
                <button style={{'marginLeft':'30px'}} type="button" class="btn btn-primary"> Ajouter un membre</button>
            </Link>
            </div>
            <table className="table table-bordered " style={{'marginTop':'30px', 'width': '90%'}}>
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
                                            <button style={{'marginLeft':'30px'}} type="button" class="btn btn-primary">
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