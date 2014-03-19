'use strict';

/*
 * WaitTimes_controllers.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/11/2014
 */



 angular.module('cmpinterviewjs').controller(
    'WaitTimesCtrl',
    [ '$scope', 'WaitTimesMgr', 'ParksModel',
function ( $scope, WaitTimesMgr, ParksModel) {




    /* Configurable constants */

    var SERVICE_URL    = "http://162.250.78.100/api/api.php";
    var APPLICATION_ID = "123456";
    var PARKNAME       = "SeaWorld";





    /* Define prototype. Has no prototype inheritance itself */
    var aWaitTimes_Controller_Prototype = (function() {

        var aPrototype = {};

        UpdateMap_Mixin( aPrototype, $scope, WaitTimesMgr, ParksModel);


        /* Supply essential context and parameters.
           Initialize private member properties.
        */
        var _pInit = function( theServiceURL, theApplicationId, thePark) {
            this._pInit_UpdateMapMixin( theServiceURL, theApplicationId, thePark);
        };
        aPrototype._pInit = _pInit;


        return aPrototype;

    })();





    /* Define constructor for instances with the prototype. */

    var WaitTimes_Controller_Constructor = function( theServiceURL, theApplicationId, thePark) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this.pswd = null;
        this.milliseconds = null;
        this.millisecondsSlider = null;

        this._v_Service   = null;

        this._v_Interval  = null;

        this._v_Updaters  = [ ];

        this.parksHome = null;
        this.park      = null;


        this._pInit( theServiceURL, theApplicationId, thePark);
    };
    WaitTimes_Controller_Constructor.prototype = aWaitTimes_Controller_Prototype;



    $scope.WaitTimes_Controller_Constructor = WaitTimes_Controller_Constructor;





    /* Decorate the $scope with an instance of the Controller
    */
    var aWaitTimes_Controller = new WaitTimes_Controller_Constructor(
        SERVICE_URL, APPLICATION_ID, PARKNAME
    );

    $scope.waitTimesCtrl = aWaitTimes_Controller;


}]);
