var crs31258 = new L.Proj.CRS('EPSG::31258',
              "+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=450000 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
              {
                origin: [-5172500.0, 5001000.0],
                resolutions: [
					400.00079375158754,
				   	200.000529167725,
				   	100.0002645838625,
				   	50,
				   	25,
				   	15.000052916772502,
				   	9.9999470832275,
				   	5.000105833545001,
				   	3.0001164168995005,
				   	2.5000529167725003,
				   	1.9999894166455001,
				   	1.4999259165184997,
				   	1.0001270002540006,
				   	0.5000635001270003,
				   	0.25003175006350015],
              });

var map = L.map('map', {
	crs: crs31258,
});
var attrib = "&copy KAGIS http://www.kagis.ktn.gv.at";
var basemap = new L.TileLayer("http://gis.ktn.gv.at/arcgis/rest/services/tilecache/Ortho_2010_2012/MapServer/tile/{z}/{y}/{x}", {
	tileSize: 512,
	maxZoom: 14,
	minZoom: 0,
	attribution: attrib
});

map.addLayer(basemap);
map.setView([46.66411, 14.63602], 12);

