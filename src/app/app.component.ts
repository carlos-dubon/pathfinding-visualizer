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

  public startNodeSelected: boolean = false;
  public targetNodeSelected: boolean = false;

  // Keep track of the last node
  public lastNode: Tile | null = null;

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

        // Placing the start and target nodes
        if (i == 4 && j == 1) {
          this.board[i][j].type = TileType.start;
        }
        if (i == 4 && j == 15) {
          this.board[i][j].type = TileType.target;
        }
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
    // Drag to place start node
    this.addStartNodeOnDrag(col);
    // Drag to place target node
    this.addTargetNodeOnDrag(col);
    // Drag to place walls
    this.mouseDown && this.toggleWall(col);
  }

  public mouseDownEvents(col: Tile): void {
    // Click to place a wall
    this.toggleWall(col);
  }

  public mouseLeaveEvents(col: Tile): void {
    this.lastNode = col;
    this.removeStartNodeOnDrag(col);
    this.removeTargetNodeOnDrag(col);
  }

  public clearWalls(): void {
    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        if (col.type === TileType.wall) col.type = TileType.default;
      });
    });
  }

  public removeStartNodeOnDrag(col: Tile) {
    if (col.type === TileType.start && this.mouseDown) {
      // Change the state of the Tile
      col.type = TileType.default;
      this.startNodeSelected = true;
    }
  }

  public addStartNodeOnDrag(col: Tile) {
    if (this.mouseDown && this.startNodeSelected) {
      if (col.type === TileType.default) {
        col.type = TileType.start;
      } else if (col.type === TileType.wall) {
        col.type = TileType.start;
      } else if (col.type === TileType.target) {
        if (this.lastNode) {
          // Prevents overlap
          this.lastNode.type = TileType.start;
          col.type = TileType.target;
        }
      }
      this.startNodeSelected = false;
    }
  }

  public removeTargetNodeOnDrag(col: Tile) {
    if (col.type === TileType.target && this.mouseDown) {
      // Change the state of the Tile
      col.type = TileType.default;
      this.targetNodeSelected = true;
    }
  }

  public addTargetNodeOnDrag(col: Tile) {
    if (this.mouseDown && this.targetNodeSelected) {
      if (col.type === TileType.default) {
        col.type = TileType.target;
      } else if (col.type === TileType.wall) {
        col.type = TileType.target;
      } else if (col.type === TileType.start) {
        if (this.lastNode) {
          this.lastNode.type = TileType.target;
          col.type = TileType.start;
        }
      }
      this.targetNodeSelected = false;
    }
  }

  // Returns true if any wall is present in the board
  public wallsPresent(): boolean {
    let wallsPresent: boolean = false;

    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        if (col.type === TileType.wall) wallsPresent = true;
      });
    });

    return wallsPresent;
  }

  // Place or remove walls
  public toggleWall(col: Tile): void {
    if (col.type === TileType.default) {
      col.type = TileType.wall;
    } else if (col.type === TileType.wall) {
      col.type = TileType.default;
    }
  }
}
