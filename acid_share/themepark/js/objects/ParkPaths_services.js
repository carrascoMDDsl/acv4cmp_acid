'use strict';

/*
 * ParkPaths_services.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/13/2014
 */







var mParksModelServices = angular.module("parkPathsServiceSupplier", []);



mParksModelServices.factory("ParkPaths", [ "ShortestPath", function( ShortestPath){


    /* Configurable constants */




    /* Internal constants */
    var NOROAD_SENTINEL = Infinity;





    /* Define prototype. Has no prototype inheritance itself */
    var aParkPaths_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */

        aPrototype._v_Park                             = null;

        aPrototype._v_Nodes                            = null;
        aPrototype._v_AdjacencyMatrix                  = null;




        /* Supply essential contextual parameters */
        var _pInit = function( thePark) {

            this._v_Park                             = thePark;

            this._v_Nodes           = null;
            this._v_AdjacencyMatrix = null;
            this._v_ShortestPath    = null;

        };
        aPrototype._pInit = _pInit;






        /* Initialize a calculator of shortest paths from the constructor supplied at instance initialization time.
           Needs an adjacency matrix, so initialize it if not already available.
        */
        var _pInit_ShortestPath = function() {

            /* Lazy initialize AdjacencyMatrix */
            if( !this._v_Nodes || !this._v_AdjacencyMatrix) {

                this._pInit_AdjacencyMatrix();

                if( !this._v_Nodes || !this._v_AdjacencyMatrix) {
                    return;
                }
            }

            /* Instantiate a shortest path calculator for the graph of Attractions, Crossings and Roads of the Park.
             */
            this._v_ShortestPath = new ShortestPath.ShortestPath_Service_Constructor( this._v_AdjacencyMatrix);
        };
        aPrototype._pInit_ShortestPath = _pInit_ShortestPath;






        /* Initialize the list of Attraction and Crossing nodes in the Park
        and the adjacency matrix representation for the graph of Attractions, Crossings and Roads of the Park.
        */
        var _pInit_AdjacencyMatrix = function() {

            if( !this._v_Park) {
                return null;
            }

            this._v_Nodes = null;
            this._v_AdjacencyMatrix = null;


            var someNodes = [ ];
            Array.prototype.push.apply( someNodes, this._v_Park.attractions());
            Array.prototype.push.apply( someNodes, this._v_Park.crossings());

            var aNumNodes = someNodes.length;

            var anAdjacencyMatrix = new Array( aNumNodes);
            for( var anIndex = 0; anIndex < aNumNodes; anIndex++) {
                anAdjacencyMatrix[ anIndex] = Array.apply( null, new Array( aNumNodes)).map( function() { return ShortestPath.NO_ARC;});
            }

            var someRoads = this._v_Park.roads();
            var aNumRoads = someRoads.length;
            for( var anIndex = 0; anIndex < aNumRoads; anIndex++) {

                var aRoad = someRoads[ anIndex];
                var somePlaces = aRoad.places();

                var aOnePlace   = somePlaces[ 0];
                var aOtherPlace = somePlaces[ 1];

                var aOnePlaceIndex   = someNodes.indexOf( aOnePlace);
                var aOtherPlaceIndex = someNodes.indexOf( aOtherPlace);

                var aRoadLength = aRoad.roadLength();

                anAdjacencyMatrix[ aOnePlaceIndex  ][ aOtherPlaceIndex] = aRoadLength;
                anAdjacencyMatrix[ aOtherPlaceIndex][ aOnePlaceIndex]   = aRoadLength;
            }


            this._v_AdjacencyMatrix = anAdjacencyMatrix;
            this._v_Nodes           = someNodes;
        };
        aPrototype._pInit_AdjacencyMatrix = _pInit_AdjacencyMatrix;







        /* Reacts to Users selection of an Attraction to show paths to other Attractions
         Requests from the shortestpath service the computation of the shortest paths to all other attractions.

        */
        var fPathsFromAttraction = function( theAttraction) {

            if( !theAttraction) {
                return null;
            }

            /* Lazy initialize ShortestPath */
            if( !this._v_ShortestPath) {
                this._pInit_ShortestPath();
                if( !this._v_ShortestPath) {
                    return null;
                }
            }


            /* Shortest Path service operates on node indexes.
             Obtain the index of the start Attraction.
             */
            var aStartIndex = this._v_Nodes.indexOf( theAttraction);
            if( aStartIndex < 0) {
                return;
            }


            var somePathsFromAttraction = [ ];


            /* Iterate on all Attractions
             */
            var someAttractions = this._v_Park.attractions();

            var aNumAttractions = someAttractions.length;
            for( var anIndex = 0; anIndex < aNumAttractions; anIndex++) {

                var anAttraction = someAttractions[ anIndex];


                /* Not for the start Attraction
                 */
                if( !( anAttraction == theAttraction)) {


                    /* Shortest Path service operates on node indexes.
                     Obtain the index of the other Attraction.
                    */
                    var anEndIndex = this._v_Nodes.indexOf( anAttraction);
                    if( anEndIndex >= 0) {


                        /* Requests from the shortest path service the computation of the shortest paths to all other attractions.
                         */
                        var aPathNodeIndexes = this._v_ShortestPath.fConstructPath( aStartIndex, anEndIndex);


                        /* Shortest Path service operates on node indexes.
                         Obtain the Attractions or Crossings corresponding to the indexes computed as steps of the path to the other Attraction.
                         */
                        var someAdjacencyMatrixNodes = this._v_Nodes;
                        var somePlaces = aPathNodeIndexes.map( function( theNodeIndex) {
                            return someAdjacencyMatrixNodes[ theNodeIndex];
                        });


                        /* Collect all steps including in addition to the Attractions and Crossings
                        also the roads in the path.
                        Compute total length of the path.
                        */
                        var someRoads = [ ];
                        var someSteps = [ theAttraction];

                        var aTotalLength = 0;
                        var aPrevPlace = theAttraction;

                        var aNumPlaces = somePlaces.length;
                        for( var anAOCIndex = 0; anAOCIndex < aNumPlaces; anAOCIndex++) {

                            var anPlace = somePlaces[ anAOCIndex];
                            var aRoad = aPrevPlace.roadTo( anPlace);

                            someRoads.push( aRoad);
                            someSteps.push( aRoad);
                            someSteps.push( anPlace);

                            aTotalLength += aRoad.roadLength();

                            aPrevPlace = anPlace;
                        }


                        /* Build a result object according to the contract with the UI as reified in _fNewVoid_PathFromAttraction
                        */
                        var aPathFromAttraction = _fNewVoid_PathFromAttraction();
                        aPathFromAttraction.originAttraction           = theAttraction
                        aPathFromAttraction.attraction                 = anAttraction;
                        aPathFromAttraction.stepPlaces = somePlaces;
                        aPathFromAttraction.stepRoads                  = someRoads;
                        aPathFromAttraction.steps                      = someSteps;
                        aPathFromAttraction.totalLength                = aTotalLength;
                        somePathsFromAttraction.push( aPathFromAttraction);
                    }
                }
            }

            return somePathsFromAttraction;
        };
        aPrototype.fPathsFromAttraction = fPathsFromAttraction;






        /* Result object for fPathsFromAttraction contract reified in separate explicit method for clarity.
        */
        var _fNewVoid_PathFromAttraction = function() {
            return {
                originAttraction:           null,
                attraction:                 null,
                stepPlaces: null,
                stepRoads:                  null,
                steps:                      null,
                totalLength:                null
            };
        };





        return aPrototype;

    })();







    /* Define constructor for instances with the Park prototype. */

    var ParkPaths_Constructor = function( thePark) {

        /* Init object layout with member properties ASAP for the benefit of JIT */

        this._v_Park                             = null;

        this._v_Nodes                            = null;
        this._v_AdjacencyMatrix                  = null;

        this._pInit( thePark);
    };
    ParkPaths_Constructor.prototype = aParkPaths_Prototype;






    /* Define service component exposing just the constructor. */

    var aService = {};

    aService.ParkPaths_Constructor = ParkPaths_Constructor;

    return aService;


}]);














