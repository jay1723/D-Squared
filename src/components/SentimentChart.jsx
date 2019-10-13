import React, { useState, useEffect, useRef } from "react"; 
import { useRootContext } from "../context.js"; 
import _ from "lodash"; 
import "../css/Plot.css"; 
import * as d3 from "d3";

// https://observablehq.com/@d3/candlestick-chart

const margin = { top: 20, right: 20, bottom: 20, left: 40 }; 
const xScale = d3.scaleBand(); 
const yScale = d3.scaleLog(); 

export default function SentimentChart(props) {
    
    const { ticker } = props; 
    const { state, dispatch } = useRootContext(); 
    const sentimentChartRef = useRef(); 

    let width = state.plotWidth; 
    let height = state.plotHeight; 

    let sentiment = state.sentiments[ticker].slice(); 
    let data = state.priceData[ticker].slice();

    const [initialized, setInitialized] = useState(false); 
            
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

    let createSentimentChart = () => {

        let svg = d3.select(sentimentChartRef.current); 

        let circleScale = d3.scaleLinear().domain([0, 1]).range([3, 10]); 

        let onStoryClick = (story) => {
            let index = -1; 
            let stories = state.sentiments[ticker].slice(); 
            for (let j = 0; j < stories.length; j++) {
                if (stories[j].date.valueOf() === story.date.valueOf()) {
                    index = j; 
                    break; 
                }
            }
            let proposal = { ticker, index }; 
            dispatch(['SET STORY SCROLLER PROPOSAL', proposal]); 
        }

        svg.append('g')
            .selectAll('circle')
            .data(sentiment)
            .enter()
            .append('circle')
                .on('click', onStoryClick)
                .attr('r', d => circleScale(d.score))
                .attr('cx', d => {
                    return xScale(d.date); 
                })
                .attr('cy', 20)
                .attr('stroke', '#e1e1e4')
                .attr('stroke-width', .5)
                .attr('fill', d => d.type === 'pos' ? 'green' : d.type === 'neutral' ? 'grey' : 'red');

    }

    useEffect(() => {

        if (sentimentChartRef.current && 
            height && 
            width && 
            !initialized) {

            createSentimentChart();
            
            setInitialized(true); 

        }

    }, [sentimentChartRef.current, height, width]); 

    return (
        <div>
            <svg style={{ height: 40, width }} ref={sentimentChartRef}/>
        </div>
    );

}