import React, { useState, useEffect } from 'react';
import '../styles/gameboard.css';
import Square from './Square';

export default function GameBoard() {
  const [playField, setPlayField] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 'W', 'B', 0, 0, 0],
    [0, 0, 0, 'B', 'W', 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const placePiece = (e) => {
    let tempPlayfield = playField;
    console.log(e);
    tempPlayfield[e[0]][e[1]] = 'B';
    setPlayField(tempPlayfield);
    console.log(playField);
    checkSquares(e[0], e[1]);
  };

  const checkSquares = (row, square) => {
    if (playField[row][square] === 'W') {
      // console.log('White:', [i], [j]);
      return { isEmpty: false, playerPiece: 'white' };
    }
    if (playField[row][square] === 'B') {
      // console.log('Black:', [i], [j]);
      return { isEmpty: false, playerPiece: 'black' };
    }
    return { isEmpty: true, playerPiece: null };
  };

  return (
    <table>
      <tbody className="gameBoard">
        {playField.map((rows, rowsidx) => {
          return (
            <tr key={rowsidx} className="row">
              {rows.map((square, squareidx) => {
                return (
                  <Square
                    rowsidx={rowsidx}
                    squareidx={squareidx}
                    checkSquares={checkSquares}
                    placePiece={placePiece}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
