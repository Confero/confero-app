angular.module('confero.tabs', [])
  .directive('conferoTabs', function() {
    "use strict";
    return {
      restrict: 'E',
      templateUrl: 'tabs.html'
    };
  });