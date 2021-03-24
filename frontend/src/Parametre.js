import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
  
export default function  Parametre({type}) {
    const isDate= (type==='date')? true : false; 
    const [selectedDate, setSelectedDate]= useState(null);

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
            null
       )
    }
}
  