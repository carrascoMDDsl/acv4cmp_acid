'use strict';

/*
 * brackets_controllers.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/13/2014
 */



/* **********************************************
 Question:
 Write a function that, given a random sequence of characters '{' and '}',
 it returns a boolean telling if the sequence is syntactically correct.
 For example '}}{' is not correct, while '{{{}}{}}' is correct.

 */


angular.module('cmpinterviewjs').controller(
    'BracketsCtrl',
    [ '$scope', 'BracketsChecker',
function ( $scope, BracketsChecker ) {



    /* Define prototype. Has no prototype inheritance itself */
    var aBrackets_Controller_Prototype = (function() {

        var aPrototype = {};


        aPrototype._v_Service = null;

        aPrototype.toBalanceCheck = null;
        aPrototype.unBalancedPosition = BracketsChecker.NO_UNBALANCED_POSITION;







        /* Supply essential context and parameters. Initialize private member properties.
        */
        var _pInit = function( thePossibleBrackets) {
            this._v_Service          = new BracketsChecker.BracketsChecker_Service_Constructor( thePossibleBrackets);

            this.toBalanceCheck     = null;
            this.unBalancedPosition = BracketsChecker.NO_UNBALANCED_POSITION;
        };
        aPrototype._pInit = _pInit;







        var toBalanceCheckChangedHandler = function() {
            if( !this._v_Service) {
                _pErrorAlert( "No bracket balance checker service available");
                return;
            }

            if( !this.toBalanceCheck) {
                this.unBalancedPosition = BracketsChecker.NO_UNBALANCED_POSITION;
                return;
            }

            this.unBalancedPosition = this._v_Service.fUnBalancedPosition( this.toBalanceCheck);
        };
        aPrototype.toBalanceCheckChangedHandler = toBalanceCheckChangedHandler;





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




        return aPrototype;

    })();








    /* Define constructor for instances with the prototype. */

    var aBrackets_Controller_Constructor = function( thePossibleBrackets) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_Service         = null;
        this.toBalanceCheck     = null;
        this.unBalancedPosition = BracketsChecker.NO_UNBALANCED_POSITION;

        this._pInit( thePossibleBrackets);
    };
    aBrackets_Controller_Constructor.prototype = aBrackets_Controller_Prototype;

    $scope.Brackets_Controller_Constructor = aBrackets_Controller_Constructor;


    $scope.brackets = new $scope.Brackets_Controller_Constructor( );

}]);





