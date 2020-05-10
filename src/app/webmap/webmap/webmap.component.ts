import { Component, OnInit } from '@angular/core';
import { loadModules, loadCss } from 'esri-loader';

@Component({
  selector: 'co19-webmap',
  templateUrl: './webmap.component.html',
  styleUrls: ['./webmap.component.scss'],
})
export class WebmapComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.initWebmap();
  }

  async initWebmap() {
    await loadCss();
    const [Map, MapView, FeatureLayer]: [
      __esri.MapConstructor,
      __esri.MapViewConstructor,
      __esri.FeatureLayerConstructor
    ] = await loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer']);
    const map = new Map({
      basemap: 'hybrid',
    });
    const view = new MapView({
      container: 'webmap',
      map,
      center: [1, 45],
      zoom: 5,
    });
  }
}
