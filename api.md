---
layout: api
title: API
---

# [Proj4Leaflet]({{site.baseurl}}/) API

----

<div id="toc" class="clearfix">
  <div class="span-5 colborder">
    <h4>Main classes</h4>
    <ul>
      <li><a href="#l-proj-crs">L.Proj.CRS</a></li>
      <li><a href="#l-proj-crs-tms">L.Proj.CRS.TMS</a></li>
      <li><a href="#l-proj-projection">L.Proj.Projection</a></li>
      <li><a href="#l-proj-tilelayer-tms">L.Proj.TileLayer.TMS</a></li>
      <li><a href="#l-proj-geojson">L.Proj.GeoJSON</a></li>
      <li><a href="#l-proj-imageoverlay">L.Proj.ImageOverlay</a></li>
    </ul>
  </div>
</div>

## Proj4js compatibility notice

Proj4js has breaking changes introduced after version 1.1.0. The current version of Proj4Leaflet uses 
Proj4js 1.3.4 or later. If you for some reason need Proj4js version 1.1.0 compatibility (for example, if you must support Internet Explorer 8 and earlier), you can still use [Proj4Leaflet version 0.5](https://github.com/kartena/Proj4Leaflet/tree/0.5).

## <a name="l-proj-crs"></a>L.Proj.CRS

An [`ICRS`](http://leafletjs.com/reference.html#icrs) implementation that uses a Proj4 definition for the projection. This is likely to be the only class you need to work with in Proj4Leaflet, unless you have special requirements.

### Usage example

```javascript
var map = L.map('map', {
    center: [57.74, 11.94],
    zoom: 13,
    crs: L.Proj.CRS('EPSG:2400',
      '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
      '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
      '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
      {
        resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
      });
});
```

### Creation

Constructor                       | Description
----------------------------------|----------------------------------------------------
`new L.Proj.CRS(<String> code, <String> proj4def, `[`Proj.CRS options`](#l-proj-crs-options)`> options)` | Creates a new CRS from the [Proj4]() definition, settings the code (CRS identifier) |

### <a name="l-proj-crs-options"></a> Options

Option                | Type                   | Default           | Descriptions
----------------------|------------------------|-------------------|----------------------------
`origin`              | `Number[]`             | [0, 0]            | Tile origin, in projected coordinates; if set, this overrides the `transformation` option
`transformation`      | [`L.Transformation`](http://leafletjs.com/reference.html#transformation)     | new L.Transformation(1, 0, -1, 0) | The transformation to use when transforming projected coordinates into pixel coordinates
`scales`              | `Number[]`             |                   | Scale factors (pixels per projection unit, for example pixels/meter) for zoom levels; specify _either_ `scales` or `resolutions`, not both
`resolutions`         | `Number[]`             |                   | Resolution factors (projection units per pixel, for example meters/pixel) for zoom levels; specify _either_ `scales` or `resolutions`, not both
`bounds`              | [`L.Bounds`](http://leafletjs.com/reference.html#bounds) |    | Bounds of the CRS, in projected coordinates; if defined, Proj4Leaflet will use this in the [`getSize`](http://leafletjs.com/reference.html#icrs-getsize) method, otherwise defaulting to Leaflet's default CRS size

## <a name="l-proj-crs-tms"></a>L.Proj.CRS.TMS

[`ICRS`](http://leafletjs.com/reference.html#icrs) implementation to work with a Proj4 projection that will be used together with a TMS tile server. Since TMS has its y axis in the opposite direction of Leaflet (and OpenStreetMap/Google Maps), this requires some extra work.

__Note:__ If you use TMS and Leaflet before version 0.7, you must use [`L.Proj.TileLayerTMS`](#l-proj-tilelayer-tms) instead of a standard `L.TileLayer`; the standard tile layer before 0.7 couldn't handle other projections than spherical Mercator together with TMS.

### Usage example

```javascript
var map = new L.Map('map', {
    crs: new L.Proj.CRS.TMS('EPSG:102012',
        '+proj=lcc +lat_1=30 +lat_2=62 +lat_0=0 +lon_0=105 +x_0=0 +y_0=0 '
        + '+ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        [-5401501.0, 4065283.0, 4402101.0, 39905283.0],
        {
            resolutions: [
               140000.0000000000,
                70000.0000000000,
                35000.0000000000,
                17500.0000000000
            ]
        }
    )
});
```

### Creation

Constructor                       | Description
----------------------------------|----------------------------------------------------
`new L.Proj.CRS.TMS(<String> code, <String> proj4def, <Number[]> projectedBounds, <`[`Proj.CRS.TMS options`](#l-proj-crs-tms-options)`> options)` | Creates a new CRS from the [Proj4]() definition, settings the code (CRS identifier) |

### <a name="l-proj-crs-tms-options"></a> Options

Takes same options as [`L.Proj.CRS`](#l-proj-crs-options), plus:

Option                | Type                   | Default           | Descriptions
----------------------|------------------------|-------------------|----------------------------
`tileSize`            | `Number`               | 256               | Tile size, in pixels, to use in this CRS

## <a name="l-proj-tilelayer-tms"></a>L.Proj.TileLayer.TMS

_Deprecated since version 0.7, since Leaflet 0.7 does not need this class._

Extends [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) to support TMS when working with Proj4 projections. Note that for Leaflet versions before 0.7, `L.TileLayer` will not work with other projections than EPSG:3857 if the option `tms` is enabled.

### Usage example

```javascript
var crs = new L.Proj.CRS.TMS(...),
    map = new L.Map('map', {
        crs: crs
    }),

map.addLayer(new L.Proj.TileLayer.TMS('http://{s}.my-tms-server/{z}/{x}/{y}.png', crs, {
    maxZoom: 17,
    minZoom: 0,
    continuousWorld: true
}));
```

### Creation

Constructor                       | Description
----------------------------------|----------------------------------------------------
`new L.Proj.TileLayer.TMS(<String> tileUrl, <`[`L.Proj.CRS.TMS`](#l-proj-crs-tms)`> crs, <`[`TileLayer options`](http://leafletjs.com/reference.html#tilelayer-options)`> options)` | Creates a new tile layer which accesses tiles using TMS scheme from the given CRS

## <a name="l-proj-geojson"></a>L.Proj.GeoJSON

Extends [`L.GeoJSON`](http://leafletjs.com/reference.html#geojson) to add CRS support. Unlike the [`TileLayer`](#l-proj-crs-tms-options) extension, the CRS is derived from the `name` property of a CRS defined directly on the GeoJSON object; see the [Named CRS](http://geojson.org/geojson-spec.html#named-crs) part of the GeoJSON spec for details. [Linked CRS](http://geojson.org/geojson-spec.html#linked-crs)s are __not__ supported.

__Note:__ The relevant Proj4 definition should be defined directly via `proj4.defs` before loading the GeoJSON object. If it is not, Proj4leaflet will throw an error.

### Usage example

```javascript
proj4.defs("urn:ogc:def:crs:EPSG::26915", "+proj=utm +zone=15 +ellps=GRS80 +datum=NAD83 +units=m +no_defs");
var geojson = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [481650, 4980105]
  },
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::26915"
    }
  }
};
var map = L.map('map');
// ...
L.Proj.geoJson(geojson).addTo(map);
```

### Creation

Constructor                       | Description
----------------------------------|----------------------------------------------------
`new L.Proj.GeoJSON(<Object> geojson?, <`[`GeoJSON options`](http://leafletjs.com/reference.html#geojson-options)`> options) | Creates a GeoJSON layer with CRS support

## L.Proj.ImageOverlay

Works like [`L.ImageOverlay`](http://leafletjs.com/reference.html#imageoverlay), but accepts bounds in the map's projected coordinate system instead of latitudes and longitudes. This is useful when the projected coordinate systems axis do not align with the latitude and longitudes, which results in distortion with the default image overlay in Leaflet.

### Usage example

```javascript
// Coordinate system is EPSG:28992 / Amersfoort / RD New
var imageBounds = L.bounds(
  [145323.20011251318, 475418.56045463786],
  [175428.80013969325, 499072.9604685671]);
L.Proj.imageOverlay(
    'http://geo.flevoland.nl/arcgis/rest/services/Groen_Natuur/' +
    'Agrarische_Natuur/MapServer/export?' +
    'format=png24&transparent=true&f=image&bboxSR=28992&imageSR=28992&' +
    'layers=show%3A0&' +
    'bbox=145323.20011251318%2C475418.56045463786%2C175428.80013969325%2C499072.9604685671&size=560%2C440',
  imageBounds);
```

### Creation

Constructor                       | Description
----------------------------------|----------------------------------------------------
`new L.Proj.ImageOverlay(<String> imageUrl, <`[`L.Bounds`](http://leafletjs.com/reference.html#bounds)`> bounds, <`[`ImageOverlay options`](http://leafletjs.com/reference.html#imageoverlay-options)`> options) | Creates a new image overlay, with the bounds set in the map's projected coordinates
