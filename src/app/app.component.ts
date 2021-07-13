import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public rows: number = 16;
  public cols: number = 45;

  constructor() {}

  public ngOnInit(): void {}
}
