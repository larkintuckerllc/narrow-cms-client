(function() {
  'use strict';
  angular
    .module('ncModule')
    .service('ncAuthService', service);
  /**
  * @name service
  * @desc Service for authorization
  * @param {Object} $q AngularJS $q service
  * @param {Object} $http AngularJS $http service
  * @param {$Object} $cookies AngularJS $cookies service
  * @param {$Object} ncConfigService
  */
  service.$inject = ['$q', '$http', '$cookies', 'ncConfigService'];
  function service($q, $http, $cookies, ncConfigService) {
    var username = null;
    var token = null;
    var svc = {};
    svc.authSync = authSync;
    svc.authAsync = authAsync;
    svc.login = login;
    svc.logout = logout;
    svc.getToken = getToken;
    return svc;
    /**
    * @name authSync
    * @desc checks authentication.
    * @return {Boolean} authorized
    */
    function authSync() {
      if (token) {
        return username;
      }
      var savedUsername = $cookies.get('narrow-cms.username');
      var savedToken = $cookies.get('narrow-cms.token');
      if (savedToken) {
        username = savedUsername;
        token = savedToken;
        return username;
      }
      return false;
    }
    /**
    * @name authAsync
    * @desc Attempts authentication.
    * @return {Object} Promise resolving when authenticated.
    */
    function authAsync() {
      var deferred = $q.defer();
      if (token) {
        deferred.resolve(username);
      } else {
        var savedUsername = $cookies.get('narrow-cms.username');
        var savedToken = $cookies.get('narrow-cms.token');
        if (savedToken) {
          username = savedUsername;
          token = savedToken;
          deferred.resolve(username);
        } else {
          deferred.reject(401);
        }
      }
      return deferred.promise;
    }
    /**
    * @name login
    * @desc Login
    * @param {String} u Username.
    * @param {String} password Password.
    * @return {Object} Promise resolving when logged in.
    */
    function login(u, password) {
      var deferred = $q.defer();
      $http.post(ncConfigService.apiRootURI + 'login', {
        username: u,
        password: password
      }).then(success).catch(error);
      /**
      * @name success
      * @desc Success callback.
      * @param {Object} AngularJS response object.
      */
      function success(res) {
        username = u;
        token = res.data.token;
        $cookies.put('narrow-cms.username', u, {path: '/'});
        $cookies.put('narrow-cms.token', token, {path: '/'});
        deferred.resolve();
      }
      /**
      * @name error
      * @desc Error callback.
      */
      function error() {
        deferred.reject();
      }
      return deferred.promise;
    }
    /**
    * @name logout
    * @desc Logout.
    */
    function logout() {
      username = null;
      token = null;
      $cookies.remove('narrow-cms.username', {path: '/'});
      $cookies.remove('narrow-cms.token', {path: '/'});
    }
    /**
    * @name getToken
    * @desc Return token.
    */
    function getToken() {
      return token;
    }
  }
})();
