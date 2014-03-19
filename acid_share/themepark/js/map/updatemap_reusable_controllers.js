'use strict';

/*
 * updatemap_reusable_controllers.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/11/2014
 */



function UpdateMap_Mixin( thePrototypeToMixIn, $scope, WaitTimesMgr, ParksModel) {




    /* Configurable constants */




    /* Contribute MixIn members to the prototype */
    (function( thePrototype) {

        /* Prototype members to be used as constants */

        thePrototype.PSWD_DEFAULT = "aaa";

        thePrototype.MILLISECONDS_MIN     = 100;
        thePrototype.MILLISECONDS_MAX     = 60000;
        thePrototype.MILLISECONDS_STEP    = 100;
        thePrototype.MILLISECONDS_DEFAULT = 2000;






        /* Prototype member properties */

        thePrototype.pswd         = null;
        thePrototype.milliseconds = null;
        thePrototype.millisecondsSlider = null;

        thePrototype._v_WaitTimesService   = null;

        thePrototype._v_Interval  = null;

        thePrototype._v_Updaters  = null;




        /* ************************
         Park model responsibility
         */
        thePrototype.parksHome = null;
        thePrototype.park = null;





        /* Supply essential context and parameters.
           Initialize private member properties.
        */
        var _pInit_UpdateMapMixin = function( theServiceURL, theApplicationId, thePark) {

            this.pswd          = this.PSWD_DEFAULT;
            this.milliseconds  = this.MILLISECONDS_DEFAULT;
            this.millisecondsSlider  = this.MILLISECONDS_DEFAULT;

            this._v_WaitTimesService    = new WaitTimesMgr.WaitTimes_Service_Constructor( theServiceURL, theApplicationId, thePark);

            this._v_Interval   = null;

            this._v_Updaters   = [ ];



            /* ************************
             Park model responsibility
             */
            this.parksHome = null;
            this.park      = null;


            this.parksHome   = new ParksModel.ParksHome_Constructor();

            ParksModel.pInitParkHomeSample( this.parksHome);

            /* Use the first Park in the parksHome.
             Multiple park support is not completed in the controller or view, but it is supported by the Model.
             There is no requirement to support multiple parks, but it seems a quite likely extension.
             */
            var someParks = this.parksHome.parks();
            if( someParks && someParks.length) {

                this.park = this.parksHome.parks()[ 0];
            }

        };
        thePrototype._pInit_UpdateMapMixin = _pInit_UpdateMapMixin;







        /* Register an updater as a party interested in being notified whenever new wait times become available.
        */
        var pRegisterUpdater = function( theUpdater) {
            if( !theUpdater || !(typeof theUpdater == "function")) {
                return;
            }

            this._v_Updaters.push( theUpdater);
        };
        thePrototype.pRegisterUpdater = pRegisterUpdater;







        /* Drop the interest previously registered for an updater as a party interested in being notified whenever new wait times become available.
        */
        var pUnRegisterUpdater = function( theUpdater) {
            if( !theUpdater || !(typeof theUpdater == "function")) {
                return;
            }

            var anUpdaterIndex = this._v_Updaters.indexOf( theUpdater);
            if( anUpdaterIndex < 0) {
                return;
            }

            this._v_Updaters.splice( anUpdaterIndex, 1);

            if( !this._v_Updaters.length) {
                $scope.waitTimesCtrl.pLogout();
            }
        };
        thePrototype.pUnRegisterUpdater = pUnRegisterUpdater;







        var pStartUpdates = function() {
            if( !this._v_WaitTimesService) {
                _pErrorAlert( "No service available");
                return;
            }

            var aPswd = this.pswd;
            if( !aPswd) {
                aPswd = this.PSWD_DEFAULT;
            }


            var aThis = this;
            var aRefreshTimesBoundFunction = aThis._pRefreshTimes.bind( aThis);

            this._v_WaitTimesService.pLogin(
                aPswd,
                function() {

                    var aMilliseconds = aThis.milliseconds;
                    if( !aMilliseconds || ( aMilliseconds < aThis.MILLISECONDS_MIN) || ( aMilliseconds > aThis.MILLISECONDS_MAX)) {
                        aMilliseconds = aThis.MILLISECONDS_DEFAULT;
                    }

                    aThis._v_Interval = setInterval(

                        /* Schedule to run under AngularJS digest loop */
                        function() {
                            $scope.$evalAsync ( function() {
                                aRefreshTimesBoundFunction();
                            });
                        },
                        aMilliseconds
                    );
                },
                _pErrorAlert
            );

        };
        thePrototype.pStartUpdates = pStartUpdates;






        var millisecondsChangedHandler = function() {

            var aMilliseconds = this.milliseconds;

            this.millisecondsSlider = aMilliseconds;

            this.pStopUpdates();
            this.pStartUpdates();
        };
        thePrototype.millisecondsChangedHandler = millisecondsChangedHandler;





        var millisecondsRangeChangedHandler = function() {

            var aMillisecondsSlider = this.millisecondsSlider;

            this.milliseconds = parseInt( aMillisecondsSlider);

            this.pStopUpdates();
            this.pStartUpdates();
        };
        thePrototype.millisecondsRangeChangedHandler = millisecondsRangeChangedHandler;








        var pStopUpdates = function() {
            if( !this._v_Interval) {
                return;
            }

            clearInterval( this._v_Interval);
            this._v_Interval = null;
        };
        thePrototype.pStopUpdates = pStopUpdates;






        var fIsUpdating = function() {
            return !( this._v_Interval == null);
        };
        thePrototype.fIsUpdating = fIsUpdating;




        var pAllWaitTimesRetrievedHandler = function( theResponse) {

            /* Notify all the interested parties: registered updaters
             */
            var aNumUpdaters = this._v_Updaters.length;

            for( var anUpdaterIndex = 0; anUpdaterIndex < aNumUpdaters; anUpdaterIndex++) {
                var anUpdater = this._v_Updaters[ anUpdaterIndex];
                if( anUpdater && (typeof anUpdater == "function")) {
                    anUpdater( theResponse);
                }
            }
        };




        var _pRefreshTimes = function( ) {

            var aThis = this;

            var anAllWaitTimesRetrievedHandler = pAllWaitTimesRetrievedHandler.bind( aThis);

            this._v_WaitTimesService.pRetrieveAllWaitTimes( anAllWaitTimesRetrievedHandler, this._pErrorAlert);
        };
        thePrototype._pRefreshTimes = _pRefreshTimes;





        var pLogout = function( ) {

            if( !this._v_WaitTimesService) {
                return;
            }

            this._v_WaitTimesService.pLogout();
        };
        thePrototype.pLogout = pLogout;






        var _pErrorAlert = function( theResponse) {
            var aMessage = "Error";
            if( theResponse) {
                aMessage += " " + theResponse;
            }
            console.log( aMessage);

            /* Modals to be opened out of the current event loop */
            setTimeout(
                function() {
                    alert( aMessage);
                },
                100
            );
        };
        thePrototype._pErrorAlert = _pErrorAlert;



    })( thePrototypeToMixIn);



}
