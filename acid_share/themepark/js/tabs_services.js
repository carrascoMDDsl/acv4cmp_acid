'use strict';

/*
 * tabs_services.js
 *
 * Licensed to CM Productions for the exclusive use of evaluating Antonio Carrasco Valero's (author's) skills and performance as part of a permanent hiring selection process by CM Productions. No other use of this code is authorized. Distribution and copy of this code is prohibited.
 *
 * Copyright 2014 by the Author of this code Antonio Carrasco Valero
 * 03/14/2014
 */





var mTabsServices = angular.module("tabsServiceSupplier", []);



mTabsServices.factory("TabsService", [  function(){


    /* Configurable constants */





    /* Internal constants */




    /* Define prototype. Has no prototype inheritance itself */

    var aTabs_Service_Prototype = (function() {

        var aPrototype = {};


        /* Prototype member properties */

        aPrototype.tabsObjectsBarEntries = null;
        aPrototype.tabsFixedObjects      = null;
        aPrototype.selectedTabObjects    = null;






        /* Supply essential contextual parameters */
        var _pInit = function( theTabsBarEntries) {

            this.tabsObjectsBarEntries  = theTabsBarEntries;
            this.tabsFixedObjects = {};
            this.selectedTabObjects = null;

            if( theTabsBarEntries && theTabsBarEntries.length && ( theTabsBarEntries[0].value)) {
                this.selectedTabObjects = theTabsBarEntries[0].value;
            }
        };
        aPrototype._pInit = _pInit;







        var fTabObjectsClass = function( theTab) {
            if( this.selectedTabObjects == theTab) {
                return "MDD_Tab_Selected";
            }

            return "MDD_Tab";
        };
        aPrototype.fTabObjectsClass = fTabObjectsClass;






        var pSelectTabObjects = function( theTab) {
            this.selectedTabObjects = theTab;

            this.pScrollTabObjectsContentIntoView( theTab);

        };
        aPrototype.pSelectTabObjects = pSelectTabObjects;







        var pScrollTabObjectsContentIntoView = function( theTabKey) {
            if( !theTabKey) {
                return;
            }

            var allKeys = this.tabsObjectsBarEntries.map(function( theTabDef) {
                return theTabDef.value;
            });


            var aHasKeysTrueBefore = false;
            var aNumKeys = allKeys.length;
            for (var aKeyIdx = 0; aKeyIdx < aNumKeys; aKeyIdx++) {
                var aKey = allKeys[ aKeyIdx];
                if (aKey) {
                    if( aKey == theTabKey) {
                        break;
                    }
                    else {
                        if( this.tabsFixedObjects[ aKey]) {
                            aHasKeysTrueBefore = true;
                            break;
                        }
                    }
                }
            }


            if( aHasKeysTrueBefore) {
                setTimeout( function() {
                        var anElement = document.getElementById( "MDD_tabsObjects_" + theTabKey);
                        if( anElement) {
                            anElement.scrollIntoView();
                        }
                    }, 100
                );
            }
        };
        aPrototype.pScrollTabObjectsContentIntoView = pScrollTabObjectsContentIntoView;;





        var pToggleTabsFixedObjects = function( theTab) {
            if( !this.tabsFixedObjects) {
                return true;
            }
            if( this.tabsFixedObjects[ theTab]) {
                this.tabsFixedObjects[ theTab] = false;
            }
            else {
                this.tabsFixedObjects[ theTab] = true;
            }
        };
        aPrototype.pToggleTabsFixedObjects = pToggleTabsFixedObjects;







        var fMayNeedToScrollTabObjectsIntoView = function( theTabKey) {
            if( !theTabKey) {
                return;
            }

            var allKeys = this.tabsObjectsBarEntries.map(function( theTabDef) {
                return theTabDef.value;
            });


            var aHasKeysTrueBefore = false;
            var aNumKeys = allKeys.length;
            for (var aKeyIdx = 0; aKeyIdx < aNumKeys; aKeyIdx++) {
                var aKey = allKeys[ aKeyIdx];
                if (aKey) {
                    if( aKey == theTabKey) {
                        break;
                    }
                    else {
                        if( ( this.selectedTabObjects && ( aKey == this.selectedTabObjects)) || this.tabsFixedObjects[ aKey]) {
                            aHasKeysTrueBefore = true;
                            break;
                        }
                    }
                }
            }


            return aHasKeysTrueBefore;
        };
        aPrototype.fMayNeedToScrollTabObjectsIntoView = fMayNeedToScrollTabObjectsIntoView;








        var pScrollTabObjectsBarIntoView = function( theTabKey) {
            if( !theTabKey) {
                return;
            }

            var allKeys = this.tabsObjectsBarEntries.map(function( theTabDef) {
                return theTabDef.value;
            });


            var aHasKeysTrueBefore = false;
            var aNumKeys = allKeys.length;
            for (var aKeyIdx = 0; aKeyIdx < aNumKeys; aKeyIdx++) {
                var aKey = allKeys[ aKeyIdx];
                if (aKey) {
                    if( aKey == theTabKey) {
                        break;
                    }
                    else {
                        if( ( this.selectedTabObjects && ( aKey == this.selectedTabObjects)) || this.tabsFixedObjects[ aKey]) {
                            aHasKeysTrueBefore = true;
                            break;
                        }
                    }
                }
            }


            if( aHasKeysTrueBefore) {
                setTimeout( function() {
                        var anElement = document.getElementById( "MDD_tabsObjects_Bar");
                        if( anElement) {
                            anElement.scrollIntoView();
                        }
                    }, 100
                );
            }
        };
        aPrototype.pScrollTabObjectsBarIntoView = pScrollTabObjectsBarIntoView;







        return aPrototype;

    })();





    /* Define constructor for instances with the prototype. */

    var aTabs_Service_Constructor = function( theTabsBarEntries) {

        /* Init object layout with member properties ASAP for the benefit of JIT */
        this.tabsObjectsBarEntries = null;
        this.tabsFixedObjects      = null;
        this.selectedTabObjects    = null;

        this._pInit( theTabsBarEntries);
    };
    aTabs_Service_Constructor.prototype = aTabs_Service_Prototype;






    /* Define service component exposing just the constructor and the "NO_ARC" sentinel constant. */

    var aService = {};

    aService.Tabs_Service_Constructor = aTabs_Service_Constructor;

    return aService;

}]);







