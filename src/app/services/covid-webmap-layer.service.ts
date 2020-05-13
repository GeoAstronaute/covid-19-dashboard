import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';

@Injectable({
  providedIn: 'root',
})
export class CovidWebmapLayerService {
  layer: __esri.FeatureLayer;

  constructor() {}

  async buildLayer(covidData) {
    const [FeatureLayer, ClassBreaksRenderer, geometryEngine]: [
      __esri.FeatureLayerConstructor,
      any,
      __esri.geometryEngine
    ] = await loadModules([
      'esri/layers/FeatureLayer',
      'esri/renderers/ClassBreaksRenderer',
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
    // const popup = this.layer.createPopupTemplate();
    // this.layer.popupTemplate = popup;
    // const renderer = new ClassBreaksRenderer({
    //   // attribute of interest - Earthquake magnitude
    //   field: 'deaths',
    //   defaultSymbol: {
    //     type: 'simple-fill',
    //     color: 'gray',
    //   },
    // });

    // renderer.addClassBreakInfo({
    //   minValue: 0,
    //   maxValue: 0,
    //   symbol: {
    //     type: 'simple-fill',
    //     color: 'green',
    //   },
    // });

    // renderer.addClassBreakInfo({
    //   minValue: 1,
    //   maxValue: 1000,
    //   symbol: {
    //     type: 'simple-fill',
    //     color: 'orange',
    //   },
    // });

    // renderer.addClassBreakInfo({
    //   minValue: 1000,
    //   maxValue: 1000000,
    //   symbol: {
    //     type: 'simple-fill',
    //     color: 'red',
    //   },
    // });
    // this.layer.renderer = renderer;
    await this.buildRenderer('deaths');
    return this.layer;
  }

  async buildRenderer(field: string) {
    const [colorRendererCreator, colorScheme]: [any, any] = await loadModules(['esri/renderers/smartMapping/creators/color', 'esri/renderers/smartMapping/symbology/color']);
    const generatedColorScheme = colorScheme.getSchemeByName({name: 'Red and Green 9', geometryType: 'polygon', theme: 'above-and-below'});
    const transformedColorScheme = colorScheme.flipColors(generatedColorScheme);
    const params = {
      layer: this.layer,
      classificationMethod: 'natural-breaks',
      field,
      numClasses: 10,
      colorScheme: transformedColorScheme
    };
    const rendererResponse = await colorRendererCreator.createClassBreaksRenderer(params);
    this.layer.renderer = rendererResponse.renderer;
  }
}
