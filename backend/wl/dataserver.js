var mymodel = require('./models/mymodel.js');
var util = require('util');
const express = require('express');

// Constants
const PORT = 8090;

const app = express();
app.get('/getdata', function (req, res) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  mymodel.getCurrentData( (results) => {
    var jsonString = JSON.stringify(results);
    res.send(jsonString);
  });
});

app.get('/getdataset', function (req, res) {

  var prefix = req.query.prefix;
  var type = req.query.type;
  var span = req.query.span;

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  mymodel.getParameter(prefix, type, span, (results) => {
    var jsonString = JSON.stringify(results);
    res.send(jsonString);
  });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
