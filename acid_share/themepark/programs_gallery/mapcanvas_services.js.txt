
/*
 * mapcanvas_services.js
 *
 * Code derived from the original supplied by CM Productions to Antonio Carrasco Valero's with the purpose of evaluating Antonio's skills and performance in extending this code with additional functionality, as part of a permanent hiring selection process by CM Productions.
 *
 * Modifications to the original code authored by Antonio Carrasco Valero
 * 03/11/2014
 */


var mMapCanvasServices = angular.module("mapcanvasServicesSupplier", []);


mMapCanvasServices.factory("MapCanvasMgr", [ "KineticNG", function( KineticNG){



    /* Configurable constants */




    /* Internal constants */




    /* Define prototype. Has no prototype inheritance itself */
    var aMapCanvas_Service_Prototype = (function() {

        var aPrototype = {};


        /* Prototype members to be used as constants */

        aPrototype.STAGE_WIDTH  = 960;
        aPrototype.STAGE_HEIGHT = 621;


        aPrototype.OFFSET_X = -35;
        aPrototype.OFFSET_Y = 635;
        aPrototype.SCALE_X  = 1.13;
        aPrototype.SCALE_Y  = -0.81;


        aPrototype.STAR_POINTS = 5;
        aPrototype.STAR_RADIUS_INNER = 10;
        aPrototype.STAR_RADIUS_OUTER = 20;

        aPrototype.STAR_FILL_RED          = 255;
        aPrototype.STAR_FILL_GREEN_NORIDE = 192;
        aPrototype.STAR_FILL_GREEN_RIDE   = 64;
        aPrototype.STAR_FILL_BLUE         = 128;

        aPrototype.STAR_STROKE_RED          = 192;
        aPrototype.STAR_STROKE_GREEN_NORIDE = 255;
        aPrototype.STAR_STROKE_GREEN_RIDE   = 128;
        aPrototype.STAR_STROKE_BLUE         = 0;
        aPrototype.STAR_ANIM_DURATION       = 0.5;
        aPrototype.STAR_ANIM_MAXDEGREES     = 360;


        aPrototype.NAME_LABEL_SHIFT_Y     = 19;
        aPrototype.NAME_LABEL_FONT_SIZE   = 10;
        aPrototype.NAME_LABEL_FONT_FAMILY = "arial, helvetica";
        aPrototype.NAME_LABEL_FONT_STYLE  = "bold";
        aPrototype.NAME_LABEL_FILL        = "black";
        aPrototype.NAME_LABEL_ALIGN       = "center";

        aPrototype.WAITTIME_CONTAINER_WIDTH  = 45;
        aPrototype.WAITTIME_CONTAINER_HEIGHT = 20;
        aPrototype.WAITTIME_CONTAINER_FILL   = "white";
        aPrototype.WAITTIME_CONTAINER_STROKE = "#888";
        aPrototype.WAITTIME_CONTAINER_STROKE_WIDTH = 2;
        aPrototype.WAITTIME_CONTAINER_SHIFT_Y   = 15;

        aPrototype.WAITTIME_LABEL_SHIFT_Y     = 19;
        aPrototype.WAITTIME_LABEL_FONT_SIZE   = 14;
        aPrototype.WAITTIME_LABEL_FONT_FAMILY = "arial, helvetica";
        aPrototype.WAITTIME_LABEL_FONT_STYLE  = "bold";
        aPrototype.WAITTIME_LABEL_FILL        = "black";
        aPrototype.WAITTIME_LABEL_ALIGN       = "center";
        
        aPrototype.CIRCLE_RADIUS = 15;

        aPrototype.CIRCLE_FILL_RED     = 128;
        aPrototype.CIRCLE_FILL_GREEN   = 255;
        aPrototype.CIRCLE_FILL_BLUE    = 128;

        aPrototype.CIRCLE_STROKE_RED   = 0;
        aPrototype.CIRCLE_STROKE_GREEN = 192;
        aPrototype.CIRCLE_STROKE_BLUE  = 0;

        aPrototype.LINE_STROKE_RED   = 128;
        aPrototype.LINE_STROKE_GREEN = 128;
        aPrototype.LINE_STROKE_BLUE  = 255;
        aPrototype.LINE_STROKE_WIDTH = 8;

        aPrototype.ROADNAME_CONTAINER_MARGIN_X = 4;
        aPrototype.ROADNAME_CONTAINER_MARGIN_Y = 4;
        aPrototype.ROADNAME_CONTAINER_FILL     = "white";






        /* Prototype member properties */

        aPrototype._v_Updater   = null;

        aPrototype._v_CanvasId   = null;

        aPrototype._v_Stage      = null;
        aPrototype._v_LayerNodes = null;
        aPrototype._v_LayerRoads = null;

        aPrototype._v_AttractionNodesByName  = null;
        aPrototype._v_AttractionLabelsByName = null;

        aPrototype._v_CrossingNodesByName    = null;
        aPrototype._v_CrossingNamesByName   = null;

        aPrototype._v_RoadLinesByName    = null;
        aPrototype._v_RoadNamesByName   = null;






        /* Supply essential contextual parameters */
        var _pInit = function( theCanvasId) {

            this._v_Updater = null;

            this._v_CanvasId = theCanvasId;

            this._v_Stage = null;
            this._v_LayerNodes = null;
            this._v_LayerRoads = null;

            this._v_AttractionNodesByName  = {};
            this._v_AttractionLabelsByName = {};
            this._v_CrossingNodesByName    = {};
            this._v_CrossingNamesByName    = {};
            this._v_RoadLinesByName        = {};
            this._v_RoadNamesByName        = {};


            this._v_Stage = new KineticNG.Stage({
                container: theCanvasId,
                width:     this.STAGE_WIDTH,
                height:    this.STAGE_HEIGHT
            });

            this._v_LayerNodes = new KineticNG.Layer();
            this._v_LayerRoads = new KineticNG.Layer();

            this._v_Stage.add( this._v_LayerRoads );
            this._v_Stage.add( this._v_LayerNodes );

            this._v_Stage.draw();
        };
        aPrototype._pInit = _pInit;








        var pLoadPark = function( thePark) {
            if( !thePark) {
                return;
            }

            var someAttractions = thePark.attractions();

            var aNumAttractions = someAttractions.length;
            for( var anIndex = 0; anIndex < aNumAttractions; anIndex++) {
                var anAttraction = someAttractions[ anIndex];
                this._pLoadAttraction( anAttraction);
            }


            var someCrossings = thePark.crossings();

            var aNumCrossings = someCrossings.length;
            for( var anIndex = 0; anIndex < aNumCrossings; anIndex++) {
                var aCrossing = someCrossings[ anIndex];
                this._pLoadCrossing( aCrossing);
            }


            var someRoads = thePark.roads();

            var aNumRoads = someRoads.length;
            for( var anIndex = 0; anIndex < aNumRoads; anIndex++) {
                var aRoad = someRoads[ anIndex];
                this._pLoadRoad( aRoad);
            }

            this._v_Stage.draw();
        };
        aPrototype.pLoadPark = pLoadPark;







        var _pLoadAttraction = function( theAttraction ) {
            if( !theAttraction) {
                return;
            }

            var aTranslatedAttraction = this._fTranslateCoordinates(
                theAttraction.latitude(),
                theAttraction.longitude()
            );

            var aGreenForeground = theAttraction.isRide() ? this.STAR_STROKE_GREEN_RIDE : this.STAR_STROKE_GREEN_NORIDE;
            var aGreenBackground = theAttraction.isRide() ? this.STAR_FILL_GREEN_RIDE   : this.STAR_FILL_GREEN_NORIDE;


            var aNode = new KineticNG.Star({
                x: aTranslatedAttraction.x,
                y: aTranslatedAttraction.y,
                numPoints:      this.STAR_POINTS,
                innerRadius:    this.STAR_RADIUS_INNER,
                outerRadius:    this.STAR_RADIUS_OUTER,
                fillRed:        this.STAR_FILL_RED,
                fillGreen:      aGreenForeground,
                fillBlue:       this.STAR_FILL_BLUE,
                strokeRed:      this.STAR_STROKE_RED,
                strokeGreen:    aGreenBackground,
                strokeBlue:     this.STAR_STROKE_BLUE
            });


            var aNameTextLabel = new KineticNG.Text({
                x: aTranslatedAttraction.x,
                y: aTranslatedAttraction.y,
                text:       theAttraction.attractionName(),
                fontSize:   this.NAME_LABEL_FONT_SIZE,
                fontFamily: this.NAME_LABEL_FONT_FAMILY,
                fontStyle:  this.NAME_LABEL_FONT_STYLE,
                fill:       this.NAME_LABEL_FILL,
                align:      this.NAME_LABEL_ALIGN
            });

            aNameTextLabel.offsetX( aNameTextLabel.getTextWidth() / 2 );
            aNameTextLabel.offsetY( aNameTextLabel.getTextHeight() / 2 );


            var aWaitTimeTextContainer = new KineticNG.Rect({
                x: aTranslatedAttraction.x - this.WAITTIME_CONTAINER_WIDTH / 2,
                y: aTranslatedAttraction.y + this.WAITTIME_CONTAINER_SHIFT_Y,
                width:  this.WAITTIME_CONTAINER_WIDTH,
                height: this.WAITTIME_CONTAINER_HEIGHT,
                fill:   this.WAITTIME_CONTAINER_FILL,
                stroke: this.WAITTIME_CONTAINER_STROKE,
                strokeWidth: this.WAITTIME_CONTAINER_STROKE_WIDTH
            });

            var aWaitTimeTextLabel = new KineticNG.Text({
                y: aTranslatedAttraction.y + this.WAITTIME_LABEL_SHIFT_Y,
                text:       this._fTimeFormat( this._fRandomTime()),
                fontSize:   this.WAITTIME_LABEL_FONT_SIZE,
                fontFamily: this.WAITTIME_LABEL_FONT_FAMILY,
                fontStyle:  this.WAITTIME_LABEL_FONT_STYLE,
                fill:       this.WAITTIME_LABEL_FILL,
                align:      this.WAITTIME_LABEL_ALIGN
            });


            aWaitTimeTextLabel.x( aWaitTimeTextContainer.x() + ( aWaitTimeTextContainer.width() / 2) );

            aWaitTimeTextLabel.offsetX( aWaitTimeTextLabel.getTextWidth() / 2 );


            this._v_LayerNodes.add( aWaitTimeTextContainer);
            this._v_LayerNodes.add( aWaitTimeTextLabel);
            this._v_LayerNodes.add( aNode);
            this._v_LayerNodes.add( aNameTextLabel);


            this._v_AttractionNodesByName[  theAttraction.attractionName()] = aNode;
            this._v_AttractionLabelsByName[ theAttraction.attractionName()] = aWaitTimeTextLabel;
        };
        aPrototype._pLoadAttraction = _pLoadAttraction;








        var _pLoadCrossing = function( theCrossing) {
            if( !theCrossing) {
                return;
            }

            var aTranslatedCrossing = this._fTranslateCoordinates(
                theCrossing.latitude(),
                theCrossing.longitude()
            );

            var aNode = new KineticNG.Circle ({
                x: aTranslatedCrossing.x,
                y: aTranslatedCrossing.y,
                radius:      this.CIRCLE_RADIUS,
                fillRed:     this.CIRCLE_FILL_RED,
                fillGreen:   this.CIRCLE_FILL_GREEN,
                fillBlue:    this.CIRCLE_FILL_BLUE,
                strokeRed:   this.CIRCLE_STROKE_RED,
                strokeGreen: this.CIRCLE_STROKE_GREEN,
                strokeBlue:  this.CIRCLE_STROKE_BLUE
            });


            var aNameTextLabel = new KineticNG.Text({
                x: aTranslatedCrossing.x,
                y: aTranslatedCrossing.y,
                text:       theCrossing.crossingName(),
                fontSize:   this.NAME_LABEL_FONT_SIZE,
                fontFamily: this.NAME_LABEL_FONT_FAMILY,
                fontStyle:  this.NAME_LABEL_FONT_STYLE,
                fill:       this.NAME_LABEL_FILL,
                align:      this.NAME_LABEL_ALIGN
            });

            aNameTextLabel.offsetX( aNameTextLabel.getTextWidth() / 2 );
            aNameTextLabel.offsetY( aNameTextLabel.getTextHeight() / 2 );


            this._v_LayerNodes.add( aNode);
            this._v_LayerNodes.add( aNameTextLabel);

            this._v_CrossingNodesByName[ theCrossing.crossingName()] = aNode;
            this._v_CrossingNamesByName[ theCrossing.crossingName()] = aNameTextLabel;

        };
        aPrototype._pLoadCrossing = _pLoadCrossing;








        var _pLoadRoad = function( theRoad) {

            if( !theRoad) {
                return;
            }

            var somePlaces = theRoad.places();
            if( somePlaces.length < 2) {
                return;
            }

            var anAttractionsOrCrossingOne   = somePlaces[ 0];
            var anAttractionsOrCrossingOther = somePlaces[ 1];

            var aTranslatedAttractionsOrCrossingOne   = this._fTranslateCoordinates(
                anAttractionsOrCrossingOne.latitude(),
                anAttractionsOrCrossingOne.longitude()
            );
            var aTranslatedAttractionsOrCrossingOther = this._fTranslateCoordinates(
                anAttractionsOrCrossingOther.latitude(),
                anAttractionsOrCrossingOther.longitude()
            );

            var aLine = new KineticNG.Line({
                points: [
                    aTranslatedAttractionsOrCrossingOne.x,
                    aTranslatedAttractionsOrCrossingOne.y,
                    aTranslatedAttractionsOrCrossingOther.x,
                    aTranslatedAttractionsOrCrossingOther.y
                ],
                strokeRed:      this.LINE_STROKE_RED,
                strokeGreen:    this.LINE_STROKE_GREEN,
                strokeBlue:     this.LINE_STROKE_BLUE,
                strokeWidth:    this.LINE_STROKE_WIDTH
            });

            this._v_LayerRoads.add( aLine );


            /* render the name of the road at its mid point
            */
            var aMidPoint = theRoad.roadMidPoint();

            var aTranslatedMidPoint = this._fTranslateCoordinates(aMidPoint[ 0], aMidPoint[ 1]);


            var aNameTextLabel = new KineticNG.Text({
                x: aTranslatedMidPoint.x,
                y: aTranslatedMidPoint.y,
                text:       theRoad.roadName(),
                fontSize:   this.NAME_LABEL_FONT_SIZE,
                fontFamily: this.NAME_LABEL_FONT_FAMILY,
                fontStyle:  this.NAME_LABEL_FONT_STYLE,
                fill:       this.NAME_LABEL_FILL,
                align:      this.NAME_LABEL_ALIGN
            });

            aNameTextLabel.offsetX( aNameTextLabel.getTextWidth() / 2 );
            aNameTextLabel.offsetY( aNameTextLabel.getTextHeight() / 2 );

            /* ACV OJO removed do not obscure road line
            var aRoadNameContainer = new KineticNG.Rect({
                x: aTranslatedMidPoint.x - ( aNameTextLabel.width() / 2) - this.ROADNAME_CONTAINER_MARGIN_X,
                y: aTranslatedMidPoint.y - this.ROADNAME_CONTAINER_MARGIN_Y,
                width:  aNameTextLabel.width() + this.ROADNAME_CONTAINER_MARGIN_X,
                height: aNameTextLabel.height() + this.ROADNAME_CONTAINER_MARGIN_Y,
                fill:   this.ROADNAME_CONTAINER_FILL,
                strokeWidth: 0
            });

            this._v_LayerRoads.add( aRoadNameContainer );
            */

            this._v_LayerRoads.add( aNameTextLabel );


            this._v_RoadLinesByName[ theRoad.roadName()] = aLine;
            this._v_RoadNamesByName[ theRoad.roadName()] = aLine;

        };
        aPrototype._pLoadRoad = _pLoadRoad;









        var _fTranslateCoordinates = function ( theLatitude, theLongitude) {

            var aTranslatedX = theLongitude * this.SCALE_X + this.OFFSET_X;
            var aTranslatedY = theLatitude  * this.SCALE_Y + this.OFFSET_Y;

            var aPoint = { x: aTranslatedX, y: aTranslatedY };

            return aPoint;
        };
        aPrototype._fTranslateCoordinates = _fTranslateCoordinates;






        /* Callback to paint new label texts in the canvas
        from the values retrieved from server.
        This centers the labels by just changing offsetX.

        Server shall return instances with the structure:
        {
            "action": "getAllWaitTimes",
            "timeOfDay": "12:35:00",
            "waitTimes": {
                "a3": 210,
                "a1": 150,
                "a12": 160,
                "a14": 10,
                "a7": 30,
                "a13": 210,
                "a6": 20,
                "a9": 20,
                "a2": 0,
                "a15": 30,
                "a10": 10,
                "a8": 30,
                "a4": 150,
                "a11": 50,
                "a5": 220
            }
        }
        */
        var updatePark_WithRetrievedTimes = function( theTimesResponse ) {

            for( var anAttractionId in this._v_AttractionNodesByName ) {
                var anAttractionNode = this._v_AttractionNodesByName[ anAttractionId ];

                new KineticNG.Tween({
                    node:     anAttractionNode,
                    duration: this.STAR_ANIM_DURATION,
                    rotation: Math.random() * this.STAR_ANIM_MAXDEGREES,
                    easing:   KineticNG.Easings.EaseInOut
                }).play();
            }
            var someWaitTimes = null;
            if( theTimesResponse) {
                someWaitTimes = theTimesResponse.waitTimes;
            }


            for( var aLabelId in this._v_AttractionLabelsByName ) {

                var aLabel = this._v_AttractionLabelsByName[ aLabelId ];

                var aTime = null;
                if( someWaitTimes) {

                    if( someWaitTimes.hasOwnProperty( aLabelId)) {
                        aTime = someWaitTimes[ aLabelId];
                    }
                }

                var aLabelText = "";
                if( aTime) {
                    aLabelText = this._fTimeFormat( aTime);
                    if( aLabelText.length) {
                        aLabel.setText( aLabelText );

                        aLabel.offsetX(  aLabel.getTextWidth() / 2 );
                    }
                }
            }
        };
        aPrototype.updatePark_WithRetrievedTimes = updatePark_WithRetrievedTimes;






        var fUpdater = function() {
            if( !this._v_Updater) {
                this._v_Updater = this.updatePark_WithRetrievedTimes.bind( this);
            }

            return this._v_Updater;
        };
        aPrototype.fUpdater = fUpdater;






        var _fTimeFormat = function( theMinutes) {
            var anHours = Math.floor( theMinutes / 60 );
            var aRemindingMinutes = theMinutes - anHours * 60;

            var anHoursPart = ( anHours > 0 ) ? ( anHours + 'h' ) : '';
            var aMinutesPart = ( aRemindingMinutes > 0 ) ? ( aRemindingMinutes + "'" ) : '';

            return anHoursPart + aMinutesPart;
        };
        aPrototype._fTimeFormat = _fTimeFormat;






        var _fRandomTime = function() {
            var someMinutes = Math.floor( Math.random() * 18 ) * 10;
            return someMinutes;
        };
        aPrototype._fRandomTime = _fRandomTime;





        /* Share graphics element coordinates */

        var fAttractionPoint = function( theAttractionName) {
            if( !theAttractionName) {
                return null;
            }

            var anAttractionStar = this._v_AttractionNodesByName[ theAttractionName];
            if( !anAttractionStar) {
                return null;
            }

            return { x: anAttractionStar.getX(), y: anAttractionStar.getY()};
        };
        aPrototype.fAttractionPoint = fAttractionPoint;




        var fCrossingPoint = function( theCrossingName) {
            if( !theCrossingName) {
                return null;
            }

            var aCrossingCircle = this._v_CrossingNodesByName[ theCrossingName];
            if( !aCrossingCircle) {
                return null;
            }

            return { x: aCrossingCircle.getX(), y: aCrossingCircle.getY()};
        };
        aPrototype.fCrossingPoint = fCrossingPoint;




        /* Share graphics element coordinates */
        var fRoadLineMidPoint = function( theRoadName) {
            if( !theRoadName) {
                return null;
            }

            var aRoadLine = this._v_RoadLinesByName[ theRoadName];
            if( !aRoadLine) {
                return null;
            }

            var someLinePoints = aRoadLine.points();
            if( !someLinePoints || ( someLinePoints.length < 4)) {
                return null;
            }

            var aMidX = ( someLinePoints[ 0] +  someLinePoints[ 2]) / 2;
            var aMidY = ( someLinePoints[ 1] +  someLinePoints[ 3]) / 2;

            return { x: aMidX, y: aMidY};
        };
        aPrototype.fRoadLineMidPoint = fRoadLineMidPoint;




        return aPrototype;

    })();





    /* Define constructor for instances with the prototype. */

    var MapCanvas_Service_Constructor = function( theCanvasId) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_Updater    = null;
        this._v_CanvasId   = null;

        this._v_Stage      = null;
        this._v_LayerNodes = null;
        this._v_LayerRoads = null;

        this._v_AttractionNodesByName  = null;
        this._v_AttractionLabelsByName = null;
        this._v_CrossingNodesByName    = null;
        this._v_CrossingNamesByName    = null;
        this._v_RoadLinesByName        = null;
        this._v_RoadNamesByName        = null;


        this._pInit( theCanvasId);
    };
    MapCanvas_Service_Constructor.prototype = aMapCanvas_Service_Prototype;







    /* Define service component exposing just the constructor . */

    var aService = {};

    aService.MapCanvas_Service_Constructor = MapCanvas_Service_Constructor;

    return aService;

}]);







