/**
 * Copyright 2017 - Author gauravm.git@gmail.com
 */

import { Component } from '@angular/core';

import { HomeService } from 'App/services/home.service';

@Component({
  selector: 'my-home',
  styleUrls: [
    './home.component.style.scss'
  ],
  templateUrl: './home.component.view.html'
})
export class HomeComponent {

  public highlightColor: string;

  constructor(private homeService: HomeService) {

    this.highlightColor = this.homeService.highlightColor;
  }

}
