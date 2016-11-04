import React, { Component } from 'react';
import './App.css';
import Filelist from './components/Filelist';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Filelist />
      </div>
    );
  }
}

export default App;
