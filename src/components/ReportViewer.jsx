import React, { useState, useEffect, useRef } from "react"; 
import { useRootContext } from "../context.js"; 
import _ from "lodash"; 
import useSmoothScroll from 'use-smooth-scroll';
import "../css/Plot.css"; 

export default function ReportViewer(props){
    const { ticker } = props; 
    const { state, dispatch } = useRootContext(); 
    const candlestickChartRef = useRef();
    const [initialized, setInitialized] = useState(false); 

    return (
        <div>
            <svg style={{ height, width }} ref={candlestickChartRef}/>
            <svg style={{ height: 40, width }} ref={sentimentChartRef}/>
        </div>
    );
}
