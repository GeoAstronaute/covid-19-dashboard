import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';

@Injectable({
  providedIn: 'root',
})
export class CovidWebmapLayerService {
  layer: __esri.FeatureLayer;

  constructor() {}

  async buildLayer(covidData) {
    const [FeatureLayer, ClassBreaksRenderer]: [
      __esri.FeatureLayerConstructor,
      any
    ] = await loadModules([
      'esri/layers/FeatureLayer',
      'esri/renderers/ClassBreaksRenderer',
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
        geometry: graphic.geometry,
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
    const params = {
      layer: this.layer,
      classificationMethod: 'natural-breaks',
      field,
      // colorScheme: {
      //   id: 'CustomScheme',
      //   colors: new Array(['#B9DC45', '#E7F317', '#FFF300', '#FFB900', '#FF8B00', '#FF0000']),
      //   theme: 'high-to-low',
      //   noDataColor: 'gray',
      //   numClasses: 6
      //   // colorsForClassBreaks: [{
      //   //     color: ['#B9DC45'],
      //   //     numClasses: 1
      //   //   },
      //   //   {
      //   //     color: ['#E7F317'],
      //   //     numClasses: 2
      //   //   },
      //   //   {
      //   //     color: ['#FFF300'],
      //   //     numClasses: 3
      //   //   },
      //   //   {
      //   //     color: ['#FFB900'],
      //   //     numClasses: 4
      //   //   },
      //   //   {
      //   //     color: ['#FF8B00'],
      //   //     numClasses: 5
      //   //   },
      //   //   {
      //   //     color: ['#FF0000'],
      //   //     numClasses: 6
      //   //   }
      //   // ]
      // }
    };
    const [colorRendererCreator, colorScheme] = await loadModules(['esri/renderers/smartMapping/creators/color', 'esri/renderers/smartMapping/symbology/color']);
    const rendererResponse = await colorRendererCreator.createClassBreaksRenderer(params);
    this.layer.renderer = rendererResponse.renderer;
  }
}
