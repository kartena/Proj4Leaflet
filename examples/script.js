
var res = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5]
,start = new L.LatLng(57.704503026010514, 11.965263344824994)
,map = new L.Map('map', {
  crs: proj4leaflet.crs('EPSG:2400'
    ,'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 +y_0=0.0 +proj=tmerc +ellps=bessel +units=m +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs')
  ,scale: function(zoom) {
    return 1 / res[zoom];
  }
  ,continuousWorld: true
})
,mapUrl = 'http://api.geosition.com/tile/lmv/{z}/{x}/{y}.png'
,attrib = 'Map data &copy; 2011 Lantmäteriet, Imagery &copy; 2011 Kartena'
,tilelayer = new L.TileLayer(mapUrl, {
  scheme: 'xyz'
  ,maxZoom: 14
  ,minZoom: 0
  ,continuousWorld: true
  ,attribution: attrib
});
map.addLayer(tilelayer);
map.setView(start, 13);
