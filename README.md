Proj4Leaflet [![NPM version](https://badge.fury.io/js/proj4leaflet.png)](https://badge.fury.io/js/proj4leaflet) [![Build Status](https://travis-ci.org/kartena/Proj4Leaflet.svg?branch=master)](https://travis-ci.org/kartena/Proj4Leaflet)
 
============

This [Leaflet](https:/leafletjs.com) plugin adds support for using projections supported by
[Proj4js](https://github.com/proj4js/proj4js).

## Features

* Supports all commonly used projections
* Extends Leaflet with full TMS support even for local projections
* Makes it easy to use GeoJSON data with other projections than WGS84
* Image overlays with bounds set from projected coordinates rather than `LatLngs`

Leaflet comes with built in support for tiles in [Spherical Mercator](https://wiki.openstreetmap.org/wiki/EPSG:3857). If you need support for tile layers in other projections, the Proj4Leaflet plugin lets you use tiles in any projection supported by Proj4js, which means support for just about any projection commonly used.

For more details and API docs, see the [Proj4Leaflet site](https://kartena.github.io/Proj4Leaflet/).
