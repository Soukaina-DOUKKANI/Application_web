import React, {useEffect,useState,useContext}  from 'react';
import c3 from "c3";
import Moment from 'moment';
import 'c3/c3.css';
import axios from '../../../Authentification/AxiosInstance';
import {LoginContext} from '../../../Authentification/LoginContext';


export default function Graphe({data, procedure}){

  const [user, setUser]=useContext(LoginContext);
  const [dataG, setDataG]=useState([]);

  useEffect(()=>{
    axios(setUser).get(`/getGraph/${procedure}`)
    .then(result => {setDataG(result.data)
                      console.log(result)}
                      )
    .catch(err=>console.log(err))
  },[])

 console.log(dataG)

 const traiterObj = (obj) => {
    let tb_keys = [];
    Object.keys(obj).map(key=>{
      let key_ = key.split('_')[0];
      if (!tb_keys.find((item) => { return item == key_})){
        tb_keys.push(key_);
      }
    })

    return tb_keys;   
 };


 let types={};
 let objChart={columns : []};
 let axisChart = {};
 let titre='';
 let axes={};


 useEffect(()=>{

    let List_keys=traiterObj(dataG)
    let i = -1;
    List_keys.map(key=>{
      if(key=='title'){
        titre= dataG[key]

      }
       
      if(dataG[key+'_visible']){
        i++;
        if(key.toLowerCase() ==='seance'){

          objChart.columns[i] = ['x'];
          objChart.x = 'x';
          axisChart.x =  {
            type : 'timeseries',
  
            tick: {
              format: function (x) { return Moment(x).format('DD/MM/yyyy') }
            }
            
          }
        } 
        else{

          objChart.columns[i] = [key];
        } 
        
        data.map(item=>{
          if(key.toLowerCase() ==='seance'){

            objChart.columns[i].push(Moment(item[key]).format('YYYY-MM-DD'))
          } 
          else{
            objChart.columns[i].push(item[key])
          }  
        })
        
        if(dataG[key+'_axe']=='y'){

          types[key] = dataG[key+'_chart'];
          axisChart.y =  {
            label : {text:  dataG[key+'_label'],
                     position: 'outer-middle'}
            
          }
        }

        if(dataG[key+'_axe']=='y2'){
          axes[key]= dataG[key+'_axe'];
          types[key] = dataG[key+'_chart'];
          axisChart.y2 =  {
                    show: true,
                    label : {text: dataG[key+'_label'],
                            position: 'outer-middle'}
             
          }
        }

      }

    })
    objChart.types=types;
    objChart.axes=axes;

  c3.generate({
    bindto: "#chart",
    data: objChart,
    title :{text: titre},
    axis : axisChart
    
  });

},[data])
  


if(data.length){
  return  <div id="chart" />;
}
else{
  return null;
}
}


   

    


 

    
    
    
