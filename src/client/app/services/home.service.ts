/**
 * Copyright 2017 - Author gauravm.git@gmail.com
 */

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
