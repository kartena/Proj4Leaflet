/*
Example using Sweden Lantmäteriet Topografisk Webbkarta
https://opendata.lantmateriet.se/#apis
*/

/*** INSERT YOUR LANTMÄTERIET API TOKEN BELOW ***/
var token = '';

var crs = new L.Proj.CRS('EPSG:3006',
	'+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	{
		resolutions: [
			4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8
		],
		origin: [-1200000.000000, 8500000.000000 ],
		bounds:  L.bounds( [-1200000.000000, 8500000.000000], [4305696.000000, 2994304.000000])
	}),
	map = new L.Map('map', {
		crs: crs,
		continuousWorld: true,
	});

new L.TileLayer('https://api.lantmateriet.se/open/topowebb-ccby/v1/wmts/token/'+ token +'/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=topowebb&STYLE=default&TILEMATRIXSET=3006&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng', {
	maxZoom: 9,
	minZoom: 0,
	continuousWorld: true,
	attribution: '&copy; <a href="https://www.lantmateriet.se/en/">Lantmäteriet</a> Topografisk Webbkarta Visning, CCB',
}).addTo(map);
//Set view over Stockholm Södermalm
map.setView([59.3167, 18.0667], 7);
