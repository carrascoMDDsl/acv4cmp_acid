
/*
 * Recommendation_canvas.js
 *
 * Code derived from the original supplied by XXX to Antonio Carrasco Valero's with the purpose of evaluating Antonio's skills and performance in extending this code with additional functionality, as part of a permanent hiring selection process by XXX.
 *
 * Modifications to the original code authored by Antonio Carrasco Valero
 * 03/11/2014
 */




angular.module('cmpinterviewjs').controller(
    'RecommendationCanvasCtrl',
    [ '$scope', 'MapCanvasMgr',
function ( $scope, MapCanvasMgr ) {





    /* Define prototype. Has no prototype inheritance itself */
    var aRecommendation_Canvas_Prototype = (function() {

        var aPrototype = {};


        /* Prototype members to be used as constants */


        /* Prototype member properties */

        aPrototype._v_Service   = null;





        /* Supply essential context and parameters.
         Initialize private member properties.
         */
        var _pInit = function() {

            this._v_Service   = null;
        };
        aPrototype._pInit = _pInit;






        /* ************************************+
         Initialization invoked from templates partials/map.html and partials/recommendation.html
         which can be found embedded in index.html inside a <script> element .
         */
        var pInitCanvas = function( theCanvasId) {

            this._v_Service    = new MapCanvasMgr.MapCanvas_Service_Constructor( theCanvasId);

            if( $scope.recommendationCtrl && $scope.recommendationCtrl.park) {
                this._v_Service.pLoadPark( $scope.recommendationCtrl.park);
            }


            /* Initialize update machinery */
            if( $scope.recommendationCtrl) {

                var anUpdater = this._v_Service.fUpdater();
                if( anUpdater) {
                    $scope.recommendationCtrl.pRegisterUpdater( anUpdater);

                    if( $scope.recommendationCtrl.pRegisterMap) {
                        $scope.recommendationCtrl.pRegisterMap( this._v_Service);
                    }

                    $scope.recommendationCtrl.pStartUpdates();
                }
            }
        };
        aPrototype.pInitCanvas = pInitCanvas;






        var pDestroy = function() {

            if( $scope.recommendationCtrl) {

                $scope.recommendationCtrl.pStopUpdates();

                var anUpdater = this._v_Service.updatePark_WithRetrievedTimes;
                if( anUpdater) {
                    $scope.recommendationCtrl.pUnRegisterUpdater( anUpdater);
                }
            }
        };
        aPrototype.pDestroy = pDestroy;




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
        aPrototype._pErrorAlert = _pErrorAlert;





        return aPrototype;

    })();






    /* Define constructor for instances with the prototype. */

    var Recommendation_Canvas_Constructor = function( theServiceURL, theApplicationId, thePark) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_Service   = null;

        this._pInit();
    };
    Recommendation_Canvas_Constructor.prototype = aRecommendation_Canvas_Prototype;



    $scope.Recommendation_Canvas_Constructor = Recommendation_Canvas_Constructor;







    /* Decorate the $scope with an instance of the Controller
     */
    var aRecommendation_Canvas = new Recommendation_Canvas_Constructor();

    $scope.recommendationCanvas = aRecommendation_Canvas;








    /* Single-page application must release resources acquired in the simulated "pages"
     when the path route changes to other simulated "pages".
     This controller must drop interest registration to update,
     otherwise it will keep being notified even if the simulated "page" has been simulated "closed",
     and the memory resources will not be garbage collected.
     */
    $scope.$on("$destroy", function() {

        if( $scope.recommendationCanvas) {
            $scope.recommendationCanvas.pDestroy();
        }
    });




}]);
