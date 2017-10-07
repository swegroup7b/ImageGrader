(function () {
  'use strict';

  angular
    .module('grader')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configure Grader menu
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Image Grader',
      state: 'grader',
      roles: ['*'],
      type: 'dropdown'
    });

    menuService.addSubMenuItem('topbar', 'grader', {
      title: 'New Session',
      state: 'grader.upload',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'grader', {
      title: 'Resume',
      title: 'Resume',
      state: 'grader.annotator',
      roles: ['*']
    });
  }
}());
