'use strict';

/*
 * waittimes_services.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/11/2014
 */



var mWaitTimesServices = angular.module("waittimesServicesSupplier", []);



mWaitTimesServices.factory("WaitTimesMgr", [  "$http", function( $http){




    /* Define prototype. Has no prototype inheritance itself */
    var aWaitTimes_Service_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */
        aPrototype._v_ServiceURL = null;
        aPrototype._v_ApplicationId = null;
        aPrototype._v_Park = null;

        aPrototype._v_AccessToken = null;



        /* Supply essential contextual parameters */
        var _pInit = function( theServiceURL, theApplicationId, thePark) {

            this._v_ServiceURL    = theServiceURL;
            this._v_ApplicationId = theApplicationId;
            this._v_Park          = thePark;

            this._v_AccessToken = null;
        };
        aPrototype._pInit = _pInit;







        /* Return inmediately if a token is already available
           because login has already been performed with success.

           Else,
           Connect to server,  and
           if obtains access token then execute the success handler,
           which may quite possibly be in charge of starting the wait-times retrieval interval.
          (not that this service cares).
         */
        var pLogin = function( thePassword, theSuccessHandler, theErrorHandler) {

            if( this._v_AccessToken) {
                if( theSuccessHandler && (typeof theSuccessHandler == "function")) {
                    theSuccessHandler( this._v_AccessToken);
                }
                return;
            }

            /* Defensive contract enforcement */
            if( !thePassword) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Login failed.\nNo Password supplied.");
                }
                return;
            }

            if( !this._v_ServiceURL) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Login failed.\nNo Service URL supplied.");
                }
                return;
            }

            if( !this._v_ApplicationId) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Login failed.\nNo Application Id supplied.");
                }
                return;
            }


            /* Using multiple variables, multiple sentences,
             to facilitate debug during exploration of the solution.
             */
            var aPayload = {
                "action": "login",
                "applicationId": this._v_ApplicationId,
                "password": thePassword,
                "park": this._v_Park
            };


            /* Secure reference to 'this',
            because 'this' will not be this this ;-)
            when executing success handler function below
            */
            var aThis = this;

            /*
            var aSuccessHandler = function( theResponse) {
                var aSuccessHandler_here = theSuccessHandler;
                var aErrorHandler_here = theErrorHandler;
                aThis._pLogin_Success( theResponse, aSuccessHandler_here, aErrorHandler_here);
            };

             While it works with JQuery, when switching to Angular $http, got error:
             XMLHttpRequest cannot load http://162.250.78.100/api/api.php. Request header field Content-Type is not allowed by Access-Control-Allow-Headers.
            Fix executing:
            delete $http.defaults.headers.common['X-Requested-With'];

            https://groups.google.com/forum/#!topic/angular/Q1WSuug7Xyc

            $http.post( this._v_ServiceURL, aPayload).success( aSuccessHandler).error( theErrorHandler);

             */


            /* Code below uses JQuery, which is included in the application for this sole purpose.
            Angular offers the service $http, which is easily dependency-injected by refering to it in this module's declaration.
            Angular also offers a subset of JQuery (I believe, the "core" selection rules matching of DOM elements),
            which is available under the same "$" when JQuery has not been also loaded in the application.
            */
            var aPayloadString = JSON.stringify( aPayload);

            var aPromise = $.ajax({
                type: "POST",
                url: this._v_ServiceURL,
                data: aPayloadString,
                success: function( theResponse) {
                    var aSuccessHandler = theSuccessHandler;
                    var aErrorHandler = theErrorHandler;
                    aThis._pLogin_Success( theResponse, aSuccessHandler, aErrorHandler);
                }
            });

            if( theErrorHandler && (typeof theErrorHandler == "function")) {
                aPromise.fail( theErrorHandler);
            }

        };
        aPrototype.pLogin = pLogin;






        /* ********************************************
        Login remote service invocation.
        Execute handlers in case of success or error.
        */

        var _pLogin_Success = function( theResponse, theSuccessHandler, theErrorHandler) {

            /* Server shall return:
             {
             "action": "login",
             "token": "t_660748397"
             }
             */

            if( !theResponse ) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "No Response from server.");
                }
                return;
            }

            /* ACV OJO Firefox does not automatically convert to an object the received JSON payload */
            var aResponse = theResponse;
            if( typeof aResponse == "string") {
                try {
                    aResponse = JSON.parse( aResponse);
                }
                catch( anException) {
                    aResponse = null;
                }
            }

            if( !aResponse ) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Unintelligible response from server.");
                }
                return;
            }


            if( !( aResponse.action == "login")) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Unexpected Response.");
                }
                return;
            }


            if( !aResponse.token) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "No Token from server.");
                }
                return;
            }


            this._v_AccessToken = aResponse.token;

            if( theSuccessHandler && (typeof theSuccessHandler == "function")) {
                theSuccessHandler( this._v_AccessToken);
            }
        };
        aPrototype._pLogin_Success = _pLogin_Success;







        /* Just kill the token, which also acts as sentinel for login above
        */
        var pLogout = function( ) {

            if( !this._v_AccessToken) {
                return;
            }

            this._v_AccessToken = null;
        };
        aPrototype.pLogout = pLogout;







        /* ********************************************
         Retrieve all Wait Times remote service invocation,
         and execute handlers on success or error.

         Success handler quite likely is in charge of re-painting the canvas
         (not that this service cares).
         */

        var pRetrieveAllWaitTimes = function(  theSuccessHandler, theErrorHandler) {

            if( !this._v_ServiceURL) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Retrieval failed.\nNo Service URL supplied.");
                }
                return;
            }

            if( !this._v_AccessToken) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Retrieval failed.\nNo Access Token available.");
                }
                return;
            }

            /* Using multiple variables, multiple sentences,
             to facilitate debug during exploration of the solution.
             */

            var aPayload = {
                "action": "getAllWaitTimes",
                "token": this._v_AccessToken
            };

            var aPayloadString = JSON.stringify( aPayload);

            var aPromise = $.ajax({
                type: "POST",
                url: this._v_ServiceURL,
                data: aPayloadString,
                success: function( theResponse) {
                    var aSuccessHandler = theSuccessHandler;
                    var aErrorHandler = theErrorHandler;
                    pRetrieveAllWaitTimes_Success( theResponse, theSuccessHandler, theErrorHandler);
                }
            });

            if( theErrorHandler && (typeof theErrorHandler == "function")) {
                aPromise.fail( theErrorHandler);
            }
        };
        aPrototype.pRetrieveAllWaitTimes = pRetrieveAllWaitTimes;







        var  pRetrieveAllWaitTimes_Success = function( theResponse, theSuccessHandler, theErrorHandler) {

            /* Server shall return
             {
             "action": "getAllWaitTimes",
             "timeOfDay": "09:06:00",
             "waitTimes": {
             "a11": 140,
             "a8": 190,
             "a1": 110,
             "a7": 10,
             "a5": 40,
             "a9": 0,
             "a3": 0,
             "a10": 50,
             "a12": 50,
             "a14": 150,
             "a4": 80,
             "a6": 50,
             "a2": 220,
             "a13": 10,
             "a15": 240
             }
             }
             */


            if( !theResponse ) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "No Response from server.");
                }
                return;
            }

            /* ACV OJO Firefox does not automatically convert to an object the received JSON payload */
            var aResponse = theResponse;
            if( typeof aResponse == "string") {
                try {
                    aResponse = JSON.parse( aResponse);
                }
                catch( anException) {
                    aResponse = null;
                }
            }

            if( !aResponse ) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Unintelligible response from server.");
                }
                return;
            }


            if( !( aResponse.action == "getAllWaitTimes")) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "Unexpected Response.");
                }
                return;
            }


            if( !aResponse.waitTimes) {
                if( theErrorHandler && (typeof theErrorHandler == "function")) {
                    theErrorHandler( "No Wait Times received from server.");
                }
                return;
            }


            if( theSuccessHandler && (typeof theSuccessHandler == "function")) {
                theSuccessHandler( aResponse);
            }
        };



        var  fRetrieveTimes_Error = function( theResponse) {
            console.log( "Error receiving wait-times");
        };





        return aPrototype;

    })();





    /* Define constructor for instances with the prototype. */

    var WaitTimes_Service_Constructor = function( theServiceURL, theApplicationId, thePark) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_ServiceURL = null;
        this._v_ApplicationId = null;
        this._v_Park = null;

        this._v_AccessToken = null;

        this._pInit( theServiceURL, theApplicationId, thePark);
    };
    WaitTimes_Service_Constructor.prototype = aWaitTimes_Service_Prototype;







    /* Define service component exposing just the constructor . */

    var aService = {};

    aService.WaitTimes_Service_Constructor = WaitTimes_Service_Constructor;

    return aService;

}]);


