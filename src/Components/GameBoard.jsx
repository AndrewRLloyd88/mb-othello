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
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  //picks a random starting player
  const randomizeStartingPlayer = () => {
    let num = Math.floor(Math.random() * 2 + 1);
    if (num < 2) {
      return { W: true, B: false };
    }
    return { W: false, B: true };
  };

  const countPieces = () => {
    let whitePieces = 0;
    let blackPieces = 0;
    for (const square of playField) {
      for (const piece of square) {
        if (piece === 'W') {
          whitePieces++;
        }
        if (piece === 'B') {
          blackPieces++;
        }
      }
    }
    setWhiteScore(whitePieces);
    setBlackScore(blackPieces);
  };

  //Helper that calls all the directional checks
  const checkDirections = (pos, inactivePlayer) => {
    console.log('positions are:', pos);
    const legalPositions = [];

    legalPositions.push(checkNegX(pos, inactivePlayer));
    legalPositions.push(checkPosX(pos, inactivePlayer));
    legalPositions.push(checkNegY(pos, inactivePlayer));
    legalPositions.push(checkPosY(pos, inactivePlayer));
    legalPositions.push(checkPosDiag(pos, inactivePlayer));
    legalPositions.push(checkNegDiag(pos, inactivePlayer));
    legalPositions.push(checkRevPosDiag(pos, inactivePlayer));
    legalPositions.push(checkRevNegDiag(pos, inactivePlayer));
    return legalPositions;
  };

  //Helper functions that check each one of the turn players' tokens
  //Positions in arrays are flipped i.e. grid x3,y2 is row2,idx3 on the playField array
  // Right to Left
  const checkNegX = (pos, inactivePlayer) => {
    for (let i = pos[1]; i >= 0; i--) {
      if (playField[pos[0]][i] === `${inactivePlayer}`) {
        if (playField[pos[0]][i - 1] === 0) {
          return [pos[0], i - 1];
        }
      }
    }
    return null;
  };

  //Left to right
  const checkPosX = (pos, inactivePlayer) => {
    for (let i = pos[1]; i < 8; i++) {
      if (playField[pos[0]][i] === `${inactivePlayer}`) {
        if (playField[pos[0]][i + 1] === 0) {
          return [pos[0], i + 1];
        }
      }
    }
    return null;
  };

  //Bottom to top
  const checkNegY = (pos, inactivePlayer) => {
    for (let i = pos[0]; i >= 0; i--) {
      if (i - 1 !== -1) {
        if (playField[i][pos[1]] === `${inactivePlayer}`) {
          if (playField[i - 1][pos[1]] === 0) {
            return [i - 1, pos[1]];
          }
        }
      }
    }
    return null;
  };

  //Top to bottom
  const checkPosY = (pos, inactivePlayer) => {
    for (let i = pos[0]; i < 8; i++) {
      if (playField[i][pos[1]] === `${inactivePlayer}`) {
        if (i + 1 !== 8) {
          if (playField[i + 1][pos[1]] === 0) {
            return [i + 1, pos[1]];
          }
        }
      }
    }
    return null;
  };

  // Diagonal left to right /
  const checkPosDiag = (pos, inactivePlayer) => {
    console.log('checkingPosDiag');
    let x = pos[0];
    let y = pos[1];
    // if (x > 2 && y < 6) {
    //   return [];
    // }

    while (x > 1 && y < 7) {
      // console.log(x, y);
      if (playField[x - 1][y + 1] === `${inactivePlayer}`) {
        // console.log('next square is W');
        if (playField[x - 2][y + 2] === 0) {
          console.log('legal move PosDiag');
          return [x - 2, y + 2];
        }
      }
      x--;
      y++;
    }
    // console.log('no legal move PosDiag');
    return null;
  };

  const checkNegDiag = (pos, inactivePlayer) => {
    console.log('checking negative diag');

    //count from piece to bottom left corner
    let x = pos[0];
    let y = pos[1];
    console.log(x, y);
    // if (x > 6 && y > 1) {
    //   return [];
    // }

    // if(x - 3 > -1 && column + 3 < numColumns) {

    //fix this needs a %
    while (x + 2 < 8 && y - 2 > -1) {
      if (playField[x + 1][y - 1] === `${inactivePlayer}`) {
        // console.log('next square is W');
        console.log('x is: ', x, 'y is:', y);
        // if (!playField[x + 2][y - 2]) {
        //   return null;
        // }

        if (playField[x + 2][y - 2] === 0) {
          console.log('legal move NegDiag');
          return [x + 2, y - 2];
        }
      }
      x++;
      y--;
    }
    // console.log('no legal move NegDiag');
    return null;
  };

  const checkRevPosDiag = (pos, inactivePlayer) => {
    console.log(inactivePlayer);
    //count to bottom right corner
    // console.log('checkingNegDiag');
    //count down to col,0
    let x = pos[0];
    let y = pos[1];

    console.log(x, y);

    while (x > 7 && y > 1) {
      console.log(x, y);
      if (playField[x][y] === `${inactivePlayer}`) {
        if (playField[x - 1][y - 1] === 0) {
          // console.log('legal move NegDiag');
          return [x + 1, y - 1];
        }
      }
      x++;
      y--;
    }
    // console.log('no legal move NegDiag');
    return null;
  };

  const checkRevNegDiag = (pos, inactivePlayer) => {
    console.log(inactivePlayer);
    //count to bottom right corner
    // console.log('checkingNegDiag');
    //count down to col,0
    let x = pos[0];
    let y = pos[1];

    console.log(x, y);

    while (x < 6) {
      x++;
      y++;
      console.log(x, y);
      if (playField[x][y] === `${inactivePlayer}`) {
        if (playField[x + 1][y + 1] === 0) {
          // console.log('legal move NegDiag');
          return [x + 1, y + 1];
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
    console.log(startPos);
    // console.log('InactivePlayer is:', inactivePlayer);
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

  //Flipping helpers
  const checkFlipNegY = (activePlayer, inactivePlayer, field, x, y) => {
    let tobeflipped = [];
    //check from placed piece upwards
    console.log('checking from placed piece to top');
    for (let i = x; i >= 1; i--) {
      console.log(tobeflipped);
      console.log('x is: ', i, 'y is: ', y);
      console.log(playField[i][y]);
      if (i - 1 !== -1) {
        if (playField[i - 1][y] === 0) {
          return [];
        }
        if (
          playField[i][y] === `${inactivePlayer}` &&
          playField[i - 1][y] !== 0
        ) {
          tobeflipped.push([i, y]);
          console.log(tobeflipped);
        }
        if (playField[i - 1][y] === `${activePlayer}`) {
          return tobeflipped;
        }
      }
    }
    return tobeflipped;
  };

  const checkFlipPosY = (activePlayer, inactivePlayer, field, x, y) => {
    const tobeflipped = [];
    console.log('checking from placed piece to bottom');
    for (let i = x; i < 8; i++) {
      //check from placed piece downwards
      console.log('x is: ', i, 'y is: ', y);
      console.log(playField[i][y]);
      //we're only checking for does the next square belong to opponent
      if (i + 1 !== 8) {
        if (
          playField[i][y] === `${inactivePlayer}` &&
          playField[i + 1][y] !== 0
        ) {
          tobeflipped.push([i, y]);
          console.log(tobeflipped);
        }
        if (playField[i + 1][y] === `${activePlayer}`) {
          return tobeflipped;
        }
      }
    }
    return [];
  };

  const checkFlipNegX = (activePlayer, inactivePlayer, field, x, y) => {
    console.log('checking from placed piece to left');
    const tobeflipped = [];
    for (let i = y; i >= 0; i--) {
      console.log(x, y);
      console.log('x is: ', x, 'y is: ', i);
      //check from placed piece to left
      console.log(playField[x][i]);
      if (i - 1 !== -1) {
        if (
          playField[x][i] === `${inactivePlayer}` &&
          playField[x][i - 1] !== 0
        ) {
          tobeflipped.push([x, i]);
          console.log(tobeflipped);
        }
        if (playField[x][i - 1] === `${activePlayer}`) {
          return tobeflipped;
        }
      }
    }
    return [];
  };

  const checkFlipPosX = (activePlayer, inactivePlayer, field, x, y) => {
    const tobeflipped = [];
    console.log('checking from placed piece to right');
    for (let i = y; i < 8; i++) {
      console.log(playField[x][i]);
      if (i + 1 !== 8) {
        if (
          playField[x][i] === `${inactivePlayer}` &&
          playField[x][i + 1] !== 0
        ) {
          tobeflipped.push([x, i]);
          console.log(tobeflipped);
        }
        if (playField[x][i + 1] === `${activePlayer}`) {
          return tobeflipped;
        }
      }
    }
    return [];
  };

  // Diagonal left to right
  const checkFlipPosDiag = (activePlayer, inactivePlayer, field, x, y) => {
    const tobeflipped = [];
    //there is a + and - diagonal
    console.log('checking from placed piece to top diagonal right');

    // console.log(x, y);

    while (x > 2) {
      console.log(x, y);
      // console.log(x, y);
      // console.log(playField[x][y]);
      if (
        playField[x - 1][y + 1] === `${inactivePlayer}` &&
        playField[x - 2][y + 2] !== 0
      ) {
        tobeflipped.push([x - 1, y + 1]);
        console.log(tobeflipped);
      }
      if (playField[x - 2][y + 2] === `${activePlayer}`) {
        return tobeflipped;
      }
      x--;
      y++;
      console.log('x is: ', x, 'y is: ', y);
    }
    return [];
  };

  const checkFlipNegDiag = (activePlayer, inactivePlayer, field, x, y) => {
    const tobeflipped = [];
    //there is a + and - diagonal
    console.log('checking from placed piece to bottom diagonal left');

    // console.log(x, y);

    while (x < 5 && y > 0) {
      if (x + 1 > 7) {
        return tobeflipped;
      }
      console.log(x, y);

      if (
        playField[x + 1][y - 1] === `${inactivePlayer}` &&
        playField[x + 2][y - 2] !== 0
      ) {
        tobeflipped.push([x + 1, y - 1]);
        console.log(tobeflipped);
      }
      if (playField[x + 2][y - 2] === `${activePlayer}`) {
        return tobeflipped;
      }
      x++;
      y--;
    }
    return [];
  };

  // Diagonal right to top left
  const checkFlipRevPosDiag = (activePlayer, inactivePlayer, field, x, y) => {
    const tobeflipped = [];
    //there is a + and - diagonal
    console.log('checking from placed piece to top diagonal left');

    // console.log(x, y);

    while (x > 2) {
      console.log(x, y);
      // console.log(x, y);
      // console.log(playField[x][y]);
      if (
        playField[x - 1][y - 1] === `${inactivePlayer}` &&
        playField[x - 2][y - 2] !== 0
      ) {
        tobeflipped.push([x - 1, y - 1]);
        console.log(tobeflipped);
      }
      if (playField[x - 2][y - 2] === `${activePlayer}`) {
        return tobeflipped;
      }
      x--;
      y--;
      console.log('x is: ', x, 'y is: ', y);
    }
    return [];
  };

  const checkFlipRevNegDiag = (activePlayer, inactivePlayer, field, x, y) => {
    const tobeflipped = [];
    //there is a + and - diagonal
    console.log('checking from placed piece to bottom diagonal right');

    // console.log(x, y);

    while (x < 5 && y < 5) {
      console.log(x, y);
      // console.log(x, y);
      // console.log(playField[x][y]);
      if (
        playField[x + 1][y + 1] === `${inactivePlayer}` &&
        playField[x + 2][y + 2] !== 0
      ) {
        tobeflipped.push([x + 1, y + 1]);
        console.log(tobeflipped);
      }
      if (playField[x + 2][y + 2] === `${activePlayer}`) {
        return tobeflipped;
      }
      x++;
      y++;
      console.log('x is: ', x, 'y is: ', y);
    }
    return [];
  };

  const flipPositions = (activePlayer, inactivePlayer, field, x, y) => {
    console.log('in flip');
    const flipArray = [];

    flipArray.push(checkFlipNegY(activePlayer, inactivePlayer, field, x, y));
    flipArray.push(checkFlipPosY(activePlayer, inactivePlayer, field, x, y));
    flipArray.push(checkFlipNegX(activePlayer, inactivePlayer, field, x, y));
    flipArray.push(checkFlipPosX(activePlayer, inactivePlayer, field, x, y));
    flipArray.push(checkFlipPosDiag(activePlayer, inactivePlayer, field, x, y));
    flipArray.push(checkFlipNegDiag(activePlayer, inactivePlayer, field, x, y));
    flipArray.push(
      checkFlipRevPosDiag(activePlayer, inactivePlayer, field, x, y)
    );
    flipArray.push(
      checkFlipRevNegDiag(activePlayer, inactivePlayer, field, x, y)
    );

    console.log('These pieces will be flipped: ', flipArray);

    for (const positions of flipArray) {
      for (const pieces of positions)
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
    countPieces();
    if (!gameOver) {
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
        //if currentPlayer has no legal moves
        if (legalMoves.length === 0) {
          console.log('Checking the other player');
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
          console.log(currentPlayer);
          const legalMoves = checkLegalMoves();
          console.log('the legal moves are: ', legalMoves);
          if (legalMoves.length > 0) {
            console.log('There are still legal moves');
            return setLegalPos(legalMoves);
          } else {
            console.log('in game over');
            setGameOver(true);
          }
        }
        return setLegalPos(legalMoves);
      }
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
                {/* {rowsidx} */}
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
      <h3>
        {whiteScore} White: {currentPlayer && currentPlayer.W ? '<' : '>'}{' '}
        {blackScore} :Black
      </h3>
      <div>{flipPieces}</div>
    </>
  );
}
