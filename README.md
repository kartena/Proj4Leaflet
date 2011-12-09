# Proj4Leaflet

This is an early attempt at integrating [Proj4js](http://proj4js.org/) with the excellent map client [Leaflet](http://leaflet.cloudmade.com). We decided to put this into a separate library for now to avoid adding unnecessary dependencies to Leaflet.

## Example
Defines the EPSG:2400 (RT90) projection in Proj4 format and returns a Leaflet CRS object which can be used as the "crs" option to L.Map.

```javascript
// RT90
L.CRS.proj4js('EPSG:2400',
  '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
  '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
  '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs', 
  new L.Transformation(1, 0, -1, 0));

// ETRS89 / UTM zone 33N
L.CRS.proj4js('EPSG:25833', 
  '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs', 
  new L.Transformation(1, 2500000, -1, 9045984));

// SWEREF 99 TM
L.CRS.proj4js('EPSG:3006', 
  '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  new L.Transformation(1, -218128.7031, -1, 6126002.9379));
```

More details in [examples/script.js](https://github.com/kartena/Proj4Leaflet/blob/master/examples/script.js)

## Transformations
Transformation turns projected coordinates into pixel coordinates corresponding to a given zoom. 

It uses the following formula: 

```javascript
point.x = scale * (this._a * point.x + this._b);                            
point.y = scale * (this._c * point.y + this._d);     
```

which we usually define as  

```
a = 1 
b = -(x_origin)
c = -1
d = y_origin
```

