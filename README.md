# Proj4Leaflet

This is an early attempt at integrating Proj4js with the excellent map client Leaflet (http://leaflet.cloudmade.com). We decided to put this into a separate library for now to avoud adding unnecessary dependencies to Leaflet.

## Example

    proj4leaflet.crs('EPSG:2400',
      '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
      '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
      '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');

Defines the EPSG:2400 (RT90) projection in Proj4 format and returns a Leaflet CRS object which can be used as the "crs" option to L.Map.

More details in [examples/script.js](https://github.com/kartena/Proj4Leaflet/blob/master/examples/script.js)