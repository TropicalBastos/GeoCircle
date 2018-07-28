require('mocha');
const assert = require('assert');
const LatLng = require('../lib/latlng');

describe('LatLng prototype tests', () => {

    it('Should correctly construct the LatLng object', done => {
        const latlng = new LatLng(52.001, -48.999);
        assert(latlng.lat === 52.001);
        assert(latlng.lng === -48.999);
        done();
    });

});