export interface CovidLatestData {
  uid: number;
  lastUpdate: number;
  confirmed: number;
  deaths: number;
  recovered: number;
  active: number;
  iso3: string;
}

export interface CSSECountryData {
  uid: number;
  iso2: string;
  iso3: string;
  code3: string;
  fips: string;
  admin2: string;
  provinceOrState: string;
  countryOrRegion: string;
  latitude: number;
  longitude: number;
  combinedKey: string;
  population: number;
}

export interface CovidTimeSerieData {
  uid: number;
  data: {date: Date, deaths?: number, confirmed?: number, recovered?: number}[];
}
