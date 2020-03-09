'use strict'
var Geohash = require('ngeohash');
let fs = require("fs");
let data = []
const x = require('./data.json')

for(var i = 0; i < x.length; i++){
	let precision = 4;
	if(x[i]['Province/State'].length == 0){
		precision = 3
	}
	let geohash = Geohash.encode(x[i]['Latitude'], x[i]['Longitude'], precision)
	let at_datetime = x[i]['Last Update'].slice(0,19).slice(0, 19).replace('T', ' ')
	let infection_probability = 100;
    if(x[i]['Confirmed'] > 0){
	let ob = {}
		ob = {
            location_name: (x[i]['Province/State'].length == 0) ? x[i]['Country/Region'] : x[i]['Province/State'] + ", " +x[i]['Country/Region'],
			location_geohash : geohash,
			at_datetime : at_datetime,
			infection_probability: 100,
			confirmed: x[i]['Confirmed']
		}
		data.push(ob);
    }
}


fs.writeFile('./newdata.json', JSON.stringify({data:data}), err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})