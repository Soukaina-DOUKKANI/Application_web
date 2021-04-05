import React , {useState, useContext} from 'react';
import {useForm} from 'react-hook-form';
import {LoginContext} from '../LoginContext';
import Axios from '../AxiosInstance'; 
import generator from 'generate-password';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Utilisateurs(){
     
    const [alerte, setAlerte]=useState(false);
    const [userData, setUserData] =useState({ id : 0, utilisateur : "", identifiant : "", pwd: ""});
    const {register, handleSubmit }= useForm();
    const [user,setUser]=useContext(LoginContext);


    const handleChange = e =>{
        const {name, value }=e.target;
        setUserData (prevUser => ({
            ...prevUser,
            [name] :value
        }));

    }

    function password(){
        const pass= generator.generate({
            length:12,
            numbers: true,
            lowercase: true,
            uppercase: true,
    
        });
        return(pass)
        
    }

    const onClick = (e)=>{

        e.preventDefault();
        setUserData( prevUser =>({
            ...prevUser, 
            pwd : password()
        }))

    }


    const onSubmit=(data)=>{
        Axios(setUser).post('http://localhost:4000/users', data).then( result => console.log(result))
        .catch(err => console.log(err));  
        setUserData({ id : 0, utilisateur : "", identifiant : "", pwd: ""})

    }



    const onBlur=(e)=>{

        const identifiant= e.target.value;
        if(identifiant!=''){
            const id= userData.id;
        Axios(setUser).get(`http://localhost:4000/checkIdentifiant/${identifiant}/${id}`)
        .then(result => {
            if (result.data== 'abort'){
                setUserData( prevUser =>({
                    ...prevUser, 
                    identifiant: ""
                
                }))
                setAlerte(true)

            }
            else{
                setAlerte(false)
            }
        })
        .catch(err => console.log(err));  

        
    }    

    }

    return (
        <div className="container" >
            <h2>Création des comptes</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group" class="col-md-6">
                    <input type="hidden" value={userData.id} ref={register}/>
                    <div>
                    <label  for ="utilisateur">Nom utilisateur</label>
                    <input class="form-control" onChange={handleChange} value={userData.utilisateur} id="utilisateur" name="utilisateur" type="text" autocomplete='off' ref={register({ required: true })}/>
                    
                    </div>
                    <div>
                       <label for="identifiant"> Créer un identifiant</label>
                       <input class="form-control" onChange={handleChange} onBlur={onBlur} value={userData.identifiant} id="identifiant" name="identifiant" type="text" autocomplete='off' ref={register({ required: true })}/>
                    </div>
                    
                    {alerte && (
                        <div class="alert alert-danger" role="alert">
                            Identifiant déjà existant!
                        </div>
                    )}

                    <label for="pwd"> Créer un mot de passe</label>

                    <div className="input-group mb-3">
                        <input autocomplete='off' class="form-control" onChange={handleChange} value={userData.pwd} name="pwd" id="pwd"  ref={register({ required: true })} />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={onClick}> Générer</button>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" >Enregistrer </button>


            </form>
        </div>)
     

}