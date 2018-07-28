require('mocha');
const assert = require('assert');
const LatLng = require('../lib/latlng');

describe('LatLng tests', () => {

    it('Should correctly construct the LatLng object', done => {
        const latlng = new LatLng(52.001, -48.999);
        assert(latlng.lat === 52.001);
        assert(latlng.lng === -48.999);
        done();
    });

    it('#getLatLngFromCoordsString() Should return the correct LatLng object from coordinates passed', done => {
        var latlng = LatLng.getLatLngFromCoordsString("52.001000, -0.000010");
        should(latlng.lat).be.equal(parseFloat(52.001));
        should(latlng.lng).be.equal(parseFloat(-0.00001));

        latlng = LatLng.getLatLngFromCoordsString("101.010,16.02310");
        should(latlng.lat).be.equal(parseFloat(101.01));
        should(latlng.lng).be.equal(parseFloat(16.0231));
        done();
    });

});