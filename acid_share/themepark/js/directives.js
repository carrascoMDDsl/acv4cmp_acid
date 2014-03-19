'use strict';

/*
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 */

/* Directives */


var mCMPInterview = angular.module('cmpinterviewjs');

mCMPInterview.directive('uiTree', function() {
    return {
        template: '<ul class="uiTree"><ui-tree-node ng-repeat="node in tree"></ui-tree-node></ul>',
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: {
            tree: '=ngModel',
            attrNodeId: "@",
            loadFn: '=',
            expandTo: '=',
            selectedId: '='
        },
        controller: function($scope, $element, $attrs) {
            $scope.loadFnName = $attrs.loadFn;
            // this seems like an egregious hack, but it is necessary for recursively-generated
            // trees to have access to the loader function
            if($scope.$parent.loadFn)
                $scope.loadFn = $scope.$parent.loadFn;

            // TODO expandTo shouldn't be two-way, currently we're copying it
            if($scope.expandTo && $scope.expandTo.length) {
                $scope.expansionNodes = angular.copy($scope.expandTo);
                var arrExpandTo = $scope.expansionNodes.split(",");
                $scope.nextExpandTo = arrExpandTo.shift();
                $scope.expansionNodes = arrExpandTo.join(",");
            }
        }
    };
}).directive('uiTreeNode', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: '<li>' +
            '<div class="node" data-node-id="{{ nodeId() }}">' +
            '<a class="icon" ng-click="toggleNode(nodeId())""></a>' +
            '<!-- <a ng-hide="selectedId" ng-href="#/assets/{{ nodeId() }}">{{ node.name }}</a> -->' +
            '{{ node.name }}' +
            '<span ng-show="selectedId" ng-class="css()" ng-click="setSelected(node)">' +
            '{{ node.name }}</span>' +
            '</div>' +
            '</li>',
        link: function(scope, elm, attrs) {
            scope.nodeId = function(node) {
                var localNode = node || scope.node;
                return localNode[scope.attrNodeId];
            };
            scope.toggleNode = function(nodeId) {
                var isVisible = elm.children(".uiTree:visible").length > 0;
                var childrenTree = elm.children(".uiTree");
                if(isVisible) {
                    scope.$emit('nodeCollapsed', nodeId);
                } else if(nodeId) {
                    scope.$emit('nodeExpanded', nodeId);
                }
                if(!isVisible && scope.loadFn && childrenTree.length === 0) {
                    // load the children asynchronously
                    var callback = function(arrChildren) {
                        scope.node.children = arrChildren;
                        scope.appendChildren();
                        elm.find("a.icon i").show();
                        elm.find("a.icon img").remove();
                        scope.toggleNode(); // show it
                    };
                    var promiseOrNodes = scope.loadFn(nodeId, callback);
                    if(promiseOrNodes && promiseOrNodes.then) {
                        promiseOrNodes.then(callback);
                    } else {
                        $timeout(function() {
                            callback(promiseOrNodes);
                        }, 0);
                    }
                    elm.find("a.icon i").hide();
                    var imgUrl = "img/ajax-loader.gif";
                    elm.find("a.icon").append('<img src="' + imgUrl + '" width="18" height="18">');
                } else {
                    childrenTree.toggle(!isVisible);
                    elm.find("a.icon i").toggleClass("icon-chevron-right");
                    elm.find("a.icon i").toggleClass("icon-chevron-down");
                }
            };

            scope.appendChildren = function() {
                // Add children by $compiling and doing a new ui-tree directive
                // We need the load-fn attribute in there if it has been provided
                var childrenHtml = '<ui-tree ng-model="node.children" attr-node-id="' +
                    scope.attrNodeId + '"';
                if(scope.loadFn) {
                    childrenHtml += ' load-fn="' + scope.loadFnName + '"';
                }
                // pass along all the variables
                if(scope.expansionNodes) {
                    childrenHtml += ' expand-to="expansionNodes"';
                }
                if(scope.selectedId) {
                    childrenHtml += ' selected-id="selectedId"';
                }
                childrenHtml += ' style="display: none"></ui-tree>';
                return elm.append($compile(childrenHtml)(scope));
            };

            scope.css = function() {
                return {
                    nodeLabel: true,
                    selected: scope.selectedId && scope.nodeId() === scope.selectedId
                };
            };
            // emit an event up the scope.  Then, from the scope above this tree, a "selectNode"
            // event is expected to be broadcasted downwards to each node in the tree.
            // TODO this needs to be re-thought such that the controller doesn't need to manually
            // broadcast "selectNode" from outside of the directive scope.
            scope.setSelected = function(node) {
                scope.$emit("nodeSelected", node);
            };
            scope.$on("selectNode", function(event, node) {
                scope.selectedId = scope.nodeId(node);
            });

            if(scope.node.hasChildren) {
                elm.find("a.icon").append('<i class="icon-chevron-right"></i>');
            }

            if(scope.nextExpandTo && scope.nodeId() == parseInt(scope.nextExpandTo, 10)) {
                scope.toggleNode(scope.nodeId());
            }
        }
    };
}]);


/* http://wemadeyoulook.at/en/blog/comma-dot-input-typenumber-mess/
 */

mCMPInterview.directive('smartFloat', function() {
    var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (FLOAT_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    if(typeof viewValue === "number")
                        return viewValue;
                    else
                        return parseFloat(viewValue.replace(',', '.'));
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            });
        }
    };
});







/* http://www.anicehumble.com/2013/07/seamless-numeric-localization-with-angularjs.html
*/



