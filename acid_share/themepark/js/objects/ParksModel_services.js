'use strict';

/*
 * ParksModel_services.js
 *
 * A Javascript exercise.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/14/2014
 */





var mParksModelServices = angular.module("parksModel", []);



mParksModelServices.factory("ParksModel", [  function(){


    /* Configurable constants */




    /* Internal constants */

    var UNNAMED = "unnamed";






    /* *************************************************
     *************************************************
     ParksHome realization.
     Manages the extent of the Park type
     and the life cycle of all the instances of Park type.

     Indirectly through instances of Park, also manages the life cycle of all instances of the object network.
     */

    /* Define prototype. Has no prototype inheritance itself */
    var aParksHome_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */
        aPrototype._v_Type = "ParksHome";

        aPrototype._v_Parks = null;




        /* Supply essential contextual parameters */
        var _pInit = function() {

            this._v_Type = "ParksHome";

            this._v_Parks = [];
        };
        aPrototype._pInit = _pInit;





        var domainType = function() {

            return this._v_Type;
        };
        aPrototype.domainType = domainType;




        var parks = function() {

            return this._v_Parks.slice();
        };
        aPrototype.parks = parks;





        var parkByName = function( theParkName) {
            if( !theParkName) {
                return null;
            }

            var aNumParks = this._v_Parks.length;
            if( !aNumParks) {
                return null;
            }

            for( var aParkIndex = 0; aParkIndex < aNumParks; aParkIndex++) {
                var aPark = this._v_Parks[ aParkIndex];
                if( aPark.parkName() == theParkName) {
                    return aPark;
                }
            }

            return null;
        };
        aPrototype.parkByName = parkByName;





        var parkCreate = function( theParkName, theDatumName) {
            if( !theParkName) {
                return null;
            }

            if( this.parkByName( theParkName)) {
                return null;
            }

            var aPark = new Park_Constructor( theParkName, theDatumName);


            var someSavedParks = this._v_Parks.slice();
            try {
                aPark._parksHomeSet_privileged( this);
                this._v_Parks.push( aPark);
            }
            catch( anException) {
                this._v_Parks = someSavedParks;
            }

            return aPark;
        };
        aPrototype.parkCreate = parkCreate;




        return aPrototype;

    })();







    /* Define constructor for instances with the Park prototype. */

    var ParksHome_Constructor = function() {

        /* Init object layout with member properties ASAP for the benefit of JIT */

        this._v_Type = null;

        this._pInit();
    };
    ParksHome_Constructor.prototype = aParksHome_Prototype;
















    /* *************************************************
     *************************************************
    Park object realization.
    */

    /* Define prototype. Has no prototype inheritance itself */
    var aPark_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */
        aPrototype._v_Type = "Park";

        aPrototype._v_ParkName        = null;
        aPrototype._v_DatumName        = null;

        aPrototype._v_ParksHome   = null;

        aPrototype._v_Attractions = null;
        aPrototype._v_Crossings   = null;
        aPrototype._v_Roads       = null;



        /* Supply essential contextual parameters */
        var _pInit = function( theParkName, theDatumName) {

            this._v_Type = "Park";

            this._v_ParkName = theParkName;
            if( !this._v_ParkName) {
                this._v_ParkName = UNNAMED;
            }

            var aDatumName = theDatumName;
            if( typeof aDatumName == "undefined") {
                aDatumName = null;
            }
            this._v_DatumName  = aDatumName;

            this._v_ParksHome   = null;

            this._v_Attractions = [];
            this._v_Crossings   = [];
            this._v_Roads       = [];
        };
        aPrototype._pInit = _pInit;







        var _parksHomeSet_privileged = function( theParksHome) {

            if( !theParksHome) {
                return;
            }

            this._v_ParksHome   = theParksHome;
        };
        aPrototype._parksHomeSet_privileged = _parksHomeSet_privileged;




        var domainType = function() {

            return this._v_Type;
        };
        aPrototype.domainType = domainType;





        var parksHome = function() {

            return this._v_ParksHome;
        };
        aPrototype.parksHome = parksHome;





        var parkName = function() {

            return this._v_ParkName;
        };
        aPrototype.parkName = parkName;




        var datumName = function() {

            return this._v_DatumName;
        };
        aPrototype.datumName = datumName;





        /* *********************************
        Attractions composite aggregation
        */

        var attractions = function() {

            return this._v_Attractions.slice();
        };
        aPrototype.attractions = attractions;






        var attractionByName = function( theAttractionName) {
            if( !theAttractionName) {
                return null;
            }

            var aNumAttractions = this._v_Attractions.length;
            if( !aNumAttractions) {
                return null;
            }

            for( var anAttractionIndex = 0; anAttractionIndex < aNumAttractions; anAttractionIndex++) {
                var anAttraction = this._v_Attractions[ anAttractionIndex];
                if( anAttraction.attractionName() == theAttractionName) {
                    return anAttraction;
                }
            }

            return null;
        };
        aPrototype.attractionByName = attractionByName;






        var attractionCreate = function( theAttractionName, theIsRide, theLatitude, theLongitude) {
            if( !theAttractionName) {
                return null;
            }

            if( this.attractionByName( theAttractionName)) {
                return null;
            }

            var anAttraction = new Attraction_Constructor( theAttractionName, theIsRide, theLatitude, theLongitude);

            var someSavedAttractions = this._v_Attractions.slice();
            try {
                anAttraction._parkSet_privileged( this);
                this._v_Attractions.push( anAttraction);
            }
            catch( anException) {
                this._v_Attractions = someSavedAttractions;
            }

            return anAttraction;
        };
        aPrototype.attractionCreate = attractionCreate;









        /* *********************************
         Crossings composite aggregation
         */

        var crossings = function() {

            return this._v_Crossings.slice();
        };
        aPrototype.crossings = crossings;






        var crossingByName = function( theCrossingName) {
            if( !theCrossingName) {
                return null;
            }

            var aNumCrossings = this._v_Crossings.length;
            if( !aNumCrossings) {
                return null;
            }

            for( var aCrossingIndex = 0; aCrossingIndex < aNumCrossings; aCrossingIndex++) {
                var aCrossing = this._v_Crossings[ aCrossingIndex];
                if( aCrossing.crossingName() == theCrossingName) {
                    return aCrossing;
                }
            }

            return null;
        };
        aPrototype.crossingByName = crossingByName;






        var crossingCreate = function( theCrossingName, theLatitude, theLongitude) {
            if( !theCrossingName) {
                return null;
            }

            if( this.crossingByName( theCrossingName)) {
                return null;
            }

            var aCrossing = new Crossing_Constructor( theCrossingName, theLatitude, theLongitude);

            var someSavedCrossings = this._v_Crossings.slice();
            try {
                aCrossing._parkSet_privileged( this);
                this._v_Crossings.push( aCrossing);
            }
            catch( anException) {
                this._v_Crossings = someSavedCrossings;
            }

            return aCrossing;
        };
        aPrototype.crossingCreate = crossingCreate;










        /* *********************************
         Roads composite aggregation
         */

        var roads = function() {

            return this._v_Roads.slice();
        };
        aPrototype.roads = roads;







        var roadByName = function( theRoadName) {
            if( !theRoadName) {
                return null;
            }

            var aNumRoads = this._v_Roads.length;
            if( !aNumRoads) {
                return null;
            }

            for( var aRoadIndex = 0; aRoadIndex < aNumRoads; aRoadIndex++) {
                var aRoad = this._v_Roads[ aRoadIndex];
                if( aRoad.roadName() == theRoadName) {
                    return aRoad;
                }
            }

            return null;
        };
        aPrototype.roadByName = roadByName;





        var roadCreate = function( theRoadName, thePlaceOne, thePlaceTwo) {
            if( !theRoadName|| !thePlaceOne || !thePlaceTwo) {
                return null;
            }

            if( thePlaceOne.hasRoadTo( thePlaceTwo)) {
                return null;
            }

            var aRoad = new Road_Constructor( theRoadName);

            var someSavedRoads    = this._v_Roads.slice();
            var someSavedRoadsOne = thePlaceOne._v_Roads.slice();
            var someSavedRoadsTwo = thePlaceTwo._v_Roads.slice();

            try {
                aRoad._placesSet_privileged( thePlaceOne, thePlaceTwo);
                thePlaceOne._roadsAdd_privileged( aRoad);
                thePlaceTwo._roadsAdd_privileged( aRoad);
                aRoad._parkSet_privileged( this);
                this._v_Roads.push( aRoad);
            }
            catch( anException) {
                this._v_Roads = someSavedRoads;
                thePlaceOne._v_Roads = someSavedRoadsOne;
                thePlaceTwo._v_Roads = someSavedRoadsTwo;
            }

            return aRoad;
        };
        aPrototype.roadCreate = roadCreate;




        return aPrototype;

    })();




    /* Define constructor for instances with the Park prototype. */

    var Park_Constructor = function( theParkName, theDatumName) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_Type = null;

        this._v_ParkName    = null;
        this._v_DatumName   = null;

        this._v_ParksHome   = null;

        this._v_Attractions = null;
        this._v_Crossings   = null;
        this._v_Roads       = null;

        this._pInit( theParkName, theDatumName);
    };
    Park_Constructor.prototype = aPark_Prototype;















    /* *************************************************
     *************************************************
     Place abstract object realization.
     */


    /* Define prototype. Has no prototype inheritance itself */
    var aPlace_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */
        aPrototype._v_Type = "Place";

        aPrototype._v_PlaceName  = null;
        aPrototype._v_Latitude  = null;
        aPrototype._v_Longitude = null;

        aPrototype._v_Park   = null;

        aPrototype._v_Roads  = null;





        /* Supply essential contextual parameters */
        var _pInit_Place = function( thePlaceName, theLatitude, theLongitude) {

            this._v_Type = "Place";

            this._v_PlaceName = thePlaceName;
            if( !this._v_PlaceName) {
                this._v_PlaceName = UNNAMED;
            }

            var aLatitude = theLatitude;
            if( typeof aLatitude == "undefined") {
                aLatitude = null;
            }
            this._v_Latitude  = aLatitude;

            var aLongitude = theLongitude;
            if( typeof aLongitude == "undefined") {
                aLongitude = null;
            }
            this._v_Longitude = aLongitude;

            this._v_Park   = null;

            this._v_Roads = [];
        };
        aPrototype._pInit_Place = _pInit_Place;
        aPrototype._pInit       = _pInit_Place;





        var _parkSet_privileged = function( thePark) {

            if( !thePark) {
                return;
            }

            this._v_Park   = thePark;
        };
        aPrototype._parkSet_privileged = _parkSet_privileged;




        var domainType = function() {

            return this._v_Type;
        };
        aPrototype.domainType = domainType;





        var placeName = function() {

            return this._v_PlaceName;
        };
        aPrototype.placeName = placeName;




        var latitude = function() {

            return this._v_Latitude;
        };
        aPrototype.latitude = latitude;




        var longitude = function() {

            return this._v_Longitude;
        };
        aPrototype.longitude = longitude;





        var park = function() {

            return this._v_Park;
        };
        aPrototype.park = park;





        var roads = function() {

            return this._v_Roads.slice();
        };
        aPrototype.roads = roads;





        var _roadsAdd_privileged = function( theRoad) {

            if( !theRoad) {
                return;
            }

            if( this._v_Roads.indexOf( theRoad) >= 0) {
                return;
            }

            this._v_Roads.push( theRoad);
        };
        aPrototype._roadsAdd_privileged = _roadsAdd_privileged;












        /* **********************************
         Derived accessors
         */


        var roadTo = function( thePlace) {
            if( !thePlace) {
                return null;
            }

            if( thePlace == this) {
                return null;
            }

            var someRoads = this._v_Roads;
            var aNumRoads = someRoads.length;
            if( !aNumRoads) {
                return null;
            }

            for( var aRoadIndex = 0; aRoadIndex < aNumRoads; aRoadIndex++) {
                var aRoad = someRoads[ aRoadIndex];
                if( aRoad.hasPlace( thePlace)) {
                    return aRoad;
                }
            }

            return null;
        };
        aPrototype.roadTo = roadTo;






        var hasRoadTo = function( thePlace) {

            return this.roadTo( thePlace) ? true : false;
        };
        aPrototype.hasRoadTo = hasRoadTo;






        var roadNames = function() {

            var someRoads = this._v_Roads;
            var someRoadNames = someRoads.map( function( theRoad) { return theRoad.roadName();});

            return someRoadNames;
        };
        aPrototype.roadNames = roadNames;





        return aPrototype;

    })();









    /* Define constructor for instances with the Attraction prototype. */

    var Place_SuperPrototypeConstructor = function( ) {

        this._v_Prototype_Place = aPlace_Prototype;

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_Type = null;

        this._v_PlaceName = null;
        this._v_Latitude       = null;
        this._v_Longitude      = null;

        this._v_Park   = null;
        this._v_Roads = null;
    };
    Place_SuperPrototypeConstructor.prototype = aPlace_Prototype;



















    /* *************************************************
       *************************************************
     Attraction object realization.
     */


    /* Define prototype. Has no prototype inheritance itself */
    var anAttraction_Prototype = (function() {

        var aPrototype = new Place_SuperPrototypeConstructor();


        /* Prototype member properties */
        aPrototype._v_Type = "Attraction";

        aPrototype._v_IsRide     = null;




        /* Supply essential contextual parameters */
        var _pInit = function( theAttractionName, theIsRide, theLatitude, theLongitude) {

            /* Delegate on super prototype initialization */
            this._v_SuperPrototype._pInit_Place.apply( this,  [ theAttractionName, theLatitude, theLongitude]);


            this._v_Type = "Attraction";

            var aIsRide = theIsRide;
            if( typeof aIsRide == "undefined") {
                aIsRide = false;
            }
            this._v_IsRide    = ( aIsRide ? true : false);
        };
        aPrototype._pInit = _pInit;





        var attractionName = function() {

            return this.placeName();
        };
        aPrototype.attractionName = attractionName;





        var isRide = function() {

            return ( this._v_IsRide ? true : false);
        };
        aPrototype.isRide = isRide;




        return aPrototype;

    })();







    /* Define constructor for instances with the Attraction prototype. */

    var Attraction_Constructor = function( theAttractionName, theIsRide, theLatitude, theLongitude) {

        /* Keep handy reference to super-prototype for super method invocation */
        this._v_SuperPrototype = anAttraction_Prototype._v_Prototype_Place;


        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_Type = null;

        this._v_IsRide     = null;

        this._pInit( theAttractionName, theIsRide, theLatitude, theLongitude);
    };
    Attraction_Constructor.prototype = anAttraction_Prototype;












    /* *************************************************
     *************************************************
     Crossing object realization.
     */


    /* Define prototype. Has no prototype inheritance itself */
    var aCrossing_Prototype = (function() {

        var aPrototype = new Place_SuperPrototypeConstructor();


        /* Prototype member properties */
        aPrototype._v_Type = "Crossing";



        /* Supply essential contextual parameters */
        var _pInit = function( theCrossingName, theLatitude, theLongitude) {

            /* Delegate on super prototype initialization */
            this._v_SuperPrototype._pInit_Place.apply( this,  [ theCrossingName, theLatitude, theLongitude]);

            this._v_Type = "Crossing";
        };
        aPrototype._pInit = _pInit;





        var crossingName = function() {

            return this.placeName();
        };
        aPrototype.crossingName = crossingName;








        /* **********************************
         Derived accessors
         */





        return aPrototype;

    })();







    /* Define constructor for instances with the Crossing prototype. */

    var Crossing_Constructor = function( theCrossingName, theLatitude, theLongitude) {

        /* Keep handy reference to super-prototype for super method invocation */
        this._v_SuperPrototype = anAttraction_Prototype._v_Prototype_Place;


        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_Type = null;

        this._pInit( theCrossingName, theLatitude, theLongitude);
    };
    Crossing_Constructor.prototype = aCrossing_Prototype;


















    /* *************************************************
     *************************************************
     Road object realization.
     */


    /* Define prototype. Has no prototype inheritance itself */
    var aRoad_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */
        aPrototype._v_Type = "Road";

        aPrototype._v_RoadName        = null;

        aPrototype._v_Park   = null;

        aPrototype._v_Places = null;


        /* Prototype member properties considered transient */

        /*to cache computations. */

        aPrototype._v_RoadLength   = null
        aPrototype._v_RoadAngle    = null
        aPrototype._v_RoadMidPoint = null


        /* Supply essential contextual parameters */
        var _pInit = function( theRoadName) {

            this._v_Type = "Road";

            this._v_RoadName = theRoadName;
            if( !this._v_RoadName) {
                this._v_RoadName = UNNAMED;
            }

            this._v_Park   = null;

            this._v_Places = [];

            this._v_RoadLength = null;
            this._v_RoadAngle  = null;
            this._v_RoadMidPoint = null
        };
        aPrototype._pInit = _pInit;






        var _parkSet_privileged = function( thePark) {

            if( !thePark) {
                return;
            }

            this._v_Park   = thePark;
        };
        aPrototype._parkSet_privileged = _parkSet_privileged;






        var _placesSet_privileged = function( thePlaceOne, thePlaceTwo) {

            if( !thePlaceOne || !thePlaceTwo) {
                return;
            }

            this._v_Places = [ thePlaceOne, thePlaceTwo];
        };
        aPrototype._placesSet_privileged = _placesSet_privileged;





        var domainType = function() {

            return this._v_Type;
        };
        aPrototype.domainType = domainType;





        var roadName = function() {

            return this._v_RoadName;
        };
        aPrototype.roadName = roadName;




        var park = function() {

            return this._v_Park;
        };
        aPrototype.park = park;






        var places = function() {

            return this._v_Places.slice();
        };
        aPrototype.places = places;







        /* *******************
        Computed
        */


        var hasPlace = function( thePlace) {

            return this._v_Places.indexOf( thePlace) >= 0;
        };
        aPrototype.hasPlace = hasPlace;





        var roadLength = function() {

            if( !( this._v_RoadLength == null)) {
                return this._v_RoadLength;
            }

            var aOnePlace   = this._v_Places[ 0];
            var aOtherPlace = this._v_Places[ 1];

            var aOneAttractionsOrCrossingLatitude    = aOnePlace.latitude();
            var aOneAttractionsOrCrossingLongitude   = aOnePlace.longitude();

            var aOtherAttractionsOrCrossingLatitude  = aOtherPlace.latitude();
            var aOtherAttractionsOrCrossingLongitude = aOtherPlace.longitude();

            var aDistanceX = Math.abs( aOneAttractionsOrCrossingLongitude - aOtherAttractionsOrCrossingLongitude);
            var aDistanceY = Math.abs( aOneAttractionsOrCrossingLatitude  - aOtherAttractionsOrCrossingLatitude);

            var aDistance  = Math.sqrt( ( aDistanceX * aDistanceX) + ( aDistanceY * aDistanceY));

            this._v_RoadLength = aDistance;

            return this._v_RoadLength;
        };
        aPrototype.roadLength = roadLength;






        var roadAngle = function( thePlace) {

            if( this._v_RoadAngle == null) {

                var aOnePlace   = this._v_Places[ 0];
                var aOtherPlace = this._v_Places[ 1];

                var aOneAttractionsOrCrossingLatitude    = aOnePlace.latitude();
                var aOneAttractionsOrCrossingLongitude   = aOnePlace.longitude();

                var aOtherAttractionsOrCrossingLatitude  = aOtherPlace.latitude();
                var aOtherAttractionsOrCrossingLongitude = aOtherPlace.longitude();

                var aDistanceX = Math.abs( aOtherAttractionsOrCrossingLongitude - aOneAttractionsOrCrossingLongitude);
                var aDistanceY = Math.abs( aOtherAttractionsOrCrossingLatitude  - aOneAttractionsOrCrossingLatitude);

                var anAngle  =  Math.atan2( aDistanceY, aDistanceX) * 180 / Math.PI;

                this._v_RoadAngle = anAngle;
            }

            if( thePlace == aOtherPlace) {
                return this._v_RoadAngle;
            }

            if( this._v_RoadAngle < 0) {
                return ( this._v_RoadAngle - 180) % 360;
            }
            return ( this._v_RoadAngle + 180) % 360;
        };
        aPrototype.roadAngle = roadAngle;







        var roadMidPoint = function() {

            if( !( this._v_RoadMidPoint == null)) {
                return this._v_RoadMidPoint;
            }

            var aOnePlace   = this._v_Places[ 0];
            var aOtherPlace = this._v_Places[ 1];

            var aOneAttractionsOrCrossingLatitude    = aOnePlace.latitude();
            var aOneAttractionsOrCrossingLongitude   = aOnePlace.longitude();

            var aOtherAttractionsOrCrossingLatitude  = aOtherPlace.latitude();
            var aOtherAttractionsOrCrossingLongitude = aOtherPlace.longitude();

            var aMidPoint  = [
                ( aOneAttractionsOrCrossingLatitude  + aOtherAttractionsOrCrossingLatitude)  / 2,
                ( aOneAttractionsOrCrossingLongitude + aOtherAttractionsOrCrossingLongitude) / 2
            ];

            this._v_RoadMidPoint = aMidPoint;

            return this._v_RoadMidPoint;
        };
        aPrototype.roadMidPoint = roadMidPoint;




        var otherPlace = function( thePlace) {

            if( !thePlace) {
                return null;
            }

            if( thePlace == this._v_Places[ 0]) {
                return this._v_Places[ 1];
            }

            if( thePlace == this._v_Places[ 1]) {
                return this._v_Places[ 0];
            }

            return null;
        };
        aPrototype.otherPlace = otherPlace;




        return aPrototype;

    })();







    /* Define constructor for instances with the Road prototype. */

    var Road_Constructor = function( theRoadName) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_Type = null;

        this._v_RoadName = null;

        this._v_Places = null;

        this._v_RoadLength = null

        this._v_RoadAngle = null

        this._v_RoadMidPoint = null


        this._pInit( theRoadName);
    };
    Road_Constructor.prototype = aRoad_Prototype;







    /* Define service component exposing just the constructor for the root of the model. */

    var aService = {};
    aService.ParksHome_Constructor = ParksHome_Constructor;















    /* ******************************************
       ******************************************
        Create a sample ParkHome object network.
    */


    var pInitParkHomeSample = function( theParksHome) {
        if( !theParksHome) {
            return;
        }

        var aPark_01 = theParksHome.parkCreate( "Theme Park 1", "NAVD 88");

        var anAtt_01 = aPark_01.attractionCreate( "a1", false, 290, 100);
        var anAtt_02 = aPark_01.attractionCreate( "a2", true,  500, 180);
        var anAtt_03 = aPark_01.attractionCreate( "a3", true,  320, 220);
        var anAtt_04 = aPark_01.attractionCreate( "a4", false, 110, 210);
        var anAtt_05 = aPark_01.attractionCreate( "a5", true,  650, 380);
        var anAtt_06 = aPark_01.attractionCreate( "a6", false, 520, 410);
        var anAtt_07 = aPark_01.attractionCreate( "a7", true,  350, 390);
        var anAtt_08 = aPark_01.attractionCreate( "a8", false, 680, 530);
        var anAtt_09 = aPark_01.attractionCreate( "a9", false, 120, 480);
        var anAtt_10 = aPark_01.attractionCreate( "a10", true,  610, 760);
        var anAtt_11 = aPark_01.attractionCreate( "a11", false, 500, 680);
        var anAtt_12 = aPark_01.attractionCreate( "a12", false, 510, 850);
        var anAtt_13 = aPark_01.attractionCreate( "a13", true,  370, 800);
        var anAtt_14 = aPark_01.attractionCreate( "a14", false, 170, 770);
        var anAtt_15 = aPark_01.attractionCreate( "a15", false, 110, 680);

        var aCros_01 = aPark_01.crossingCreate( "c1", 390, 170);
        var aCros_02 = aPark_01.crossingCreate( "c2", 400, 260);
        var aCros_03 = aPark_01.crossingCreate( "c3", 230, 160);
        var aCros_04 = aPark_01.crossingCreate( "c4", 230, 320);
        var aCros_05 = aPark_01.crossingCreate( "c5", 540, 320);
        var aCros_06 = aPark_01.crossingCreate( "c6", 440, 460);
        var aCros_07 = aPark_01.crossingCreate( "c7", 200, 470);
        var aCros_08 = aPark_01.crossingCreate( "c8", 290, 570);
        var aCros_09 = aPark_01.crossingCreate( "c9", 440, 610);
        var aCros_10 = aPark_01.crossingCreate( "c10", 590, 640);
        var aCros_11 = aPark_01.crossingCreate( "c11", 400, 730);
        var aCros_12 = aPark_01.crossingCreate( "c12", 200, 690);
        var aCros_13 = aPark_01.crossingCreate( "c13", 120, 590);


        var aRoad_01 = aPark_01.roadCreate( "r1", anAtt_02, aCros_02);
        var aRoad_02 = aPark_01.roadCreate( "r2", anAtt_02, aCros_01);
        var aRoad_03 = aPark_01.roadCreate( "r3", aCros_01, aCros_02);
        var aRoad_04 = aPark_01.roadCreate( "r4", anAtt_01, aCros_01);
        var aRoad_05 = aPark_01.roadCreate( "r5", aCros_02, aCros_04);
        var aRoad_06 = aPark_01.roadCreate( "r6", anAtt_03, aCros_04);
        var aRoad_07 = aPark_01.roadCreate( "r7", anAtt_01, aCros_03);
        var aRoad_08 = aPark_01.roadCreate( "r8", aCros_03, aCros_04);
        var aRoad_09 = aPark_01.roadCreate( "r9", aCros_03, anAtt_04);
        var aRoad_10 = aPark_01.roadCreate( "r10", anAtt_04, aCros_04);
        var aRoad_11 = aPark_01.roadCreate( "r11", aCros_04, anAtt_07);
        var aRoad_12 = aPark_01.roadCreate( "r12", aCros_04, aCros_07);
        var aRoad_13 = aPark_01.roadCreate( "r13", anAtt_05, aCros_05);
        var aRoad_14 = aPark_01.roadCreate( "r14", anAtt_06, aCros_06);
        var aRoad_15 = aPark_01.roadCreate( "r15", aCros_05, aCros_06);
        var aRoad_16 = aPark_01.roadCreate( "r16", aCros_05, anAtt_07);
        var aRoad_17 = aPark_01.roadCreate( "r17", anAtt_07, aCros_06);
        var aRoad_18 = aPark_01.roadCreate( "r18", aCros_06, anAtt_08);
        var aRoad_19 = aPark_01.roadCreate( "r19", anAtt_08, aCros_10);
        var aRoad_20 = aPark_01.roadCreate( "r20", aCros_10, aCros_09);
        var aRoad_21 = aPark_01.roadCreate( "r21", aCros_09, aCros_08);
        var aRoad_22 = aPark_01.roadCreate( "r22", aCros_06, aCros_08);
        var aRoad_23 = aPark_01.roadCreate( "r23", aCros_08, aCros_07);
        var aRoad_24 = aPark_01.roadCreate( "r24", aCros_07, aCros_13);
        var aRoad_25 = aPark_01.roadCreate( "r25", aCros_07, anAtt_09);
        var aRoad_26 = aPark_01.roadCreate( "r26", aCros_13, anAtt_15);
        var aRoad_27 = aPark_01.roadCreate( "r27", aCros_13, aCros_12);
        var aRoad_28 = aPark_01.roadCreate( "r28", aCros_12, anAtt_14);
        var aRoad_29 = aPark_01.roadCreate( "r29", aCros_12, aCros_11);
        var aRoad_30 = aPark_01.roadCreate( "r30", aCros_09, aCros_11);
        var aRoad_31 = aPark_01.roadCreate( "r31", anAtt_11, aCros_11);
        var aRoad_32 = aPark_01.roadCreate( "r32", aCros_10, anAtt_10);
        var aRoad_33 = aPark_01.roadCreate( "r33", anAtt_10, aCros_11);
        var aRoad_34 = aPark_01.roadCreate( "r34", anAtt_10, anAtt_12);
        var aRoad_35 = aPark_01.roadCreate( "r35", anAtt_12, aCros_11);
        var aRoad_36 = aPark_01.roadCreate( "r36", aCros_11, anAtt_13);
    };
    aService.pInitParkHomeSample = pInitParkHomeSample;





    return aService;

}]);







