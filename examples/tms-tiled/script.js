var crs = new L.Proj.CRS.TMS('EPSG:102012',
	'+proj=lcc +lat_1=30 +lat_2=62 +lat_0=0 +lon_0=105 +x_0=0 +y_0=0 '
	+ '+ellps=WGS84 +datum=WGS84 +units=m +no_defs',
	[-5401501.0, 4065283.0, 4402101.0, 39905283.0],
	{
		resolutions: [
		   140000.0000000000,
		    70000.0000000000,
		    35000.0000000000,
		    17500.0000000000,
		     8750.0000000000,
		     4375.0000000000,
		     2187.5000000000,
		     1093.7500000000,
		      546.8750000000,
		      273.4375000000,
		      136.7187500000,
		       68.3593750000,
		       34.1796875000,
		       17.0898437500,
		        8.5449218750,
		        4.2724609375,
		        2.1362304688,
		        1.0681152344
		]
	});

var	map = new L.Map('map', {
	crs: crs,
	continuousWorld: true,
	worldCopyJump: false
});

/*
	This tile layer is provided by basemap.ru /
	Nikolai Lebedev (https://github.com/nlebedev)
*/
var tileUrl = 'http://basemap.ru/service/tms/1.0.0/ooptrf_EPSG102012/{z}/{x}/{y}.png',
	attrib = '&copy; 2012 OpenStreetMap contributors, USGS',
	tilelayer = new L.Proj.TileLayer.TMS(tileUrl, crs, {
		maxZoom: 17
		,minZoom: 0
		,continuousWorld: true
		,attribution: attrib
	});

map.addLayer(tilelayer);
map.setView([70.568, 122.871], 4);
