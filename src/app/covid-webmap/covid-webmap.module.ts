import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidWebmapComponent } from './covid-webmap/covid-webmap.component';
import { WebmapModule } from '../webmap/webmap.module';



@NgModule({
  declarations: [CovidWebmapComponent],
  imports: [
    CommonModule,
    WebmapModule
  ],
  exports: [CovidWebmapComponent]
})
export class CovidWebmapModule { }
