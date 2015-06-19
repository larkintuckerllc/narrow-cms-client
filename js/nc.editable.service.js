(function() {
  'use strict';
  angular
    .module('ncModule')
    .factory('ncEditableService', service);
  /**
  * @name service
  * @desc Service for editables
  * @param {Object} $resource AngularJS $resource object
  * @param {Object} ncAuthService
  */
  service.$inject = ['$resource', 'ncConfigService', 'ncAuthService'];
  function service($resource, ncConfigService, ncAuthService) {
    return $resource(ncConfigService.apiRootURI + '/editables/:_id', {}, {
      save: {method: 'POST',
        headers: {Authorization: authorization}},
      query: {method: 'GET', isArray: true,
        headers: {Authorization: authorization}},
      update: {method: 'PUT', params: {_id:'@_id'},
        headers: {Authorization: authorization}},
      delete: {method: 'DELETE', params: {_id:'@_id'},
        headers: {Authorization: authorization}}
    });
    /**
    * @name authorization
    * @desc Provides authorizaiton header.
    * @return {String} Authorization header.
    */
    function authorization() {
      return 'bearer ' + ncAuthService.getToken();
    }
  }
})();
