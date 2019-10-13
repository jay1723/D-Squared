
export const ReducerInitialState = {

    
    
    // all tickers which we can visualize 
    allTickers: [], 

    // maps a ticker to price data for a stonk 
    priceData: {}, 
    // maps a ticker to sentiment data for a stonk 
    sentiments: {}, 

    // the current set of selected stonks 
    selectedTickers: [], 
    
    // the dimensions for plots 
    plotWidth: 1350, 
    plotHeight: 400,
    filings: {}
};

export function Reducer(state, [type, payload]) {

    switch (type) {

        case 'SET DATA': 
            let newState = { ...state }; 
            let keys = Object.keys(payload.priceData); 
            for (let k of keys) {
                newState['priceData'][k] =  payload['priceData'][k]; 
                newState['sentiments'][k] =  payload['sentiments'][k]; 
            }
            return newState;  

        case 'SET ALL TICKERS': 
            return { ...state, allTickers: payload }; 

        case 'SET SELECTED TICKERS': 
            return { ...state, selectedTickers: payload }; 

        case 'SET STORY SCROLLER PROPOSAL': 
            return { ...state, storyScrollerProposal: payload }; 
            
        case 'SET COMPANY':
            return {...state, company: payload};

        case 'SET TICKER TO NAME': 
            return { ...state, tickerToName: payload }; 

        case 'SET FILING INDEX':
            return{...state, filings: payload}
    }

}