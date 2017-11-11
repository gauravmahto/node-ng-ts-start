import { Injectable } from '@angular/core';

@Injectable()
export class HomeService {

  private mHighlightColor: string;

  constructor() {
    this.mHighlightColor = 'rosybrown';
  }

  get highlightColor() {
    return this.mHighlightColor;
  }

  set highlightColor(color: string) {
    this.mHighlightColor = color;
  }

}