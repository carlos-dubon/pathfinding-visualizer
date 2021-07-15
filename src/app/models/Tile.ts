export class Tile {
  public i: number;
  public j: number;
  public DOMElement?: Element;
  public type: TileType;
  public state: TileState;
  public path: boolean;
  public arrowPath: boolean;
  constructor(i: number, j: number, type: TileType, DOMElement?: Element) {
    this.i = i;
    this.j = j;
    this.type = type;
    this.DOMElement = DOMElement;
    this.state = TileState.unvisited;
    this.path = false;
    this.arrowPath = false;
  }
}

export enum TileType {
  default = 1,
  wall,
  start,
  target,
}

export enum TileState {
  unvisited,
  visited,
}
