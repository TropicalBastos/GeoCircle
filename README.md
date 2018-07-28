# Geo Circle

This is a lightweight geo utility package that can extract all of the latitudes and longitude coords within an array of data within a user-defined km circle area

## Installation

Installation is with npm : `npm install geocircle --save`

## Usage

Firstly you'd have to create A `GeoCircle` object and pass it the correct parameters. In your array of data you need to have a latlng object of anatomy `{ lat: 34.0001, lng: -33.1111 }` by default the key latlng is used but you can specify a user-defined key for example `coords` as the fourth argument to the `GeoCircle` constructor.

```javascript
const GeoCircle = require('geocircle');

const data = [
    {
        name: "A",
        coords: {
            lat: 52.000,
            lng: -33.500
        }
    },
    {
        name: "B",
        coords: {
            lat: -34.9285,
            lng: 138.6007
        }
    }
];

var geoCircle = new GeoCircle(52.000, -33.000, data, 'coords');
geoCircle.setGeoCircleWithin(100) //within 100km
console.log(geoCircle.toString()) // name: A | Latitude: 52.00000 | Longitude: -33.50000
```

## Method Reference

| Method             | Summary                                                                                          |
|--------------------|--------------------------------------------------------------------------------------------------|
| setGeoCircleWithin | Filters the internal data array to only the coordinates within the km radius provided as a param |
| sort               | `(key, sort = SORT_DESCENDING)` Sorts the internal data by key and by asc or desc                |
| toString           | Returns a human readable string representation of the internal data                              |