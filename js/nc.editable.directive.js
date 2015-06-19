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
