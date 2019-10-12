import React, { useReducer, useState } from 'react';
import { Layout, Menu, Icon } from 'antd';
import Plot from "./components/Plot.jsx"; 
import { RootProvider } from "./context.js"; 
import { ReducerInitialState, Reducer } from "./reducers/reducer.js"; 
import 'antd/dist/antd.css';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function App() {

  const [state, dispatch] = useReducer(Reducer, ReducerInitialState);
  const [selectedCompanies, setSelectedCompanies] = useState([]); 
  const [collapsed, setCollapsed] = useState(true); 

  return (
    <RootProvider value={{ state, dispatch }}>

      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          
          <Menu
          theme={'dark'}
          selectedKeys={selectedCompanies}
          mode="inline">
            <SubMenu
            key="companies"
            title={
              <span>
                <Icon type="appstore" />
                <span>Companies</span>
              </span>
            }>
              {state.tickers.map(ticker => (
                <Menu.Item key={ticker}>{ticker}</Menu.Item>
              ))}
            </SubMenu>
            
          </Menu>

        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={() => setCollapsed(!collapsed)}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            <div className="App" style={{ height: 500, width: 500 }}>
              <Plot/>
            </div>
          </Content>
        </Layout>
      </Layout>         

      
    </RootProvider>
  );
}

export default App;
