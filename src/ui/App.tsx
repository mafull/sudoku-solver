import React, { useState } from "react";

import { solveViaBacktracking, Sudoku } from "../Sudoku";
import { Grid } from "../types";
import Board from "./Board";
import "./App.css";

const sudoku = new Sudoku();

const App: React.FC = () => {
    const [grid, setGrid] = useState<Grid>(sudoku.getGrid());

    return (
        <div className="container">
            <Board grid={grid} />
            <button onClick={() => setGrid(sudoku.generate())}>
                Regenerate
            </button>
            <button
                onClick={() => {
                    solveViaBacktracking(sudoku);
                    setGrid(sudoku.getGrid());
                }}
            >
                Solve!
            </button>
            <button
                onClick={() => {
                    sudoku.clear();
                    setGrid(sudoku.getGrid());
                }}
            >
                Clear
            </button>
        </div>
    );
};

export default App;
