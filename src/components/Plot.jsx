import React, { useState, useEffect, useRef } from "react"; 
import { useRootContext } from "../context.js"; 
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

export default function Plot(props) {

    const width = 500; 
    const height = 300; 

    const { state, dispatch } = useRootContext(); 
    const candlestickChartRef = useRef();
    const sentimentChartRef = useRef()

    const [xScale, setXScale] = useState(() => d3.scaleBand()); 
    const [yScale, setYScale] = useState(() => d3.scaleLog()); 

    let xAxis = (g) => {

        let data = state.priceData; 
        
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
            
    let updateScales = (data) => {

        xScale  .domain(d3.timeDay
                .range(data[0].date, +data[data.length - 1].date + 1)
                .filter(d => d.getDay() !== 0 && d.getDay() !== 6))
                .range([margin.left, width - margin.right])
                .padding(0.2);

        yScale  .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
                .rangeRound([height - margin.bottom, margin.top]);

    }; 

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

            let stories = []; 
            for (let i = 0; i < data.length; i+=9) {
                let { date } = data[i]; 
                let score = Math.random();
                let type = Math.random() < .5 ?  'positive' : 
                          Math.random() < .5 ?   'neutral' : 
                                                 'negative';  
                stories.push({ date, score, type }); 
            }
            updateScales(data); 

            dispatch(['SET PRICE DATA', data]); 
            dispatch(["SET STORIES", stories]); 
        }

        getData();

    }, []); 

    let createCandleStickChart = () => {

        let svg = d3.select(candlestickChartRef.current); 

        svg.append("g")
            .call(xAxis);
    
        svg.append("g")
            .call(yAxis);
        
        const g = svg.append("g")
            .attr("stroke", "#d1d1d1")
            .selectAll("g")
            .data(state.priceData)
            .join("g")
            .attr("transform", d => `translate(${xScale(d.date)},0)`);
        
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

    let createSentimentChart = () => {

        let svg = d3.select(sentimentChartRef.current); 
        let circleScale = d3.scaleLinear().domain([0, 1]).range([3, 10]); 

        svg.append('g')
            .selectAll('.rect')
            .data(state.stories)
            .enter()
            .append('circle')
                .attr('r', d => circleScale(d.score))
                .attr('cx', d => xScale(d.date))
                .attr('cy', 20)
                .attr('stroke', '#e1e1e4')
                .attr('stroke-width', .5)
                .attr('fill', d => d.type === 'positive' ? 'green' : d.type === 'neutral' ? 'grey' : 'red');

    }

    useEffect(() => {

        if (candlestickChartRef.current && 
            sentimentChartRef.current && 
            state.priceData && 
            state.stories && 
            height && 
            width) {

            createCandleStickChart(); 
            createSentimentChart(); 

            // let colors = state.stories.map(d => d.type === 'positive' ? 'green' : d.type === 'neutral' ? 'grey' : 'red');
            // let defs = svg.append('defs'); 
            // let gradient = defs
            //                 .append("linearGradient")
            //                 .attr("id", "linear-gradient")

            // let step = 100.0 / (colors.length - 1); 
            // for (let i = 0; i < state.stories.length; i++) {
            //     let offset = step * i; 
            //     let color = colors[i]; 
            //     gradient.append('stop')
            //             .attr('offset', `${offset}%`)
            //             .attr('stop-color', color); 
            // }

            // svg.append("rect")
            //     .attr('x', xScale(state.stories[0].date))
            //     .attr('y', 100)
            //     .attr('width', xScale(state.stories[state.stories.length-1].date))
            //     .attr('height', 10)
            //     .attr("fill", "url(#linear-gradient)")


        }

    }, [candlestickChartRef.current, state.priceData, state.stories, height, width]); 

    return <div>
        <svg style={{ height, width }} ref={candlestickChartRef}/>
        <svg style={{ height: 40, width }} ref={sentimentChartRef}/>
    </div>
    

}