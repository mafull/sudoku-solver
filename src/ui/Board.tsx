import React from "react";

import { Grid } from "../types";

const Board: React.FC<{ grid: Grid }> = ({ grid }) => (
    <div className="board">
        {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
                <div key={rowIdx + colIdx} className="cell">
                    {cell}
                </div>
            ))
        )}
    </div>
);

export default Board;
