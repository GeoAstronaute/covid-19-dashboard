import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidRecapDataComponent } from './covid-recap-data/covid-recap-data.component';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [CovidRecapDataComponent],
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports: [CovidRecapDataComponent]
})
export class CovidRecapDataModule { }
