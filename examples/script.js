// Change the mapUrl below to test!

var res = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5];

var setupMap = function(mapId) {
  var bounds = new L.LatLngBounds(new L.LatLng(55.2, 10.57), new L.LatLng(69.1,24.18))
  ,map = new L.Map(mapId, {
    crs: L.CRS.EPSG2400,
    scale: function(zoom) {
      return 1 / res[zoom];
    }
    ,maxBounds: bounds
  })
  ,mapUrl = 'http://your-map.data/{z}/{x}/{y}.png'
  ,attrib = 'Demo of RT90 projections using proj4js with Leaflet'
  ,tilelayer = new L.TileLayer(mapUrl, {
    scheme: 'xyz'
    ,maxZoom: 14
    ,minZoom: 0
    ,noWrap: true
    ,continuousWorld: true
    ,attribution: attrib
  });
  map.addLayer(tilelayer);
  
  return map;
};

var map = window.map = setupMap('map');
var start = new L.LatLng(57.704503026010514, 11.965263344824994);
map.setView(start, 13);
