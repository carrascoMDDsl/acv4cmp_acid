
/*
 * highlightrecommendation_services.js
 *
 * Code derived from the original supplied by XXX to Antonio Carrasco Valero's as the basis for a Javascript experiment.
 *
 * Modifications to the original code authored by Antonio Carrasco Valero
 * 03/11/2014
 */


var mHighlightRecommendationServices = angular.module("highlightrecommendationServicesSupplier", []);


mHighlightRecommendationServices.factory("HighlightRecommendationMgr", [ function(){



    /* Configurable constants */




    /* Internal constants */




    /* Define prototype. Has no prototype inheritance itself */
    var aHighlightRecommendation_Service_Prototype = (function() {

        var aPrototype = {};


        /* Prototype members to be used as constants */



        /* Prototype member properties */

        aPrototype._v_SVGId   = null;






        /* Supply essential contextual parameters */
        var _pInit = function( theSVGId) {

            this._v_SVGId = theSVGId;
        };
        aPrototype._pInit = _pInit;





        /* Register the Map able to resolve coordinates for graphics of Attractions, Crossings and Roads.
         */
        var pUseMap = function( theMap) {
            if( !theMap) {
                return;
            }

            this._v_Map = theMap;
        };
        aPrototype.pUseMap = pUseMap;







        var pUpdateHighlightRecommendation = function( theRecommendation) {
            if( !theRecommendation) {
                return;
            }

            var aSVG = document.getElementById( this._v_SVGId);
            if( !aSVG) {
                return;
            }

            /* Clear previous recommendation highlight SVG elements */
            while ( aSVG.firstChild) {
                aSVG.removeChild( aSVG.firstChild);
            }



            if( !( theRecommendation.path && theRecommendation.path.steps && ( theRecommendation.path.steps.length > 1) && this._v_Map)) {
                return;
            }



            /* Render text With the expected total, walking and waiting times, and the itinerary.
            */
            this._pAddText( aSVG, "We recommend the Attraction", 10, 20, 18);
            this._pAddText( aSVG, theRecommendation.path.attraction.attractionName(), 10, 46, 24, "bold");
            this._pAddText( aSVG, "for you to enjoy in " + theRecommendation.timeToEnjoy + " minute" + (( theRecommendation.timeToEnjoy > 1) ? "s" : ""), 10, 80, 18);
            this._pAddText( aSVG, "after walking "   + theRecommendation.timeToWalk + " minute" + (( theRecommendation.timeToWalk > 1) ? "s" : ""), 10, 106, 18);
            this._pAddText( aSVG, "and waiting for " + theRecommendation.timeToWait + " minute" + (( theRecommendation.timeToWait > 1) ? "s" : ""), 10, 132, 18);

            this._pAddText( aSVG, "Walk from Attraction " + theRecommendation.path.originAttraction.attractionName() + " following itinerary", 10, 164, 16);


            var someSteps = theRecommendation.path.steps;
            var aNumSteps = ( someSteps.length - 1 ) / 2;

            var anY = 188;
            for( var aStepIndex = 0; aStepIndex < aNumSteps; aStepIndex++) {
                var aRoad = someSteps[ (( aStepIndex + 1) * 2) - 1];

                var aPlace = someSteps[ ( aStepIndex + 1) * 2];
                this._pAddText( aSVG, "Road " + aRoad.roadName(), 10, anY, 16);
                anY += 20;
                this._pAddText( aSVG, aPlace.domainType() + " " + aPlace.placeName(), 10, anY, 16);
                anY += 20;
            }


            /* Render line from the origin destination passing through all intermediate crossings to the destination Attraction
            */

            var anOriginAttractionPoint = this._v_Map.fAttractionPoint( someSteps[ 0].attractionName());

            var aSVGpathString = "M " + anOriginAttractionPoint.x + "," + anOriginAttractionPoint.y;

            for( var aStepIndex = 0; aStepIndex < aNumSteps; aStepIndex++) {
                var aPlace = someSteps[ ( aStepIndex + 1) * 2];
                var aPlacePoint  = null;
                if( aPlace.domainType() == "Attraction") {
                    aPlacePoint = this._v_Map.fAttractionPoint( aPlace.attractionName());
                }
                else {
                    aPlacePoint = this._v_Map.fCrossingPoint( aPlace.crossingName());
                }
                aSVGpathString += " L " + aPlacePoint.x + "," + aPlacePoint.y
            }

            var aLineFromOriginToDestination = document.createElementNS("http://www.w3.org/2000/svg", 'path');

            aLineFromOriginToDestination.setAttribute( "d",aSVGpathString);
            aLineFromOriginToDestination.setAttribute( "stroke", "red");
            aLineFromOriginToDestination.setAttribute( "fill", "none");
            aLineFromOriginToDestination.setAttribute( "stroke-width", 8);

            aSVG.appendChild( aLineFromOriginToDestination);



            /* Render arrow at the mid-point of the first Road in the path. Rotated parallel to the Road line.
            */
            var aFirstRoad = theRecommendation.path.steps[ 1];
            var aNextStep  = theRecommendation.path.steps[ 2];

            var aRoadAngle = aFirstRoad.roadAngle( aNextStep);
            var anAngleToRotate = aRoadAngle;

            var aRoadMidPoint = this._v_Map.fRoadLineMidPoint( aFirstRoad.roadName());


            var anArrowTransform    = "rotate(" + anAngleToRotate + " 0,0)" ;
            var aContainerTransform = "translate(" + aRoadMidPoint.x + "," + aRoadMidPoint.y + ")" ;


            var anArrowContainer = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            anArrowContainer.setAttribute( "transform", aContainerTransform);

            var anArrow = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            anArrow.setAttribute( "d", "M 10,0 L -10,-10 L -5,0 L -10,10");
            anArrow.setAttribute( "fill", "blue");
            anArrow.setAttribute( "transform", anArrowTransform);
            anArrowContainer.appendChild( anArrow);

            aSVG.appendChild( anArrowContainer);
        };
        aPrototype.pUpdateHighlightRecommendation = pUpdateHighlightRecommendation;





        var _pAddText = function( theSVG, theText, theX, theY, theFontSize, theFontWeight) {
            if( !theSVG || !theText) {
                return;
            }

            var aNewText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            aNewText.setAttribute( "x", theX);
            aNewText.setAttribute( "y", theY);
            aNewText.setAttribute( "font-size", "" + theFontSize + "px");
            if( theFontWeight) {
                aNewText.setAttribute( "font-weight", "" + theFontWeight);
            }

            var aTextNode = document.createTextNode( theText);
            aNewText.appendChild( aTextNode);

            theSVG.appendChild( aNewText);
        };
        aPrototype._pAddText = _pAddText;




        return aPrototype;

    })();





    /* Define constructor for instances with the prototype. */

    var HighlightRecommendation_Service_Constructor = function( theSVGId) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_SVGId   = null;

        this._pInit( theSVGId);
    };
    HighlightRecommendation_Service_Constructor.prototype = aHighlightRecommendation_Service_Prototype;







    /* Define service component exposing just the constructor . */

    var aService = {};

    aService.HighlightRecommendation_Service_Constructor = HighlightRecommendation_Service_Constructor;

    return aService;

}]);







