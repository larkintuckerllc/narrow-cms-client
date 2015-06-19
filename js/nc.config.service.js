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
