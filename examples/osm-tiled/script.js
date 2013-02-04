var crs = new L.Proj4js.CRS('EPSG:2400',
	'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 '
	+ '+x_0=1500000.0 +y_0=0.0 +proj=tmerc +ellps=bessel '
	+ '+units=m '
	+ '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
	{
		resolutions: [
			8192, 4096, 2048, 1024, 512, 256, 128,
			64, 32, 16, 8, 4, 2, 1, 0.5
		],
		origin: [0, 0]
	});

var	map = new L.Map('map', {
	crs: crs,
	continuousWorld: true,
	worldCopyJump: false
});

var mapUrl = 'http://api.geosition.com/tile/lmv/{z}/{x}/{y}.png',
	attrib = 'Map data &copy; 2011 Lantmäteriet, Imagery &copy; 2011 Kartena',
	tilelayer = new L.TileLayer(mapUrl, {
		maxZoom: 14
		,minZoom: 0
		,continuousWorld: true
		,attribution: attrib
	});

var b = new Billing.Leaflet(map,
							"github-demo",
							"lmv",
							parseInt(Math.random() * 10000000),
							window.location.hostname,
							window.location.href);
map.addLayer(tilelayer);
map.setView([57.704, 11.965], 13);
