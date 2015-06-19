(function() {
  'use strict';
  angular
    .module('ncModule', ['ngResource', 'ngCookies']);
})();

(function() {
  'use strict';
  angular
    .module('ncModule')
    .provider('ncConfigService', Provider);
  /**
  * @name Provider
  * @desc Provider
  */
  function Provider() {
    var self = this;
    var apiRootURI = '/narrow-cms';
    var pencilCss = [
      'width: 20px;',
      'height:20px;',
      'background-color: rgba(255,0,0,0.5);'
    ].join('\n');
    var pencilHTML = '';
    self.setApiRootURI = setApiRootURI;
    self.setPencilCss = setPencilCss;
    self.setPencilHTML = setPencilHTML;
    self.$get = $get;
    /**
    * @name setApiRootURI
    * @desc set api root URI
    * @param {String} uri
    */
    function setApiRootURI(uri) {
      apiRootURI = uri;
    }
    /**
    * @name setPencilCss
    * @desc set pencil css
    * @param {String} css
    */
    function setPencilCss(css) {
      pencilCss = css;
    }
    /**
    * @name setPencilHTML
    * @desc set pencil html
    * @param {String} html
    */
    function setPencilHTML(html) {
      pencilHTML = html;
    }
    /**
    * @name $get
    * @desc returns factory
    **/
    function $get() {
      var svc = {};
      svc.apiRootURI = apiRootURI;
      svc.pencilCss = pencilCss;
      svc.pencilHTML = pencilHTML;
      return svc;
    }
  }
})();

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
      $http.post(ncConfigService.apiRootURI + '/login', {
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

(function() {
  'use strict';
  angular
    .module('ncModule')
    .directive('ncEditable', directive);
  /**
  * @name directive
  * @desc Directive for content region.
  * @param {Object} $window
  */
  directive.$inject = ['$window', '$timeout', 'ncConfigService'];
  function directive($window, $timeout, ncConfigService) {
    return {
      restrict: 'A',
      template: [
        '<div style="position: relative; width:0px; height:0px">',
        '<div style="display: none; position: absolute;',
        ncConfigService.pencilCss,
        '">',
        ncConfigService.pencilHTML,
        '</div>',
        '</div>',
        '<div>',
        '</div>'
      ].join(''),
      link: link,
      scope: {
        value: '=',
        editable: '&'
      }
    };
    /**
    * @name link
    * @desc Link for content region directive.
    * @param {Object} $scope the isolated scope
    * @param {Object} element the element
    */
    function link($scope, element) {
      var value = $scope.value;
      var editor;
      var pencilElement = element.find('div')[1];
      var editableElement = element.find('div')[2];
      $scope.$watch('value', update);
      if ($scope.editable()) {
        $scope.$on('$destroy', cleanup);
        pencilElement.style.display = 'block';
        editableElement.setAttribute('contenteditable', 'true');
        editor = $window.CKEDITOR.inline(editableElement);
        editor.on('change', input);
      }
      render();
      /**
      * @name update
      * @desc update on value
      * @param {Object} $newValue
      * @param {Object} $oldValue
      */
      function update(newValue) {
        if (value !== newValue) {
          value = newValue;
          render();
        }
      }
      /**
      * @name cleanup
      * @desc cleanup directive
      */
      function cleanup() {
        editor.removeListener('change', input);
        editor.destroy();
      }
      /**
      * @name input
      * @desc something interacted with editor
      */
      function input() {
        var newValue = editor.getData();
        if (value !== newValue) {
          value = newValue;
          // Could not use $scope.$apply as might be in digest cycle.
          $timeout(read);
        }
      }
      /**
      * @name render
      * @desc render the editor content
      */
      function render() {
        if (!$scope.editable()) {
          element.html(value);
        } else {
          editor.setData(value);
        }
      }
      /**
      * @name read
      * @desc read value out of editor
      */
      function read() {
        $scope.value = value;
      }
    }
  }
}
)();
