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
  const [flipPieces, setFlipPieces] = useState([]);
  const [previousPlayer, setPreviousPlayer] = useState('');
  const [endTurn, setEndTurn] = useState(false);

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
    console.log('positions are:', pos);
    const legalPositions = [];

    legalPositions.push(checkNegX(pos, inactivePlayer));
    legalPositions.push(checkPosX(pos, inactivePlayer));
    legalPositions.push(checkNegY(pos, inactivePlayer));
    legalPositions.push(checkPosY(pos, inactivePlayer));
    // legalPositions.push(checkPosDiag(pos, inactivePlayer));
    // legalPositions.push(checkNegDiag(pos, inactivePlayer));
    return legalPositions;
  };

  //Helper functions that check each one of the turn players' tokens
  //Positions in arrays are flipped i.e. grid x3,y2 is row2,idx3 on the playField array
  // Right to Left
  const checkNegX = (pos, inactivePlayer) => {
    // console.log('checkingNegX');
    // console.log(pos);
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

  //Left to right
  const checkPosX = (pos, inactivePlayer) => {
    // console.log('checkingPosX');
    for (let i = pos[1]; i < 8; i++) {
      // console.log(pos[1], i);
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

  //Bottom to top
  const checkNegY = (pos, inactivePlayer) => {
    console.log('checkingNegY');
    for (let i = pos[0]; i >= 0; i--) {
      console.log(i, pos[1]);
      //if the next square is the opposite color
      if (playField[i][pos[1]] === `${inactivePlayer}`) {
        // console.log(playField[i][pos[1]]);
        if (playField[i - 1][pos[1]] === 0) {
          // console.log('legal move posY');
          return [i - 1, pos[1]];
        }
      }
    }
    // console.log('no legal move posY');
    return null;
  };

  //Top to bottom
  const checkPosY = (pos, inactivePlayer) => {
    console.log('positions: ', pos);
    console.log('checkingPosY');
    for (let i = pos[0]; i < 8; i++) {
      console.log(i, pos[1]);
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

  //Diagonal left to right
  // const checkPosDiag = (pos, inactivePlayer) => {
  //   console.log('checkingPosDiag');
  //   //count up to top right corner
  //   let x = pos[0];
  //   let y = pos[1];

  //   // console.log(x, y);

  //   while (x > 0 && y < 8) {
  //     x--;
  //     y++;
  //     // console.log(x, y);
  //     if (playField[x][y] === `${inactivePlayer}`) {
  //       // console.log('next square is W');
  //       if (playField[x - 1][y + 1] === 0) {
  //         // console.log('legal move PosDiag');
  //         return [x - 1, y + 1];
  //       }
  //     }
  //   }
  //   // console.log('no legal move PosDiag');
  //   return null;
  // };

  // const checkNegDiag = (pos, inactivePlayer) => {
  //   console.log(inactivePlayer);
  //   // console.log('checkingNegDiag');
  //   //count down to col,0
  //   let x = pos[0];
  //   let y = pos[1];

  //   console.log(x, y);

  //   //fix this needs a %
  //   while (x < 7) {
  //     x++;
  //     y--;
  //     console.log(x, y);
  //     if (playField[x][y] === `${inactivePlayer}`) {
  //       // console.log('next square is W');
  //       if (playField[x + 1][y - 1] === 0) {
  //         // console.log('legal move NegDiag');
  //         return [x + 1, y - 1];
  //       }
  //     }
  //   }
  //   // console.log('no legal move NegDiag');
  //   return null;
  // };

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
    console.log(startPos);
    console.log('InactivePlayer is:', inactivePlayer);
    startPos.forEach((pos) => {
      console.log(pos);
      legalPos.push(checkDirections(pos, inactivePlayer[0]));
      console.log(legalPos);
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
    console.log('in flip');
    const flipArray = [];
    console.log('x is: ', x, 'y is: ', y);
    //check from placed piece upwards
    for (let i = x; i >= 0; i--) {
      console.log('x is: ', i, 'y is: ', y);
      console.log(playField[i][y]);
      if (playField[i][y] === `${inactivePlayer}`) {
        flipArray.push([i, y]);
        console.log(flipArray);
      }
    }

    for (let i = x; i < 8; i++) {
      console.log('x is: ', i, 'y is: ', y);
      console.log(playField[i][y]);
      if (playField[i][y] === `${inactivePlayer}`) {
        flipArray.push([i, y]);
        console.log(flipArray);
      }
    }
    console.log('These pieces will be flipped: ', flipArray);
    //check from position downwards
    // for (let i = y; i >= 7; i++) {
    //   console.log(playField[i][x]);
    //   if (playField[i][x] === `${inactivePlayer}`) {
    //     flipArray.push([i, x]);
    //     console.log(flipArray);
    //   }
    // }

    for (const pieces of flipArray) {
      field[pieces[0]][pieces[1]] = `${activePlayer}`;
      console.log(field);
    }
    setFlipPieces(flipArray);
    return field;
  };

  const switchPlayer = (previousPlayer) => {
    console.log('In switchPlayer PreviousPlayer: ', previousPlayer);
    if (previousPlayer[0] === 'B') {
      console.log('White should be the current player');
      return { W: true, B: false };
    }
    if (previousPlayer[0] === 'W') {
      console.log('Black should be the current player');
      return { W: false, B: true };
    }
  };

  // const assignPreviousPlayer = (currentPlayer) => {
  //   return setPreviousPlayer(currentPlayer);
  // };

  const getInactivePlayer = (currentPlayer) => {
    return Object.keys(currentPlayer).filter((k) => !currentPlayer[k]);
  };

  //player places a piece based on square clicked
  const placePiece = (e) => {
    console.log('placing piece');
    const activePlayer = Object.keys(currentPlayer).filter(
      (k) => currentPlayer[k]
    );
    const inactivePlayer = Object.keys(currentPlayer).filter(
      (k) => !currentPlayer[k]
    );
    const x = parseInt(e[1]);
    const y = parseInt(e[0]);
    console.log('x: ', x, 'y: ', y);
    //check the move is legal
    for (const move of legalPos) {
      if (move[0] === x && move[1] === y) {
        //create a temporary copy of the playField
        let tempPlayfield = playField;
        let flippedPlayfield;
        //mark the square as playerPiece value
        tempPlayfield[e[1]][e[0]] = `${activePlayer}`;
        //need a function to get all squares in between pieces of that type
        flippedPlayfield = flipPositions(
          activePlayer,
          inactivePlayer,
          tempPlayfield,
          x,
          y
        );
        //set the playfield to the temporary array
        return setEndTurn(true), setPlayField(flippedPlayfield);
      }
    }
  };

  //check through all the squares to update their state
  const checkSquares = (x, y) => {
    if (playField[y][x] === 'W') {
      // console.log('White:', [i], [j]);
      return { isEmpty: false, playerPiece: 'white', legalMove: false };
    }
    if (playField[y][x] === 'B') {
      // console.log('Black:', [i], [j]);
      return { isEmpty: false, playerPiece: 'black', legalMove: false };
    }
    for (const position of legalPos) {
      if (y === position[0] && x === position[1]) {
        return { isEmpty: true, playerPiece: null, legalMove: true };
      }
    }
    return { isEmpty: true, playerPiece: null, legalMove: false };
  };

  useEffect(() => {
    if (!currentPlayer) {
      const startingPlayer = randomizeStartingPlayer();
      setCurrentPlayer(startingPlayer);
    }
    if (currentPlayer && !previousPlayer) {
      setPreviousPlayer(getInactivePlayer(currentPlayer));
    }
    if (currentPlayer && legalPos.length === 0) {
      console.log('setting legal pos for', currentPlayer);
      const legalMoves = checkLegalMoves();
      console.log('the legal moves are: ', legalMoves);
      return setLegalPos(legalMoves);
    }
    console.log(playField);
  }, [playField, checkSquares, endTurn]);

  useEffect(() => {
    // console.log(currentPlayer);
    // console.log(previousPlayer);
    // console.log(legalPos);

    if (endTurn) {
      setEndTurn(false);
      // console.log('turn has ended');
      setLegalPos([]);
      // console.log('switching player');
      const activePlayer = Object.keys(currentPlayer).filter(
        (k) => currentPlayer[k]
      );
      const inactivePlayer = Object.keys(currentPlayer).filter(
        (k) => !currentPlayer[k]
      );
      // console.log('Switching Current Player');
      let newPlayer = switchPlayer(activePlayer);
      // console.log('NEWPLAYER VAR currentPlayer is now: ', newPlayer);
      setCurrentPlayer([]);
      setCurrentPlayer(newPlayer);
      // console.log('STATE currentPlayer is now: ', currentPlayer);
      // console.log('STATE previousPlayer is now: ', previousPlayer);
    }
  }, [endTurn]);

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
                      playField={playField}
                      previousPlayer={previousPlayer}
                      currentPlayer={currentPlayer}
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
