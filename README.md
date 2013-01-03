# Proj4Leaflet

This [Leaflet](http://leafletjs.com) plugin adds support for using projections supported by
[Proj4js](http://proj4js.org/).

For more details, see this [blog post on tiling and projections](http://blog.kartena.se/local-projections-in-a-world-of-spherical-mercator/).

## Example
Defines the EPSG:2400 (RT90) projection in Proj4 format and returns a Leaflet CRS object which can be used as the "crs" option to L.Map.

```javascript
// RT90 with map's pixel origin at RT90 coordinate (0, 0)
new L.CRS.Proj4js('EPSG:2400',
  '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
  '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
  '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
);

// ETRS89 / UTM zone 33N with map's pixel origin at (-2500000, 9045984)
new L.CRS.Proj4js('EPSG:25833',
  '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs',
  {origin: [-2500000, 9045984]});

// SWEREF 99 TM with map's pixel origin at (218128.7031, 6126002.9379)
new L.CRS.Proj4js('EPSG:3006',
  '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  {origin: [218128.7031, 6126002.9379]});
```

## Reference
The plugin extends Leaflet with a few classes that helps integrating Proj4's projections into
Leaflet's [ICRS](http://leafletjs.com/reference.html#icrs) interface.

###L.CRS.Proj4js
An ICRS implementation that uses a Proj4 definition for the projection. This is likely to be the only class you need to work with in Proj4Leaflet.

####Usage example
```javascript
var map = L.map('map', {
    center: [57.74, 11.94],
    zoom: 13,
    crs: L.CRS.Proj4js('EPSG:2400',
      '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
      '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
      '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');
});
```

####Constructor
```javascript
L.CRS.Proj4js(code, proj4def, options)
```

* ```code``` is the projection's SRS code (only used internally by the Proj4js library).
* ```proj4def``` is the Proj4 definition for the projection to use
* ```options``` is an options object with these possible options:
  * ```origin```: the projected coordinate to use as the map's pixel origin; overrides the
    ```transformation``` option if set
  * ```transformation```: an [L.Transformation](http://leafletjs.com/reference.html#transformation) that is used to transform the projected coordinates to pixel coordinates; default is ```L.Transformation(1, 0, -1, 0)```
  * ```scales```: an array of scales (pixels per projected coordinate unit) for each corresponding zoom level; default is to use Leaflet's native scales. You should use ```scales``` _or_ ```resolutions```, not both.
  * ```resolutions```: an array of resolutions (projected coordinate units per pixel) for each corresponding zoom level; default is to use Leaflet's native resolutions. You should use ```scales``` _or_ ```resolutions```, not both.
