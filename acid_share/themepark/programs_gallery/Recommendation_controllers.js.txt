'use strict';

/*
 * Recommendation_controllers.js
 *
 * A Javascript exercise.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/11/2014
 */





angular.module('cmpinterviewjs').controller(
    'RecommendationCtrl',
    [ '$scope', 'WaitTimesMgr', 'ParksModel', 'ParkPaths', 'HighlightRecommendationMgr',
function ( $scope, WaitTimesMgr, ParksModel, ParkPaths, HighlightRecommendationMgr) {




    /* Configurable constants */

    var SERVICE_URL    = "http://162.250.78.100/api/api.php";
    var APPLICATION_ID = "123456";
    var PARKNAME       = "SeaWorld";





    /* Define prototype. Has no prototype inheritance itself */
    var aRecommendation_Controller_Prototype = (function() {

        var aPrototype = {};


        UpdateMap_Mixin( aPrototype, $scope, WaitTimesMgr, ParksModel);


        /* Prototype members to be used as constants */



        aPrototype.WAITTIME_NOTRECEIVED_SORTSENTINEL = 1000000;


        /* UI contract constants */

        /* http://en.wikipedia.org/wiki/Walking
         Specific studies have found pedestrian walking speeds ranging from
         4.51 kilometres per hour (2.80 mph) 4510/3600 = 1.25 m/s to 4.75 kilometres per hour (2.95 mph) =1.3 m/s for older individuals
         and from 5.32 kilometres per hour (3.31 mph) = 1.48 m/s to 5.43 kilometres per hour (3.37 mph) = 1.5 m/s for younger individuals;
         a brisk walking speed can be around 6.5 kilometres per hour (4.0 mph) = 1.8 m/s.
         Champion racewalkers can average more than 14 kilometres per hour (8.7 mph) = 3.9 m/s over a distance of 20 kilometres (12 mi).
         An average human child achieves independent walking ability at around 11 months old.
         */
        aPrototype.WALKINGSPEED_OPTIONS = [
            { label: "Children, elder or impaired", value: 1},
            { label: "Older individuals",           value: 1.3},
            { label: "Younger individuals",         value: 1.5},
            { label: "Brisk walking pace",          value: 1.8},
            { label: "Race walker",                 value: 3.9}
        ];



        aPrototype.HIGHTLIGHTPATH_SVG_ID = "highlightpath_svg_id";


        /* Prototype member properties */

        aPrototype._v_Map  = null;

        aPrototype._v_LastKnownWaitTimes = null;






        /* ************************
        Paths responsibility
        */

        aPrototype._v_ParkPaths = null;

        aPrototype.currentAttraction    = null;
        aPrototype.pathsFromAttraction  = null;





        /* ************************
         Recommendation responsibility
         */
        aPrototype.walkingSpeed   = null;
        aPrototype.recommendation   = null;



        /* ************************
         Highlight path responsibility
         */

        aPrototype._v_HighlighRecommendationService = null;








        /* Supply essential context and parameters.
         Initialize private member properties.
         */
        var _pInit = function( theServiceURL, theApplicationId, thePark) {

            this._pInit_UpdateMapMixin( theServiceURL, theApplicationId, thePark);




            this._v_Map  = null;

            this._v_LastKnownWaitTimes = {};


            /* ************************
             Paths responsibility
            */

            this._v_ParkPaths = null;

            this.currentAttraction   = null;
            this.pathsFromAttraction = null;


            if( this.park) {
                /* Obtain an instance to compute Paths between Attractions in the Park
                */
                this._v_ParkPaths = new ParkPaths.ParkPaths_Constructor( this.park);
            }


            /* ************************
             Recommendation responsibility
            */

            this.walkingSpeed   = this.WALKINGSPEED_OPTIONS[ 0].value;
            this.recommendation = null;


            /* ************************
             Highlight path responsibility
             */

            this._v_HighlighRecommendationService = new HighlightRecommendationMgr.HighlightRecommendation_Service_Constructor( this.HIGHTLIGHTPATH_SVG_ID);
        };
        aPrototype._pInit = _pInit;









        /* Register and pass to recommendation graphics service
        the Map able to resolve coordinates for graphics of Attractions, Crossings and Roads.
        */
        var pRegisterMap = function( theMap) {
            if( !theMap) {
                return;
            }

            this._v_Map = theMap;

            if( this._v_HighlighRecommendationService) {
                this._v_HighlighRecommendationService.pUseMap( this._v_Map);
            }
        };
        aPrototype.pRegisterMap = pRegisterMap;







        var pAllWaitTimesRetrievedHandler = function( theResponse) {

            this._pMergeLastKnownWaitTimes( theResponse);

            this._pRefreshRecommendation();

            this._pUpdateHighlightRecommendation();

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
        aPrototype._pRefreshTimes = _pRefreshTimes;







        var _pMergeLastKnownWaitTimes = function( theJustReceivedWaitTimes) {
            if( !theJustReceivedWaitTimes) {
                return;
            }

            if( !this.park) {
                return;
            }

            var someAttractions = this.park.attractions();
            var aNumAttractions = someAttractions.length;

            for( var anIndex=0; anIndex < aNumAttractions; anIndex++) {

                var anAttraction = someAttractions[ anIndex];

                var anAttractionName = anAttraction.attractionName();

                var aWaitTime = 0;
                if( theJustReceivedWaitTimes.waitTimes.hasOwnProperty( anAttractionName)) {

                    aWaitTime = theJustReceivedWaitTimes.waitTimes[ anAttractionName];

                    if( aWaitTime) {
                        this._v_LastKnownWaitTimes[ anAttractionName] = {
                            timeOfDay: theJustReceivedWaitTimes.timeOfDay,
                            waitTime:  aWaitTime
                        };
                    }
                }
            }
        };
        aPrototype._pMergeLastKnownWaitTimes = _pMergeLastKnownWaitTimes;








        /* ************************
         Paths responsibility
        */

        /* Reacts to Users selection of the current Attraction location, from which to recommend other Attractions
        */
        var currentAttractionChangedHandler = function() {

            this._pRefreshPathsFromAttraction();
            this._pRefreshTimes();
        };
        aPrototype.currentAttractionChangedHandler = currentAttractionChangedHandler;










        /* Updates the list of paths to other Attractions, after selection of an Attraction or list order.
         Requests from the shortestpath service the computation of the shortest paths to all other attractions.
         Sorts the Paths according to the selected criteria.
        */
        var _pRefreshPathsFromAttraction = function() {

            this.pathsFromAttraction = [];
            if( !this.currentAttraction) {
                return;
            }

            this.pathsFromAttraction = this._v_ParkPaths.fPathsFromAttraction( this.currentAttraction);
        };
        aPrototype._pRefreshPathsFromAttraction = _pRefreshPathsFromAttraction;








        /* ************************
         Recommendation responsibility
         */





        /* Reacts to Users selection of an Attraction to show paths to other Attractions
         */
        var walkingSpeedChangedHandler = function() {

            this._pRefreshTimes();
        };
        aPrototype.walkingSpeedChangedHandler = walkingSpeedChangedHandler;








         /* Updates the list of paths to other Attractions,
         after selection of an origin Attraction, or selection of list ordering criteria.
         Delegates in the shortestpath service the computation of the shortest paths to all other attractions.
         Sorts the Paths according to the selected criteria.
         */
        var _pRefreshRecommendation = function() {

            this.recommendation     = null;

            if( !this.pathsFromAttraction) {
                return;
            }

            if( this.pathsFromAttraction.length < 2) {
                this.recommendation     = this.pathsFromAttraction[ 0];
                return;
            }

            if( !this._v_LastKnownWaitTimes) {
                return;
            }


            var aWalkingSpeed = this.walkingSpeed;
            if( !aWalkingSpeed) {
                aWalkingSpeed = this.WALKINGSPEED_OPTIONS[ 0].value;
            }

            var aThis = this;
            var somePathsToSort = this.pathsFromAttraction.map( function( thePath) {
                var aPathAttraction = thePath.attraction;

                var aWalkingTime = _fSecondsToMinutes( thePath.totalLength / aWalkingSpeed);
                var aWaitTime    = aThis._fWaitTimeForAttraction( aPathAttraction);
                if( aWaitTime <= 0) {
                    aWaitTime = aThis.WAITTIME_NOTRECEIVED_SORTSENTINEL;
                    console.log( "No wait time received yet for attraction " + aPathAttraction.attractionName());
                }
                var aTotalTime   = aWalkingTime + aWaitTime;
                return [ thePath, aTotalTime, aWalkingTime, aWaitTime];
            });

            var someSortedPaths = somePathsToSort.sort( function( theOnePathAndTime, theOtherPathAndTime) {
                return theOnePathAndTime[ 1] - theOtherPathAndTime[ 1];
            });

            this.recommendation = _fNewVoidRecommendation();
            this.recommendation.path        = someSortedPaths[ 0][ 0];
            this.recommendation.timeToEnjoy = someSortedPaths[ 0][ 1];
            this.recommendation.timeToWalk  = someSortedPaths[ 0][ 2];
            this.recommendation.timeToWait  = someSortedPaths[ 0][ 3];
            this.recommendation.enjoyTime   = someSortedPaths[ 0][ 1];
        };
        aPrototype._pRefreshRecommendation = _pRefreshRecommendation;






        var _fNewVoidRecommendation = function() {
            return {
                path:      null,
                timeToEnjoy: null,
                timeToEnjoy_Minutes: null,
                enjoyTime: null,
                enjoyTime_Minutes: null,
                timeToWalk: null,
                timeToWalk_Minutes: null,
                timeToWait: null,
                timeToWait_Minutes: null,
                toString: function() {
                    var anOriginAttractionName = "?";
                    if( this.path && this.path.originAttraction) {
                        anOriginAttractionName = this.path.originAttraction.attractionName();
                    }

                    var aAttractionName = "?";
                    if( this.path && this.path.attraction) {
                        aAttractionName = this.path.attraction.attractionName();
                    }
                    return "Recommendation from Attraction " + anOriginAttractionName + " to " + aAttractionName;
                }
            }
        };







        var _fSecondsToMinutes = function( theSeconds) {
            if( !theSeconds) {
                return 0;
            }

            var aMinutes = Math.round( theSeconds / 60);
            if( !aMinutes) {
                aMinutes = 1;
            }

            return aMinutes;
        };







        /* Return the wait time for the supplied attraction from last Wait times result if already received from the server.
        */
        var _fWaitTimeForAttraction = function( theAttraction) {

            var aWaitTime = -1;

            if( !theAttraction) {
                return aWaitTime;
            }

            if( !this._v_LastKnownWaitTimes) {
                return aWaitTime;
            }

            var anAttractionName = theAttraction.attractionName();

            if( !this._v_LastKnownWaitTimes.hasOwnProperty( anAttractionName)) {
                return aWaitTime;
            }

            aWaitTime = this._v_LastKnownWaitTimes[ anAttractionName].waitTime;

            return aWaitTime;
        };
        aPrototype._fWaitTimeForAttraction = _fWaitTimeForAttraction;









        /* ************************
        Highlight path responsibility
        */


        /* Update by delegating into the Highlight Path service.
         */
        var _pUpdateHighlightRecommendation = function() {

            if( !this._v_HighlighRecommendationService) {
                return;
            }

            this._v_HighlighRecommendationService.pUpdateHighlightRecommendation( this.recommendation);
        };
        aPrototype._pUpdateHighlightRecommendation = _pUpdateHighlightRecommendation;





        return aPrototype;

    })();








    /* Define constructor for instances with the prototype. */

    var Recommendation_Controller_Constructor = function( theServiceURL, theApplicationId, thePark) {

        /* Init object layout with member properties ASAP for the benefit of JIT */



        this._v_Map  = null;

        this._v_LastKnownWaitTimes = null;




        /* ************************
         Paths responsibility
        */

        this._v_ParkPaths = null;

        this.currentAttraction   = null;
        this.pathsFromAttraction = null;


        /* ************************
         Recommendation responsibility
        */

        this.walkingSpeed   = null;
        this.recommendation   = null;


        /* ************************
         Highlight path responsibility
         */

        this._v_HighlighRecommendationService = null;


        this._pInit( theServiceURL, theApplicationId, thePark);
    };
    Recommendation_Controller_Constructor.prototype = aRecommendation_Controller_Prototype;



    $scope.Recommendation_Controller_Constructor = Recommendation_Controller_Constructor;






    /* Decorate the $scope with an instance of the Controller
     */
    var aRecommendation_Controller = new Recommendation_Controller_Constructor(
        SERVICE_URL, APPLICATION_ID, PARKNAME
    );

    $scope.recommendationCtrl = aRecommendation_Controller;


}]);
