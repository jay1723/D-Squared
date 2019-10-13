import React, { useState, useEffect, useRef } from "react"; 
import { useRootContext } from "../context.js"; 
import _ from "lodash"; 
import useSmoothScroll from 'use-smooth-scroll';
import "../css/Plot.css"; 
import * as d3 from "d3";

// https://observablehq.com/@d3/candlestick-chart

const margin = { top: 20, right: 20, bottom: 20, left: 40 }; 
const xScale = d3.scaleBand(); 
const yScale = d3.scaleLog(); 
const line = d3.line(); 

export default function MultiPlot(props) {
    
    const { state } = useRootContext(); 
    const chartRef = useRef();

    let width = state.plotWidth; 
    let height = state.plotHeight; 

    let getMinMaxDate = () => {

        let minDate = null; 
        let maxDate = null; 
        for (let i = 0; i < state.selectedTickers.length; i++) {
            let ticker = state.selectedTickers[i];
            let data = state.priceData[ticker].slice(); 
            let sentiment = state.sentiments[ticker].slice(); 
            let dates = _.union(data.map(d => d.date), sentiment.map(d => d.date)); 
            let aMinDate = new Date(Math.min.apply(null, dates)); 
            let aMaxDate = new Date(Math.max.apply(null, dates));
            if (!minDate || aMinDate.valueOf() < minDate.valueOf()) {
                minDate = aMinDate; 
            }
            if (!maxDate || aMaxDate.valueOf() > maxDate.valueOf()) {
                maxDate = aMaxDate; 
            }
        }
        return { minDate, maxDate }; 

    }

    let { minDate, maxDate } = getMinMaxDate(); 

    const [initialized, setInitialized] = useState(false); 

    let xAxis = (g) => {
        
        g   
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .tickValues(
                    d3.timeMonday
                    .every(width > 720 ? 1 : 2)
                    .range(minDate, maxDate)
                )
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
            
    let updateScales = (data) => {

        xScale  .domain(d3.timeDay.range(minDate, +maxDate + 1))
                .range([margin.left, width - margin.right])
                .padding(0.2);

        yScale  .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
                .rangeRound([height - margin.bottom, margin.top]);

    }; 

    let createAxes = () => {

        let svg = d3.select(chartRef.current); 

        svg.append("g")
            .call(xAxis);
    
        svg.append("g")
            .call(yAxis);

    }

    let createLineChart = (data, i) => {

        let svg = d3.select(chartRef.current); 

        updateScales(data); 

        line.x(d => xScale(d.date)); 
        line.y(d => yScale((d.open+d.close)/2)); 

        svg.append("path")
            .attr('d', line(data))
            .attr('fill', 'none')
            .attr("stroke", d3.schemeCategory10[i]); 
        
    } 

    useEffect(() => {

        if (chartRef.current && 
            height && 
            width && 
            !initialized) {

            createAxes();
            
            for (let i = 0; i < state.selectedTickers.length; i++) {
                let ticker = state.selectedTickers[i]; 
                let data = state.priceData[ticker].slice(); 
                createLineChart(data, i); 
            }
            
            setInitialized(true); 

        }

    }, [chartRef.current, height, width]); 

    return (
        <div>
            <svg style={{ height, width }} ref={chartRef}/>
        </div>
    );

}