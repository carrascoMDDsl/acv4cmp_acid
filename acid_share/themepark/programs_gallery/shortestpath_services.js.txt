'use strict';

/*
 * shortestpath_services.js
 *
 * A Javascript exercise.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/14/2014
 */



/* **********************************************
Wrapper as a Javascript prototype and AngularJS service of:

 * dijkstra.js
 *
 * Dijkstra's single source shortest path algorithm in JavaScript.
 *
 * Cameron McCormack <cam (at) mcc.id.au>
 *
 * Permission is hereby granted to use, copy, modify and distribute this
 * code for any purpose, without fee.
 *
 * Initial version: October 21, 2004

 */




var mShortestPathServices = angular.module("shortestpathServiceSupplier", []);



mShortestPathServices.factory("ShortestPath", [  function(){


    /* Configurable constants */





    /* Internal constants */

    var NO_ARC = Infinity;



    /* Define prototype. Has no prototype inheritance itself */

    var aShortestPath_Service_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */

        aPrototype._v_AdjacencyMatrix           = null;

        aPrototype._v_NumNodes                  = null;
        aPrototype._v_IsAdecuateAdjacencyMatrix = null;

        aPrototype._v_ShortestsPaths            = null;





        /* Supply essential contextual parameters */

        /* *********************************************************************
        The adjacency matrix should be defined such that
        E[i][j] == Infinity
        means that there is no arc between vertex i and j,

        and
        E[i][j] == n
        means that there is an arc with weight n between i and j.

        The adjacency matrix can define a directed graph;
        the example one in the code is undirected though
        (since E[i][j] == E[j][i] for all i and j).

        */
        var _pInit = function( theAdjacencyMatrix) {

            this._v_AdjacencyMatrix           = theAdjacencyMatrix;
            this._v_NumNodes                  = null;
            this._v_IsAdecuateAdjacencyMatrix = false;
            this._v_ShortestsPaths            = null;


            if( this._v_AdjacencyMatrix) {
                var aNumNodes = this._v_AdjacencyMatrix.length;
                if( aNumNodes) {

                    var aIsAdecuate = true;
                    for( var aRowIndex = 0; aRowIndex < aNumNodes; aRowIndex++) {
                        var aRow = this._v_AdjacencyMatrix[ aRowIndex];
                        if( !aRow || !( aRow.length == aNumNodes)) {
                            aIsAdecuate = false;
                            break;
                        }
                    }

                    this._v_IsAdecuateAdjacencyMatrix = aIsAdecuate;

                    if( aIsAdecuate) {
                        this._v_NumNodes = aNumNodes;
                    }
                }
            }
        };
        aPrototype._pInit = _pInit;






        /* *********************************************************************
        * Dijkstra's shortest path algorithm in JavaScript
        Here is an implementation of Dijkstra's single source shortest path algorithm in JavaScript.
        The shortestPath function takes three arguments:
        the adjacency matrix defining the graph,
        the number of vertices in the graph,
        and the starting vertex number.

        The adjacency matrix should be defined such that
        E[i][j] == Infinity
        means that there is no arc between vertex i and j,

        and
        E[i][j] == n
        means that there is an arc with weight n between i and j.

        The adjacency matrix can define a directed graph;
        the example one in the code is undirected though
        (since E[i][j] == E[j][i] for all i and j).

        The function will return an object encapsulating the shortest path info for the given starting vertex.

        It has three properties:

        a pathLengths property,
        which is an array that gives the shortest path length from the starting vertex to each vertex i,

        predecessors,
        which is a predecessor list describing the spanning tree that defines the actual shortest paths
        from the starting vertex to each other vertex,

        and startVertex,
        the starting vertex the shortest path data is valid for.

        */
        var fComputeShortestPaths = function ( theStartVertex) {

            this._v_ShortestsPaths = null

            if( !this._v_IsAdecuateAdjacencyMatrix) {
                return null;
            }

            if( !this._v_NumNodes) {
                return null;
            }

            if( theStartVertex >= this._v_NumNodes) {
                return null;
            }

            var done = new Array(this._v_NumNodes);
            done[ theStartVertex] = true;

            var pathLengths = new Array(this._v_NumNodes);
            var predecessors = new Array(this._v_NumNodes);

            for (var i = 0; i < this._v_NumNodes; i++) {
                pathLengths[i] = this._v_AdjacencyMatrix[ theStartVertex][i];
                if ( this._v_AdjacencyMatrix[ theStartVertex][i] != NO_ARC) {
                    predecessors[i] = theStartVertex;
                }
            }


            pathLengths[ theStartVertex] = 0;

            for (var i = 0; i < this._v_NumNodes - 1; i++) {

                var closest = -1;
                var closestDistance = NO_ARC;

                for (var j = 0; j < this._v_NumNodes; j++) {
                    if (!done[j] && pathLengths[j] < closestDistance) {
                        closestDistance = pathLengths[j];
                        closest = j;
                    }
                }


                done[closest] = true;

                for (var j = 0; j < this._v_NumNodes; j++) {
                    if (!done[j]) {
                        var possiblyCloserDistance = pathLengths[closest] + this._v_AdjacencyMatrix[closest][j];
                        if (possiblyCloserDistance < pathLengths[j]) {
                            pathLengths[j] = possiblyCloserDistance;
                            predecessors[j] = closest;
                        }
                    }
                }
            }

            this._v_ShortestsPaths = {
                "startVertex":  theStartVertex,
                "pathLengths":  pathLengths,
                "predecessors": predecessors
            };

            return this._v_ShortestsPaths;
        };
        aPrototype.fComputeShortestPaths = fComputeShortestPaths;









        /* *********************************************************************
        To get an actual list of vertices comprising the path to a given vertex, use the constructPath function.
        It takes the shortest path info object returned from shortestPath and the vertex you want to go to,
        and returns an array of vertices that comprise the path.

        */
        var fConstructPath = function ( theStartVertex, theEndVertex) {

            if( !this._v_ShortestsPaths || !( this._v_ShortestsPaths.startVertex == theStartVertex)) {
                this.fComputeShortestPaths( theStartVertex);
                if( !this._v_ShortestsPaths) {
                    return null;
                }
            }

            var anEndVertex = theEndVertex;

            var path = [];
            while ( anEndVertex != this._v_ShortestsPaths.startVertex) {
                path.unshift( anEndVertex);
                anEndVertex = this._v_ShortestsPaths.predecessors[ anEndVertex];
            }
            return path;
        };
        aPrototype.fConstructPath = fConstructPath;






        return aPrototype;

    })();



    /* Define constructor for instances with the prototype. */

    /* *********************************************************************
    The adjacency matrix should be defined such that
    E[i][j] == Infinity
    means that there is no arc between vertex i and j,

    and
    E[i][j] == n
    means that there is an arc with weight n between i and j.

    The adjacency matrix can define a directed graph;
    the example one in the code is undirected though
    (since E[i][j] == E[j][i] for all i and j).

    */
    var ShortestPath_Service_Constructor = function( theAdjacencyMatrix) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_AdjacencyMatrix           = null;
        this._v_NumNodes                  = null;
        this._v_IsAdecuateAdjacencyMatrix = null;
        this._v_ShortestsPaths            = null;

        this._pInit( theAdjacencyMatrix);
    };
    ShortestPath_Service_Constructor.prototype = aShortestPath_Service_Prototype;









    /* Define service component exposing just the constructor and the "NO_ARC" sentinel constant. */

    var aService = {};

    aService.ShortestPath_Service_Constructor = ShortestPath_Service_Constructor;

    aService.NO_ARC = NO_ARC;

    return aService;

}]);







