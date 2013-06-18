var crs = new L.Proj.CRS('EPSG:2193',
	'+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	{
		origin: [-4020900, 19998100],
		resolutions: [
		  4233.341800016934, 
	      2116.670900008467, 
	      1587.5031750063501, 
	      1058.3354500042335,
	       793.7515875031751,
	       529.1677250021168,
	       264.5838625010584, 
	       132.2919312505292,
	        66.1459656252646,
	        33.0729828126323, 
	        19.843789687579378, 
	        13.229193125052918,
	         5.291677250021167,
	         2.6458386250105836,
	         1.3229193125052918,
	         0.6614596562526459
		]
	});

var	map = new L.Map('map', {
	crs: crs,
	scale: function(zoom) {
		return 1 / res[zoom];
	},
	continuousWorld: true,
	worldCopyJump: false
});

var tileUrl = 'http://services.arcgisonline.co.nz/arcgis/rest/services/Generic/newzealand/MapServer/tile/{z}/{y}/{x}',
	attrib = 'Eagle Technology Group Ltd And LINZ &copy; 2012',
	tilelayer = new L.TileLayer(tileUrl, {
		maxZoom: 15,
		minZoom: 0,
		continuousWorld: true,
		attribution: attrib,
		tms: false
	});

map.addLayer(tilelayer);
map.setView([-41.288889, 174.777222], 13);

function onMapMouseMove(e) {
//	console.log("xy: " + e.latlng);
}

map.on('mousemove', onMapMouseMove);
