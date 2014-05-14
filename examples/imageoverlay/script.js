var res = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420];

var RD2 = new L.Proj.CRS.TMS(
        'EPSG:28992',
        '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999],
    {
            resolutions: res
    });


var map = L.map('map', {crs:RD2}).setView([52.479, 5.24545], 7);

L.tileLayer('http://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png', {
    tms: true
}).addTo(map);


L.Proj.imageOverlay('http://geo.flevoland.nl/arcgis/rest/services/Groen_Natuur/Agrarische_Natuur/MapServer/export?format=png24&transparent=true&f=image&bboxSR=28992&imageSR=28992&layers=show%3A0&bbox=145323.20011251318%2C475418.56045463786%2C175428.80013969325%2C499072.9604685671&size=560%2C440',
	L.bounds([145323.20011251318, 475418.56045463786], [175428.80013969325, 499072.9604685671])).addTo(map);