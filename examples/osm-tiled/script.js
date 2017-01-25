var crs = new L.Proj.CRS('EPSG:3006',
	'+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	{
		resolutions: [
			8192, 4096, 2048, 1024, 512, 256, 128,
			64, 32, 16, 8, 4, 2, 1, 0.5
		],
		origin: [0, 0],
		bounds: L.bounds([218128.7031, 6126002.9379], [1083427.2970, 7692850.9468])
	}),
	map = new L.Map('map', {
		crs: crs,
	});

L.tileLayer('https://api.geosition.com/tile/osm-bright-3006/{z}/{x}/{y}.png', {
	maxZoom: 14,
	minZoom: 0,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, Imagery &copy; <a href="http://www.kartena.se/">Kartena</a>'
}).addTo(map);

map.setView([57.704, 11.965], 13);
