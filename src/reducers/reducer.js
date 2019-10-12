
export const ReducerInitialState = {

    priceData: null, 
    allTickers: ["AAPL", "GOOG", "AMZN"], 
    selectedTickers: []

};

export function Reducer(state, [type, payload]) {

    switch (type) {

        case 'SET PRICE DATA': 
            return { ...state, priceData: payload }; 
            
        case 'SET STORIES': 
            return { ...state, stories: payload }; 

        case 'SET SELECTED TICKERS': 
            return { ...state, selectedTickers: payload }; 

            
        case 'SET COMPANY':
            return {...state, company: payload};
    }

}