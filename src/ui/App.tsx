import React, { useCallback, useEffect, useState } from "react";

import { solveViaBacktracking, Sudoku } from "../Sudoku";
import { Grid } from "../types";
import Board from "./Board";
import "./App.css";

const sudoku = new Sudoku();
const solver = solveViaBacktracking(sudoku);

const copyGrid = (grid: Grid): Grid =>
    grid.map((row) => row.map((cell) => cell)) as any;

const App: React.FC = () => {
    const [grid, setGridRaw] = useState<Grid>(sudoku.grid);
    const setGrid = useCallback(
        (grid: Grid) =>
            setGridRaw(grid.map((row) => row.map((cell) => cell)) as any),
        [setGridRaw]
    );

    const [isSolving, setIsSolving] = useState<boolean>(false);
    const [intervalHandle, setIntervalHandle] = useState<NodeJS.Timeout | null>(
        null
    );
    const [intervalMs, setIntervalMs] = useState<number>(200);

    useEffect(() => {
        if (intervalHandle) clearInterval(intervalHandle);
        if (isSolving) {
            setIntervalHandle(
                setInterval(() => {
                    const { done } = solver.next();
                    setGrid(sudoku.grid);
                    if (done) setIsSolving(false);
                }, intervalMs)
            );
        }
    }, [isSolving, intervalMs]);

    console.log(grid);
    return (
        <div className="container">
            <Board grid={grid} />
            <button onClick={() => setGrid(sudoku.generate())}>
                Regenerate
            </button>
            <button
                onClick={() => {
                    setIsSolving(!isSolving);
                }}
            >
                {isSolving ? "Stop" : "Solve!"}
            </button>
            <button
                onClick={() => {
                    sudoku.clear();
                    setGrid(sudoku.grid);
                }}
            >
                Clear
            </button>
            <div>
                <span>
                    Interval: <b>{intervalMs} ms</b>
                </span>
                <button onClick={() => setIntervalMs(intervalMs + 50)}>
                    +
                </button>
                <button
                    onClick={() => setIntervalMs(Math.max(intervalMs - 50, 0))}
                >
                    -
                </button>
            </div>
        </div>
    );
};

export default App;
