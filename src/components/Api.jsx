import { useRootContext } from "../context.js"; 
import React, { useEffect } from "react"; 
import _ from "lodash"; 
import { declareOpaqueType } from "@babel/types";

export default function API(props) {

    const { state, dispatch } = useRootContext(); 

    // Once upon application load, we load in all tickers for all stonks 
    useEffect(() => {

        let url = "http://localhost:4000/getNasdaqTicker";
        let getData = async () => {
            let data = await fetch(url).then(response => response.json()); 
            data = data.map(d => {
                let newD = {}
                newD['name'] = d['Company Name']; 
                newD['ticker'] = d['Symbol']; 
                return newD; 
            }).slice(0,100); 
            dispatch(['SET ALL TICKERS', data]);
        }

        getData();

    }, []); 

    // Everytime the set of selected companies changes, we query for all companies that we do 
    // not already have data for 
    useEffect(() => {

        let makeUrls = ticker => ({
            stonks: `http://localhost:4000/getStockInfo?ticker=${ticker}`, 
            sentiments: `http://localhost:4000/getSentiment?company=${ticker}`
        }); 

        // get all tickers which we need to get data for 
        // let requestTickers = [];
        // for (let ticker of state.selectedTickers) {
        //     let needToLoad = !state.priceData[ticker]; 
        //     if (needToLoad) {
        //         requestTickers.push(ticker); 
        //     }
        // }

        // remove data for unselected tickers 
        // let cachedTickers = Object.keys(state.priceData); 
        // let removeTickers = _.difference(cachedTickers, state.selectedTickers); 
        // for (let ticker of removeTickers) {
        //     delete state.priceData[ticker]; 
        //     delete state.sentiments[ticker]; 
        // }

        let getData = async () => {

            let tickers = state.selectedTickers.slice(); 

            // request data for all new tickers 
            let proms = []; 
            for (let ticker of tickers) {
                let { stonks, sentiments } = makeUrls(ticker); 
                proms.push(fetch(stonks).then(response => response.json())); 
                proms.push(fetch(sentiments).then(response => response.json())); 
            }

            let result = await Promise.all(proms); 
            let newPriceData = {}; 
            let newSentiments = {}; 
            let i = 0; 
            for (let ticker of tickers) {
                newPriceData[ticker] = result[i]; 
                newSentiments[ticker] = result[i+1]; 
                i += 2; 
            }

            dispatch(['SET PRICE DATA', newPriceData]); 
            dispatch(['SET SENTIMENTS', newSentiments]); 

        }

        getData(); 

    }, [state.selectedTickers]); 

    // useEffect(() => {
    //     let url =  + state.company;
    //     let getData = async () => {
    //         let data = await fetch(url).then(response => response.json())
    //         dispatch(['SET PRICE DATA', data]);
    //     }

    //     getData();

    // }, [state.selectedCompanies]); 

    return null; 
    

}