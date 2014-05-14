describe('L.Proj.Projection', function() {
	it('can create an instance from a SRS code and proj4 def', function() {
		new L.Proj.Projection(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');
	});
});

describe('L.Proj.CRS', function() {
	it('can create an instance from a SRS code and proj4 def', function() {
		var crs = new L.Proj.CRS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');

		expect(crs.code).toBe('EPSG:2400');
	});

	it('can project a coordinate to a point in the defined SRS', function() {
		var crs = new L.Proj.CRS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');

		var pp = crs.project(new L.LatLng(55.723337, 14.194313));
		expect(pp.x).toBeCloseTo(1398776, 0)
		expect(pp.y).toBeCloseTo(6178304, 0);
	});

	it('has a default transformation that is [1, 0, -1, 0]', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1]
		});
		var ll = new L.LatLng(1, 1),
			pp = crs.latLngToPoint(ll, 0),
			up = crs.pointToLatLng(pp, 0);

		expect(pp.x).toBe(ll.lng);
		expect(pp.y).toBe(-ll.lat);
		expect(up.lat).toBe(ll.lng);
		expect(up.lng).toBe(ll.lat);
	});

	it('uses provided zoom level scales', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			scales: [1, 2, 3]
		});
		var ll = new L.LatLng(1, 1);

		for (var i = 0; i < 3; i++) {
			var pp = crs.latLngToPoint(ll, i),
				up = crs.pointToLatLng(pp, i),
				s = i + 1;

			expect(pp.x).toBeCloseTo(ll.lng * s, 6);
			expect(pp.y).toBeCloseTo(-ll.lat * s, 6);
			expect(up.lat).toBeCloseTo(ll.lng, 6);
			expect(up.lng).toBeCloseTo(ll.lat, 6);
		}
	});

	it('uses provided zoom level resolutions', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1, 0.5, 1 / 3]
		});
		var ll = new L.LatLng(1, 1);

		for (var i = 0; i < 3; i++) {
			var pp = crs.latLngToPoint(ll, i),
				up = crs.pointToLatLng(pp, i),
				s = i + 1;

			expect(pp.x).toBeCloseTo(ll.lng * s, 6);
			expect(pp.y).toBeCloseTo(-ll.lat * s, 6);
			expect(up.lat).toBeCloseTo(ll.lng, 6);
			expect(up.lng).toBeCloseTo(ll.lat, 6);
		}
	});

	it('uses provided origin', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1],
			origin: [10, 10]
		});

		var ll = new L.LatLng(12, 12),
			pp = crs.latLngToPoint(ll, 0),
			up = crs.pointToLatLng(pp, 0);

		expect(pp.x).toBeCloseTo(ll.lng - 10, 6);
		expect(pp.y).toBeCloseTo(-ll.lat + 10, 6);
		expect(up.lat).toBeCloseTo(ll.lng, 6);
		expect(up.lng).toBeCloseTo(ll.lat, 6);
	});

	it('accepts custom transformation', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1],
			transformation: new L.Transformation(3, 0, 1, -5)
		});

		var ll = new L.LatLng(10, 10),
			pp = crs.latLngToPoint(ll, 0),
			up = crs.pointToLatLng(pp, 0);

		expect(pp.x).toBe(ll.lng * 3);
		expect(pp.y).toBe(ll.lat - 5);
		expect(up.lat).toBe(ll.lng);
		expect(up.lng).toBe(ll.lat);
	});

	it('legacy size', function() {
		var crs = new L.Proj.CRS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs'),
		    worldSize = 256,
		    i,
		    size;

		for (i = 0; i <= 22; i++) {
			size = crs.getSize(i);
			expect(size.x).toBe(worldSize);
			expect(size.y).toBe(worldSize);
			worldSize *= 2;
		}
	});

	it('size from bounds', function() {
		var resolutions = [2, 1, 0.5],
			crs = new L.Proj.CRS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs', {
				bounds: L.bounds([0, 0], [4000, 5000]),
				resolutions: resolutions,
				origin: [0, 4000]
			}),
		    worldSize = 256,
		    i,
		    size;

		for (i = 0; i < resolutions.length; i++) {
			size = crs.getSize(i);
			expect(size.x).toBe(4000 / resolutions[i]);
			expect(size.y).toBe(5000 / resolutions[i]);
			worldSize *= 2;
		}
	});
});

