import React from 'react';
import { FileHandler } from './components/file-handler/FileHandler';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FileHandler />
      </header>
    </div>
  );
}

export default App;
