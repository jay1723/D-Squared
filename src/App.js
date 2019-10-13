import React, { useReducer, useState, useEffect } from 'react';
import { Layout, Tree, Input, Radio, Row, Col } from 'antd';
import API from "./components/Api.jsx"; 
import { RootProvider } from "./context.js"; 
import { ReducerInitialState, Reducer } from "./reducers/reducer.js"; 
import StoryScroller from "./components/StoryScroller.jsx"; 
import CandlestickChart from "./components/CandlestickChart.jsx"; 
import SentimentChart from "./components/SentimentChart.jsx";
import MultiPlot from "./components/MultiPlot.jsx"; 
import 'antd/dist/antd.css';
import './css/App.css'; 

const { Header, Sider, Content } = Layout;

function App() {

  const [state, dispatch] = useReducer(Reducer, ReducerInitialState);
  const [selectableTickers, setSelectableTickers] = useState([]); 
  const [isMulti, setIsMulti] = useState(false); 

  let allTickers = state.allTickers.map(d => d.ticker); 

  useEffect(() => {
    setSelectableTickers(state.allTickers.map(d => d.ticker)); 
  }, [state.allTickers]); 

  return (
    <RootProvider value={{ state, dispatch }}>

      <API/>

      <Layout>
        
        {/* Side panel for selecting company tickers */}
        <Sider>
          <div style={{ padding: 3 }}>
            {/* Filter company tickers */}
            <Input placeholder="Search" onChange={(e) => {
              let prefix = e.target.value; 
              prefix = prefix.toLowerCase(); 
              setSelectableTickers(
                prefix.length === 0 ? allTickers : 
                                      allTickers.filter(key => key.toLowerCase().slice(0, prefix.length) === prefix)
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
              {selectableTickers.map(key => <Tree.TreeNode title={key} key={key}/>)}
            </Tree>
          </div>
        </Sider>

        <Layout>
          <Header style={{ background: '#fff' }}>
{/* 
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
            </Radio.Group> */}

          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
              {!isMulti ? 
                          (state.selectedTickers.length === 0 ? null : 
                                (() => {
                                  let ticker = state.selectedTickers[0]; 
                                  if (state.sentiments[ticker] && state.priceData[ticker]) {
                                    return <React.Fragment>
                                      <Row type="flex" justify="center" align="top">
                                        <Col style={{ width: state.plotWidth }}>
                                          <div>
                                            <CandlestickChart ticker={ticker}/>
                                            <SentimentChart ticker={ticker}/>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row type="flex" justify="center" align="top">
                                        <Col style={{ width: state.plotWidth }}>
                                          <StoryScroller ticker={ticker} width={state.plotWidth}/>
                                        </Col>
                                      </Row>

                                    </React.Fragment>
                                      
                                      
                                  } else {
                                    return null; 
                                  }
                                  
                                })()
                          )
                          : null
                    
              }

          </Content>
        </Layout>
      </Layout>         

      
    </RootProvider>
  );
}

export default App;
