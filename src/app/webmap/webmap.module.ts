import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebmapComponent } from './webmap/webmap.component';



@NgModule({
  declarations: [WebmapComponent],
  imports: [
    CommonModule
  ],
  exports: [WebmapComponent]
})
export class WebmapModule { }
