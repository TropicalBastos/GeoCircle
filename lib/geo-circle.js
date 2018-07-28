const utils = require('@tropicalbastos/clone-js');
const LatLng = require('./latlng');

/**
 * Module Constants
 */
const COORDS_DELIMITER = ',';
const RADIUS_OF_EARTH = 6371;
const SORT_ASCENDING = 'ASC';
const SORT_DESCENDING = 'DESC';
const KEY_LATLNG = 'latlng';

/**
 * Number utilities
 */
if (typeof(Number.prototype.toRadians) === "undefined") {

    /**
     * @summary Converts numeric degrees to radians
     * @returns {Number} Reference to the current number
     */
    Number.prototype.toRadians = function() {
      return this * Math.PI / 180;
    }
}

/**
 * @summary Creates a GeoCircle object
 * 
 * @public
 * @constructor
 * 
 * @param {Number} lat - Number representing the latitude
 * @param {Number} long - Number representing the longitude
 * @param {Array} data - internal workable data
 * @param {String} key - The latitude and longitude object key for each item in the data array
 * @throws {TypeError}
 */
function GeoCircle(lat, long, data, key = KEY_LATLNG){
    try{
        if(lat === undefined || long === undefined || data === undefined){
            throw new TypeError('Too few arguments passed to GeoCircle');
        }
    }catch(e){
        console.log(e.name + ': ' + e.message);
        return false;
    }
    this.lat = lat;
    this.long = long;
    /** Its always important to create deep copies of objects ;) */
    var pureData = utils.deepClone(data);
    pureData.forEach((item, index) => {
        if(item[key] === undefined || item[key] === null){
            throw new Error('Every item in the data array has to have a LatLng object');
        }else{
            if(!item[key].hasOwnProperty('lat') || !item[key].hasOwnProperty('lng')){
                throw new Error('The item with index' + index + 
                ' in the data array does not have a correct LatLng object')
            }
        }
        const lat = parseFloat(item[key].lat);
        const lng = parseFloat(item[key].lng);
        item.latlng = new LatLng(lat, lng);
        if(key !== undefined && key !== KEY_LATLNG)
            delete item[key];
    });
    this.data = pureData;
}

/**
 * @summary Sorts the member data array in ascending or descending order
 * 
 * @public
 * @method
 * 
 * @param {String} key The key in the data member array to sort by
 * @param {String} order The order to sort the array by, supports ASC and DESC
 * @return {GeoCircle} The current instance with sorted partners in ascending order
 */
GeoCircle.prototype.sort = function(key, order = SORT_DESCENDING){
    if(order !== SORT_ASCENDING && order !== SORT_DESCENDING)
        throw new Error("Must supply a valid order to GeoCircle.prototype.sort");
    this.data = this.data.sort((a, b) => {
        const dataKey1 = a[key].toLowerCase(),
              dataKey2 = b[key].toLowerCase();
        switch(order){
            case SORT_ASCENDING:
                if(dataKey1 < dataKey2) return 1;
                if(dataKey1 > dataKey2) return -1;
                break;
            case SORT_DESCENDING:
                if(dataKey1 > dataKey2) return 1;
                if(dataKey1 < dataKey2) return -1;
                break;
        }
        return 0;
    });
    return this;
}

/**
 * @summary Extracts the coordinates from a string
 * 
 * @protected
 * @method
 * 
 * @param {String} coords Example: '52.0000,-0.1400000'
 * @return {Object} { lat: 52.0000, lng: -0.1400 }
 */
GeoCircle.prototype.getCoordsFromCoordsString = function(coords) {
    var latlng = coords.split(COORDS_DELIMITER);
    return {
        lat: parseFloat(latlng[0]),
        lng: parseFloat(latlng[1])
    };
};

/**
 * @summary Filters the member data array to all items with latlng objects
 *  within the km distance passed
 * 
 * @public
 * @method
 * 
 * @param {Number} km - The number of kilometeres in area to search
 * @return {GeoCircle} - The current instance with a modified data array
 */
GeoCircle.prototype.setGeoCircleWithin = function(km) {
    var self = this;
    this.data = this.data.filter(item => {
        const latlng = item.latlng;
        var differenceLat = (self.lat - latlng.lat).toRadians();
        var differenceLng = (self.long - latlng.lng).toRadians();
        var a = 
            Math.sin(differenceLat / 2) * Math.sin(differenceLat / 2) +
            Math.sin(differenceLng / 2) * Math.sin(differenceLng / 2) *
            Math.cos(self.lat.toRadians()) * Math.cos(latlng.lat);
        /** Convert those pesky negative numbers into usable absolutes otherwise it produces NaN's */
        if(a < 0){
            a = -a;
            a = Math.pow(a, 0.5);
        }
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = RADIUS_OF_EARTH * c;
        return d <= km;
    });
    return this;
}

/**
 * @summary Outputs the internal data into human readable string
 * 
 * @public
 * @method
 * 
 * @return {String} The line separated latlng info
 */
GeoCircle.prototype.toString = function(){
    var out = '';
    this.data.forEach(item => {
        for(key in item){
            if(key === KEY_LATLNG)
                break;
            out += `${key}: ${item[key]} | `;
        }
        out += `Latitude: ${item.latlng.lat.toFixed(5)} | Longitude: ${item.latlng.lng.toFixed(5)}\n`;
    });
    return out;
}

/**
 * Attach static constants to export
 */
GeoCircle.SORT_ASCENDING = SORT_ASCENDING;
GeoCircle.SORT_DESCENDING = SORT_DESCENDING

module.exports = GeoCircle;