import React, {useEffect,useState,useContext}  from 'react';
import c3 from "c3";
import Moment from 'moment';
import 'c3/c3.css';
import axios from './AxiosInstance';
import {LoginContext} from './LoginContext';


export default function Graphe({data, procedure}){

  const [user, setUser]=useContext(LoginContext);
  const [dataG, setDataG]=useState([]);

  useEffect(()=>{
    axios(setUser).get(`http://localhost:4000/getGraph/${procedure}`)
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
    /*.map(key => {
      if(key=='title'){
        return(
          <div>
            {`${key} : ${obj[key]}`}
          </div>
        )
      }else{
        return(
          <div>
            {
              `${key} -
              visible : ${obj[key+'_visible']}
              label : ${obj[key+'_label']}
              chart : ${obj[key+'_chart']}
              axe : ${obj[key+'_axe']}`
            }
          </div>
        )
      }
    })*/
 };
 let types={};
 let objChart={columns : []};
 let axisChart = {};
 let titre='';

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
        }

      }

    })
    objChart.types=types;

  

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


   

    


 

    
    
    
