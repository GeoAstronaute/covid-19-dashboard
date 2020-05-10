import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { loadModules, loadCss } from 'esri-loader';

@Component({
  selector: 'co19-webmap',
  templateUrl: './webmap.component.html',
  styleUrls: ['./webmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebmapComponent implements OnInit {
  @Input() center: [number, number] = [0, 0];
  @Input() type: '2D'|'3D' = '3D';
  @Output() typeChange = new EventEmitter<'2D'|'3D'>();
  view: __esri.MapView | __esri.SceneView;
  map: __esri.Map;

  constructor() {}

  ngOnInit(): void {
    this.initWebmap();
  }

  async initWebmap() {
    await loadCss();
    const [Map]: [
      __esri.MapConstructor
    ] = await loadModules(['esri/Map']);
    this.map = new Map({
      basemap: 'hybrid',
    });
    this.type === '2D' ? this.buildMapView() : this.buildSceneView();
  }

  async buildMapView() {
    const [MapView]: [
      __esri.MapViewConstructor
    ] = await loadModules(['esri/views/MapView']);
    this.view = new MapView({
      container: 'webmap',
      map: this.map,
      center: this.center,
      zoom: 2
    });
  }

  async buildSceneView() {
    const [SceneView]: [
      __esri.SceneViewConstructor
    ] = await loadModules(['esri/views/SceneView']);
    this.view = new SceneView({
      container: 'webmap',
      map: this.map,
      center: this.center,
      zoom: 2
    });
  }

  updateView(type) {
    this.typeChange.emit(type);
    type === '2D' ? this.buildMapView() : this.buildSceneView();
  }
}
