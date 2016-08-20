var map = L.map('map').setView([44.97,-93.24], 11);

// OSM Tiles

L.tileLayer(
  'http://tile.openstreetmap.org/{z}/{x}/{y}.png', 
  {
      attribution: 'Data by <a href="http://openstreetmap.org">OpenStreetMap contributors</a>'
  }
)
.addTo(map);

// GeoJSON layer (UTM15)
proj4.defs('EPSG:26915', '+proj=utm +zone=15 +ellps=GRS80 +datum=NAD83 +units=m +no_defs');

var geojson = {
  'type': 'Feature',
  'geometry': {
    'type': 'Point',
    'coordinates': [481650, 4980105],
  },
  'properties': {
    'name': 'University of Minnesota'
  },
  'crs': {
    'type': 'name',
    'properties': {
        'name': 'urn:ogc:def:crs:EPSG::26915'
      }
    }
  };

L.Proj.geoJson(geojson, {
  'pointToLayer': function(feature, latlng) {
    return L.marker(latlng).bindPopup(feature.properties.name);
  }
}).addTo(map);