describe('L.Proj.CRS.TMS', function() {
	it('can create an instance from a SRS code and proj4 def', function() {
		var crs = new L.Proj.CRS.TMS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
			[50,50,100,100], {
				resolutions: [1],
			});

		expect(crs.code).toBe('EPSG:2400');
	});

	it('transformation to be set from projected bounds', function() {
		var crs = new L.Proj.CRS.TMS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
			[50,50,100,100], {
				resolutions: [1],
			}),
			t = crs.transformation;

		expect(t._a).toBe(1);
		expect(t._b).toBe(-50);
		expect(t._c).toBe(-1);
		expect(t._d).toBe(100)
	});

	it('can adjust bounds to align with tilegrid', function() {
		var resolutions = [6386.233628906251, 3193.1168144531257, 1596.5584072265628, 798.2792036132814, 399.1396018066407, 199.56980090332036, 99.78490045166018, 49.89245022583009],
			crs = new L.Proj.CRS.TMS('EPSG:900913',
				'+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
				[-851225.043, 6422198.546, 196550.197, 9691000.164],
				{
					resolutions: resolutions
				}
			),
			tileLayer = new L.Proj.TileLayer.TMS('http://test/{z}/{x}/{y}.png', crs),
			crs = tileLayer.crs,
			t = crs.transformation,
			upperLeft = new L.Point(-851225.043, 9691950.164),
			lowerLeft = new L.Point(-851225.043, 6422198.546),
			tp;

		for (i = 0; i < resolutions.length; i++) {
			// Mock a very stupid map
			tileLayer._map = {getZoom: function() { return i; }};

			tp = t.transform(upperLeft, crs.scale(i));
			expect(tp.x).toBeCloseTo(0, 6);
			expect(tp.y).toBeCloseTo(0, 6);

			tp = t.transform(lowerLeft, crs.scale(i));
			// Convert to a tile point
			tp.x = Math.round(tp.x / 256);
			// -1 since Leaflet uses tile's upper edge as reference
			tp.y = Math.round(tp.y / 256) - 1;
			expect(tileLayer.getTileUrl(tp)).toBe('http://test/' + i + '/0/0.png');
		}
	});

	it('calculates the correct size', function() {
		var resolutions = [1, 0.5, 0.25],
		    crs = new L.Proj.CRS.TMS(
		    	'EPSG:2400',
		    	'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
		    	'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
		    	'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
		    	[0, 0, 4000, 4000], {
		    		resolutions: resolutions
	    	}),
		    i,
		    size,
		    tileSize;

		for (i = 0; i < resolutions.length; i++) {
			size = crs.getSize(i);
			tileSize = resolutions[i] * 256;
			expect(size.x).toBe((Math.ceil(4000 / tileSize) * tileSize) / resolutions[i]);
			expect(size.y).toBe((Math.ceil(4000 / tileSize) * tileSize) / resolutions[i]);
		}
	});
});

