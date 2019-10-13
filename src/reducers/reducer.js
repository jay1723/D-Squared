
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
    plotWidth: 650, 
    plotHeight: 300

};

export function Reducer(state, [type, payload]) {

    switch (type) {

        case 'SET PRICE DATA': 
            return { ...state, priceData: payload }; 
            
        case 'SET SENTIMENTS': 
            return { ...state, sentiments: payload }; 

        case 'SET ALL TICKERS': 
            return { ...state, allTickers: payload }; 

        case 'SET SELECTED TICKERS': 
            return { ...state, selectedTickers: payload }; 

        case 'SET STORY SCROLLER PROPOSAL': 
            return { ...state, storyScrollerProposal: payload }; 
            
        case 'SET COMPANY':
            return { ...state, company: payload };
            
    }

}