String.prototype.replaceAll = function(stringToFind,stringToReplace){
    if (stringToFind === stringToReplace) return this;

    var temp = this;
    var index = temp.indexOf(stringToFind);
    while(index != -1){
        temp = temp.replace(stringToFind,stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};



mCMPInterview.directive('numeric', function($filter, $locale) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            var decN = scope.$eval(attr.decimalPlaces); // this is the decimal-places attribute

            var aMinNumeric = null;
            var aMaxNumeric = null;

            var aMinNumeric_Source = attr.minNumeric; // this is the min-numeric attribute
            var aMaxNumeric_Source = attr.maxNumeric; // this is the max-numeric attribute

            if( aMinNumeric_Source) {
                aMinNumeric = scope.$eval( aMinNumeric_Source);
            }

            if( aMaxNumeric_Source) {
                aMaxNumeric = scope.$eval( aMaxNumeric_Source);
            }

            var aPreviousText = null;
            var aLastNumOverMin = null;

            // http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
            function theDecimalPlaces(num) {
                var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                if (!match) { return 0; }
                return Math.max(
                    0,
                    // Number of digits right of decimal point.
                    (match[1] ? match[1].length : 0)
                        // Adjust for scientific notation.
                        - (match[2] ? +match[2] : 0));
            }




            function fReplaceSeps( theNumberString) {
                if( !theNumberString || !( typeof theNumberString == "string")) {
                    return "";
                }
                var aGroupSepsRemoved = theNumberString.replaceAll($locale.NUMBER_FORMATS.GROUP_SEP, '');
                var aDecimalReplaced = aGroupSepsRemoved.replaceAll($locale.NUMBER_FORMATS.DECIMAL_SEP, '.');
                return aDecimalReplaced;
            }





            function fromUser(text) {
                var y = fReplaceSeps( text);


                var anUndo = false;

                var aNumber = Number(y); // return a model-centric value from user input y
                if( ( aNumber == null) || isNaN( aNumber) ) {
                    anUndo = true;
                }

                if( !anUndo) {
                    if( !decN) {
                        if( !( aNumber == Math.floor( aNumber))) {
                            anUndo = true;
                        }
                    }
                }
                if( !anUndo) {
                    if( !( aMaxNumeric == null)) {
                        if( aNumber > aMaxNumeric) {
                            anUndo = true;
                        }
                    }
                }

                if( !anUndo) {
                    if( !( aMinNumeric == null)) {
                        if( ( aMinNumeric >= 0) && ( aNumber < 0)) {
                            anUndo = true;
                        }
                    }
                }

                if( anUndo) {
                    if( aPreviousText) {
                        aNumber = Number( aPreviousText);
                        var aFormattedN = $filter('number')( aNumber, theDecimalPlaces( aNumber));
                        element.val( aFormattedN);
                    }
                }
                else {
                    aPreviousText = y;

                    if( !( aMinNumeric == null)) {
                        if( aNumber >= aMinNumeric) {
                            aLastNumOverMin = aNumber;
                        }
                    }
                }

                return aNumber;
            }




            function toUser(n) {
                return $filter('number')(n, decN); // locale-aware formatting
            }




            ngModel.$parsers.push( fromUser);
            ngModel.$formatters.push( toUser);



            element.bind('blur', function() {

                var aModelValue = ngModel.$modelValue;
                if( !( aMinNumeric == null)) {

                    if( aModelValue < aMinNumeric) {
                        if( !( aLastNumOverMin == null)) {
                            aModelValue = aLastNumOverMin;
                            scope.$apply( function() {
                                ngModel.$setViewValue( toUser( aLastNumOverMin));
                            });
                        }
                        else {
                            aModelValue = aMinNumeric;
                            scope.$apply( function() {
                                ngModel.$setViewValue( toUser( aMinNumeric));
                            });
                        }
                    }
                }

                element.val( toUser( aModelValue));

                aPreviousText = null;
                aLastNumOverMin = null;
            });



            element.bind('focus', function() {
                var aModelValue = ngModel.$modelValue;

                var aFormattedN = $filter('number')( aModelValue, theDecimalPlaces( aModelValue));

                aPreviousText =  fReplaceSeps( aFormattedN);

                if( !( aMinNumeric == null)) {
                    if( aModelValue >= aMinNumeric) {
                        aLastNumOverMin = aModelValue;
                    }
                }

                element.val( aFormattedN);
            });



        } // link
    }; // return
}); // module









mCMPInterview.directive('numericOrig', function($filter, $locale) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            var decN = scope.$eval(attr.decimalPlaces); // this is the decimal-places attribute


            // http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
            function theDecimalPlaces(num) {
                var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                if (!match) { return 0; }
                return Math.max(
                    0,
                    // Number of digits right of decimal point.
                    (match[1] ? match[1].length : 0)
                        // Adjust for scientific notation.
                        - (match[2] ? +match[2] : 0));
            }

            function fromUser(text) {
                var x = text.replaceAll($locale.NUMBER_FORMATS.GROUP_SEP, '');
                var y = x.replaceAll($locale.NUMBER_FORMATS.DECIMAL_SEP, '.');

                return Number(y); // return a model-centric value from user input y
            }

            function toUser(n) {
                return $filter('number')(n, decN); // locale-aware formatting
            }

            ngModel.$parsers.push(fromUser);
            ngModel.$formatters.push(toUser);

            element.bind('blur', function() {
                element.val(toUser(ngModel.$modelValue));
            });

            element.bind('focus', function() {
                var n = ngModel.$modelValue;
                var formattedN = $filter('number')(n, theDecimalPlaces(n));
                element.val(formattedN);
            });

        } // link
    }; // return
}); // module