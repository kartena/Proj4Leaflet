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
		expect(pp.x).toBeCloseTo(1398776, 0);
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

	it('size from bounds', function() {
		var resolutions = [2, 1, 0.5],
			crs = new L.Proj.CRS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs', {
				bounds: L.bounds([0, 0], [4000, 5000]),
				resolutions: resolutions,
				origin: [0, 5000]
			}),
		    worldSize = 256,
		    i,
		    bounds;

		for (i = 0; i < resolutions.length; i++) {
			bounds = crs.getProjectedBounds(i);
			expect(bounds.max.x).toBe(4000 / resolutions[i]);
			expect(bounds.max.y).toBe(5000 / resolutions[i]);
			worldSize *= 2;
		}
	});
	it('convert zoom to scale and viceversa and return the same values', function () {
		 var crs = new L.Proj.CRS('EPSG:3006',
				'+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
		{
			resolutions: [
				8192, 4096, 2048, 1024, 512, 256, 128,
				64, 32, 16, 8, 4, 2, 1, 0.5
			]
		});
		
		expect(crs.zoom(crs.scale(8.9578457485))).toBe(8.9578457485);
		expect(crs.zoom(crs.scale(8))).toBe(8);
		expect(crs.zoom(crs.scale(1/8191))).toBeCloseTo(1/8191, 6);
		expect(crs.zoom(crs.scale(0.5))).toBe(0.5);
		expect(crs.zoom(crs.scale(0.51))).toBe(0.51);
	});
});
