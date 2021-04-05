import React, {useEffect}  from 'react';
import c3 from "c3";
import Moment from 'moment';
import 'c3/c3.css';

export default function Graphe({data}){

  useEffect(() => {
    let obj = {  type: "line", types: {
      VOLUME: 'bar'
    },
    x: 'x', axes: {
      VOLUME: 'y2'
    },
    colors: {
      VOLUME: "blue",
      MASI: "red"
    },
     columns : [["x"],["MASI"], ["VOLUME"]] };
    data.map(item => {
      obj.columns[0].push(Moment(item.Seance).format('YYYY-MM-DD'));
      obj.columns[1].push(item.MASI);
      obj.columns[2].push(item.VOLUME);

    });

    console.log(obj);
    c3.generate({
      bindto: "#chart",
      data: obj,
      axis : {
        x: {
            type : 'timeseries',

            tick: {
              format: function (x) { return Moment(x).format('DD/MM/yyyy') }
          }
            
        },
        
          y: {
            label: {
              text: 'MASI',
              position: 'outer-middle'
            }
          },
          y2: {
            show: true,
            label: {
              text: 'VOLUME (en MDH)',
              position: 'outer-middle'
              
            }
          }, 
          grid: {
            x: {
                show: false
            },
            y: {
                show: true
            }
        },
        
    }
      
    });
    
  }, [data]);
  
  if(data.length){
    return  <div id="chart" />;
  }
  else{
    return null
  }
  }
   

    


 

    
    
    
