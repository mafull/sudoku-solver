import { Cell, Grid } from "./types";

const DUMMY_GRID: Grid = [
    [null, 7, 9, 5, null, 8, null, null, 4],
    [2, 3, null, 1, 4, null, null, null, 6],
    [5, 6, null, null, null, null, 7, null, 8],
    [null, 1, 7, null, null, 2, 4, 8, 5],
    [null, null, 6, null, 5, null, null, null, 7],
    [4, null, null, 7, null, null, 9, 6, null],
    [7, null, null, null, null, null, null, null, null],
    [null, 5, null, null, null, 4, 8, 7, null],
    [null, null, null, null, null, null, null, 5, null],
];

const DUMMY_GRID_SOLVED: Grid = [
    [1, 7, 9, 5, 6, 8, 2, 3, 4],
    [2, 3, 8, 1, 4, 7, 5, 9, 6],
    [5, 6, 4, 2, 3, 9, 7, 1, 8],
    [3, 1, 7, 6, 9, 2, 4, 8, 5],
    [8, 9, 6, 4, 5, 1, 3, 2, 7],
    [4, 2, 5, 7, 8, 3, 9, 6, 1],
    [7, 8, 1, 3, 2, 5, 6, 4, 9],
    [6, 5, 2, 9, 1, 4, 8, 7, 3],
    [9, 4, 3, 8, 7, 6, 1, 5, 2],
];

const EMPTY_GRID: Grid = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
];

export class Sudoku {
    private grid: Grid = EMPTY_GRID;

    constructor(grid?: Grid) {
        if (grid) this.grid = grid;
        else this.generate();
    }

    private checkRowIndex(row: number): void {
        if (row < 0 || row > 8)
            throw new Error(`row ${row} must be in the range 0-8`);
    }
    private checkColIndex(col: number): void {
        if (col < 0 || col > 8)
            throw new Error(`col ${col} must be in the range 0-8`);
    }

    getCell(row: number, col: number): Cell {
        this.checkRowIndex(row);
        this.checkColIndex(col);

        return this.grid[row][col];
    }

    setCell(row: number, col: number, value: number | null): void {
        this.checkRowIndex(row);
        this.checkColIndex(col);

        this.grid[row][col] = value;
    }

    getGrid(): Grid {
        return this.grid;
    }

    setGrid(grid: Grid): void {
        this.grid = grid;
    }

    clear(): void {
        this.setGrid(EMPTY_GRID);
    }

    /**
     * @TODO actually generate
     */
    generate(): Grid {
        this.setGrid(DUMMY_GRID);
        return this.grid;
    }
}

type SudokuSolver = (sudoku: Sudoku) => void;

export const solveViaBacktracking: SudokuSolver = (sudoku) => {
    sudoku.setGrid(DUMMY_GRID_SOLVED);
};
