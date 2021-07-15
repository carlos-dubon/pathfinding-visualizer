import { Tile, TileType } from '../models/Tile';

// Traverse the board in search of the start node an return it when found
export function getStartNode(board: Array<Array<Tile>>): Tile {
  // Node blueprint
  let node = new Tile(0, 0, TileType.default, document.createElement('div'));

  board.forEach((row: Array<Tile>) => {
    row.forEach((col: Tile) => {
      if (col.type === TileType.start) {
        node = col;
      }
    });
  });
  return node;
}

// Traverse the board in search of the target node an return it when found
export function getTargetNode(board: Array<Array<Tile>>): Tile {
  // Node blueprint
  let node = new Tile(0, 0, TileType.default, document.createElement('div'));

  board.forEach((row: Array<Tile>) => {
    row.forEach((col: Tile) => {
      if (col.type === TileType.target) {
        node = col;
      }
    });
  });
  return node;
}

export function create2DArray(rows: number, cols: number): Array<Array<any>> {
  const arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}
