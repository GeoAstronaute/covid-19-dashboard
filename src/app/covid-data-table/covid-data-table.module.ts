import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidDataTableComponent } from './covid-data-table/covid-data-table.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';



@NgModule({
  declarations: [CovidDataTableComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ScrollingModule
  ],
  exports: [CovidDataTableComponent]
})
export class CovidDataTableModule { }
