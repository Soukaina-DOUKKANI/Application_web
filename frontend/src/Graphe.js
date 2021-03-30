import React, {useEffect}  from 'react';
import * as d3 from 'd3';
import c3 from "c3";
import useD3 from './useD3';
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
     columns : [["x"],["MASI"], ["VOLUME"]] };
    data.map(item => {
      obj.columns[0].push(Moment(item.Seance).format('YYYY-MM-DD'));
      obj.columns[1].push(item.MASI);
      obj.columns[2].push(item.VOLUME);

    });

    console.log(obj);
    c3.generate({
      bindto: "#chart",
      title: {text: "Indice MASI et VOLUME sur 1 an glissant"},
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
          }
        
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
    /*
    const ref = useD3(
        (svg) => {
          if (data.length!=0){
          const height = 500;
          const width = 500;
          const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
          const x = d3
            .scaleBand()
            .domain(data.map((d) => Moment(d. Seance).format("DD/MM/yyyy")))
            .rangeRound([margin.left, width - margin.right])
            .padding(0.1);
    
          const y2 = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.VOLUME)])
            .rangeRound([height - margin.bottom, margin.top]);

         
    
          const xAxis = (g) =>
            g.attr("transform", `translate(0,${height - margin.bottom})`).call(
              d3
                .axisBottom(x)
                .tickValues(
                  d3
                    .ticks(...d3.extent(x.domain()), width / 40)
                    .filter((v) => x(v) !== undefined)
                )
                .tickSizeOuter(0)
            );
    
          const y2Axis = (g) =>
            g
              .attr("transform", `translate(${width - margin.right},0)`)
              .style("color", "black")
              .call(d3.axisRight(y2))
              .call((g) => g.select(".domain").remove())
              .call((g) =>
                g
                  .append("text")
                  .attr("x", -margin.left)
                  .attr("y", 10)
                  .attr("fill", "currentColor")
                  .attr("stroke-miterlimit", 1)
                  .attr("text-anchor", "start")
                  .text(data.y2)
              );
    
          svg.select(".x-axis").call(xAxis);
          svg.select(".y-axis").call(y2Axis);
    
          svg
            .select(".plot-area")
            .attr("fill", "steelblue")
            .selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(Moment(d. Seance).format("DD/MM/yyyy")))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y2(d.VOLUME))
            .attr("height", (d) => y2(0) - y2(d.VOLUME))
            
        }},
        [data.length]
      
        
      );
   
    
      return (
        <svg
        
          ref={ref}
          style={{
            height: 500,
            width: "100%",
            marginRight: "0px",
            marginLeft: "0px",
          }}
        >
          <g className="plot-area"  />
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      );}*/
    

    


 

    
    
    
