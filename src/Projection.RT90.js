Proj4js.defs["EPSG:2400"] = "+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 +y_0=0.0 +proj=tmerc +ellps=bessel +units=m +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs";
Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

var rt90 = new Proj4js.Proj("EPSG:2400");
var wgs84 = new Proj4js.Proj("EPSG:4326");
 
L.Projection.RT90 = {
    MAX_LATITUDE: 85.0840591556,

    R_MINOR: 6356752.3142,
    R_MAJOR: 6378137,

    project: function (/*LatLng*/latlng) /*-> Point*/{

        var latlng_ = new Proj4js.Point(latlng.lng, latlng.lat);
        Proj4js.transform(wgs84, rt90, latlng_);
        var p = new L.Point(latlng_.x, latlng_.y);
        return p;

    },

    unproject: function (/*Point*/point, /*Boolean*/unbounded) /*-> LatLng*/{
        var point_ = new Proj4js.Point(point.x, point.y);
        Proj4js.transform(rt90, wgs84, point_);

        var l = new L.LatLng(point_.y, point_.x);
        return l;

    }
};
