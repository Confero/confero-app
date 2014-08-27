angular.module('confero.tabs', [])
  .directive('conferoTabs', function() {
    "use strict";
    return {
      restrict: 'E',
      templateUrl: 'views/tabs.html'
    };
  });