// https://stackoverflow.com/a/52490977/13722195
type Tuple<T, N extends number> = N extends N
    ? number extends N
        ? T[]
        : _TupleOf<T, N, []>
    : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
    ? R
    : _TupleOf<T, N, [T, ...R]>;

export type Cell = number | null;
export type Array9<T = Cell> = Tuple<T, 9>;
export type Grid<T = Cell> = Array9<Array9<T>>;
