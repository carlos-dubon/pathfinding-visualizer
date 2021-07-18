import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgsRevealModule } from 'ngx-scrollreveal';
import { NgsRevealConfig } from 'ngx-scrollreveal';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgsRevealModule,
  ],
  providers: [NgsRevealConfig],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(config: NgsRevealConfig) {
    config.easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
    config.origin = 'bottom';
    config.distance = '120%';
    config.duration = 600;
    config.reset = false;
  }
}
