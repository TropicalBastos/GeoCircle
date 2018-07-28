require('mocha');
var should = require('should');
const assert = require('assert');
const GeoCircle = require('../lib/geo-circle');
const LatLng = require('../lib/latlng');

describe('GeoCircle Tests', () => {
    
    it('Should throw TypeError if missing first three arguments', done => {
        try{
            var geoCircle = new GeoCircle();
            var geoCircle = new GeoCircle(52.0000);
            var geoCircle = new GeoCircle(52.000, -0.00001);
        }catch(e){
            assert(e instanceof TypeError);
        }
        done();
    });

    it('Should throw error if incorrect data array is supplied', done => {
        try{
            var geoCircle = new GeoCircle(52.000, -0.00001, [{item: 1}, {item: 2}]);
        }catch(e){
            if(e !== null){
                done();
            }
        }
    });

    it('Should not throw error if correct arguments and data supplied', done => {
        var hasError = false;
        var data = [
            { latlng: { lat: 52.000, lng: -0.00001 } },
            { latlng: { lat: 52.000, lng: -0.00001 } }
        ];
        try{
            var geoCircle = new GeoCircle(52.000, -0.00001, data);
        }catch(e){
            console.log(e);
            hasError = true;
        }
        assert(!hasError);
        done();
    });

    it('Should correctly construct the GeoCircle object', done => {
        var hasError = false;
        var data = [
            { test: { lat: 52.000, lng: -0.00001 } },
            { test: { lat: 52.000, lng: -0.00001 } }
        ];
        try{
            var geoCircle = new GeoCircle(52.000, -0.00001, data, 'test');
        }catch(e){
            hasError = true;
        }
        assert(!hasError);
        should(geoCircle.data[0].latlng.lat).be.equal(data[0].test.lat);
        done();
    });

    it('#sort() Should correctly sort the data array in acsending|descending order', done => {
        var data = [
            {
                "id": 0,
                "organization": "B",
                latlng: {
                    lat: 34.000,
                    lng: -0.9999
                }
            },
            {
                "id": 1,
                "organization": "A",
                latlng: {
                    lat: 52.000,
                    lng: -0.00001
                }
            }
        ];
        var geoCircle = new GeoCircle(52.000, -0.00001, data);
        geoCircle.sort('organization', GeoCircle.SORT_DESCENDING);
        var first = geoCircle.data[0];
        var last = geoCircle.data[1];
        should(first.organization).be.equal('A');
        should(last.organization).be.equal("B");

        var geoCircle = new GeoCircle(52.000, -0.00001, data);
        geoCircle.sort('organization', GeoCircle.SORT_ASCENDING);
        var first = geoCircle.data[0];
        var last = geoCircle.data[1];
        should(first.organization).be.equal('B');
        should(last.organization).be.equal("A");
        done();
    });

    it('#setGeoCircleWithin() Data returned should always be within a given kilometre area', done => {
        const data = [
            {
                name: "A",
                latlng: {
                    lat: 52.277409,
                    lng: -0.8779359
                }
            },
            {
                name: "B",
                latlng: {
                    lat: -34.9285,
                    lng: 138.6007
                }
            },
            {
                name: "C",
                latlng: {
                    lat: 32.949702599999,
                    lng: -84.0383625
                }
            },
            {
                name: "D",
                latlng: {
                    lat: 32.949702599999,
                    lng: -84.0383625
                }
            }
        ]

        /** Northamptonshire area coords */
        geoCircle = new GeoCircle(52.277409, -0.877935999999977, data);
        geoCircle.setGeoCircleWithin(100);
        var first = geoCircle.data[0];
        should(first.name).be.equal('A');
        should(geoCircle.data.length).below(2);

        /** Southern Australia */
        geoCircle = new GeoCircle(-34.9285, 138.6007, data);
        geoCircle.setGeoCircleWithin(30);
        var first = geoCircle.data[0];
        should(first.name).be.equal('B');
        should(geoCircle.data.length).below(2);

        /** North Carolina - USA */
        geoCircle = new GeoCircle(32.94970259999999, -84.0383625, data);
        geoCircle.setGeoCircleWithin(100);
        var first = geoCircle.data[0];
        var second = geoCircle.data[1];
        should(first.name).be.equal('C');
        should(second.name).be.equal('D');
        should(geoCircle.data.length).above(1);
        done();
    });

    it('#toString() Should output the GeoCircle string in the correct format', done => {
        var data = [ 
            { latlng: { lat: 52.101, lng: -100.0002 } },
            { name: "Test", latlng: { lat: -34.224, lng: 98.0001 } },
        ];
        var d1 = data[0];
        var d2 = data[1];
        var g1 = new GeoCircle(000000, 00000, [d1]);
        var g2 = new GeoCircle(000000, 00000, [d2]);
        var output1 = g1.toString();
        var output2 = g2.toString();
        should(output1).be.equal('Latitude: 52.10100 | Longitude: -100.00020\n');
        should(output2).be.equal('name: Test | Latitude: -34.22400 | Longitude: 98.00010\n');
        done();
    });

    it('#getData() Should get GeoCircle\'s internal data', done => {
        var data = [ 
            { latlng: { lat: 52.101, lng: -100.0002 } },
            { name: "Test", latlng: { lat: -34.224, lng: 98.0001 } },
        ];
        var geoCircle = new GeoCircle(34.0000, -130.0001, data);
        var internalData = geoCircle.getData();
        should(internalData[0].latlng.lat).be.equal(52.101);
        should(internalData[0].latlng.lng).be.equal(-100.0002);
        should(internalData[1].latlng.lat).be.equal(-34.224);
        should(internalData[1].latlng.lng).be.equal(98.0001);
        should(internalData[1].name).be.equal("Test");
        done();
    });

    it('#setData() Should set GeoCircle\'s internal data', done => {
        var data = [ 
            { latlng: { lat: 52.101, lng: -100.0002 } },
            { name: "Test", latlng: { lat: -34.224, lng: 98.0001 } },
        ];
        var geoCircle = new GeoCircle(34.0000, -130.0001, [{latlng: {lat: 0, lng: 0}}]);
        var internalData = geoCircle.setData(data);
        should(internalData[0].latlng.lat).be.equal(52.101);
        should(internalData[0].latlng.lng).be.equal(-100.0002);
        should(internalData[1].latlng.lat).be.equal(-34.224);
        should(internalData[1].latlng.lng).be.equal(98.0001);
        should(internalData[1].name).be.equal("Test");
        done();
    });

});