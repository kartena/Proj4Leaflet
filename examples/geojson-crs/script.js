var map = L.map('map').setView([44.97,-93.24], 11);

// MapQuest OSM Tiles
L.tileLayer(
  'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
  {
    subdomains: '1234',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);

// GeoJSON layer
Proj4js.defs["EPSG:26915"] = "+proj=utm +zone=15 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";
var geojson = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [481650, 4980105],
  },
  "properties": {
    "name": "University of Minnesota"
  },
  "crs": {
    "type": "name",
      "properties": {
        "name": "urn:ogc:def:crs:EPSG::26915"
      }
    }
  };

L.Proj.geoJson(geojson, {
  'pointToLayer': function(feature, latlng) {
    return L.marker(latlng).bindPopup(feature.properties.name);
  }
}).addTo(map);
