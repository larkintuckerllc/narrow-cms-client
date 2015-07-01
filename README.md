# narrow-cms-client

The client (AngularJS) component for NarrowCMS. NarrowCMS is a light-weight content management system for MEAN stack developers.

## getting started

We have provided an example implementation of NarrowCMS that effectively is the information one needs to get started using it: https://github.com/larkintuckerllc/narrow-cms-example

## requirements

* Internet Explorer v9 or greater for public facing elements.
* Internet Explorer v10 or greater for administrative interface.
* Updated versions of all other browsers

Additionally it requires:

* AngularJS: Tested against v1.4.0 (Bower dependency)
* angular-resource: Tested against v1.4.0 (Bower dependency)
* angular-cookies: Tested against v1.4.0 (Bower dependency)
* CKEditor: Tested against v4.4.7

## reference

### module: ncModule

### provider: ncConfigServiceProvider

```Javascript
/**
* @name setApiRootURI
* @desc set api root URI
* @param {String} uri
*/
/**
* @name setPencilCss
* @desc set pencil css
* @param {String} css
*/
/**
* @name setPencilHTML
* @desc set pencil html
* @param {String} html
*/
```
### service: ncAuthService

```Javascript
/**
* @name authSync
* @desc checks authentication.
* @return {Boolean} authorized
*/
/**
* @name authAsync
* @desc Attempts authentication.
* @return {Object} Promise resolving when authenticated.
*/
/**
* @name login
* @desc Login
* @param {String} u Username.
* @param {String} password Password.
* @return {Object} Promise resolving when logged in.
*/
/**
* @name logout
* @desc Logout.
*/
```

### service: ncEditableService

This is an AngularJS resource class object:

https://docs.angularjs.org/api/ngResource/service/%24resource

The following is an example of unauthenticated reading of content.

```JavaScript
// CHANGE '_id' TO MATCH A CREATED EDITABLE
    $scope.example1 = ncEditableService
      .get({_id: '558605493d0a87ddf115cddd'});
```

The usable property of the returned object is "content".

The following is an example of authenticated updating of content.

```JavaScript
$scope.example1.$update();
```

While not shown in this simple example, these methods can be called with callbacks or used as promises.

### ncEditable

The following is an example of using the directive.

```HTML
<div nc-editable value="example1.content" editable="isAuth"></div>
```

example1.content: This is a two-way binding to the editable content.

isAuth: Boolean; on the loading of the directive, this determines if the content is editable or not.

note: In order to change the editable state of the directive, the directive needs be reloaded.
