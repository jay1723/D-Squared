import React, { useReducer } from 'react';
import Plot from "./components/Plot.jsx"; 
import { RootProvider } from "./context.js"; 
import { ReducerInitialState, Reducer } from "./reducers/reducer.js"; 

function App() {

  const [state, dispatch] = useReducer(Reducer, ReducerInitialState);

  return (
    <RootProvider value={{ state, dispatch }}>
      <div className="App" style={{ height: 500, width: 500 }}>
        <Plot/>
      </div>
    </RootProvider>
  );
}

export default App;
