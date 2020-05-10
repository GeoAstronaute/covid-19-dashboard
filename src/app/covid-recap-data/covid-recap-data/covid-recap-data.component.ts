import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'co19-covid-recap-data',
  templateUrl: './covid-recap-data.component.html',
  styleUrls: ['./covid-recap-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CovidRecapDataComponent implements OnInit {
  @Input() confirmed: number;
  @Input() recovered: number;
  @Input() deaths: number;

  constructor() { }

  ngOnInit(): void {
  }

}
