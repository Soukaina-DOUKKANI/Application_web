import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import Axios from 'axios';
import { Controller} from "react-hook-form";


export default function  Parametre({type, valeur, requete, register, control, setValue}) {
    
    const isDate= (type.toLowerCase()=='@date_in')? true : false; 
    const isValue=(valeur!=="")? true : false;
    const [values, setValues]=useState([]);
    const [selectedDate, setSelectedDate]=useState(null);


    useEffect(() => {  
        if (!isDate && !isValue){
            Axios.get(`http://localhost:4000/Get_options/${requete}`).then(result => setValues(result.data));
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
  