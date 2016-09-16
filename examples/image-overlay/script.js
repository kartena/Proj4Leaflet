var crs = new L.Proj.CRS('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs', {
        resolutions: [21674.7100160867, 10837.35500804335, 5418.677504021675, 2709.3387520108377, 1354.6693760054188, 677.3346880027094,
            338.6673440013547, 169.33367200067735, 84.66683600033868, 42.33341800016934, 21.16670900008467, 10.583354500042335,
            5.291677250021167, 2.6458386250105836, 1.3229193125052918, 0.6614596562526459, 0.33072982812632296, 0.16536491406316148],
        origin: [-2500000, 9045984]
    }
);

var map = L.map('map', {
    crs: crs,
    center: [60, 10],
    zoom: 14
});

L.tileLayer('https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBasis/MapServer/tile/{z}/{y}/{x}').addTo(map);

L.Proj.imageOverlay('https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheGraatone/MapServer/export' +
    '?bbox=220461.84450009145,6661489.40861154,222115.49415195954,6662415.4521056535' +
    '&size=1250,700&dpi=96&format=png24&transparent=true&bboxSR=25833&imageSR=25833&f=image',
    L.bounds([220461.84450009145, 6661489.40861154], [222115.49415195954, 6662415.4521056535])).addTo(map);
