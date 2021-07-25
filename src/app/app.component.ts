import { generate } from './algorithms/prim';
import { Tile, TileState, TileType } from './models/Tile';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { getStartNode, getTargetNode } from './algorithms/helperFunctions';
import dijkstras from './algorithms/dijkstra';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  // Counter that prevents multiple function calls
  public counter: number = 0;

  // Counter to control of when searchAnimation() is no longer calling itself
  public counter2: number = 0;

  // Counter that prevents multiple function calls
  public counter3: number = 0;

  public searchAnimationInProgress: boolean = false;
  public animationIsDone: boolean = false;

  // DOM Board element ref
  @ViewChild('boardEl') boardEl: ElementRef<Element>;

  public appSpeed: string = 'Normal';

  public mobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateDesign(window.innerWidth);
    this.ngOnInit();
    setTimeout(() => {
      // Fires when the stack is empty so setTimeout() acts as a "when DOM ready" function
      this.ngAfterViewInit();
    });
  }

  constructor(private _snackBar: MatSnackBar) {}

  public ngOnInit(): void {
    this.updateDesign(window.innerWidth);
    this.generateBoard();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      // Fires when the stack is empty so setTimeout() acts as a "when DOM ready" function
      this.mapDOMElements();
    });
  }

  public updateDesign(width: number): void {
    // break at 1172px to a mobile version
    width < 1172 ? (this.mobile = true) : (this.mobile = false);

    this.mobile ? this.setBoardSize(0) : this.setBoardSize(410);
  }

  private setBoardSize(informationPanel: number): void {
    // Note that the toolbar height and panels width can change
    const toolbarHeight: number = 80;

    const windowHeight: number = window.innerHeight - toolbarHeight;
    const windowWidth: number = window.innerWidth - informationPanel;

    let availableRows = Math.floor(windowHeight / 25);

    this.mobile ? (availableRows -= 7) : (availableRows -= 2);

    const availableCols = Math.floor(windowWidth / 25) - 2;

    this.rows = availableRows;
    this.cols = availableCols;

    this.startRow = Math.floor(this.rows / 2);
    this.startCol = Math.floor(this.cols / 4);
  }

  // Set the value for the mousedown event
  public setMouseDownValue(value: boolean) {
    this.mouseDown = value;
  }

  public setAppSpeed(speed: string) {
    this.appSpeed = speed;
  }

  // Constructs the board
  private generateBoard(): void {
    this.board = this.create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        // Populate the 2D Array with Tile objects
        this.board[i][j] = new Tile(i, j, TileType.default);

        // Placing the start and target nodes
        if (i == this.startRow && j == this.startCol) {
          this.board[i][j].type = TileType.start;
        }
        if (i == this.startRow && j == this.startCol * 3) {
          this.board[i][j].type = TileType.target;
        }
      }
    }
  }

  // Creates a 2D Array that is later populated with Tile objects (Array<Array<Tile>>)
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
    if (this.animationIsDone) {
      this.clearPath();
    }

    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        if (col.type === TileType.wall) col.type = TileType.default;
      });
    });
  }

  public clearBoard(): void {
    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        // Remove start and target nodes from the board
        if (col.type === TileType.start) col.type = TileType.default;
        if (col.type === TileType.target) col.type = TileType.default;
      });
    });

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        // Placing the start and target nodes
        if (i == this.startRow && j == this.startCol * 1) {
          this.board[i][j].type = TileType.start;
        }
        if (i == this.startRow && j == this.startCol * 3) {
          this.board[i][j].type = TileType.target;
        }
      }
    }

    this.clearWalls();
    this.clearPath();
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
    if (this.animationIsDone && this.mouseDown) {
      col.arrowPath = false;
    }

    if (col.type === TileType.target && this.mouseDown) {
      // Change the state of the Tile
      col.type = TileType.default;
      this.targetNodeSelected = true;
    }
  }

  public addTargetNodeOnDrag(col: Tile) {
    if (this.animationIsDone && this.mouseDown && this.targetNodeSelected) {
      this.clearPath();
      //col.arrowPath = true;
      this.animationIsDone = false;
    }

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

  public shortestPathLength(): number {
    let pathNodes: number = 0;
    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        if (col.path === true) pathNodes++;
      });
    });

    return pathNodes;
  }

  // Place or remove walls
  public toggleWall(col: Tile): void {
    if (this.animationIsDone) {
      this.clearPath();
    }

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
    this.searchAnimationInProgress = true;
    this.animationIsDone = false;
    this.clearPath();
    this.counter2 = 0;
    this.counter3 = 0;
    this.counter2++;
    this.searchAnimation(getStartNode(this.board));
  }

  // Recursive function to visualize the algorithm
  private searchAnimation(currentNode: Tile) {
    let speed: number = 200;

    switch (this.appSpeed) {
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
      if (currentNode.type === TileType.start)
        currentNode.state = TileState.visited;

      // search up
      if (currentNode.i - 1 >= 0) {
        this.checkForTarget(this.board[currentNode.i - 1][currentNode.j]);
        // Visit the target node when found
        if (this.targetFound && this.counter === 0) {
          this.targetFoundEvents();
        }
        if (
          this.targetFound === false &&
          this.board[currentNode.i - 1][currentNode.j].state ===
            TileState.unvisited &&
          this.board[currentNode.i - 1][currentNode.j].type !== TileType.wall
        ) {
          const nextNode = this.board[currentNode.i - 1][currentNode.j];
          nextNode.state = TileState.visited;
          this.counter2++;
          this.searchAnimation(nextNode);
        }
      }

      // search down
      if (currentNode.i + 1 < this.rows) {
        this.checkForTarget(this.board[currentNode.i + 1][currentNode.j]);
        // Visit the target node when found
        if (this.targetFound && this.counter === 0) {
          this.targetFoundEvents();
        }
        if (
          this.targetFound === false &&
          this.board[currentNode.i + 1][currentNode.j].state ===
            TileState.unvisited &&
          this.board[currentNode.i + 1][currentNode.j].type !== TileType.wall
        ) {
          const nextNode = this.board[currentNode.i + 1][currentNode.j];
          nextNode.state = TileState.visited;
          this.counter2++;
          this.searchAnimation(nextNode);
        }
      }

      // search left
      if (currentNode.j - 1 >= 0) {
        this.checkForTarget(this.board[currentNode.i][currentNode.j - 1]);
        // Visit the target node when found
        if (this.targetFound && this.counter === 0) {
          this.targetFoundEvents();
        }
        if (
          this.targetFound === false &&
          this.board[currentNode.i][currentNode.j - 1].state ===
            TileState.unvisited &&
          this.board[currentNode.i][currentNode.j - 1].type !== TileType.wall
        ) {
          const nextNode = this.board[currentNode.i][currentNode.j - 1];
          nextNode.state = TileState.visited;
          this.counter2++;
          this.searchAnimation(nextNode);
        }
      }

      // search right
      if (currentNode.j + 1 < this.cols) {
        this.checkForTarget(this.board[currentNode.i][currentNode.j + 1]);
        // Visit the target node when found
        if (this.targetFound && this.counter === 0) {
          this.targetFoundEvents();
        }
        if (
          this.targetFound === false &&
          this.board[currentNode.i][currentNode.j + 1].state ===
            TileState.unvisited &&
          this.board[currentNode.i][currentNode.j + 1].type !== TileType.wall
        ) {
          const nextNode = this.board[currentNode.i][currentNode.j + 1];
          nextNode.state = TileState.visited;
          this.counter2++;
          this.searchAnimation(nextNode);
        }
      }
      this.counter2--;
    }, speed);
  }

  // Returns true if searchAnimation() is done without reaching the target
  public searchAnimationIsDone(): boolean {
    if (this.counter2 == 0 && !this.targetFound) {
      // The algorithm is done
      this.animationIsDone = true;
      this.targetIsUnreachableMsg();
      return true;
    } else {
      // The algorithm is not done yet
      return false;
    }
  }

  private targetFoundEvents(): void {
    getTargetNode(this.board).state = TileState.visited;

    // Apply dijkstras algorithm to the current board and then send it to animatePath function for path animation
    // dijkstras returns the shortest path between the start and target nodes
    this.animatePath(dijkstras(this.board));

    // Counter that prevents multiple calls to dijkstras function
    this.counter++;
  }

  // Change the state of targetFound to true if the target node is passed as a parameter
  private checkForTarget(currentNode: Tile): void {
    if (currentNode.type === TileType.target) {
      this.targetFound = true;
    }
  }

  public clearPath(): void {
    // Reset the counter that prevents multiple calls to the Dijkstra's algorithm
    this.counter = 0;
    // When the path is cleared, the algorithm hasn't found the target
    this.targetFound = false;
    this.animationIsDone = false;
    this.counter2 = 0;
    this.board.forEach((row: Array<Tile>) => {
      row.forEach((col: Tile) => {
        (col.DOMElement as HTMLElement).classList.remove(
          'rotateminus90',
          'rotate90',
          'rotate180',
          'rotate0'
        );
        if (col.state === TileState.visited) {
          col.state = TileState.unvisited;
        }
        if (col.path === true) {
          col.path = false;
        }
        if (col.arrowPath === true) {
          col.arrowPath = false;
        }
      });
    });
  }

  public animatePath(path: Array<Array<number>>): void {
    for (let i = 0; i < path.length; i++) {
      const e = path[i];
      const r = path[i + 1];

      if (r) {
        if (r[1] < e[1]) {
          // The arrow is going up
          (this.board[e[1]][e[0]].DOMElement as HTMLElement).classList.add(
            'rotateminus90'
          );
          (this.board[r[1]][r[0]].DOMElement as HTMLElement).classList.add(
            'rotateminus90'
          );
        } else if (r[1] > e[1]) {
          // The arrow is going down
          (this.board[e[1]][e[0]].DOMElement as HTMLElement).classList.add(
            'rotate90'
          );
          (this.board[r[1]][r[0]].DOMElement as HTMLElement).classList.add(
            'rotate90'
          );
        } else if (r[0] < e[0]) {
          // The arrow is going left
          (this.board[e[1]][e[0]].DOMElement as HTMLElement).classList.add(
            'rotate180'
          );
          (this.board[r[1]][r[0]].DOMElement as HTMLElement).classList.add(
            'rotate180'
          );
        } else {
          // The arrow is going right
          (this.board[e[1]][e[0]].DOMElement as HTMLElement).classList.add(
            'rotate0'
          );
          (this.board[r[1]][r[0]].DOMElement as HTMLElement).classList.add(
            'rotate0'
          );
        }
      }

      let speed: number = 50;

      switch (this.appSpeed) {
        case 'Fast': {
          speed = 20;
          break;
        }
        default: {
          // Normal speed
          speed = 50;
          break;
        }
      }

      setTimeout(() => {
        this.board[e[1]][e[0]].path = true;
        this.board[e[1]][e[0]].arrowPath = true;
        if (i != path.length - 1) {
          setTimeout(() => {
            this.board[e[1]][e[0]].arrowPath = false;
          }, speed - 5);
        } else {
          this.animationIsDone = true;
          this.searchAnimationInProgress = false;
        }
      }, i * speed);
    }
  }

  public targetIsUnreachableMsg(): void {
    this.counter3++;
    if (this.counter3 == 1) {
      this._snackBar.open(
        '🚨 Oops! There is no path to the target node.',
        'Close',
        {
          duration: 6000,
        }
      );
    }
  }

  public nodesAreAtStartPosition(): boolean {
    const currentStartNodei = getStartNode(this.board).i;
    const currentStartNodej = getStartNode(this.board).j;
    const currentTargetNodei = getTargetNode(this.board).i;
    const currentTargetNodej = getTargetNode(this.board).j;

    const originalStartNodei = this.startRow;
    const originalStartNodej = this.startCol;
    const originalTargetNodei = this.startRow;
    const originalTargetNodej = this.startCol * 3;

    if (
      currentStartNodei == originalStartNodei &&
      currentStartNodej == originalStartNodej &&
      currentTargetNodei == originalTargetNodei &&
      currentTargetNodej == originalTargetNodej
    ) {
      return true;
    } else {
      return false;
    }
  }

  public generateMaze(): void {
    this.clearPath();
    this.clearWalls();
    this.searchAnimationInProgress = true;
    this.counter2++;

    const randomMaze: Array<Array<number>> = generate({
      width: this.cols,
      height: this.rows,
    });

    let speed: number = 30;

    switch (this.appSpeed) {
      case 'Fast': {
        speed = 10;
        break;
      }
      default: {
        // Normal speed
        speed = 30;
        break;
      }
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        setTimeout(() => {
          if (
            randomMaze[i][j] === 1 &&
            this.board[i][j].type !== TileType.start &&
            this.board[i][j].type !== TileType.target
          ) {
            this.board[i][j].type = TileType.wall;
          }

          if (i == this.rows - 1 && j == this.cols - 1) {
            this.searchAnimationInProgress = false;
            this.counter2--;
          }
        }, j * speed);
      }
    }
  }
}
