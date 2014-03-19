'use strict';

/*
 * objects_controllers.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/13/2014
 */




angular.module('cmpinterviewjs').controller(
    'ObjectsCtrl',
    [ '$scope', 'ParksModel', 'ParkPaths',  'TabsService',
function ( $scope, ParksModel, ParkPaths, TabsService) {





    /* Define prototype. Has no prototype inheritance itself */
    var aObjects_Controller_Prototype = (function() {

        var aPrototype = {};


        /* Prototype members to be used as constants */

        /* UI contract constants */

        aPrototype.PATHSORDER_OPTIONS = [
            { label: "Closer Attractions first", value: "CloserFirst"},
            { label: "Sort by Attraction name", value: "SortByName"}
        ];




        /* Prototype member properties */

        aPrototype.parksHome = null;

        aPrototype.park = null;

        aPrototype.tabs     = null;

        aPrototype._v_ParkPaths = null;

        aPrototype.selectedPathsStart   = null;
        aPrototype.pathsFromAttraction  = null;
        aPrototype.selectedPathsOrder   = null;



        /* Supply essential context and parameters. Initialize private member properties.
        */
        var _pInit = function() {

            this.parksHome = null;

            this.park     = null;

            this.tabs     = null;

            this._v_ParkPaths = null;

            this.selectedPathsStart  = null;
            this.pathsFromAttraction = null;
            this.selectedPathsOrder  = this.PATHSORDER_OPTIONS[ 0].value;


            this.parksHome   = new ParksModel.ParksHome_Constructor();

            ParksModel.pInitParkHomeSample( this.parksHome);


            /* Use the first Park in the parksHome.
            Multiple park support is not completed in the controller or view, but it is supported by the Model.
            There is no requirement to support multiple parks, but it seems a quite likely extension.
            */
            var someParks = this.parksHome.parks();
            if( someParks && someParks.length) {

                this.park = this.parksHome.parks()[ 0];

                /* Obtain an instance to compute Paths between Attractions in the Park
                */
                this._v_ParkPaths = new ParkPaths.ParkPaths_Constructor( this.park);
            }



            /* Instatiate and configure UI tabs machinery */
            this.tabs = new TabsService.Tabs_Service_Constructor( [
                { label: "Attractions", value: "Attractions"},
                { label: "Crossings",   value: "Crossings"},
                { label: "Roads",       value: "Roads"},
                { label: "Paths",       value: "Paths"}
            ]);
        };
        aPrototype._pInit = _pInit;








        /* Reacts to Users selection of an Attraction to show paths to other Attractions
        */
        var selectedPathsStartChangedHandler = function() {

            this._pRefreshPathsFromAttraction();
        };
        aPrototype.selectedPathsStartChangedHandler = selectedPathsStartChangedHandler;





        /* Reacts to Users selection of an ordering criteria to show paths from the selected Attraction to to other Attractions
         */
        var selectedPathsOrderChangedHandler = function() {

           this._pRefreshPathsFromAttraction();
        };
        aPrototype.selectedPathsOrderChangedHandler = selectedPathsOrderChangedHandler;





        /* Updates the list of paths to other Attractions, after selection of an Attraction or list order.
         Requests from the shortestpath service the computation of the shortest paths to all other attractions.
         Sorts the Paths according to the selected criteria.
         */
        var _pRefreshPathsFromAttraction = function() {

            this.pathsFromAttraction     = [];
            if( !this.selectedPathsStart) {
                return;
            }

            var somePaths = this._v_ParkPaths.fPathsFromAttraction( this.selectedPathsStart);

            var someSortedPaths = somePaths;
            if( this.selectedPathsOrder  == this.PATHSORDER_OPTIONS[ 0].value) {
                someSortedPaths = _fSortedPaths_CloserFirst( somePaths);
            }
            else {
                if( this.selectedPathsOrder  == this.PATHSORDER_OPTIONS[ 1].value) {
                    someSortedPaths = _fSortedPaths_ByAttractionName( somePaths);
                }
            }

            this.pathsFromAttraction = someSortedPaths

        };
        aPrototype._pRefreshPathsFromAttraction = _pRefreshPathsFromAttraction;







        var _fSortedPaths_CloserFirst = function( thePaths) {
            if( !thePaths) {
                return null;
            }

            if( thePaths.length < 2) {
                return thePaths;
            }

            var someSortedPaths = thePaths.sort( function( theOnePath, theOtherPath) {
                return theOnePath.totalLength - theOtherPath.totalLength;
            });

            return someSortedPaths;
        };





        var _fSortedPaths_ByAttractionName = function( thePaths) {
            if( !thePaths) {
                return null;
            }

            if( thePaths.length < 2) {
                return thePaths;
            }

            var someSortedPaths = thePaths.sort( function( theOnePath, theOtherPath) {
                var aOnePath   = theOnePath.attraction.attractionName().toLowerCase();
                var aOtherPath = theOtherPath.attraction.attractionName().toLowerCase();

                if ( aOnePath < aOtherPath){
                    return -1;
                }
                else {
                    if ( aOnePath > aOtherPath){
                        return  1;
                    }
                    else{
                        return 0;
                    }
                }
            });

            return someSortedPaths;
        };





        /* Compute class based on the type and properties of the supplied object
        */
        var fCSSclassNameFor = function( theObject) {

            if( !theObject) {
                return "";
            }

            switch( theObject.domainType()) {
                case 'Attraction':
                    return ( theObject.isRide() ? "CMP_Attraction_Ride" : "CMP_Attraction");

                case 'Crossing':
                    return "CMP_Crossing";

                case 'Road':
                    return "CMP_Road";

                default:
                    break;
            }

            return "";

        };
        aPrototype.fCSSclassNameFor = fCSSclassNameFor;





        /* Just in case, we need to be alert :-) */
        var _pErrorAlert = function( theMessage) {

            var aMessage = theMessage;
            if( !aMessage) {
                aMessage = "Error";
            }
            /* Modals to be opened out of the current event loop */
            setTimeout(
                function() {
                    alert( aMessage);
                },
                100
            );
        };
        aPrototype._pErrorAlert = _pErrorAlert;




        return aPrototype;

    })();








    /* Define constructor for instances with the prototype. */

    var Objects_Controller_Constructor = function() {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this.parksHome = null;

        this.park     = null;

        this.tabs     = null;

        this._v_ParkPaths = null;

        this.selectedPathsStart  = null;
        this.pathsFromAttraction = null;
        this.selectedPathsOrder  = null;

        this._pInit();
    };
    Objects_Controller_Constructor.prototype = aObjects_Controller_Prototype;











    /* *********************************+
    Decorate the $scope
    */

    $scope.objectsCtrl = new Objects_Controller_Constructor();


}]);





