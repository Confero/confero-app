angular.module('confero.header', [])
  .directive('conferoHeader', function() {
    return {
      restrict: 'E',
      templateUrl: './views/header.html'
    };
  });