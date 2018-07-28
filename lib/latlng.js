
/** LatLng Object Prototype
 * 
 * @summary core object anatomy of the internal data of GeoCircle
 * @see GeoCircle
 * 
 * @param {*} lat 
 * @param {*} lng 
 */
function LatLng(lat, lng){
    this.lat = lat;
    this.lng = lng
};

/**
 * @summary Extracts the coordinates from a string
 * 
 * @static
 * @method
 * 
 * @param {String} coords Example: '52.0000,-0.1400000'
 * @return {LatLng} { lat: 52.0000, lng: -0.1400 }
 */
LatLng.getLatLngFromCoordsString = function(coords) {
    var latlng = coords.split(',');
    const lat = latlng[0], lng = latlng[1];
    return new LatLng(parseFloat(lat), parseFloat(lng));
};

module.exports = LatLng;