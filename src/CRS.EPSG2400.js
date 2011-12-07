
L.CRS.EPSG2400 = L.Util.extend({}, L.CRS, {
    code: 'EPSG:2400',

    projection: L.Projection.RT90,
    // transformation: new L.Transformation(0.5/Math.PI, 0.5, -0.5/Math.PI, 0.5),
    transformation:new L.Transformation(1, 0, -1, 0),

    project: function (/*LatLng*/latlng)/*-> Point*/{
               
        var projectedPoint = this.projection.project(latlng),
        earthRadius = 6378137;
        return projectedPoint;// .multiplyBy(earthRadius);
        
    }
});
