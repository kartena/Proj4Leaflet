L.CRS.proj4js = (function () {
	var createProjection = function (code, def) {
		if (typeof(def) !== 'undefined') {
			Proj4js.defs[code] = def;
		}
		var proj = new Proj4js.Proj(code);
		return {
			project: function (latlng) {
				var projPoint = new Proj4js.Point(latlng.lng, latlng.lat);
				Proj4js.transform(Proj4js.WGS84, proj, projPoint);
				return new L.Point(projPoint.x, projPoint.y);
			},

			unproject: function (point, unbounded) {
				var projPoint = new Proj4js.Point(point.x, point.y);
				Proj4js.transform(proj, Proj4js.WGS84, projPoint);
				return new L.LatLng(projPoint.y, projPoint.x, unbounded);
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
