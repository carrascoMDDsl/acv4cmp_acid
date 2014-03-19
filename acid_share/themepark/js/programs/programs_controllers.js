'use strict';

/*
 * programs_controllers.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/12/2014
 */





angular.module('cmpinterviewjs').controller(
    'ProgramsCtrl',
    [ '$scope',
function ( $scope ) {

    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        theme: 'twilight',
        readOnly: 'nocursor',
        mode: 'javascript'
    };


    $scope.programs = {};
    $scope.programs.retrievedSourceCodes = {};

    $scope.programs.selectedSourceCode = "index.html";


    var selectedSourceCodeChangedHandler = function() {
        if( !$scope.programs.selectedSourceCode) {
            return null;
        }

        if( $scope.programs.retrievedSourceCodes.hasOwnProperty( $scope.programs.selectedSourceCode)) {
            var aSourceCode = $scope.programs.retrievedSourceCodes[ $scope.programs.selectedSourceCode];
            $scope.programs.sourceCode = aSourceCode;
        }


        var aSelectedSourceCode = $scope.programs.selectedSourceCode;


        var anAccessPromise = $.ajax({
            type: "GET",
            url: "programs_gallery/" + aSelectedSourceCode + ".txt",
            accepts: "text/plain",
            dataType: "text",
            success: function( theResponse) {
                $scope.programs.retrievedSourceCodes[ aSelectedSourceCode] = theResponse;
                $scope.$evalAsync( function() {
                    $scope.programs.sourceCode = theResponse;

                })
            },
            error: function() {
                console.log( "Error retrieving " + aSelectedSourceCode);
            }
        });
    };
    $scope.selectedSourceCodeChangedHandler = selectedSourceCodeChangedHandler;

    selectedSourceCodeChangedHandler();

}]);







