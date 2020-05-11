import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebmapUtilsService {
  constructor() {}

  registerClickEventOnLayer(
    layerView: __esri.LayerView,
    view: __esri.MapView | __esri.SceneView
  ) {
    const clickSubject$ = new BehaviorSubject<__esri.Graphic>(null);
    view.on('pointer-move', (evt) => {
      view.hitTest(evt).then((response) => {
        if (response.results.length) {
          const graphic = response.results.filter((result) => {
            // check if the graphic belongs to the layer of interest
            return result.graphic.layer.id === layerView.layer.id;
          })[0].graphic;
          document.getElementById('webmap').style.cursor  = graphic ? 'pointer' : 'default';
        } else {
          document.getElementById('webmap').style.cursor  = 'default';
        }
      });
    });
    view.on('click', (evt) => {
      view.hitTest(evt).then((response) => {
        if (response.results.length) {
          const graphic = response.results.filter((result) => {
            // check if the graphic belongs to the layer of interest
            return result.graphic.layer.id === layerView.layer.id;
          })[0].graphic;
          // do something with the result graphic
          clickSubject$.next(graphic);
        }
      });
    });
    return clickSubject$;
  }
}
