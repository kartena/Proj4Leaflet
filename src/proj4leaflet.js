(function(factory) {
	var L, proj4;
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['leaflet', 'proj4'], factory);
	} else if (typeof module === 'object' && typeof module.exports === "object") {
		// Node/CommonJS
		L = require('leaflet');
		proj4 = require('proj4');
		module.exports = factory(L, proj4);
	} else {
		// Browser globals
		if (typeof window.L === 'undefined' || typeof window.proj4 === 'undefined')
			throw 'Leaflet and proj4 must be loaded first';
		factory(window.L, window.proj4);
	}
}(function (L, proj4) {
	if (proj4.__esModule && proj4.default) {
		// If proj4 was bundled as an ES6 module, unwrap it to get
		// to the actual main proj4 object.
		// See discussion in https://github.com/kartena/Proj4Leaflet/pull/147
		proj4 = proj4.default;
	}

	L.Proj = {};

	L.Proj._isProj4Obj = function(a) {
		return (typeof a.inverse !== 'undefined' &&
			typeof a.forward !== 'undefined');
	};

	L.Proj.Projection = L.Class.extend({
		initialize: function(code, def, bounds) {
			var isP4 = L.Proj._isProj4Obj(code);
			this._proj = isP4 ? code : this._projFromCodeDef(code, def);
			this.bounds = isP4 ? def : bounds;
		},

		project: function (latlng) {
			var point = this._proj.forward([latlng.lng, latlng.lat]);
			return new L.Point(point[0], point[1]);
		},

		unproject: function (point, unbounded) {
			var point2 = this._proj.inverse([point.x, point.y]);
			return new L.LatLng(point2[1], point2[0], unbounded);
		},

		_projFromCodeDef: function(code, def) {
			if (def) {
				proj4.defs(code, def);
			} else if (proj4.defs[code] === undefined) {
				var urn = code.split(':');
				if (urn.length > 3) {
					code = urn[urn.length - 3] + ':' + urn[urn.length - 1];
				}
				if (proj4.defs[code] === undefined) {
					throw 'No projection definition for code ' + code;
				}
			}

			return proj4(code);
		}
	});

	L.Proj.CRS = L.Class.extend({
		includes: L.CRS,

		options: {
			transformation: new L.Transformation(1, 0, -1, 0)
		},

		initialize: function(a, b, c) {
			var code,
				proj,
				def,
				options;

			if (L.Proj._isProj4Obj(a)) {
				proj = a;
				code = proj.srsCode;
				options = b || {};

				this.projection = new L.Proj.Projection(proj, L.bounds(options.bounds));
			} else {
				code = a;
				def = b;
				options = c || {};
				this.projection = new L.Proj.Projection(code, def, L.bounds(options.bounds));
			}

			L.Util.setOptions(this, options);
			this.code = code;
			this.transformation = this.options.transformation;

			if (this.options.origin) {
				var first = this.options.origin[0];

				if (this._isArray(first)) {
					this._createTransformations(this.options.origin);
				} else {
					this.transformation =
						new L.Transformation(1, -this.options.origin[0],
							-1, this.options.origin[1]);
				}
			}

			if (this.options.scales) {
				this._scales = this.options.scales;
			} else if (this.options.resolutions) {
				this._scales = [];
				for (var i = this.options.resolutions.length - 1; i >= 0; i--) {
					if (this.options.resolutions[i]) {
						this._scales[i] = 1 / this.options.resolutions[i];
					}
				}
			}

			this.infinite = !L.bounds(this.options.bounds);

		},

		// override Leaflet function?
		latLngToPoint: function(latlng, zoom) {
			var projectedPoint = this.projection.project(latlng);
			var transformation = this._getTransformationByZoom(zoom);
			var scale = this.scale(zoom);

			return transformation._transform(projectedPoint, scale);
		},

		// override Leaflet function?
		pointToLatLng: function(point, zoom) {
			var scale = this.scale(zoom);
			var transformation = this._getTransformationByZoom(zoom);
			var untransformedPoint = transformation.untransform(point, scale);

			return this.projection.unproject(untransformedPoint);
		},

		// override Leaflet function?
		getProjectedBounds: function(zoom) {
			if (this.infinite) { return null; }

			var transformation = this._getTransformationByZoom(zoom);

			var b = this.projection.bounds,
				s = this.scale(zoom),
				min = transformation.transform(b.min, s),
				max = transformation.transform(b.max, s);

			return new Bounds(min, max);
		},

		scale: function(zoom) {
			var iZoom = Math.floor(zoom),
				baseScale,
				nextScale,
				scaleDiff,
				zDiff;
			if (zoom === iZoom) {
				return this._scales[zoom];
			} else {
				// Non-integer zoom, interpolate
				baseScale = this._scales[iZoom];
				nextScale = this._scales[iZoom + 1];
				scaleDiff = nextScale - baseScale;
				zDiff = (zoom - iZoom);
				return baseScale + scaleDiff * zDiff;
			}
		},

		zoom: function(scale) {
			// Find closest number in this._scales, down
			var downScale = this._closestElement(this._scales, scale),
				downZoom = this._scales.indexOf(downScale),
				nextScale,
				nextZoom,
				scaleDiff;
			// Check if scale is downScale => return array index
			if (scale === downScale) {
				return downZoom;
			}
			if (downScale === undefined) {
				return -Infinity;
			}
			// Interpolate
			nextZoom = downZoom + 1;
			nextScale = this._scales[nextZoom];
			if (nextScale === undefined) {
				return Infinity;
			}
			scaleDiff = nextScale - downScale;
			return (scale - downScale) / scaleDiff + downZoom;
		},

		distance: L.CRS.Earth.distance,

		R: L.CRS.Earth.R,

		/* Get the closest lowest element in an array */
		_closestElement: function(array, element) {
			var low;
			for (var i = array.length; i--;) {
				if (array[i] <= element && (low === undefined || low < array[i])) {
					low = array[i];
				}
			}
			return low;
		},

		/* Determines if incoming parameter is an Array */
		_isArray: Array.isArray || function(arr) {
			return Object.prototype.toString.call(arr) === '[object Array]';
		},

		/* creates transformations based on origins */
		_createTransformations: function(origins) {
			this._transformations = [];

			for (var i = 0, len = origins.length; i < len; i++) {
				var origin = origins[i];

				var trans = new L.Transformation(1, -origin[0], -1, origin[1]);
				this._transformations.push(trans);
			}
		},

		/** returns L.Transformation object based on zoom */
		_getTransformationByZoom: function(zoom) {
			if (!this._transformations) {
				return this.transformation;
			}

			// should we create interpolated transformation if zoom isn't integer?
			// if so then we should return the result of L.Transformation' _transform function
			// instead of creating L.Transformation objects
			var iZoom = Math.floor(zoom);
			var lastIdx = this._transformations.length - 1;

			return this._transformations[iZoom > lastIdx ? lastIdx : iZoom];
		}
	});

	L.Proj.GeoJSON = L.GeoJSON.extend({
		initialize: function(geojson, options) {
			this._callLevel = 0;
			L.GeoJSON.prototype.initialize.call(this, geojson, options);
		},

		addData: function(geojson) {
			var crs;

			if (geojson) {
				if (geojson.crs && geojson.crs.type === 'name') {
					crs = new L.Proj.CRS(geojson.crs.properties.name);
				} else if (geojson.crs && geojson.crs.type) {
					crs = new L.Proj.CRS(geojson.crs.type + ':' + geojson.crs.properties.code);
				}

				if (crs !== undefined) {
					this.options.coordsToLatLng = function(coords) {
						var point = L.point(coords[0], coords[1]);
						return crs.projection.unproject(point);
					};
				}
			}

			// Base class' addData might call us recursively, but
			// CRS shouldn't be cleared in that case, since CRS applies
			// to the whole GeoJSON, inluding sub-features.
			this._callLevel++;
			try {
				L.GeoJSON.prototype.addData.call(this, geojson);
			} finally {
				this._callLevel--;
				if (this._callLevel === 0) {
					delete this.options.coordsToLatLng;
				}
			}
		}
	});

	L.Proj.geoJson = function(geojson, options) {
		return new L.Proj.GeoJSON(geojson, options);
	};

	L.Proj.ImageOverlay = L.ImageOverlay.extend({
		initialize: function (url, bounds, options) {
			L.ImageOverlay.prototype.initialize.call(this, url, null, options);
			this._projectedBounds = bounds;
		},

		// Danger ahead: Overriding internal methods in Leaflet.
		// Decided to do this rather than making a copy of L.ImageOverlay
		// and doing very tiny modifications to it.
		// Future will tell if this was wise or not.
		_animateZoom: function (event) {
			var scale = this._map.getZoomScale(event.zoom);
			var northWest = L.point(this._projectedBounds.min.x, this._projectedBounds.max.y);
			var offset = this._projectedToNewLayerPoint(northWest, event.zoom, event.center);

			L.DomUtil.setTransform(this._image, offset, scale);
		},

		_reset: function () {
			var zoom = this._map.getZoom();
			var pixelOrigin = this._map.getPixelOrigin();
			var bounds = L.bounds(
				this._transform(this._projectedBounds.min, zoom)._subtract(pixelOrigin),
				this._transform(this._projectedBounds.max, zoom)._subtract(pixelOrigin)
			);
			var size = bounds.getSize();

			L.DomUtil.setPosition(this._image, bounds.min);
			this._image.style.width = size.x + 'px';
			this._image.style.height = size.y + 'px';
		},

		_projectedToNewLayerPoint: function (point, zoom, center) {
			var viewHalf = this._map.getSize()._divideBy(2);
			var newTopLeft = this._map.project(center, zoom)._subtract(viewHalf)._round();
			var topLeft = newTopLeft.add(this._map._getMapPanePos());

			return this._transform(point, zoom)._subtract(topLeft);
		},

		_transform: function (point, zoom) {
			var crs = this._map.options.crs;
			var transformation = crs.transformation;
			var scale = crs.scale(zoom);

			return transformation.transform(point, scale);
		}
	});

	L.Proj.imageOverlay = function (url, bounds, options) {
		return new L.Proj.ImageOverlay(url, bounds, options);
	};

	return L.Proj;
}));
