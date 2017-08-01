var mysql      = require('mysql');
var dateFormat = require('dateformat');
var async = require('async');


// jmguru
exports.getCurrentData = function (cb) {

  var connection = mysql.createConnection({
    host     : 'gigi',
    user     : 'wluser',
    password : '1234',
    database : 'weatherrepo'
  });

  connection.connect();

  connection.query('SELECT DATE_FORMAT(ts, "%d %b %Y - %T") AS date,zip,temp,hum,bar,rain,wspd,wdir from weatherdata order by wl_id DESC LIMIT 1', [], function (error, results, fields) {
    //if (error) throw error;
    if(error) {
      var error = new Error("Sorry");
      return cb(error);
    }
    cb(results,null);
  });

  connection.end();

}



exports.getParameter = function (prefix, type, span, cb) {

  var connection = mysql.createConnection({
    host     : 'gigi',
    user     : 'wluser',
    password : '1234',
    database : 'weatherrepo'
  });

  connection.connect();

  async.waterfall(
    [
      (next) => {
        connection.query(getQuery('temp',type, span), [], function (error, results, fields) {
          if(error) {
            var error = new Error("Sorry");
            return cb(error);
          }
          for(i=0;i<results.length;i++) {
            results[i].group = 1;
          }
          next(null,results);
        });
      },

      (results2,next) => {
        connection.query(getQuery('hum',type, span), [], function (error, results, fields) {
          if(error) {
            console.log(error)
            return cb(error);
          }
          for(i=0;i<results.length;i++) {
            results[i].group = 2;
          }
          next(null,results.concat(results2));
        });
      },

      (results2,next) => {
        connection.query(getQuery('bar',type, span), [], function (error, results, fields) {
          if(error) {
            console.log(error)
            return cb(error);
          }
          for(i=0;i<results.length;i++) {
            results[i].group = 3;
          }
          next(null,results.concat(results2));
        });
      },

      (results2,next) => {
        connection.query(getQuery('rain',type, span), [], function (error, results, fields) {
          if(error) {
            console.log(error)
            return cb(error);
          }
          for(i=0;i<results.length;i++) {
            results[i].group = 4;
          }
          next(null,results.concat(results2));
        });
      },

      (results2,next) => {
        connection.query(getQuery('wspd',type, span), [], function (error, results, fields) {
          if(error) {
            console.log(error)
            return cb(error);
          }
          for(i=0;i<results.length;i++) {
            results[i].group = 5;
          }
          next(null,results.concat(results2));
        });
      }

      ],
      (err,results) => {
          console.log(results);
          cb(results,null);
          connection.end();
      }
   );
}

function getQuery(prefix, type, span) {
  return ('SELECT DATE_FORMAT(ts, "%Y-%m-%d") AS x, ' + type + '(' + prefix + ') AS y from weatherdata where DATE_FORMAT(ts, "%Y-%m-%d") > DATE_SUB(NOW(), INTERVAL '+ span +' WEEK) group by x order by x');
}

function getFormattedDateRange (off1,off2) {
  var day1 = new Date();
  day1.setDate(day1.getDate() - off1);
  day1 = dateFormat(day1,'yyyy-mm-dd');

  var day2 = new Date();
  day2.setDate(day2.getDate() - off2);
  day2 = dateFormat(day2,'yyyy-mm-dd');

  var rangeObj = {
    startDate: day1,
    endDate: day2
  }

  return rangeObj;
}
