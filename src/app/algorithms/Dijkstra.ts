import { Tile, TileType } from './../models/Tile';
import { create2DArray, getStartNode, getTargetNode } from './helperFunctions';
import { Grid, DijkstraFinder } from 'pathfinding';

export default function dijkstras(
  board: Array<Array<Tile>>
): Array<Array<number>> {
  const matrix: Array<Array<number>> = getMatrix(board);

  const grid: Grid = new Grid(matrix);
  const finder: DijkstraFinder = new DijkstraFinder();

  return finder.findPath(
    getStartNode(board).j,
    getStartNode(board).i,
    getTargetNode(board).j,
    getTargetNode(board).i,
    grid
  );
}

function getMatrix(board: Array<Array<Tile>>): Array<Array<number>> {
  const rows: number = board.length;
  const cols: number = board[0].length;
  const matrix: Array<Array<number>> = create2DArray(rows, cols);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j].type === TileType.wall) {
        matrix[i][j] = 1;
      } else {
        matrix[i][j] = 0;
      }
    }
  }

  return matrix;
}
