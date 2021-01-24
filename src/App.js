import React from 'react';
import './styles/index.css';
import GameBoard from './Components/GameBoard';

function App() {
  return (
    <div className="App">
      <h1>Othello</h1>
      <GameBoard />
    </div>
  );
}

export default App;
