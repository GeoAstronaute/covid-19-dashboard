import { Component, ViewChild, Input, AfterViewInit, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'co19-webmap-type-switch',
  templateUrl: './webmap-type-switch.component.html',
  styleUrls: ['./webmap-type-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebmapTypeSwitchComponent implements AfterViewInit, OnDestroy {
  @Input() value: '2D'|'3D';
  @ViewChild(MatButtonToggleGroup) buttonToggleGroup: MatButtonToggleGroup;
  @Output() typeChange = new EventEmitter<string>();
  componentDestroyed$ = new Subject<void>();

  ngAfterViewInit() {
    this.buttonToggleGroup.change
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((change: MatButtonToggleChange) => {
        this.typeChange.emit(change.value);
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
