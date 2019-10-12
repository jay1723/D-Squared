
export const ReducerInitialState = {

    priceData: null, 
    tickers: ["AAPL", "GOOG", "AMZN"]

};

export function Reducer(state, [type, payload]) {

    switch (type) {

        case 'SET PRICE DATA': 
            return { ...state, priceData: payload }; 
            
        case 'SET STORIES': 
            return { ...state, stories: payload }; 

        case 'SET TICKERS': 
            return { ...state, tickers: payload }; 

            
        case 'SET COMPANY':
            return {...state, company: payload};
    }

}