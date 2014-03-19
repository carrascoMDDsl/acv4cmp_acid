'use strict';

/*
 * app.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/11/2014
 */

angular.module('cmpinterviewjs',
    [
        'ngRoute',
        '$strap.directives',
        'ui.bootstrap',
        'mongolabResourceHttp',
        'notificationWidget',
        'ngGrid',
        'ui.codemirror',
        'kineticNgServices',
        'mapcanvasServicesSupplier',
        'highlightrecommendationServicesSupplier',
        'waittimesServicesSupplier',
        'bracketsCheckerServiceSupplier',
        'shortestpathServiceSupplier',
        'parkPathsServiceSupplier',
        'tabsServiceSupplier',
        'parksModel'
    ]
);




angular.module('cmpinterviewjs').config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/welcome',              {templateUrl: 'partials/welcome.html',              controller: 'VoidCtrl'}).
      when('/credits',              {templateUrl: 'partials/credits.html',              controller: 'VoidCtrl'}).
      when('/map',                  {templateUrl: 'partials/map.html',                  controller: 'WaitTimesCtrl'}).
      when('/recommendation',       {templateUrl: 'partials/recommendation.html',       controller: 'RecommendationCtrl'}).
      when('/compatibility',        {templateUrl: 'partials/compatibility.html',        controller: 'VoidCtrl'}).
      when('/diagrams',             {templateUrl: 'partials/diagrams.html',             controller: 'DiagramsCtrl'}).
      when('/programs',             {templateUrl: 'partials/programs.html',             controller: 'ProgramsCtrl'}).
      when('/brackets',             {templateUrl: 'partials/brackets.html',             controller: 'BracketsCtrl'}).
      when('/objects',              {templateUrl: 'partials/objects.html',              controller: 'ObjectsCtrl'}).
      when('/technologies',         {templateUrl: 'partials/technologies.html',         controller: 'VoidCtrl'}).

      otherwise({redirectTo: '/welcome'});
}]);
