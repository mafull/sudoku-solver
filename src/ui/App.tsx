import React, { useCallback, useEffect, useState } from "react";

import { solveViaBacktracking, Sudoku, CellIndices } from "../Sudoku";
import { Grid } from "../types";
import Board from "./Board";
import "./App.css";

const sudoku = new Sudoku();

const solvers = ["Backtracking"] as const;
type SolverName = typeof solvers[number];
const solverMap: Record<
    SolverName,
    (sudoku: Sudoku) => IterableIterator<CellIndices>
> = {
    Backtracking: solveViaBacktracking,
};

const App: React.FC = () => {
    const [grid, setGridRaw] = useState<Grid>(sudoku.grid);
    const setGrid = useCallback(
        (grid: Grid) =>
            setGridRaw(grid.map((row) => row.map((cell) => cell)) as any),
        [setGridRaw]
    );

    const [isSolving, setIsSolving] = useState<boolean>(false);
    const [selectedSolverName, setSelectedSolverName] = useState<SolverName>(
        solvers[0]
    );
    const [solver, setSolver] = useState<ReturnType<
        typeof solveViaBacktracking
    > | null>(null);
    const [intervalHandle, setIntervalHandle] = useState<NodeJS.Timeout | null>(
        null
    );
    const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
    const [intervalMs, setIntervalMs] = useState<number>(200);
    const [currentCell, setCurrentCell] = useState<CellIndices | null>(null);

    useEffect(() => {
        if (intervalHandle) clearInterval(intervalHandle);
        if (isSolving) {
            setIntervalHandle(
                setInterval(() => {
                    const { done, value: newCurrentCell } = solver!.next();
                    setCurrentCell(newCurrentCell);
                    setGrid(sudoku.grid);
                    if (done) {
                        setSolver(null);
                        setIsSolving(false);
                    }
                }, intervalMs)
            );
        }
    }, [isSolving, intervalMs]);

    return (
        <div className="container">
            <div className="alert">
                You must turn off browser security in order to access the
                external Sudoku generation API
            </div>
            <Board grid={grid} currentCell={currentCell} />
            <div className="control-area">
                <div>
                    <button
                        onClick={() => {
                            sudoku.generate(difficulty).then(() => {
                                setGrid(sudoku.grid);
                                setSolver(
                                    solverMap[selectedSolverName](sudoku)
                                );
                            });
                        }}
                        disabled={isSolving}
                    >
                        Regenerate
                    </button>
                    <button
                        onClick={() => {
                            setIsSolving(!isSolving);
                        }}
                        disabled={!solver}
                    >
                        {isSolving ? "Pause" : "Solve!"}
                    </button>
                    <button
                        onClick={() => {
                            sudoku.clear();
                            setSolver(null);
                            setGrid(sudoku.grid);
                        }}
                        disabled={isSolving || !solver}
                    >
                        Clear
                    </button>
                </div>
                <div className="variable-control">
                    <span className="variable-control-label">Algorithm:</span>
                    <div className="variable-control-controls">
                        <select
                            value={selectedSolverName}
                            onChange={(e) =>
                                setSelectedSolverName(
                                    e.target.value as SolverName
                                )
                            }
                        >
                            {solvers.map((solverName) => (
                                <option key={solverName} value={solverName}>
                                    {solverName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="variable-control">
                    <span className="variable-control-label">Interval:</span>
                    <div className="variable-control-controls">
                        <button
                            onClick={() =>
                                setIntervalMs(Math.max(intervalMs - 50, 0))
                            }
                            disabled={intervalMs === 0}
                        >
                            -
                        </button>
                        <span>{intervalMs} ms</span>
                        <button onClick={() => setIntervalMs(intervalMs + 50)}>
                            +
                        </button>
                    </div>
                </div>
                <div className="variable-control">
                    <span className="variable-control-label">Difficulty:</span>
                    <div className="variable-control-controls">
                        <button
                            onClick={() =>
                                setDifficulty((difficulty - 1) as any)
                            }
                            disabled={difficulty === 1}
                        >
                            -
                        </button>
                        <span>{`${difficulty} (${
                            ["easy", "norm", "hard"][difficulty - 1]
                        })`}</span>
                        <button
                            onClick={() =>
                                setDifficulty((difficulty + 1) as any)
                            }
                            disabled={difficulty === 3}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
