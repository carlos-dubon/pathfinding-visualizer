export function createBoard(rows: number, cols: number) {
  const arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }
  return arr as Array<Array<Tile>>;
}

export class Tile {
  public DOMElement?: Element;
  constructor(DOMElement?: Element) {
    this.DOMElement = DOMElement;
  }
}
