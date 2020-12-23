import axios from "axios";

import { Array9, Cell, Grid } from "./types";

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

const VALID_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
type RowOrColIndex = typeof VALID_INDICES[number];

export class Sudoku {
    grid: Grid;

    constructor(grid: Grid = EMPTY_GRID) {
        this.grid = grid;
    }

    getCell(row: RowOrColIndex, col: RowOrColIndex): Cell {
        return this.grid[row][col];
    }

    setCell(
        row: RowOrColIndex,
        col: RowOrColIndex,
        value: number | null
    ): void {
        this.grid[row][col] = value;
    }

    setGrid(grid: Grid): void {
        this.grid = grid;
    }

    clear(): void {
        for (let rowIdx = 0; rowIdx < this.grid.length; rowIdx++) {
            for (let colIdx = 0; colIdx < this.grid[0].length; colIdx++) {
                this.setCell(
                    rowIdx as RowOrColIndex,
                    colIdx as RowOrColIndex,
                    null
                );
            }
        }
        this.setGrid(EMPTY_GRID);
    }

    /**
     * @TODO actually generate
     */
    async generate(difficulty: 1 | 2 | 3 = 2): Promise<void> {
        this.clear();
        const {
            data: { squares },
        } = await axios.get(
            `http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=${difficulty}`
        );
        squares.forEach(({ x, y, value }: any) => this.setCell(y, x, value));
        // this.setGrid(DUMMY_GRID);
    }

    private static isUniqueSet(set: Array<Cell>): boolean {
        const seen = new Set<number>();
        for (const cell of set) {
            if (cell === null) continue;
            if (seen.has(cell)) return false;
            seen.add(cell);
        }
        return true;
    }

    isRowValid(rowIdx: RowOrColIndex): boolean {
        const row = this.grid[rowIdx];
        return Sudoku.isUniqueSet(row);
    }

    isColValid(colIdx: RowOrColIndex): boolean {
        const col = this.grid.map((row) => row[colIdx]);
        return Sudoku.isUniqueSet(col);
    }

    isSquareValid(rowIdx: RowOrColIndex, colIdx: RowOrColIndex): boolean {
        const squareRowIdx = Math.floor(rowIdx / 3) * 3;
        const squareColIdx = Math.floor(colIdx / 3) * 3;
        const square = [
            squareRowIdx,
            squareRowIdx + 1,
            squareRowIdx + 2,
        ].flatMap((rowIdx) => {
            const row = this.grid[rowIdx];
            return row.slice(squareColIdx, squareColIdx + 3);
        });
        return Sudoku.isUniqueSet(square);
    }

    isCellValid(rowIdx: RowOrColIndex, colIdx: RowOrColIndex): boolean {
        return (
            this.isRowValid(rowIdx) &&
            this.isColValid(colIdx) &&
            this.isSquareValid(rowIdx, colIdx)
        );
    }

    printGrid(): void {
        let str = "";
        for (let rowIdx = 0; rowIdx < this.grid.length; rowIdx++) {
            const rowAsStrs = [
                ...this.grid[rowIdx].slice(0, 3).map((cell) => cell || " "),
                "|",
                ...this.grid[rowIdx].slice(3, 6).map((cell) => cell || " "),
                "|",
                ...this.grid[rowIdx].slice(6).map((cell) => cell || " "),
            ];
            str += `\n ${rowAsStrs.join(" ")}`;
            if (rowIdx === 2 || rowIdx === 5) str += "\n ---------------------";
        }
        console.log(str);
    }
}

export type CellIndices = [row: RowOrColIndex, col: RowOrColIndex];

export function* solveViaBacktracking(
    sudoku: Sudoku
): IterableIterator<CellIndices> {
    const cellsToSolve: Array<CellIndices> = [];

    for (let rowIdx = 0; rowIdx < sudoku.grid.length; rowIdx++) {
        for (let colIdx = 0; colIdx < sudoku.grid[0].length; colIdx++) {
            if (sudoku.grid[rowIdx][colIdx] === null)
                cellsToSolve.push([rowIdx as any, colIdx as any]);
        }
    }

    let currCellIdx = 0;
    while (currCellIdx < cellsToSolve.length) {
        const [rowIdx, colIdx] = cellsToSolve[currCellIdx];
        const currCellValue = sudoku.getCell(rowIdx, colIdx);
        if (currCellValue === 9) sudoku.setCell(rowIdx, colIdx, null);
        else {
            for (
                let trial = currCellValue ? currCellValue + 1 : 1;
                trial <= 9;
                trial++
            ) {
                sudoku.setCell(rowIdx, colIdx, trial);
                if (sudoku.isCellValid(rowIdx, colIdx)) break;

                sudoku.setCell(rowIdx, colIdx, null);
            }
        }
        if (sudoku.getCell(rowIdx, colIdx) !== null) {
            currCellIdx++;
        } else currCellIdx--;
        yield [rowIdx, colIdx];
    }

    alert("Solved!");
}
