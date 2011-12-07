(function (global) { 
  var projection = function (code, def) {
    if (typeof(def) !== 'undefined') {
      Proj4js.defs[code] = def;
    }
    var proj = new Proj4js.Proj(code);
    return {
      project: function (/*LatLng*/latlng) /*-> Point*/{
        var latlng_ = new Proj4js.Point(latlng.lng, latlng.lat);
        Proj4js.transform(Proj4js.WGS84, proj, latlng_);
        return new L.Point(latlng_.x, latlng_.y);
      },

      unproject: function (/*Point*/point, /*Boolean*/unbounded) /*-> LatLng*/{
        var point_ = new Proj4js.Point(point.x, point.y);
        Proj4js.transform(proj, Proj4js.WGS84, point_);
        return new L.LatLng(point_.y, point_.x);
      }
    };
  };

  global.proj4leaflet = {
    crs: function (code, def) {
      return L.Util.extend({}, L.CRS, {
        code: code,
        projection: projection(code, def),
        transformation: new L.Transformation(1, 0, -1, 0),
        project: function (/*LatLng*/latlng) /*-> Point*/{
            return this.projection.project(latlng);
        }
      });
    }
  }
})(window);
