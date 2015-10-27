/*
Example using Sweden Lantmäteriet Topografisk Webbkarta
http://www.lantmateriet.se/globalassets/kartor-och-geografisk-information/geodatatjanster/tekn_beskrivningar/tb_twkvisningvccby_v1.0.pdf
*/
var crs = new L.Proj.CRS('EPSG:3006',
	'+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	{
		resolutions: [
			4096, 2048, 1024, 512, 256, 128,64, 32
		],
		origin: [-1200000.000000, 8500000.000000 ],
		bounds:  L.bounds( [-1200000.000000, 8500000.000000], [4305696.000000, 2994304.000000])
	}),
	map = new L.Map('map', {
		crs: crs,
		continuousWorld: true,
	});

new L.TileLayer('http://maps-open.lantmateriet.se/open/topowebb-ccby/v1/wmts/1.0.0/topowebb/default/3006/{z}/{y}/{x}.png', {
	maxZoom: 7,
	minZoom: 0,
	continuousWorld: true,
	attribution: '&copy; <a href="http://www.lantmateriet.se/en/">Lantmäteriet</a> Topografisk Webbkarta Visning, CCB',
}).addTo(map);
//Set view over Stockholm Södermalm
map.setView([59.3167, 18.0667], 7);
