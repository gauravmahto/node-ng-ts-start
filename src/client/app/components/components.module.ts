import { NgModule } from '@angular/core';
import { SharedModule } from 'App/shared/shared.module';

import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ComponentsModule {
}