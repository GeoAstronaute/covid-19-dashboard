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
  @Output() mapInit = new EventEmitter<void>();
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
      basemap: 'gray',
    });
    this.type === '2D' ? await this.buildMapView() : await this.buildSceneView();
    this.mapInit.emit();
    this.addWidgets(this.view);
  }

  async buildMapView() {
    const [MapView]: [
      __esri.MapViewConstructor
    ] = await loadModules(['esri/views/MapView']);
    const viewProperties: __esri.MapViewProperties = {
      container: 'webmap',
      map: this.map,
      center: this.center,
      zoom: 2
    };
    if (this.view?.extent) {
      viewProperties.center = this.view.center;
      viewProperties.zoom = this.view.zoom;
    }
    this.view = new MapView(viewProperties);
  }

  async buildSceneView() {
    const [SceneView]: [
      __esri.SceneViewConstructor
    ] = await loadModules(['esri/views/SceneView']);
    const viewProperties: __esri.SceneViewProperties = {
      container: 'webmap',
      map: this.map,
      center: this.center,
      zoom: 2
    };
    if (this.view?.extent) {
      viewProperties.center = this.view.center;
      viewProperties.zoom = this.view.zoom;
    }
    this.view = new SceneView(viewProperties);
  }

  async updateView(type) {
    type === '2D' ? await this.buildMapView() : await this.buildSceneView();
    this.typeChange.emit(type);
    this.addWidgets(this.view);
  }

  async addWidgets(view: __esri.MapView | __esri.SceneView) {
    const [BasemapGallery, Legend, Expand]: [
      __esri.BasemapGalleryConstructor,
      __esri.LegendConstructor,
      __esri.ExpandConstructor
    ] = await loadModules(['esri/widgets/BasemapGallery', 'esri/widgets/Legend', 'esri/widgets/Expand']);
    const basemapGallery = new BasemapGallery({
      view,
      container: document.createElement('div')
    });
    const expandBasemapGallery = new Expand({
      view,
      content: basemapGallery
    });
    const legend = new Legend({view});
    const expandLegend = new Expand({
      view,
      content: legend
    });
    view.ui.add(expandBasemapGallery, 'bottom-left');
    view.ui.add(expandLegend, 'bottom-right');
  }
}
