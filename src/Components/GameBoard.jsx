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
  const [legalPos, setLegalPos] = useState([]);

  useEffect(() => {
    setLegalPos(checkLegalMoves());
    console.log(legalPos);
  }, []);

  const checkDirections = (pos) => {
    const legalPositions = [];
    //check +Y axis
    legalPositions.push(checkPosY(pos));
    legalPositions.push(checkNegY(pos));
    legalPositions.push(checkNegX(pos));
    legalPositions.push(checkPosX(pos));
    legalPositions.push(checkPosDiag(pos));
    legalPositions.push(checkNegDiag(pos));
    console.log(legalPositions);
    return legalPositions;
  };

  //Helper functions that check each one of the turn players' tokens
  const checkPosY = (pos) => {
    // console.log('checkingPosY');
    //count up to 0,row
    for (let i = pos[0]; i >= 0; i--) {
      //if the next square is the opposite color
      if (playField[i][pos[1]] === 'W') {
        if (playField[i - 1][pos[1]] === 0) {
          // console.log('legal move posY');
          return [i - 1, pos[1]];
        }
      }
    }
    // console.log('no legal move posY');
    return null;
  };

  const checkNegY = (pos) => {
    // console.log('checkingNegY');
    //count up to 8,row
    for (let i = pos[0]; i < 8; i++) {
      // console.log(i);
      //if the next square is the opposite color
      if (playField[i][pos[1]] === 'W') {
        // console.log('next square is W');
        if (playField[i + 1][pos[1]] === 0) {
          // console.log('legal move negY');
          return [i + 1, pos[1]];
        }
      }
    }
    // console.log('no legal move negY');
    return null;
  };

  const checkNegX = (pos) => {
    // console.log('checkingNegX');
    //count down to col,0
    for (let i = pos[1]; i >= 0; i--) {
      // console.log(pos[0], i);
      //if the next square is the opposite color
      if (playField[pos[0]][i] === 'W') {
        // console.log('next square is W');
        if (playField[pos[0]][i - 1] === 0) {
          // console.log('legal move NegX');
          return [pos[0], i - 1];
        }
      }
    }
    // console.log('no legal move NegX');
    return null;
  };

  const checkPosX = (pos) => {
    // console.log('checkingPosX');
    //count down to col,0
    for (let i = pos[1]; i < 8; i++) {
      // console.log(pos[0], i);
      //if the next square is the opposite color
      if (playField[pos[0]][i] === 'W') {
        // console.log('next square is W');
        if (playField[pos[0]][i + 1] === 0) {
          // console.log('legal move PosX');
          return [pos[0], i + 1];
        }
      }
    }
    // console.log('no legal move PosX');
    return null;
  };

  const checkPosDiag = (pos) => {
    // console.log('checkingPosDiag');
    //count down to col,0
    let x = pos[0];
    let y = pos[1];

    // console.log(x, y);

    while (x > 0 && y < 8) {
      x--;
      y++;
      // console.log(x, y);
      if (playField[x][y] === 'W') {
        // console.log('next square is W');
        if (playField[x - 1][y + 1] === 0) {
          // console.log('legal move PosDiag');
          return [x - 1, y + 1];
        }
      }
    }
    // console.log('no legal move PosDiag');
    return null;
  };

  const checkNegDiag = (pos) => {
    // console.log('checkingPosDiag');
    //count down to col,0
    let x = pos[0];
    let y = pos[1];

    // console.log(x, y);

    while (x < 8 && y > 0) {
      x++;
      y--;
      // console.log(x, y);
      if (playField[x][y] === 'W') {
        // console.log('next square is W');
        if (playField[x + 1][y - 1] === 0) {
          // console.log('legal move NegDiag');
          return [x + 1, y - 1];
        }
      }
    }
    // console.log('no legal move NegDiag');
    return null;
  };

  //check active players legal moves based on current pieces
  const checkLegalMoves = () => {
    let startPos = [];
    let legalPos = [];
    //get current pieces of active player
    for (let i = 0; i < playField.length; i++) {
      for (let j = 0; j < playField[i].length; j++) {
        if (playField[i][j] === 'B') {
          startPos.push([i, j]);
        }
      }
    }
    startPos.forEach((pos) => {
      legalPos.push(checkDirections(pos));
    });
    setLegalPos(legalPos);
    console.log(legalPos);
    return legalPos;
  };

  //player places a piece based on square clicked
  const placePiece = (e) => {
    //check the move is legal

    //does it neigbour an opposing piece in any axis

    //create a temporary copy of the playField
    let tempPlayfield = playField;
    console.log(e);
    //mark the square as playerPiece value
    tempPlayfield[e[0]][e[1]] = 'B';

    //need a function to get all squares in between pieces of that type

    //set the playfield to the temporary array
    setPlayField(tempPlayfield);
    console.log(playField);
    //set the individual state for the clicked square
    checkSquares(e[0], e[1]);
  };

  const checkSquares = (row, square) => {
    const legalMoves = checkLegalMoves();
    console.log(legalMoves);
    if (playField[row][square] === 'W') {
      // console.log('White:', [i], [j]);
      return { isEmpty: false, playerPiece: 'white', legalMove: false };
    }
    if (playField[row][square] === 'B') {
      // console.log('Black:', [i], [j]);
      return { isEmpty: false, playerPiece: 'black', legalMove: false };
    }
    return { isEmpty: true, playerPiece: null, legalMove: false };
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
