(function() {
  'use strict';
  angular
    .module('ncModule')
    .factory('ncCachedEditableService', service);
  /**
  * @name service
  * @desc Service for cached editables - only good for get.
  * @param {Object} $resource AngularJS $resource object
  */
  service.$inject = ['$resource', 'ncConfigService' ];
  function service($resource, ncConfigService) {
    return $resource(ncConfigService.apiRootURI + 'cached/editables/:_id');
  }
})();
