
export const ReducerInitialState = {

    priceData: null, 
    allTickers: ["AAPL", "GOOG", "AMZN"], 
    selectedTickers: [], 
    plotWidth: 650, 
    plotHeight: 300,
    filings: {}
};

export function Reducer(state, [type, payload]) {

    switch (type) {

        case 'SET PRICE DATA': 
            return { ...state, priceData: payload }; 
            
        case 'SET STORIES': 
            return { ...state, stories: payload }; 

        case 'SET SELECTED TICKERS': 
            return { ...state, selectedTickers: payload }; 

        case 'SET STORY SCROLLER PROPOSAL': 
            return { ...state, storyScrollerProposal: payload }; 
            
        case 'SET COMPANY':
            return {...state, company: payload};

        case 'SET FILING INDEX':
            return{...state, filings: payload}
    }

}