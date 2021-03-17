import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import Axios from 'axios';  
export default function  Parametre({type}) {
    const isDate= (type=='date')? true : false; 
    const [selectedDate, setSelectedDate]= useState(null);
    const [values, setValues] = useState([]);  
    useEffect(() => {  
        if (!isDate){
            Axios.get(`http://localhost:4000/Get_values`).then(result => setValues(result.data));
        }  
    }, []); 
    if (isDate){
        return(
            <div>
            <DatePicker selected={selectedDate}
            onChange={Date => setSelectedDate(Date)}
            dateFormat='dd/MM/yyyy'/>
            </div>);
        }
    else{
        return(
             <div>
                 <select>
                    
                     {values.map(item =>{
                       return (
                                <option value={item.Valeur}>{item.Valeur}</option>
                 
                   
                       )})}
                 </select>
             </div>
        )
    }
};  