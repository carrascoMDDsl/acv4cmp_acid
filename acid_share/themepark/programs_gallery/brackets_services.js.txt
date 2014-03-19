'use strict';

/*
 * brackets_services.js
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




var mBracketsCheckerServices = angular.module("bracketsCheckerServiceSupplier", []);



mBracketsCheckerServices.factory("BracketsChecker", [  function(){


    /* Configurable constants */

    var BRACKETS = [ "()", "[]", "{}"];









    /* Internal constants */

    var NO_UNBALANCED_POSITION = -1;



    /* Define prototype. Has no prototype inheritance itself */
    var aBracketsChecker_Service_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */
        aPrototype._v_PossibleBrackets = null;
        aPrototype._v_DetectBrackets   = null;



        /* Supply essential contextual parameters */
        var _pInit = function( thePossibleBrackets) {

            this._v_PossibleBrackets = thePossibleBrackets;

            if( !this._v_PossibleBrackets) {
                this._v_PossibleBrackets = BRACKETS;
            }

            this._v_DetectBrackets = {};

            var aNumBracketsSets = this._v_PossibleBrackets.length;
            for ( var aBracketsSetIndex = 0; aBracketsSetIndex < aNumBracketsSets; aBracketsSetIndex++) {

                var aBracketSet = this._v_PossibleBrackets[ aBracketsSetIndex];

                var anOpenBracket = aBracketSet[ 0];
                var aCloseBracket = aBracketSet[ 1];

                this._v_DetectBrackets[ anOpenBracket] = aBracketSet;
                this._v_DetectBrackets[ aCloseBracket] = aBracketSet;
            }
        };
        aPrototype._pInit = _pInit;







        /* Returns the character index for the first character which is an unbalanced bracket,
        or -1 if the string is correctly balanced. */

        var fUnBalancedPosition = function( theToBalanceCheck) {

            if( !theToBalanceCheck) {
                return NO_UNBALANCED_POSITION;
            }

            var aBrackets = null;

            var aOpenPositions = [];

            var aNumChars = theToBalanceCheck.length;

            for( var anIndex= 0; anIndex < aNumChars; anIndex++) {
                var aChar = theToBalanceCheck[  anIndex];

                if( !aBrackets) {
                    var aBracketsSet = this._v_DetectBrackets[ aChar];
                    if( aBracketsSet) {
                        aBrackets = aBracketsSet;
                    }
                }


                if( aBrackets) {

                    if( aChar == aBrackets[ 0]) {
                        aOpenPositions.push( anIndex);
                    }
                    else {
                        if( aChar == aBrackets[ 1]) {
                            if( !aOpenPositions.length) {
                                return anIndex;
                            }
                            aOpenPositions.pop();
                        }
                    }
                }
            }

            if( aOpenPositions.length) {
                var anUnBalancedPosition = aOpenPositions[ aOpenPositions.length -1];
                return anUnBalancedPosition;
            }

            return NO_UNBALANCED_POSITION;
        };
        aPrototype.fUnBalancedPosition = fUnBalancedPosition;







        var fIsBalanced = function( theToBalanceCheck) {

            var anUnBalancedPosition = fUnBalancedPosition( theToBalanceCheck);
            if( anUnBalancedPosition == NO_UNBALANCED_POSITION) {
                return true;
            }

            return false;
        };
        aPrototype.fIsBalanced = fIsBalanced;








        return aPrototype;

    })();




    /* Define constructor for instances with the prototype. */

    var BracketsChecker_Service_Constructor = function( thePossibleBrackets) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this._v_PossibleBrackets = null;
        this._v_DetectBrackets   = null;

        this._pInit( thePossibleBrackets);
    };
    BracketsChecker_Service_Constructor.prototype = aBracketsChecker_Service_Prototype;






    /* Define service component exposing just the constructor and the "not unbalanced" sentinel constant. */

    var aService = {};

    aService.BracketsChecker_Service_Constructor = BracketsChecker_Service_Constructor;

    aService.NO_UNBALANCED_POSITION = NO_UNBALANCED_POSITION;

    return aService;

}]);







