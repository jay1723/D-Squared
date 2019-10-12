import React, { useState, useEffect, useRef } from "react"; 
import { useRootContext } from "../context.js"; 
import * as d3 from "d3";

export default function Plot(props) {

    const { state, dispatch } = useRootContext(); 
    const candlestickChartRef = useRef(null); 

    useEffect(() => {

        let getData = async () => {

            let data = (await d3.csv(`https://gist.githubusercontent.com/mbostock/696604b8395aa68d0e7dcd74abd21dbb/raw/55c17dab8461cde25ca8c735543fba839b0c940b/AAPL.csv`, d => {
                const date = parseDate(d["Date"]);
                return {
                    date,
                    high:   +d["High"],
                    low:    +d["Low"],
                    open:   +d["Open"],
                    close:  +d["Close"]
                };
            })).slice(-120);

            dispatch(['SET PRICE DATA', data]); 
        }

        getData();

    }, []);

    useEffect(() => {

        if (candlestickChartRef.current && state.priceData) {

            let data = state.priceData; 

            // let candlestickChart = d3.Selection(candlestickChartRef.current); 

            // svg.append("g")
            // .call(xAxis);
        
            // svg.append("g")
            //     .call(yAxis);
            
            // const g = svg.append("g")
            //     .attr("stroke", "black")
            //     .selectAll("g")
            //     .data(data)
            //     .join("g")
            //     .attr("transform", d => `translate(${x(d.date)},0)`);
            
            // g.append("line")
            //     .attr("y1", d => y(d.low))
            //     .attr("y2", d => y(d.high));
            
            // g.append("line")
            //     .attr("y1", d => y(d.open))
            //     .attr("y2", d => y(d.close))
            //     .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
            //         : d.close > d.open ? d3.schemeSet1[2]
            //         : d3.schemeSet1[8])
            //     .attr("stroke-width", x.bandwidth());
            
            // g.append("title")
            //     .text(d => `${formatDate(d.date)}
            // Open: ${formatValue(d.open)}
            // Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})
            // Low: ${formatValue(d.low)}
            // High: ${formatValue(d.high)}`);
        
        }

    }, [state.priceData]); 


    return (
        <svg style={{ height: 500, width: 500 }} ref={candlestickChartRef}/>
    );

}