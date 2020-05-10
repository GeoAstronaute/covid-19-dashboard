import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WebmapComponent } from './webmap/webmap.component';
import { WebmapTypeSwitchComponent } from './webmap-type-switch/webmap-type-switch.component';



@NgModule({
  declarations: [WebmapComponent, WebmapTypeSwitchComponent],
  imports: [
    CommonModule,
    MatButtonToggleModule
  ],
  exports: [WebmapComponent]
})
export class WebmapModule { }
