import { createBoard, Tile } from './models/Board';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public rows: number = 16;
  public cols: number = 45;

  public board: Array<Array<Tile>>;

  @ViewChild('boardEl') boardEl: ElementRef<HTMLElement>;

  constructor() {}

  public ngOnInit(): void {
    this.board = createBoard(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = new Tile();
      }
    }
  }

  public ngAfterViewInit(): void {
    let rowsCollection: HTMLCollection = this.boardEl.nativeElement.children;

    for (let i = 0; i < this.rows; i++) {
      let currentRow: Element = rowsCollection[i];

      let colsCollection: HTMLCollection = currentRow.children;

      for (let j = 0; j < this.cols; j++) {
        let currentCol: Element = colsCollection[j];
        this.board[i][j].DOMElement = currentCol;
      }
    }
  }
}
