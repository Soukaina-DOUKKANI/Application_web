import React , {useState, useContext, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {LoginContext} from '../LoginContext';
import Axios from '../AxiosInstance'; 
import generator from 'generate-password';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory} from 'react-router-dom';


export default function Utilisateurs({match}){
     
    const [alerte, setAlerte]=useState(false);
    const [userData, setUserData] =useState({ id : 0, utilisateur : "", identifiant : "", pwd: "", procedures:[], fonctions:[]});
    const {register, handleSubmit}= useForm();
    const [user,setUser]=useContext(LoginContext);
    const [procedure, setProcedure]=useState([]);
    const history= useHistory();
    const [fonction , setFonction] = useState([]);



    useEffect(() => {
        Axios(setUser).get('http://localhost:4000/List_procedures')
        .then(result => setProcedure(result.data))
        .catch(err=> console.log(err))
    },[])
    
    useEffect(() => {
        Axios(setUser).get('http://localhost:4000/List_fonctions')
        .then(result => {setFonction(result.data)
                          console.log(result)})
        .catch(err=> console.log(err))
    },[])
    
    
    useEffect(() => {
    const id=match.params.id;
    if(id){
        Axios(setUser).get(`http://localhost:4000/get_user/${id}`)
        .then(result => {
            const obj={ 
                id : result.data.ID,
                utilisateur : result.data.nom_utilisateur,
                identifiant : result.data.identifiant,
                pwd: result.data.pwd,
                procedures: JSON.parse(result.data.procedures),
                fonctions: JSON.parse(result.data.fonctions)

                };

                setUserData(obj);
    
        })
        .catch(err=> console.log(err))

    }
    }, [])

    const options=(obj)=>{
        let options=[]
        obj.map(item=>{
           
            options.push({value : item.P, label : item.P})
        })

        return (options)
    }

    const options2=(obj)=>{
        let options=[]
        obj.map(item=>{
           
            options.push({value : item.F, label : item.F})
        })

        return (options)
    }

    

    const handleChange = e =>{
        const {name, value }=e.target;
        setUserData (prevUser => ({
            ...prevUser,
            [name] :value
        }));

    }
    const handleChange2 = (e) => {
        let target = e.target
        let name = target.name
        let value = Array.from(target.selectedOptions, option => option.value);
        setUserData (prevUser => ({
            ...prevUser,
            [name] :value
        }));
      }

      const handleChange3 = (e) => {
        let target = e.target
        let name = target.name
        let value = Array.from(target.selectedOptions, option => option.value);
        setUserData (prevUser => ({
            ...prevUser,
            [name] :value
        }));
      }

    function password(){
        const pass= generator.generate({
            length: 20,
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
        console.log(data)
        Axios(setUser).post('http://localhost:4000/users', data).then( result => console.log(result))
        .catch(err => console.log(err));  
        //setUserData({ id : 0, utilisateur : "", identifiant : "", pwd: "", procedures:[]})
        history.push('/Lister_utilisateurs')
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
            <h2> Gestion des comptes Utilisateurs</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group" class="col-md-6">
                    <input type="hidden" name='id' value={userData.id} ref={register}/>
                    <div>
                    <label  for ="utilisateur">Nom utilisateur</label>
                    <input class="form-control" onChange={handleChange} value={userData.utilisateur} id="utilisateur" name="utilisateur" type="text" autoComplete='off' ref={register({ required: true })}/>
                    
                    </div>
                    <div>
                       <label for="identifiant"> Créer un identifiant</label>
                       <input class="form-control" onChange={handleChange} onBlur={onBlur} value={userData.identifiant} id="identifiant" name="identifiant" type="text" autoComplete='off' ref={register({ required: true })}/>
                    </div>
                    
                    {alerte && (
                        <div class="alert alert-danger" role="alert">
                            Identifiant déjà existant!
                        </div>
                    )}

                    <label for="pwd"> Créer un mot de passe</label>

                    <div className="input-group mb-3">
                        <input autoComplete='off' class="form-control" onChange={handleChange} value={userData.pwd} name="pwd" id="pwd"  ref={register({ required: true })} />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={onClick}> Générer</button>
                        </div>
                    </div>
                    <label>Liste des procédures </label>
                    <div className="input-group mb-3">
                        
                        {<select multiple={true} name='procedures' onChange={handleChange2} value={userData.procedures}  ref={register}>
                                            {procedure.map(item =>{
                                                return (
                                                    <option value={item.P}>{item.P}</option>
                                                )})}
                                                </select> }
                           
                    </div>
                    <label>Liste des fonctions</label>
                    <div className="input-group mb-3">
                    { 
                    <select multiple={true} name='fonctions' onChange={handleChange3} value={userData.fonctions}  ref={register}>
                        {fonction.map(item =>{
                            return (
                                <option value={item.F}>{item.F}</option>
                            )})}
                            </select>
                        }
                    </div>
                </div>
                <button onClick={()=> alert('Modifications enregistrées')} type="submit" class="btn btn-primary" >Enregistrer </button>


            </form>
        </div>)
     

}