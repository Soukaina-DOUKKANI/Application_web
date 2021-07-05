import React , {useState, useContext, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {LoginContext} from '../Authentification/LoginContext';
import Axios from '../Authentification/AxiosInstance'; 
import generator from 'generate-password';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory} from 'react-router-dom';
import './Utilisateurs.styles.css';
import Select from 'react-select';
import Select2 from 'react-select';


export default function Utilisateurs({match}){
     
    const [alerte, setAlerte]=useState(false);
    const [userData, setUserData] =useState({ id : 0, utilisateur : "", identifiant : "", pwd: "", procedures:[], fonctions:[]});
    const {register, handleSubmit, control}= useForm();
    const [user,setUser]=useContext(LoginContext);
    const [procedure, setProcedure]=useState([]);
    const history= useHistory();
    const [fonction , setFonction] = useState([]);


    useEffect(() => {
        Axios(setUser).get('/List_procedures')
        .then(result => setProcedure(result.data))
        .catch(err=> console.log(err))
    },[])
    
    useEffect(() => {
        Axios(setUser).get('/List_fonctions')
        .then(result => {setFonction(result.data)})
        .catch(err=> console.log(err))
    },[])
    
    
    useEffect(() => {
    const id=match.params.id;
    if(id){
        Axios(setUser).get(`/get_user/${id}`)
        .then(result => {
            const proc=JSON.parse(result.data.procedures)
            const fct=JSON.parse(result.data.fonctions)
            const data=(obj2)=>{
                let val=[]
                for (let i in obj2){
                    val.push(obj2[i].value)
                }
                return(val)
            }
            console.log(data(proc)) 
            const obj={ 
                id : result.data.ID,
                utilisateur : result.data.nom_utilisateur,
                identifiant : result.data.identifiant,
                pwd: result.data.pwd,
                procedures: JSON.parse(result.data.procedures),
                fonctions: JSON.parse(result.data.fonctions)
                };
            console.log(obj)
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
    

    

    function password(){
        const pass= generator.generate({
            length: 15,
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
        Axios(setUser).post('/users', data).then( result => console.log(result))
        .catch(err => console.log(err));  
        //setUserData({ id : 0, utilisateur : "", identifiant : "", pwd: "", procedures:[]})
        history.push('/Lister_utilisateurs')
    }


    const onBlur=(e)=>{

        const identifiant= e.target.value;
        if(identifiant!=''){
            const id= userData.id;
        Axios(setUser).get(`/checkIdentifiant/${identifiant}/${id}`)
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
    
    console.log('procedures',userData.procedures)


    return (
        <div className='utilisateurs-creation' >
            <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <h2 style={{'marginBottom':'20px'}}> Gestion des comptes Utilisateurs</h2>

                <div className="form-group" >
                    <input type="hidden" name='id' value={userData.id} ref={register}/>
                    <p className='row'>
                    <label className='col-md-4' for ="utilisateur"> Ajouter le nom de l'utilisateur</label>
                    <input className="form-control col-sm-7 " onChange={handleChange} value={userData.utilisateur} id="utilisateur" name="utilisateur" type="text" autoComplete='off' ref={register({ required: true })}/>
                    
                    </p>
                    <p className='row'>
                       <label className='col-md-4' for="identifiant"> Créer un identifiant</label>
                       <input className="form-control col-sm-7"  onChange={handleChange} onBlur={onBlur} value={userData.identifiant} id="identifiant" name="identifiant" type="text" autoComplete='off' ref={register({ required: true })}/>
                    </p>
                    
                    {alerte && (
                        <div class="alert alert-danger" role="alert">
                            Identifiant déjà existant!
                        </div>
                    )}

                    <p className="input-group ">
                        <label for="pwd"> Créer un mot de passe</label>
                        
                        <input style={{'marginLeft':'15%'}} autoComplete='off' className="form-control col-md-6" onChange={handleChange} value={userData.pwd} name="pwd" id="pwd"  ref={register({ required: true })} />
                        
                        <div   className="input-group-append">
                            <button style={{'paddingRight':'22px'}} className="btn btn-outline-primary  " type="button" onClick={onClick}> Générer</button>
                        </div>
                    </p>
                    <p className='row'>
                    <label className='col-md-3' >Liste des procédures </label>
                    <div  style={{'marginLeft':'8%', 'width':'58%'}} >
                        <Controller
                            as={Select}
                            name="procedures"
                            control={control}
                            value={userData.procedures}
                            defaultValue=""
                            placeholder='Selectionner'
                            options={options(procedure)}
                            isMulti
                            isClearable
                            isSearchable
                        />
                    </div>
                    
                    </p>
                    
                    <p className='row'>
                    <label className='col-md-3' >Liste des fonctions</label>
                    <div style={{'marginLeft':'8%', 'width':'58%'}}>
                    <Controller
                            as={Select2}
                            name="fonctions"
                            control={control}
                            value={userData.fonctions}
                            defaultValue=""
                            placeholder='Selectionner'
                            options={options2(fonction)}
                            isMulti
                            isClearable
                            isSearchable
                            
                        />
                    </div>
                    </p>
                </div>
                <button  onClick={()=> alert('Modifications enregistrées')} type="submit" style={{'marginLeft':'81%'}} className="  btn btn-primary" >Enregistrer </button>


            </form>
        </div>)
     

}