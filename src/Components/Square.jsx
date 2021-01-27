import React, { useState, useEffect } from 'react';
import '../styles/square.css';

export default function Square(props) {
  const [squarestate, setSquareState] = useState({
    isEmpty: true,
    playerPiece: null,
    legalMove: false,
  });

  useEffect(() => {
    // console.log('trigger square useEffect');
    setSquareState(props.checkSquares(props.squareidx, props.rowsidx));
  }, [props, props.previousPlayer, props.currentPlayer]);

  return (
    <td
      key={`${props.squareidx}${props.rowsidx}`}
      id={`${props.squareidx}${props.rowsidx}`}
      isEmpty={squarestate.isEmpty}
      className={squarestate.legalMove ? 'legal' : null}
      playerPiece={squarestate.playerPiece}
      onClick={(event) => {
        props.placePiece(event.target.id);
        setSquareState(props.checkSquares(props.squareidx, props.rowsidx));
      }}
    >
      {!squarestate.isEmpty ? (
        squarestate.playerPiece === 'white' ? (
          <div className="white"> </div>
        ) : (
          <div className="black"> </div>
        )
      ) : null}
    </td>
  );
}
