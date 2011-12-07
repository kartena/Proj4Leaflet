// Change the mapUrl below to test!
Proj4js.defs["EPSG:2400"] = "+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 +y_0=0.0 +proj=tmerc +ellps=bessel +units=m +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs";

var res = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5];

var setupMap = function(mapId) {
  var bounds = new L.LatLngBounds(new L.LatLng(55.2, 10.57), new L.LatLng(69.1,24.18))
  ,map = new L.Map(mapId, {
    crs: proj4leaflet.crs('EPSG:2400'),
    scale: function(zoom) {
      return 1 / res[zoom];
    }
    ,maxBounds: bounds
  })
  ,mapUrl = 'http://kar-render1:9090/lmv-default-idevio/{z}/{x}/{y}.png'
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
