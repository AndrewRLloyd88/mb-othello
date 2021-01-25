import React, { useState, useEffect } from 'react';
import '../styles/square.css';

export default function Square(props) {
  const [squarestate, setSquareState] = useState({
    isEmpty: true,
    playerPiece: null,
    legalMove: false,
  });

  useEffect(() => {
    setSquareState(props.checkSquares(props.rowsidx, props.squareidx));
  }, [props]);

  return (
    <td
      key={`${props.squareidx}${props.rowsidx}`}
      id={`${props.squareidx}${props.rowsidx}`}
      isEmpty={squarestate.isEmpty}
      className={squarestate.legalMove ? 'legal' : null}
      playerPiece={squarestate.playerPiece}
      onClick={(event) => {
        props.placePiece(event.target.id);
        props.checkSquares(props.rowsidx, props.squareidx);
        setSquareState(props.checkSquares(props.rowsidx, props.squareidx));
      }}
    >
      {!squarestate.isEmpty ? (
        squarestate.playerPiece === 'white' ? (
          <div className="white">W</div>
        ) : (
          <div className="black">B</div>
        )
      ) : null}
    </td>
  );
}
