import React, { useReducer, useState } from 'react';
import { Layout, Menu, Icon, Tree, Input, Radio, Card } from 'antd';
import Plot from "./components/Plot.jsx"; 
import { RootProvider } from "./context.js"; 
import { ReducerInitialState, Reducer } from "./reducers/reducer.js"; 
import StoryScroller from "./components/StoryScroller.jsx"; 
import 'antd/dist/antd.css';
import './css/App.css'; 

const { Header, Sider, Content } = Layout;

function App() {

  const [state, dispatch] = useReducer(Reducer, ReducerInitialState);
  const [selectableTickerValues, setSelectableTickerValues] = useState(state.allTickers);
  const [isMulti, setIsMulti] = useState(false); 

  return (
    <RootProvider value={{ state, dispatch }}>

      <Layout>
        
        {/* Side panel for selecting company tickers */}
        <Sider>
          <div style={{ padding: 3 }}>
            {/* Filter company tickers */}
            <Input placeholder="Search" onChange={(e) => {
              let prefix = e.target.value; 
              prefix = prefix.toLowerCase(); 
              setSelectableTickerValues(
                prefix.length === 0 ? state.allTickers : 
                                      state.allTickers.filter(key => key.toLowerCase().slice(0, prefix.length) === prefix)
              ); 
            }}/>

            {/* Select one or more company tickers */}
            <Tree 
            checkable 
            className="ticker-list"
            checkedKeys={state.selectedTickers}
            style={{ color: 'white' }}
            onCheck={(keys) => {
                if (isMulti) {
                  // allow multiple selections
                  dispatch(['SET SELECTED TICKERS', keys]); 
                } else {
                  // single selection mode 
                  dispatch(['SET SELECTED TICKERS', keys.length > 0 ? [keys[keys.length-1]] : []]); 
                }
                
            }}>
              {selectableTickerValues.map(key => <Tree.TreeNode title={key} key={key}/>)}
            </Tree>
          </div>
        </Sider>

        <Layout>
          <Header style={{ background: '#fff' }}>

            <Radio.Group 
            defaultValue={isMulti ? 'multiple' : 'single'} 
            buttonStyle="solid"
            onChange={e => {
              let newIsMulti = e.target.value === 'multiple'; 
              let keys = state.selectedTickers.slice(); 
              keys.sort(); 
              if (!newIsMulti) {
                dispatch(['SET SELECTED TICKERS', keys.length > 0 ? [keys[0]] : []]);
              }
              setIsMulti(newIsMulti); 
            }}
            >
              <Radio.Button value="single">Single</Radio.Button>
              <Radio.Button value="multiple">Multiple</Radio.Button>
            </Radio.Group>

          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            <div className="App" style={{ width: "100%" }}>
              {!state.stories ? <Plot/> : 
                
                
                
                !isMulti ? <div>
                            <Plot ticker={'AAPL'}/>
                            <StoryScroller ticker={'AAPL'} width={state.plotWidth} stories={state.stories}/>
                          </div> 
                          : null
              }
            </div>


          </Content>
        </Layout>
      </Layout>         

      
    </RootProvider>
  );
}

export default App;
