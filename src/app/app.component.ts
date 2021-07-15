import { Tile, TileState, TileType } from './models/Tile';
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
  public rows: number;
  public cols: number;

  // Where the start and target node should start
  public startRow: number;
  public startCol: number;

  // Board
  public board: Array<Array<Tile>>;

  public targetFound: boolean = false;

  // DOM Board element ref
  @ViewChild('boardEl') boardEl: ElementRef<Element>;

  public appSpeed: string = 'Normal';

  constructor() {}

  public setAppSpeed(speed: string) {
    this.appSpeed = speed;
  }

  private setBoardSize(): void {
    // Note that the toolbar height and panels width can change
    const toolbarHeight: number = 90;
    const informationPanel: number = 410;
    const windowHeight: number = window.innerHeight - toolbarHeight;
    const windowWidth: number = window.innerWidth - informationPanel;

    const availableRows = Math.floor(windowHeight / 25) - 2;
    const availableCols = Math.floor(windowWidth / 25) - 2;
    this.rows = availableRows;
    this.cols = availableCols;

    // this.rows = 20;
    //this.cols = 40;

    this.startRow = Math.floor(this.rows / 2);
    this.startCol = Math.floor(this.cols / 4);
  }

  public ngOnInit(): void {
    this.setBoardSize();
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
        this.board[i][j] = new Tile(i, j, TileType.default);

        // Placing the start and target nodes
        if (i == this.startRow && j == this.startCol * 1) {
          this.board[i][j].type = TileType.start;
        }
        if (i == this.startRow && j == this.startCol * 3) {
          this.board[i][j].type = TileType.target;
        }
      }
    }
  }

  // Creates a 2D Array that is later populated with Tile objects
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

  // Removes all the walls from the board
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

  public visitedNodes(): number {
    let visitedNodes: number = 0;
    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        if (col.state === TileState.visited) visitedNodes++;
      });
    });

    return visitedNodes;
  }

  // Place or remove walls
  public toggleWall(col: Tile): void {
    if (col.type === TileType.default && col.state === TileState.visited) {
      col.type = TileType.wall;
      // SetTimeout takes into consideration the CSS Drop animation for walls
      setTimeout(() => {
        col.state = TileState.unvisited;
      }, 250);
    } else if (
      col.type === TileType.default &&
      col.state === TileState.unvisited
    ) {
      col.type = TileType.wall;
      setTimeout(() => {
        col.state = TileState.unvisited;
      }, 250);
    } else if (col.type === TileType.wall) {
      col.type = TileType.default;
      setTimeout(() => {
        col.state = TileState.unvisited;
      }, 250);
    }
  }

  public start(): void {
    this.targetFound = false;
    this.searchAnimation(this.getStartNode());
  }

  // Recursive function to visualize the algorithm
  private searchAnimation(currentNode: Tile) {
    let speed: number = 200;

    switch (this.appSpeed) {
      case 'Slow': {
        speed = 400;
        break;
      }
      case 'Fast': {
        speed = 20;
        break;
      }
      default: {
        // Normal speed
        speed = 200;
        break;
      }
    }

    setTimeout(() => {
      // Visit the start node
      if (currentNode.type === TileType.start) {
        currentNode.state = TileState.visited;
      }

      // Visit the target node when found
      if (this.targetFound) {
        this.getTargetNode().state = TileState.visited;
      }

      // search up
      if (currentNode.i - 1 >= 0) {
        this.checkForTarget(this.board[currentNode.i - 1][currentNode.j]);

        if (
          this.targetFound === false &&
          this.board[currentNode.i - 1][currentNode.j].state ===
            TileState.unvisited &&
          this.board[currentNode.i - 1][currentNode.j].type !== TileType.wall
        ) {
          const nextNode = this.board[currentNode.i - 1][currentNode.j];
          nextNode.state = TileState.visited;

          this.searchAnimation(nextNode);
        }
      }

      // search down
      if (currentNode.i + 1 < this.rows) {
        this.checkForTarget(this.board[currentNode.i + 1][currentNode.j]);

        if (
          this.targetFound === false &&
          this.board[currentNode.i + 1][currentNode.j].state ===
            TileState.unvisited &&
          this.board[currentNode.i + 1][currentNode.j].type !== TileType.wall
        ) {
          const nextNode = this.board[currentNode.i + 1][currentNode.j];
          nextNode.state = TileState.visited;

          this.searchAnimation(nextNode);
        }
      }

      // search left
      if (currentNode.j - 1 >= 0) {
        this.checkForTarget(this.board[currentNode.i][currentNode.j - 1]);

        if (
          this.targetFound === false &&
          this.board[currentNode.i][currentNode.j - 1].state ===
            TileState.unvisited &&
          this.board[currentNode.i][currentNode.j - 1].type !== TileType.wall
        ) {
          const nextNode = this.board[currentNode.i][currentNode.j - 1];
          nextNode.state = TileState.visited;

          this.searchAnimation(nextNode);
        }
      }

      // search right
      if (currentNode.j + 1 < this.cols) {
        this.checkForTarget(this.board[currentNode.i][currentNode.j + 1]);

        if (
          this.targetFound === false &&
          this.board[currentNode.i][currentNode.j + 1].state ===
            TileState.unvisited &&
          this.board[currentNode.i][currentNode.j + 1].type !== TileType.wall
        ) {
          const nextNode = this.board[currentNode.i][currentNode.j + 1];
          nextNode.state = TileState.visited;

          this.searchAnimation(nextNode);
        }
      }
    }, speed);
  }

  // Traverse the board in search of the start node an return it when found
  private getStartNode(): Tile {
    // Node blueprint
    let node = new Tile(0, 0, TileType.default, document.createElement('div'));

    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        if (col.type === TileType.start) {
          node = col;
        }
      });
    });
    return node;
  }

  // Traverse the board in search of the target node an return it when found
  private getTargetNode(): Tile {
    // Node blueprint
    let node = new Tile(0, 0, TileType.default, document.createElement('div'));

    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        if (col.type === TileType.target) {
          node = col;
        }
      });
    });
    return node;
  }

  // Change the state of targetFound to true if the target node is passed as a parameter
  private checkForTarget(currentNode: Tile): void {
    if (currentNode.type === TileType.target) {
      this.targetFound = true;
    }
  }
}