describe('L.Proj.GeoJSON', function() {
	beforeEach(function() {
		proj4.defs('EPSG:3006', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
		proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs ');
	});

	it('handles named CRS', function() {
		var geojson = {
				'type': 'Point',
				'coordinates': [319180, 6399862],
				'crs': {
					'type': 'name',
					'properties': {
						'name': 'EPSG:3006'
					}
				}
			},
			options = {
				onEachFeature: function(f, l) {
					var ll = l.getLatLng();

					expect(ll.lat).toBeCloseTo(57.70451, 5);
					expect(ll.lng).toBeCloseTo(11.96526, 5);
				}
			};

		spyOn(options, 'onEachFeature');

		L.Proj.geoJson(geojson, options);
		expect(options.onEachFeature).toHaveBeenCalled();
	});

	it('handles legacy CRS', function() {
		var geojson = {
				'type': 'Point',
				'coordinates': [319180, 6399862],
				'crs': {
					'type': 'EPSG',
					'properties': {
						'code': 3006
					}
				}
			},
			options = {
				onEachFeature: function(f, l) {
					var ll = l.getLatLng();

					expect(ll.lat).toBeCloseTo(57.70451, 5);
					expect(ll.lng).toBeCloseTo(11.96526, 5);
				}
			};

		spyOn(options, 'onEachFeature');

		L.Proj.geoJson(geojson, options);
		expect(options.onEachFeature).toHaveBeenCalled();
	});

	it('handles missing CRS', function() {
		var geojson = {
				'type': 'Point',
				'coordinates': [11.96526, 57.70451]
			},
			options = {
				onEachFeature: function(f, l) {
					var ll = l.getLatLng();

					expect(ll.lat).toBeCloseTo(57.70451, 5);
					expect(ll.lng).toBeCloseTo(11.96526, 5);
				}
			};

		spyOn(options, 'onEachFeature');

		L.Proj.geoJson(geojson, options);
		expect(options.onEachFeature).toHaveBeenCalled();
	});

	it('throws on undefined CRS', function() {
		var geojson = {
				'type': 'Point',
				'coordinates': [319180, 6399862],
				'crs': {
					'type': 'name',
					'properties': {
						'name': 'PFGL:1337'
					}
				}
			};

		expect(function() { L.Proj.geoJson(geojson); }).toThrow();
	});

	it('handles data added with addData', function() {
		var geojson = {
				'type': 'Point',
				'coordinates': [319180, 6399862],
				'crs': {
					'type': 'name',
					'properties': {
						'name': 'EPSG:3006'
					}
				}
			},
			options = {
				onEachFeature: function(f, l) {
					var ll = l.getLatLng();

					expect(ll.lat).toBeCloseTo(57.70451, 5);
					expect(ll.lng).toBeCloseTo(11.96526, 5);
				}
			},
			l;

		spyOn(options, 'onEachFeature');

		l = L.Proj.geoJson(geojson, options);
		l.addData(geojson);

		expect(options.onEachFeature).toHaveBeenCalled();
	});

	it('handles FeatureCollection', function() {
		var geojson = {
				'type':'FeatureCollection',
				'features': [
					{
						'type':'Feature',
						'id':'pand',
						'geometry':{'type':'MultiPolygon','coordinates':[[[[234038.74,580648.672],[234034.874,580653.938],[234023.226,580669.804],[234018.279,580668.348],[234008.066,580665.342],[234012.423,580654.134],[234008.164,580652.906],[234010.63,580640.48],[234038.74,580648.672]]]]},
						'properties':{}
					}
				],
				'crs':{'type':'EPSG','properties':{'code':'28992'}}
			},
			options = {
				onEachFeature: function(f, l) {
					var ll = l.getLatLngs();

					expect(ll[0].lat).toBeCloseTo(53.2081, 5);
					expect(ll[0].lng).toBeCloseTo(6.5711, 5);
				}
			},
			l;

		spyOn(options, 'onEachFeature');

		l = L.Proj.geoJson(geojson, options);
		l.addData(geojson);

		expect(options.onEachFeature).toHaveBeenCalled();
		expect(l.options.coordsToLatLng).toBeFalsy();
	});

	it('defaults to WGS84 after feature with CRS', function() {
		var geojson1 = {
				'type':'FeatureCollection',
				'features': [
					{
						'type':'Feature',
						'id':'pand',
						'geometry':{'type':'MultiPolygon','coordinates':[[[[234038.74,580648.672],[234034.874,580653.938],[234023.226,580669.804],[234018.279,580668.348],[234008.066,580665.342],[234012.423,580654.134],[234008.164,580652.906],[234010.63,580640.48],[234038.74,580648.672]]]]},
						'properties':{}
					}
				],
				'crs':{'type':'EPSG','properties':{'code':'28992'}}
			},
			geojson2 = {
				'type': 'Point',
				'coordinates': [11.5, 57.5],
			},
			i = 0,
			options = {
				onEachFeature: function(f, l) {
					if (i === 1) {
						var ll = l.getLatLng();

						expect(ll.lat).toBe(57.5);
						expect(ll.lng).toBe(11.5);
					}

					i++;
				}
			},
			l;

		spyOn(options, 'onEachFeature').andCallThrough();

		l = L.Proj.geoJson(geojson1, options);
		l.addData(geojson2);

		expect(options.onEachFeature).toHaveBeenCalled();
		expect(l.options.coordsToLatLng).toBeFalsy();
	});

	it('handles FeatureCollection with multiple features properly', function() {
		var options = {
				onEachFeature: function(f, l) {
					function assertLatLngs(latlngs) {
						var latlng,
						    i;
						for (i = 0; i < latlngs.length; i++) {
							latlng = latlngs[i];
							if (L.Util.isArray(latlng)) {
								assertLatLngs(latlng);
							} else {
								expect(latlng.lat).toBeGreaterThan(-90);
								expect(latlng.lat).toBeLessThan(90);
								expect(latlng.lng).toBeGreaterThan(-180);
								expect(latlng.lng).toBeLessThan(180);
							}
						}
					}

					assertLatLngs((l.getLatLngs && l.getLatLngs()) || (l.getLatLng && [l.getLatLng()]));
				}
			},
			spy = spyOn(options, 'onEachFeature').andCallThrough(),
			l;

		proj4.defs('EPSG:3006', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
		l = L.Proj.geoJson(featureCollection, options); // from test-data.js

		expect(options.onEachFeature).toHaveBeenCalled();
		expect(spy.callCount).toBe(3);
	});
});

describe('legacy API', function() {
	it('can create a CRS from L.Proj function', function() {
		var crs = L.CRS.proj4js(
		    'EPSG:2400',
		    '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
		    '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
		    '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');
		var pp = crs.project(new L.LatLng(55.723337, 14.194313));
		expect(pp.x).toBeCloseTo(1398776, 0);
		expect(pp.y).toBeCloseTo(6178304, 0);
		expect(crs.code).toBe('EPSG:2400');
	});
});
