import React, { useState, useEffect, useRef } from "react"; 
import { useRootContext } from "../context.js"; 
import _ from "lodash"; 
import useSmoothScroll from 'use-smooth-scroll';
import "../css/Plot.css"; 
import * as d3 from "d3";

// https://observablehq.com/@d3/candlestick-chart

const margin = { top: 20, right: 20, bottom: 20, left: 40 }; 
const parseDate = d3.timeParse("%Y-%m-%d"); 
const formatValue = d3.format(".2f"); 
const formatDate = d3.timeFormat("%B %-d, %Y"); 
const formatChange = (y0, y1) => {
    const f = d3.format("+.2%");
    return (y0, y1) => f((y1 - y0) / y0);
}; 

const xScale = d3.scaleBand(); 
const yScale = d3.scaleLog(); 

export default function CandlestickChart(props) {
    
    const { ticker } = props; 
    const { state } = useRootContext(); 
    const candlestickChartRef = useRef();

    let width = state.plotWidth; 
    let height = state.plotHeight; 

    let data = state.priceData[ticker].slice();
    let sentiment = state.sentiments[ticker].slice(); 

    const [initialized, setInitialized] = useState(false); 

    let xAxis = (g) => {
        
        g   
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .tickValues(d3.timeMonday
                    .every(width > 720 ? 1 : 2)
                    .range(data[0].date, data[data.length - 1].date))
                .tickFormat(d3.timeFormat("%-m/%-d")))
            .call(g => g.select(".domain").remove())
        
    } 

    let yAxis = (g) => {

        g   
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale)
                .tickFormat(d3.format("$~f"))
                .tickValues(d3.scaleLinear().domain(yScale.domain()).ticks()))
            .call(g => g.selectAll(".tick line")
                .attr("stroke-opacity", 0.2)
                .attr("x2", width - margin.left - margin.right))
            .call(g => g.select(".domain").remove())
        
    } 
            
    let updateScales = () => {

        let dates = _.union(data.map(d => d.date), sentiment.map(d => d.date)); 
        let minDate = new Date(Math.min.apply(null, dates)); 
        let maxDate = new Date(Math.max.apply(null, dates));

        xScale  .domain(d3.timeDay.range(minDate, +maxDate + 1))
                .range([margin.left, width - margin.right])
                .padding(0.2);

        yScale  .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
                .rangeRound([height - margin.bottom, margin.top]);

    }; 

    updateScales(); 

    let createCandleStickChart = () => {

        let svg = d3.select(candlestickChartRef.current); 

        svg.append("g")
            .call(xAxis);
    
        svg.append("g")
            .call(yAxis);
        
        const g = svg.append("g")
            .attr("stroke", "#d1d1d1")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => {
                return `translate(${xScale(d.date)},0)`; 
            });
        
        g.append("line")
            .attr("y1", d => yScale(d.low))
            .attr("y2", d => yScale(d.high));
        
        g.append("line")
            .attr("y1", d => yScale(d.open))
            .attr("y2", d => yScale(d.close))
            .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
                                : d.close > d.open ? d3.schemeSet1[2]
                                : d3.schemeSet1[8])
            .attr("stroke-width", xScale.bandwidth());
        
        g.append("title")
            .text(d => `${formatDate(d.date)}
                        Open: ${formatValue(d.open)}
                        Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})
                        Low: ${formatValue(d.low)}
                        High: ${formatValue(d.high)}`);

    }



    useEffect(() => {

        if (candlestickChartRef.current && 
            height && 
            width && 
            !initialized) {

            createCandleStickChart(); 
            
            setInitialized(true); 

        }

    }, [candlestickChartRef.current, height, width]); 

    return (
        <div>
            <svg style={{ height, width }} ref={candlestickChartRef}/>
        </div>
    );

}