import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';

@Injectable({
  providedIn: 'root',
})
export class CovidWebmapLayerService {
  layer: __esri.FeatureLayer;
  renderersCache: {[rendererName: string]: __esri.Renderer} = {};

  constructor() {}

  async buildLayer(covidData) {
    const [FeatureLayer, geometryEngine]: [
      __esri.FeatureLayerConstructor,
      __esri.geometryEngine
    ] = await loadModules([
      'esri/layers/FeatureLayer',
      'esri/geometry/geometryEngine'
    ]);
    const countryLayer = new FeatureLayer({
      url:
        'https://services7.arcgis.com/bxmuD0WlNbMDdTJ6/arcgis/rest/services/world_countries/FeatureServer/0',
    });
    const query = countryLayer.createQuery();
    query.returnGeometry = true;
    query.geometryPrecision = 1;
    query.outFields = ['CNTR_ID as iso2, Name'];
    const result = await countryLayer.queryFeatures(query);
    const graphics = result.features.map((graphic) => {
      const relatedCovidData = covidData.find(
        (d) => d.alpha2Code === graphic.attributes.iso2
      );
      return {
        geometry: geometryEngine.simplify(graphic.geometry),
        attributes: {
          ...graphic.attributes,
          ...relatedCovidData,
        }
      };
    });
    this.layer = new FeatureLayer({
      source: graphics, // array of graphics objects
      title: 'Countries',
      objectIdField: 'OBJECTID',
      geometryType: 'polygon',
      opacity: 0.7,
      spatialReference: countryLayer.spatialReference,
      outFields: ['*'],
      fields: [
        {
          name: 'OBJECTID',
          type: 'oid',
        },
        {
          name: 'iso2',
          type: 'string',
        },
        {
          name: 'Name',
          type: 'string',
        },
        {
          name: 'deaths',
          type: 'integer',
        },
        {
          name: 'recovered',
          type: 'integer',
        },
        {
          name: 'confirmed',
          type: 'integer',
        },
      ],
    });
    await this.setRenderer('deaths', true);
    return this.layer;
  }

  async setRenderer(field: string, inversedColorRamp?: boolean) {
    if (this.renderersCache[name]) {
      return this.applyRenderer(this.renderersCache[name]);
    }
    const params = {
      layer: this.layer,
      classificationMethod: 'natural-breaks',
      field,
      numClasses: 10
    };
    this.buildRenderer(field, params, inversedColorRamp);
  }

  async setRendererByValueExpression(name: string, valueExpression: string, view: __esri.View, inversedColorRamp?: boolean) {
    if (this.renderersCache[name]) {
      return this.applyRenderer(this.renderersCache[name]);
    }
    const params = {
      layer: this.layer,
      classificationMethod: 'natural-breaks',
      valueExpression,
      view,
      numClasses: 10
    };
    this.buildRenderer(name, params, inversedColorRamp);
  }

  private async buildRenderer(name: string, params: __esri.colorCreateClassBreaksRendererParams, inversedColorRamp?: boolean) {
    const [colorRendererCreator, colorScheme]: [__esri.color, __esri.symbologyColor] = await loadModules(['esri/renderers/smartMapping/creators/color', 'esri/renderers/smartMapping/symbology/color']);
    let generatedColorScheme = colorScheme.getSchemeByName({name: 'Red and Green 9', geometryType: 'polygon', theme: 'above-and-below'});
    if (inversedColorRamp) {
      generatedColorScheme = colorScheme.flipColors(generatedColorScheme);
    }
    params.colorScheme = generatedColorScheme;
    const rendererResponse = await colorRendererCreator.createClassBreaksRenderer(params);
    this.renderersCache[name] = rendererResponse.renderer;
    this.applyRenderer(rendererResponse.renderer);
  }

  private applyRenderer(renderer: __esri.Renderer) {
    this.layer.renderer = renderer;
  }
}
