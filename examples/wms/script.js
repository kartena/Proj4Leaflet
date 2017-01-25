var crs = new L.Proj.CRS('EPSG:3006',
	'+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	{
		resolutions: [
			8192, 4096, 2048, 1024, 512, 256, 128,
			64, 32, 16, 8, 4, 2, 1, 0.5
		],
		origin: [0, 0]
	}),
	map = new L.Map('map', {
		crs: crs,
	});

L.tileLayer.wms('https://geodatatest.havochvatten.se/geoservices/ows', {
	layers: 'hav-bakgrundskartor:hav-grundkarta',
	format: 'image/png',
	maxZoom: 14,
	minZoom: 0,
	attribution: '&copy; OpenStreetMap contributors <a href="https://www.havochvatten.se/kunskap-om-vara-vatten/kartor-och-geografisk-information/karttjanster.html">Havs- och vattenmyndigheten (Swedish Agency for Marine and Water Management)</a>'
}).addTo(map);

map.setView([55.8, 14.3], 3);
