
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

		expect(crs.code).to.be('EPSG:2400');
	});

	it('can project a coordinate to a point in the defined SRS', function() {
		var crs = new L.Proj.CRS(
			'EPSG:2400',
			'+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
			'+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
			'+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs');

		var pp = crs.project(new L.LatLng(55.723337, 14.194313));
		expect(pp.x).to.be.within(1398775, 1398777);
		expect(pp.y).to.be.within(6178303, 6178305);
	});

	it('has a default transformation that is [1, 0, -1, 0]', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1]
		});
		var ll = new L.LatLng(1, 1),
			pp = crs.latLngToPoint(ll, 0),
			up = crs.pointToLatLng(pp, 0);

		expect(pp.x).to.be(ll.lng);
		expect(pp.y).to.be(-ll.lat);
		expect(up.lat).to.be(ll.lng);
		expect(up.lng).to.be(ll.lat);
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

			expect(pp.x).to.be(ll.lng * s);
			expect(pp.y).to.be(-ll.lat * s);
			expect(up.lat).to.be(ll.lng);
			expect(up.lng).to.be(ll.lat);

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
			expect(pp.x).to.be(ll.lng * s);
			expect(pp.y).to.be(-ll.lat * s);
			expect(up.lat).to.be(ll.lng);
			expect(up.lng).to.be(ll.lat);

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

		expect(pp.x.toPrecision(6)).to.be((ll.lng - 10).toPrecision(6));
		expect(pp.y.toPrecision(6)).to.be((-ll.lat + 10).toPrecision(6));
		expect(up.lat.toPrecision(6)).to.be(ll.lng.toPrecision(6));
		expect(up.lng.toPrecision(6)).to.be(ll.lat.toPrecision(6));

	});

	it('accepts custom transformation', function() {
		var crs = new L.Proj.CRS('EPSG:4326', '', {
			resolutions: [1],
			transformation: new L.Transformation(3, 0, 1, -5)
		});

		var ll = new L.LatLng(10, 10),
			pp = crs.latLngToPoint(ll, 0),
			up = crs.pointToLatLng(pp, 0);

		expect(pp.x).to.be(ll.lng * 3);
		expect(pp.y).to.be(ll.lat - 5);
		expect(up.lat).to.be(ll.lng);
		expect(up.lng).to.be(ll.lat);
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
			expect(bounds.max.x).to.be(4000 / resolutions[i]);
			expect(bounds.max.y).to.be(5000 / resolutions[i]);
			worldSize *= 2;
		}
	});

	it('converts zoom to scale and vice versa and returns the same values', function () {
		 var crs = new L.Proj.CRS('EPSG:3006',
				'+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
		{
			resolutions: [
				8192, 4096, 2048, 1024, 512, 256, 128,
				64, 32, 16, 8, 4, 2, 1, 0.5
			]
		});
		
		expect(crs.zoom(crs.scale(8.9578457485))).to.be(8.9578457485);
		expect(crs.zoom(crs.scale(8))).to.be(8);
		expect(crs.zoom(crs.scale(1/8191)).toPrecision(6)).to.be((1/8191).toPrecision(6));
		expect(crs.zoom(crs.scale(0.5))).to.be(0.5);
		expect(crs.zoom(crs.scale(0.51))).to.be(0.51);
	});

	it('converts scale to zoom and returns Infinity if the scale passed in is bigger than maximum scale', function () {
		var crs = new L.Proj.CRS('EPSG:3006', '', {
			scales: [1, 2, 3]
		});

		expect(crs.zoom(4)).to.be(Infinity);
		expect(crs.zoom(Infinity)).to.be(Infinity);
	});

	it('tests that distance works (L.CRS.Earth.Distance)', function testDistance() {
		var crs = new L.Proj.CRS('EPSG:3006', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
			scales: [1, 2, 3]
		});
		
		expect(
			crs.distance(
				crs.unproject(new L.Point(218128, 6126002)), 
				crs.unproject(new L.Point(218128, 6126003))))
				.to.be.within(0.9, 1);
		
		expect(
			crs.distance(new L.LatLng(57.777, 11.9), new L.LatLng(57.778, 11.9)))
			.to.be.within(111.194, 111.195);

	});
});
