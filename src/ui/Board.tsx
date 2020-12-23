import React from "react";
import { CellIndices } from "../Sudoku";

import { Grid } from "../types";

const Board: React.FC<{ grid: Grid; currentCell: CellIndices | null }> = ({
    grid,
    currentCell,
}) => (
    <div className="board">
        {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
                <div
                    key={rowIdx + colIdx}
                    className={`cell${
                        currentCell &&
                        rowIdx === currentCell[0] &&
                        colIdx === currentCell[1]
                            ? " current"
                            : ""
                    }`}
                >
                    {cell}
                </div>
            ))
        )}
    </div>
);

export default Board;
