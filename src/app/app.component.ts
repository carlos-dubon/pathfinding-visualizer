import { Tile, TileType } from './models/Tile';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // State of the mousedown event
  public mouseDown: boolean = false;

  // Amt of rows and cols the board should have
  public rows: number = 16;
  public cols: number = 45;

  // Board
  public board: Array<Array<Tile>>;

  // DOM Board element ref
  @ViewChild('boardEl') boardEl: ElementRef<Element>;

  constructor() {}

  public ngOnInit(): void {
    this.generateBoard();
  }

  public ngAfterViewInit(): void {
    this.mapDOMElements();
  }

  // Set the value for the mousedown event
  public setMouseDownValue(value: boolean) {
    this.mouseDown = value;
  }

  // Generates the structure needed for a 2D board
  private generateBoard(): void {
    this.board = this.create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = new Tile(TileType.default);
      }
    }
  }

  private create2DArray(rows: number, cols: number): Array<Array<Tile>> {
    const arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols);
    }
    return arr as Array<Array<Tile>>;
  }

  // Map the DOM Elements to the logical board
  private mapDOMElements(): void {
    let rowsCollection: HTMLCollection = this.boardEl.nativeElement.children;

    for (let i = 0; i < this.rows; i++) {
      let currentRow: Element = rowsCollection[i];

      let colsCollection: HTMLCollection = currentRow.children;

      for (let j = 0; j < this.cols; j++) {
        let currentCol: Element = colsCollection[j];
        // Assign the DOM Element to the corresponding Tile
        this.board[i][j].DOMElement = currentCol;
      }
    }
  }

  public mouseEnterEvents(col: Tile): void {
    // Drag to place walls
    this.mouseDown && this.toggleWall(col);
  }

  public mouseDownEvents(col: Tile): void {
    // Click to place a wall
    this.toggleWall(col);
  }

  // Place or remove walls
  public toggleWall(col: Tile): void {
    if (col.type === TileType.default) {
      col.type = TileType.wall;
    } else {
      col.type = TileType.default;
    }
  }
}
