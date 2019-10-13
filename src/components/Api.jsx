import { useRootContext } from "../context.js"; 
import React, { useEffect } from "react"; 


export default function API(props) {
    const { state, dispatch } = useRootContext(); 
    useEffect(() => {
        let url = "http://localhost:4000/getSentiment?company=" + state.company;
        let getData = async () => {
            let data = await fetch(url).then(response => response.json())
            dispatch(['SET COMPANY', data]);
        }

        getData();

    }, [state.selectedCompanies]); 

    useEffect(() => {
        let url = "http://localhost:4000/getStockInfo?ticker=" + state.company;
        let getData = async () => {
            let data = await fetch(url).then(response => response.json())
            dispatch(['SET PRICE DATA', data]);
        }

        getData();

    }, [state.selectedCompanies]); 

    useEffect(() => {
        let url = "http://localhost:4000/getNasdaqTicker;
        let getData = async () => {
            let data = await fetch(url).then(response => response.json())
            dispatch(['SET TICKER', data]);
        }

        getData();

    }, [state.selectedCompanies]);

    useEffect(() => {
        let url = "http://localhost:4000/secforms?ticker=" + state.company;
        let getData = async () => {
            let data = await fetch(url).then(response => response.json())
            dispatch(['SET FILING INDEX', data]);
        }

        getData();

    }, [state.selectedCompanies]); 

}