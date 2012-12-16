L.CRS.proj4js = (function () {
	var createProjection = function (code, def, /*L.Transformation*/ transformation) {
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
				var point2 = Proj4js.transform(proj, Proj4js.WGS84, point.clone());
				return new L.LatLng(point2.y, point2.x, unbounded);
			}
		};
	};

	return function (code, def, transformation) {
		return L.Util.extend({}, L.CRS, {
			code: code,
			transformation: transformation ? transformation: new L.Transformation(1, 0, -1, 0),
			projection: createProjection(code, def)
		});
	};
}());

L.TileLayer.Proj4TMS = L.TileLayer.extend({
	options: {
		tms: true,
		continuousWorld: true,
	},

	initialize: function(urlTemplate, options) {
		L.TileLayer.prototype.initialize.call(this, urlTemplate, options);
	},

	getTileUrl: function(tilePoint) {
		var projectedTileSize = (this.options.tileSize / this._map.options.crs.scale(this._map.getZoom())),
			gridHeight = Math.round((this.options.projectedBounds[3] - this.options.projectedBounds[1]) / projectedTileSize);

		// TODO: relies on some of TileLayer's internals
		return L.Util.template(this._url, L.Util.extend({
			s: this._getSubdomain(tilePoint),
			z: this._getZoomForUrl(),
			x: tilePoint.x,
			y: gridHeight - tilePoint.y - 1
		}, this.options));	}
});