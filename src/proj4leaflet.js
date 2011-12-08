L.CRS.proj4js = (function () {
	var createProjection = function (code, def) {
		if (typeof(def) !== 'undefined') {
			Proj4js.defs[code] = def;
		}
		var proj = new Proj4js.Proj(code);
		return {
			project: function (latlng) {
				var point = new L.Point(latlng.lng, latlng.lat);
				return Proj4js.transform(Proj4js.WGS84, proj, point);
			},

			unproject: function (point, unbounded) {
				Proj4js.transform(proj, Proj4js.WGS84, point);
				return new L.LatLng(point.y, point.x, unbounded);
			}
		};
	};

	var transformation = new L.Transformation(1, 0, -1, 0);

	return function (code, def) {
		return L.Util.extend({}, L.CRS, {
			code: code,
			transformation: transformation,
			projection: createProjection(code, def)
		});
	};
}());
