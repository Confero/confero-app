angular.module('confero.tabs', [])
  .directive('conferoTabs', function() {
    return {
      restrict: 'E',
      templateUrl: './views/tabs.html'
    };
  });