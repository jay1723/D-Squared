
export const ReducerInitialState = {

    priceData: null

};

export function Reducer(state, [type, payload]) {

    switch (type) {

        case 'SET PRICE DATA': 
            return { ...state, priceData: payload }; 
            
    }

}