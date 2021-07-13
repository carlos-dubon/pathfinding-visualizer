export class Tile {
  public DOMElement?: Element;
  public type: TileType;
  constructor(type: TileType, DOMElement?: Element) {
    this.type = type;
    this.DOMElement = DOMElement;
  }
}

export enum TileType {
  default = 1,
  wall,
  start,
  target,
}
