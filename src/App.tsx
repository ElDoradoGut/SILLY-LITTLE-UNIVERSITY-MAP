import React from 'react';
import SillyMap from './sillyMap';
import logo from './logo.svg';
import './App.css';


function App() {
  return (

    <div style={{ 
     height: "100vh"
    }}>
        <div style={{ 
        height: "10vh",
        backgroundColor: '#00385d', 
        color: '#ffffff', 
        padding: '20px',  
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        
      <h1>UtmaWayFinder</h1>
      <img src={`${process.env.PUBLIC_URL}/UTMA_2023_bco_1.png`} style={{ height: '100px', marginLeft: '10px' }} />
      
    </div>
    <SillyMap/>
    </div>
    
  );
}


export default App;
