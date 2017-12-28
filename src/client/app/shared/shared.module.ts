/**
 * Copyright 2017 - Author gauravm.git@gmail.com
 */

import { NgModule } from '@angular/core';

import { HighLightDirective } from './highlight.directive';

@NgModule({
  declarations: [
    HighLightDirective
  ],
  exports: [
    HighLightDirective
  ]
})
export class SharedModule {
}
