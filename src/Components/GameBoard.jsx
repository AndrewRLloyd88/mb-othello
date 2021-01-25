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
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    if (!currentPlayer) {
      const startingPlayer = randomizeStartingPlayer();
      setCurrentPlayer(startingPlayer);
    }
    if (currentPlayer && legalPos.length === 0) {
      console.log(currentPlayer);
      const legalMoves = checkLegalMoves();
      console.log(legalMoves);
      return setLegalPos(legalMoves);
    }
  }, [currentPlayer]);

  //picks a random starting player
  const randomizeStartingPlayer = () => {
    let num = Math.floor(Math.random() * 2 + 1);
    if (num < 2) {
      return { W: true, B: false };
    }
    return { W: false, B: true };
  };

  //Helper that calls all the directional checks
  const checkDirections = (pos, inactivePlayer) => {
    const legalPositions = [];
    //check +Y axis
    legalPositions.push(checkPosY(pos, inactivePlayer));
    legalPositions.push(checkNegY(pos, inactivePlayer));
    legalPositions.push(checkNegX(pos, inactivePlayer));
    legalPositions.push(checkPosX(pos, inactivePlayer));
    legalPositions.push(checkPosDiag(pos, inactivePlayer));
    legalPositions.push(checkNegDiag(pos, inactivePlayer));
    return legalPositions;
  };

  //Helper functions that check each one of the turn players' tokens
  const checkPosX = (pos, inactivePlayer) => {
    // console.log('checkingPosY');
    //count up to 0,row
    for (let i = pos[0]; i >= 0; i--) {
      //if the next square is the opposite color
      if (playField[i][pos[1]] === `${inactivePlayer}`) {
        if (playField[i - 1][pos[1]] === 0) {
          // console.log('legal move posY');
          return [i - 1, pos[1]];
        }
      }
    }
    // console.log('no legal move posY');
    return null;
  };

  const checkNegX = (pos, inactivePlayer) => {
    // console.log('checkingNegY');
    //count up to 8,row
    for (let i = pos[0]; i < 8; i++) {
      // console.log(i);
      //if the next square is the opposite color
      if (playField[i][pos[1]] === `${inactivePlayer}`) {
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

  const checkPosY = (pos, inactivePlayer) => {
    // console.log('checkingNegX');
    //count down to col,0
    for (let i = pos[1]; i >= 0; i--) {
      // console.log(pos[0], i);
      //if the next square is the opposite color
      if (playField[pos[0]][i] === `${inactivePlayer}`) {
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

  const checkNegY = (pos, inactivePlayer) => {
    // console.log('checkingPosX');
    //count down to col,0
    for (let i = pos[1]; i < 8; i++) {
      // console.log(pos[0], i);
      //if the next square is the opposite color
      if (playField[pos[0]][i] === `${inactivePlayer}`) {
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

  const checkPosDiag = (pos, inactivePlayer) => {
    // console.log('checkingPosDiag');
    //count down to col,0
    let x = pos[0];
    let y = pos[1];

    // console.log(x, y);

    while (x > 0 && y < 8) {
      x--;
      y++;
      // console.log(x, y);
      if (playField[x][y] === `${inactivePlayer}`) {
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

  const checkNegDiag = (pos, inactivePlayer) => {
    console.log(inactivePlayer);
    // console.log('checkingNegDiag');
    //count down to col,0
    let x = pos[0];
    let y = pos[1];

    console.log(x, y);

    //fix this needs a %
    while (x < 7) {
      x++;
      y--;
      console.log(x, y);
      if (playField[x][y] === `${inactivePlayer}`) {
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
    const activePlayer = Object.keys(currentPlayer).filter(
      (k) => currentPlayer[k]
    );
    const inactivePlayer = Object.keys(currentPlayer).filter(
      (k) => !currentPlayer[k]
    );
    let startPos = [];
    let legalPos = [];
    let legalMoves = [];
    //get current pieces of active player
    for (let i = 0; i < playField.length; i++) {
      for (let j = 0; j < playField[i].length; j++) {
        if (playField[i][j] === `${activePlayer}`) {
          startPos.push([i, j]);
        }
      }
    }
    startPos.forEach((pos) => {
      legalPos.push(checkDirections(pos, inactivePlayer));
    });

    for (const position of legalPos) {
      for (const lpos of position) {
        if (lpos !== null) {
          legalMoves.push(lpos);
        }
      }
    }
    return legalMoves;
  };

  const flipPositions = (activePlayer, inactivePlayer, field, x, y) => {
    const piecesToFlip = [];
    for (let i = x; i >= 0; i--) {
      //if the next square is the opposite color
      if (playField[i][y] === `${inactivePlayer}`) {
        if (playField[i - 1][y] === `${activePlayer}`) {
          // console.log('legal move posY');
          piecesToFlip.push(i - 1, y);
          console.log(piecesToFlip);
        }
      }
    }
    console.log(field);
    return;
  };

  //player places a piece based on square clicked
  const placePiece = (e) => {
    console.log(e);
    const activePlayer = Object.keys(currentPlayer).filter(
      (k) => currentPlayer[k]
    );
    const inactivePlayer = Object.keys(currentPlayer).filter(
      (k) => !currentPlayer[k]
    );
    const x = parseInt(e[0]);
    const y = parseInt(e[1]);

    //check the move is legal
    for (const move of legalPos) {
      if (move[0] === x && move[1] === y) {
        //create a temporary copy of the playField
        let tempPlayfield = playField;
        //mark the square as playerPiece value
        tempPlayfield[e[0]][e[1]] = `${activePlayer}`;

        //need a function to get all squares in between pieces of that type
        flipPositions(activePlayer, inactivePlayer, tempPlayfield, x, y);

        //set the playfield to the temporary array
        setPlayField(tempPlayfield);
        console.log(playField);
        //set the individual state for the clicked square
        checkSquares(e[0], e[1]);
      }
    }
  };

  //check through all the squares to update their state
  const checkSquares = (row, square) => {
    if (playField[square][row] === 'W') {
      // console.log('White:', [i], [j]);
      return { isEmpty: false, playerPiece: 'white', legalMove: false };
    }
    if (playField[square][row] === 'B') {
      // console.log('Black:', [i], [j]);
      return { isEmpty: false, playerPiece: 'black', legalMove: false };
    }
    for (const position of legalPos) {
      if (square === position[0] && row === position[1]) {
        return { isEmpty: true, playerPiece: null, legalMove: true };
      }
    }
    return { isEmpty: true, playerPiece: null, legalMove: false };
  };

  return (
    <>
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
                      legalPos={legalPos}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>White: {currentPlayer && currentPlayer.W ? '<' : '>'} :Black</h3>
    </>
  );
}
