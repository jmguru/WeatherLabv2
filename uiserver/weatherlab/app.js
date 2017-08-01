// script.js

// create the module and name it scotchApp
var scotchApp = angular.module('weatherlab', ['ngRoute']);

//jmguru-000000
scotchApp.factory('myFactory', function ($http) {

  return {
        getAggData: function(type, span) {
            var query = 'http://gigi:8090/getdataset?span=' + span + '&type=' + type;

            return $http.get(query).then(function(response){
                return response.data;
            });
        }
  };

});

// configure our routes
scotchApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/current.html',
            controller  : 'mainController'
        })
        .when('/details', {
            templateUrl : 'pages/details.html',
            controller  : 'detailsController'
        })
});


// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function($http, $scope) {
  var self = this;

  $http.get('http://gigi:8090/getdata').then(function(response) {

    $scope.weatherdata = response.data;
    $scope.currdate = response.data[0].date;
    $scope.currzip = response.data[0].zip;
    $scope.currtemp = response.data[0].temp;
    $scope.currhum = response.data[0].hum;
    $scope.currbar = response.data[0].bar;
    $scope.currrain = response.data[0].rain;
    $scope.currwspd = response.data[0].wspd;
    $scope.currwdir = response.data[0].wdir;
  });
});

scotchApp.controller('detailsController', function($http, $scope, myFactory) {

  var self = this;

  $scope.title = 'Weather Details';
  $scope.TEMPERATURE_LABEL = 'Weather Timeline';

  $scope.tempCB = {
       mode : true
  };

  $scope.humCB = {
       mode : true
  };

  $scope.barCB = {
       mode : true
  };

  $scope.rainCB = {
       mode : true
  };

  $scope.wspdCB = {
       mode : true
  };

  $scope.type = {
      select: 'MAX'
  };

  $scope.span = {
      select: '1'
  };

  var dataset;
  var options;
  var graph2d;
  var groups = new vis.DataSet();
  var startD;
  var endD;
  var container = document.getElementById('visualtemp');

  // Initialize the graph
  myFactory.getAggData($scope.type.select,$scope.span.select).then(function(data) {

    startD = data[0].x;
    endD = data[data.length-1].x;

    groups.add({
      id: 1,
      content: 'Temperature',
      visible: true
    });
    groups.add({
      id: 2,
      content: 'Humidity',
      visible: true
    });
    groups.add({
      id: 3,
      content: 'Barometer',
      visible: true
    });
    groups.add({
      id: 4,
      content: 'Rain Level',
      visible: true
    });
    groups.add({
      id: 5,
      content: 'Wind Speed',
      visible: true
    });

    dataset = new vis.DataSet(data);

    options = {
       start: startD,
       end: endD,
       legend: true
    };

    graph2d = new vis.Graph2d(container, dataset, groups, options);
  });

  // Redraw onclick
  $scope.enableMode = function () {
    myFactory.getAggData($scope.type.select,$scope.span.select).then(function(data) {

      groups.update({id: 1, visible: $scope.tempCB.mode});
      groups.update({id: 2, visible: $scope.humCB.mode});
      groups.update({id: 3, visible: $scope.barCB.mode});
      groups.update({id: 4, visible: $scope.rainCB.mode});
      groups.update({id: 5, visible: $scope.wspdCB.mode});

      graph2d.setOptions({
         start: data[0].x,
         end: data[data.length-1].x
      });

      dataset.clear();
      dataset.update(data);
    });
  }

});
