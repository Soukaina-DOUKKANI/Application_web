import React, { useEffect, useState, useContext } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {LoginContext} from './LoginContext';
import Axios from './AxiosInstance'; 
import { Controller} from "react-hook-form";


export default function  Parametre({type, valeur,bdd, requete, register, control, setValue}) {
    
    const isDate= (type.toLowerCase()=='@date_in')? true : false; 
    const isValue=(valeur!=="")? true : false;
    const [values, setValues]=useState([]);
    const [selectedDate, setSelectedDate]=useState(null);
    const [user,setUser]=useContext(LoginContext);



    useEffect(() => {  
        if (!isDate && !isValue){
            Axios(setUser).get(`http://localhost:4000/Get_options/${requete}/${bdd}`)
            .then(result => setValues(result.data))
            .catch(err => console.log(err));  

        }  
    }, []);
    
    const handleChange = (changerDate) => {
        setValue(type, changerDate, {
          shouldDirty: true
        });
        setSelectedDate(changerDate);
      };
    if (isDate){
        
        return(
            <div>
                
                <Controller
                control={control}
                name={type}
                defaultValue={selectedDate}
                render={() => (
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleChange}
                        dateFormat='dd/MM/yyyy' 
                        showYearDropdown
                        scrollableMonthYearDropdown
                        isClearable
                    />
                  )}
                />
            
            </div>);
        }
        else{
            if (isValue){
                return(
                        <input value={valeur} name = {type} ref={register}  />
                )

            }
            else{
            return(
                 <div>
                     <select  name = {type} ref={register}>
                        
                         {values.map(item =>{
                           return (
                                    <option value={item.Valeur}>{item.Valeur}</option>
                     
                       
                           )})}
                     </select>
                 </div>
            )
            }
        }
}
  