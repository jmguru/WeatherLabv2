
'use strict';

//Test remote edit

const express = require('express');
var mysql      = require('mysql');

// Constants
const PORT = 8080;

var assert = require ('assert');

var zip=""
var ts=""
var temp=0
var hum=0
var bar=0
var rain=0.0
var wspd=0.0
var wdir=""

const app = express();
app.get('/process_get', function (req, res) {

    zip=req.query.zip;
    ts=req.query.ts;
    temp=req.query.temp;
    hum=req.query.hum;
    bar=req.query.bar;
    rain=req.query.rain;
    wspd=req.query.wspd;
    wdir=req.query.wdir;

    var connection = mysql.createConnection({
      host     : 'gigi',
      user     : 'wluser',
      password : '1234',
      database : 'weatherrepo'
    });

    connection.connect();

    var post  = {
      zip: zip,
      ts: '2016-08-17 12:00:00',
      temp: temp,
      hum: hum,
      bar: bar,
      rain: rain,
      wspd: wspd,
      wdir: wdir
    };

    var sql = 'INSERT INTO weatherdata (zip,ts,temp,hum,bar,rain,wspd,wdir) ' +
          'VALUES (' + '\"' + zip + '\"' + ',' + '\'' + ts + '\'' + ',' + temp + ',' + hum + ',' + bar + ',' +
          rain + ',' + wspd + ',' + '\"' + wdir + '\"' + ')';

    connection.query(sql);

    connection.end();
    res.send("OK");
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

